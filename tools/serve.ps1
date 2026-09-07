$ErrorActionPreference = 'Stop'
$prefix = 'http://127.0.0.1:8771/'
$root = 'D:\Codex'
$mime = @{
  '.html' = 'text/html; charset=utf-8'
  '.js'   = 'text/javascript; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'
  '.mp4'  = 'video/mp4'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.svg'  = 'image/svg+xml'
  '.ico'  = 'image/x-icon'
}
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Serving $root at $prefix"
try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    try {
      $path = [System.Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
      if ($path -eq '/') { $path = '/index.html' }
      $rel = $path.TrimStart('/') -replace '/', '\'
      $file = Join-Path $root $rel
      if ((Test-Path $file -PathType Leaf) -and ((Resolve-Path $file).Path.StartsWith($root))) {
        $ext = [System.IO.Path]::GetExtension($file).ToLower()
        $type = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
        $bytes = [System.IO.File]::ReadAllBytes($file)
        $ctx.Response.ContentType = $type
        $ctx.Response.ContentLength64 = $bytes.Length
        $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
        Write-Host "200 $path"
      } else {
        $ctx.Response.StatusCode = 404
        Write-Host "404 $path"
      }
    } catch {
      Write-Host "ERR $($_.Exception.Message)"
    } finally {
      try { $ctx.Response.Close() } catch {}
    }
  }
} finally {
  $listener.Stop()
}
