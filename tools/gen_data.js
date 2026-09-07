// 扫描 videos 目录，生成 assets/js/data.js
// 用法: node tools/gen_data.js
const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '..', 'videos');
const OUT = path.resolve(__dirname, '..', 'assets', 'js', 'data.js');

const CN_NUM = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 };

const PROJECTS = {
  1: {
    title: '初识 Nuke',
    subtitle: '软件定位 · 界面 · 合成思维',
    desc: '建立对节点式合成的整体认知：Nuke 在视效流程中的位置、界面布局与节点图的基本工作方式。',
    level: '入门',
    goals: ['理解节点式合成与图层式合成的差异', '熟悉 Nuke 界面与 Viewer / Node Graph / 属性面板', '建立"从素材到交付"的整体流程概念'],
    nodes: ['Read', 'Viewer', 'Write'],
    track: 'foundation'
  },
  2: {
    title: '工程与工作流',
    subtitle: '项目设置 · 素材 · 渲染输出',
    desc: '完整跑通一枪镜头：项目设置、导入素材、Merge 合成、工程优化与渲染输出。',
    level: '入门',
    goals: ['正确设置项目分辨率、帧率与色彩空间', '掌握 Read / Merge / Write 的基础组合', '理解代理、缓存与工程优化的意义'],
    nodes: ['Read', 'Merge', 'Write', 'Reformat', 'Constant'],
    track: 'foundation'
  },
  3: {
    title: '图层合成实战',
    subtitle: '多元素合成 · 通道 · 综合案例',
    desc: '通过"夏天转冬天""小汽车合成""飞行器合成"三个完整案例，练习多元素叠加、氛围统一与通道运用。',
    level: '进阶',
    goals: ['用 Grade / ColorCorrect 统一不同素材的氛围', '理解并运用特殊层（深度、法线、运动向量）', '独立完成多元素镜头的分层合成'],
    nodes: ['Merge', 'Transform', 'Grade', 'Shuffle', 'Copy'],
    track: 'composite'
  },
  4: {
    title: '调色与色彩匹配',
    subtitle: '色彩空间 · 匹配 · 风格化',
    desc: '把不同光照条件下拍摄的素材调到同一个时空里，是合成师最日常也最见功力的工作。',
    level: '进阶',
    goals: ['掌握 Grade / ColorCorrect / ColorLookup 的分工', '学会用黑场、白场与伽马匹配前景背景', '建立色彩空间（linear / sRGB）的正确观念'],
    nodes: ['Grade', 'ColorCorrect', 'ColorLookup', 'Saturation'],
    track: 'color'
  },
  5: {
    title: '运动模糊与抠像基础',
    subtitle: 'VectorBlur · 边缘质量',
    desc: '运动模糊决定元素是否"长在"画面里；抠像的边缘质量决定合成是否可信。',
    level: '进阶',
    goals: ['用 VectorBlur 为 CG 元素添加真实运动模糊', '理解边缘宽度、收缩与溢色控制', '处理毛发、半透明等难抠素材'],
    nodes: ['VectorBlur', 'Keylight', 'EdgeBlur', 'Erode'],
    track: 'key'
  },
  6: {
    title: '变形与镜头校正',
    subtitle: 'LensDistortion · 创意变形',
    desc: '镜头畸变校正让 CG 与实拍严丝合缝，创意变形则能做出"狮吼功"这类戏剧效果。',
    level: '进阶',
    goals: ['用 LensDistortion 去除/添加镜头畸变', '掌握 Grid Warp / SplineWarp 的变形逻辑', '把变形用于叙事性视觉效果'],
    nodes: ['LensDistortion', 'SplineWarp', 'GridWarp', 'Transform'],
    track: 'composite'
  },
  7: {
    title: '跟踪与摄像机反求',
    subtitle: '点跟踪 · 平面跟踪 · 3D 反求',
    desc: '跟踪是合成的地基：反求出的摄像机决定了 CG 元素的透视与运动是否准确。',
    level: '高阶',
    goals: ['用 Tracker 做点跟踪与稳定', '用 PlanarTracker 处理平面替换与擦除', '用 CameraTracker 反求三维摄像机并解算场景'],
    nodes: ['Tracker', 'PlanarTracker', 'CameraTracker', 'CornerPin'],
    track: 'track'
  },
  8: {
    title: 'Roto 与边缘处理',
    subtitle: 'RotoPaint · 边缘融合 · 噪点',
    desc: '手工绘制遮罩与边缘融合技巧，让前景与背景之间看不出接缝。',
    level: '高阶',
    goals: ['用 RotoPaint 绘制动态遮罩与逐帧修复', '用 LightWrap 让前景吸收背景光', '匹配噪点与颗粒，避免"贴纸感"'],
    nodes: ['RotoPaint', 'LightWrap', 'Noise', 'AddMix'],
    track: 'roto'
  },
  9: {
    title: '擦除与穿帮修复',
    subtitle: '威亚 · 标记点 · 逐帧修补',
    desc: '影视合成里最耗时的活：把穿帮的东西干净地抹掉，还不能看出修过的痕迹。',
    level: '高阶',
    goals: ['用逐帧 / 左右帧互补 / 静帧贴片三种思路擦除物体', '用 F_WireRemoval 处理威亚与细线', '修复运动镜头中的大面积穿帮'],
    nodes: ['RotoPaint', 'F_WireRemoval', 'FrameHold', 'Tracker'],
    track: 'cleanup'
  },
  10: {
    title: '键控抠像专题',
    subtitle: 'Keylight · Primatte · IBK · Keyer',
    desc: '四大抠像器逐个拆解：什么时候用谁，遇到问题该调哪个参数。',
    level: '高阶',
    goals: ['掌握 Keylight 的 Screen Colour / Gain 与边缘处理', '用 Primatte 处理复杂蓝绿幕', '用 IBK 处理溢色严重的素材', '用 Keyer 做快速差值抠像', '组合多种抠像器完成综合练习'],
    nodes: ['Keylight', 'Primatte', 'IBKColour', 'IBKGizmo', 'Keyer', 'Despill'],
    track: 'key'
  },
  11: {
    title: '综合实训',
    subtitle: '花瓣 · 房屋与烟雾',
    desc: '两个完整实训镜头，把抠像、调色、跟踪、边缘处理串成一条完整生产线。',
    level: '实战',
    goals: ['独立完成一个含多层元素的完整镜头', '合理组织节点图，保证可读性与可维护性', '按交付标准输出最终画面'],
    nodes: ['Keylight', 'Merge', 'Grade', 'Transform', 'Noise'],
    track: 'composite'
  }
};

const TRACKS = {
  foundation: { name: '基础入门', desc: '界面、工程设置与基础合成流程' },
  color: { name: '色彩与调色', desc: '色彩空间、匹配与风格化' },
  key: { name: '键控抠像', desc: '抠像器、边缘与溢色控制' },
  roto: { name: 'Roto 与边缘', desc: '遮罩绘制、边缘融合与噪点' },
  cleanup: { name: '擦除修复', desc: '威亚、穿帮与逐帧修补' },
  track: { name: '跟踪与反求', desc: '点跟踪、平面跟踪与摄像机反求' },
  composite: { name: '综合合成', desc: '多元素镜头与完整交付' }
};

// 从标题关键词推断关联节点
const NODE_KEYWORDS = [
  ['Keylight', /keylight/i],
  ['Primatte', /primatte/i],
  ['IBKColour', /ibk/i],
  ['Keyer', /keyer/i],
  ['Despill', /抠像|溢色/],
  ['RotoPaint', /rotopaint|roto/i],
  ['LightWrap', /lightwrap/i],
  ['Noise', /noise|噪点/i],
  ['F_WireRemoval', /wire ?removal|威亚|钢丝/i],
  ['Tracker', /跟踪|追踪/i],
  ['CameraTracker', /摄像机反求|反求/i],
  ['PlanarTracker', /平面跟踪/i],
  ['LensDistortion', /畸变/i],
  ['SplineWarp', /狮吼功|变形/],
  ['VectorBlur', /运动模糊/i],
  ['Merge', /merge|合成/i],
  ['Grade', /调色|色彩|夏天转|匹配/],
  ['Shuffle', /特殊层|通道/i],
  ['Transform', /变换|位移/i],
  ['Write', /渲染输出|输出/i]
];

function guessNodes(text) {
  const out = [];
  for (const [node, re] of NODE_KEYWORDS) if (re.test(text) && !out.includes(node)) out.push(node);
  return out;
}

function fmtDuration(sec) {
  const m = Math.floor(sec / 60), s = Math.round(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function main() {
  const files = fs.readdirSync(SRC).filter(f => f.toLowerCase().endsWith('.mp4'));
  const lessons = [];

  for (const file of files) {
    const base = file.replace(/\.mp4$/i, '');
    const m = base.match(/^项目(\d+)\s*(.*)$/);
    if (!m) continue;
    const pj = parseInt(m[1], 10);
    let rest = m[2].trim();

    let kind = 'task', taskNo = null, taskLabel = '';
    const tm = rest.match(/^任务\s*([一二三四五六七八九十])?\s*(.*)$/);
    if (tm) {
      kind = 'task';
      taskNo = tm[1] ? CN_NUM[tm[1]] : null;
      taskLabel = tm[1] ? '任务' + tm[1] : '实操';
      rest = tm[2].trim();
    }
    else {
      const lm = rest.match(/^(实训)([一二三四五六七八九十])\s*(.*)$/);
      if (lm) { kind = 'lab'; taskNo = CN_NUM[lm[2]]; taskLabel = '实训' + lm[2]; rest = lm[3].trim(); }
      else if (/^项目扩展/.test(rest)) { kind = 'ext'; taskLabel = '项目扩展'; rest = rest.replace(/^项目扩展\s*/, ''); }
      else if (/^简介$/.test(rest)) { kind = 'intro'; taskLabel = '项目简介'; rest = PROJECTS[pj] ? PROJECTS[pj].title : '项目简介'; }
    }

    const tailNum = (rest.match(/(\d+)$/) || [])[1];
    const stat = fs.statSync(path.join(SRC, file));
    const est = Math.max(45, Math.round(stat.size / (1024 * 1024) * 9)); // 粗略估算，浏览器读取元数据后会被真实时长覆盖
    let nodes = guessNodes(base);
    if (!nodes.length && PROJECTS[pj]) nodes = PROJECTS[pj].nodes.slice(0, 3);

    lessons.push({
      file,
      title: rest || base,
      raw: base,
      project: pj,
      kind,
      taskNo,
      taskLabel,
      part: tailNum ? parseInt(tailNum, 10) : null,
      sizeMB: +(stat.size / 1024 / 1024).toFixed(1),
      est,
      estText: fmtDuration(est),
      nodes
    });
  }

  const kindOrder = { intro: 0, task: 1, lab: 2, ext: 3 };
  lessons.sort((a, b) =>
    a.project - b.project ||
    kindOrder[a.kind] - kindOrder[b.kind] ||
    (a.taskNo || 0) - (b.taskNo || 0) ||
    (a.part || 0) - (b.part || 0) ||
    a.raw.localeCompare(b.raw, 'zh')
  );

  let n = 0;
  lessons.forEach(l => { l.id = 'L' + String(++n).padStart(3, '0'); });

  const projects = Object.keys(PROJECTS).map(k => {
    const id = +k;
    const ls = lessons.filter(l => l.project === id);
    return Object.assign({
      id,
      count: ls.length,
      totalEst: ls.reduce((s, l) => s + l.est, 0),
      lessons: ls.map(l => l.id)
    }, PROJECTS[k]);
  }).sort((a, b) => a.id - b.id);

  const data = { generatedAt: new Date().toISOString().slice(0, 10), tracks: TRACKS, projects, lessons };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, 'window.NUKE_DATA = ' + JSON.stringify(data, null, 2) + ';\n', 'utf8');
  console.log('项目数:', projects.length, '课程数:', lessons.length);
  projects.forEach(p => console.log(`  项目${p.id} ${p.title}: ${p.count} 节`));
}

main();
