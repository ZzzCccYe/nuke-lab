/* 交付格式规范 / 渲染与交付 的可视化数据 */
window.NUKE_VIZ = {
  /* 1. 画幅对照：按真实宽高比渲染缩略块 */
  aspects: [
    { name: 'HD 16:9', w: 1920, h: 1080, ratio: '1.78:1', use: '电视、网络、常规审片', tone: 'violet' },
    { name: 'Flat 1.85:1', w: 1998, h: 1080, ratio: '1.85:1', use: '院线遮幅，最常见的电影画幅', tone: 'teal' },
    { name: 'Scope 2.39:1', w: 2048, h: 858, ratio: '2.39:1', use: '宽银幕院线，氛围感最强', tone: 'orange' },
    { name: 'DCI 2K', w: 2048, h: 1080, ratio: '1.90:1', use: '数字院线母版标准', tone: 'pink' },
    { name: 'DCI 4K', w: 4096, h: 2160, ratio: '1.90:1', use: '高规格院线母版', tone: 'pink' },
    { name: 'UHD 4K', w: 3840, h: 2160, ratio: '1.78:1', use: '流媒体 4K 交付', tone: 'violet' },
    { name: 'Square 1:1', w: 1080, h: 1080, ratio: '1.00:1', use: '社交媒体方形版', tone: 'lime' },
    { name: 'Vertical 9:16', w: 1080, h: 1920, ratio: '0.56:1', use: '短视频 / 手机端', tone: 'lime' }
  ],

  /* 2. 位深：色阶数量与渐变断层 */
  depths: [
    { bits: '8-bit', levels: 256, steps: 14, note: '每通道 256 级；大范围渐变容易看出台阶（banding）', tone: 'warn' },
    { bits: '10-bit', levels: 1024, steps: 40, note: '每通道 1024 级；播出与审片格式的常用精度', tone: 'ok' },
    { bits: '16-bit half', levels: 65536, steps: 150, note: '半精度浮点；合成中间件的默认选择', tone: 'good' },
    { bits: '32-bit float', levels: 0, steps: 320, note: '单精度浮点；HDR、深度与向量通道首选', tone: 'good' }
  ],

  /* 3. 色度子采样：每 8×4 像素块的色度采样点 */
  subsampling: [
    { name: '4:4:4', chromaX: 1, chromaY: 1, note: '每个像素都有独立色度，抠像 / 调色余量最大' },
    { name: '4:2:2', chromaX: 2, chromaY: 1, note: '水平方向每 2 像素共享色度，常见播出与母版格式' },
    { name: '4:2:0', chromaX: 2, chromaY: 2, note: '水平垂直均减半，体积小但抠像与边缘处理会更吃力' }
  ],

  /* 4. 编码 / 容器横向对比（0-100 相对评分） */
  codecs: [
    { name: 'OpenEXR 序列', quality: 98, size: 88, compat: 70, alpha: true, seq: true, note: '合成中间件首选，支持多通道与浮点' },
    { name: 'ProRes 4444', quality: 90, size: 70, compat: 88, alpha: true, seq: false, note: '带透明的高质量交付，体积偏大' },
    { name: 'ProRes 422 HQ', quality: 82, size: 46, compat: 92, alpha: false, seq: false, note: '无透明成片与母版的稳妥选择' },
    { name: 'DNxHR HQX', quality: 80, size: 45, compat: 82, alpha: false, seq: false, note: 'Avid / Windows 工作流的常用格式' },
    { name: 'H.264 MP4', quality: 55, size: 12, compat: 100, alpha: false, seq: false, note: '审片与网络分发，不建议再次合成' },
    { name: 'H.265 MP4', quality: 60, size: 8, compat: 74, alpha: false, seq: false, note: '更省码率，但兼容性与解码压力更高' },
    { name: 'PNG 序列', quality: 74, size: 58, compat: 96, alpha: true, seq: true, note: '无损、带透明，适合图形与网页元素' },
    { name: 'DPX 序列', quality: 84, size: 92, compat: 66, alpha: false, seq: true, note: '传统 DI / 调色流程，体积很大' }
  ],
  metrics: [
    { key: 'quality', label: '画质 / 动态范围' },
    { key: 'size', label: '体积开销（越高越占空间）' },
    { key: 'compat', label: '兼容性' }
  ],

  /* 5. 色彩管线：从素材到输出的数据流向 */
  pipeline: [
    { name: 'Read', sub: 'camera Log / sRGB', desc: '按素材实际编码设置输入色彩空间', tone: 'read' },
    { name: '→ Scene Linear', sub: '色彩空间转换', desc: '统一到线性空间再做运算', tone: 'grade' },
    { name: '合成 / 调色', sub: 'Merge · Grade · Blur', desc: '线性空间下的模糊与叠加才物理正确', tone: 'merge' },
    { name: 'Viewer LUT', sub: '仅用于显示', desc: '显示变换不等于输出变换，别混淆', tone: 'view' },
    { name: 'Write', sub: 'Rec.709 / 交付规格', desc: '按交付单明确输出色彩空间', tone: 'write' }
  ],

  /* 6. 命名规范拆解 */
  naming: {
    tpl: 'prjX_sh0100_comp_v003.####.exr',
    parts: [
      { text: 'prjX', label: '项目代号', tone: 'violet' },
      { text: 'sh0100', label: '镜头号', tone: 'teal' },
      { text: 'comp', label: '任务 / 环节', tone: 'orange' },
      { text: 'v003', label: '版本号', tone: 'pink' },
      { text: '####', label: '帧号占位', tone: 'lime' },
      { text: 'exr', label: '扩展名', tone: 'slate' }
    ],
    tips: ['全部小写，用下划线分段，不要出现空格与中文', '版本号从 v001 起，每次交付递增，不要覆盖已批准版本', '序列帧用 #### 或 %04d 占位，保证下游能整段读取']
  },

  /* 7. 交付流程：什么时候该输出什么 */
  flow: [
    { step: '素材整理', out: '原始素材 / 代理', tone: 'slate', desc: '确认分辨率、帧率、色彩空间与丢帧情况' },
    { step: '镜头合成', out: 'EXR 序列', tone: 'violet', desc: '中间件全部用 EXR，方便断点续渲与单帧修复' },
    { step: '内部 QC', out: '检查清单', tone: 'teal', desc: '抽检首/中/尾帧，确认边缘、噪点与色彩' },
    { step: '客户审片', out: 'H.264 MP4', tone: 'orange', desc: '体积小、能在线批注，不用于后续制作' },
    { step: '最终母版', out: 'ProRes / DNxHR', tone: 'pink', desc: '按交付单输出成片或带透明元素' },
    { step: '归档', out: 'EXR + 工程', tone: 'lime', desc: '连同节点图与素材清单一起归档，便于返修' }
  ],

  /* 8. 常见翻车点：错误 vs 正确 的画面对比 */
  pitfalls: [
    {
      title: 'Alpha 边缘的黑边 / 绿边',
      bad: '未做 Unpremult 就模糊，或去溢色过度',
      good: '先 Unpremult → 处理 → Premult；去溢色保持克制',
      demo: 'edge'
    },
    {
      title: '渐变断层 Banding',
      bad: '8-bit 输出大范围天空 / 光晕',
      good: '中间文件用 16-bit half 或 32-bit float',
      demo: 'band'
    },
    {
      title: '灰雾 / 发黑',
      bad: '把 Video Legal 范围素材当 Full 解释',
      good: '明确 Data Range，广播素材按 Legal 处理',
      demo: 'range'
    },
    {
      title: 'Viewer 与输出不一致',
      bad: '用 Viewer LUT 当输出变换，交付后偏色',
      good: 'Write 单独指定输出色彩空间，与显示分开',
      demo: 'lut'
    }
  ]
};
