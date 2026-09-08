# Nuke Lab 本地 <-> 线上 双向同步脚本
# 用法（在 D:\Codex 目录下执行）：
#   本地改完 -> 同步到线上：  powershell -ExecutionPolicy Bypass -File tools\sync.ps1 up
#   线上改完 -> 同步回本地：  powershell -ExecutionPolicy Bypass -File tools\sync.ps1 down
#   查看当前状态：            powershell -ExecutionPolicy Bypass -File tools\sync.ps1 status
#   带说明提交：              powershell -ExecutionPolicy Bypass -File tools\sync.ps1 up -message "更新了节点图鉴"
param(
  [Parameter(Position = 0)][ValidateSet('up', 'down', 'status')][string]$mode = 'up',
  [string]$message
)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$git  = Join-Path $PSScriptRoot 'mingit\cmd\git.exe'
Set-Location $root

function Branch([string]$name) { & $git config branch.$name.remote }

if ($mode -eq 'status') {
  & $git status -sb
  Write-Host ''
  & $git log --oneline -5
  exit
}

if ($mode -eq 'down') {
  Write-Host '==> 拉取线上修改到本地 ...'
  & $git pull --rebase --autostash
  Write-Host ''
  Write-Host '完成，本地已与线上一致：' -ForegroundColor Green
  & $git log --oneline -3
  exit
}

# mode = up：提交并推送本地修改
# 每次推送前自动更新 index.html 里的资源版本号，强制线上/手机刷新 css/js 缓存
$indexPath = Join-Path $root 'index.html'
$stamp = Get-Date -Format 'yyyyMMddHHmm'
$html = [System.IO.File]::ReadAllText($indexPath)
$newHtml = [regex]::Replace($html, '(\.(?:css|js)\?v=)\d+', ('${1}' + $stamp))
if ($newHtml -ne $html) {
  [System.IO.File]::WriteAllText($indexPath, $newHtml)
  Write-Host "==> 资源版本号已更新为 $stamp"
}

& $git add -A
$staged = @(& $git diff --cached --name-only)
if ($staged.Count -gt 0) {
  $msg = if ($message) { $message } else { "本地更新 $(Get-Date -Format 'yyyy-MM-dd HH:mm')" }
  Write-Host "==> 提交 $($staged.Count) 个文件的修改 ..."
  & $git commit -m $msg | Out-Null
} else {
  Write-Host '==> 本地没有新的文件改动。'
}
Write-Host '==> 推送到线上 ...'
& $git push
if ($LASTEXITCODE -ne 0) {
  Write-Host '==> 推送受阻，尝试先合并线上修改再重试 ...' -ForegroundColor Yellow
  & $git pull --rebase --autostash
  if ($LASTEXITCODE -ne 0) { Write-Host '网络不稳定，请稍后再试（内容已保存在本地，不会丢失）。' -ForegroundColor Red; exit 1 }
  & $git push
}
Write-Host ''
Write-Host '完成。GitHub Pages 会在 1-2 分钟内自动更新线上页面。' -ForegroundColor Green
