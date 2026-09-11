/* Nuke Lab — 应用逻辑 */
(function () {
  'use strict';
  var D = window.NUKE_DATA, NODES = window.NUKE_NODES;
  var KEY = 'nukelab.v1';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------- 状态 ---------------- */
  var DEF = { settings: { base: 'videos/', resume: true, autoNext: true, speed: 1, autoDone: true }, prog: {}, notes: {}, favs: {}, days: {}, ex: {}, durs: {}, last: null, recent: [], rq: [], dchk: {}, dcfg: {} };
  var S;
  try { S = Object.assign({}, DEF, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { S = Object.assign({}, DEF); }
  S.settings = Object.assign({}, DEF.settings, S.settings || {});
  ['prog', 'notes', 'favs', 'days', 'ex', 'durs'].forEach(function (k) { if (!S[k]) S[k] = {}; });
  if (!S.recent) S.recent = [];

  var save = function () { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } };
  var today = function () { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  var dayKey = function (ts) { var d = new Date(ts); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); };
  var mmss = function (sec) { if (!sec || !isFinite(sec)) return '0:00'; var m = Math.floor(sec / 60), s = Math.round(sec % 60); return m + ':' + String(s).padStart(2, '0'); };
  var humanMin = function (sec) { var m = Math.round(sec / 60); return m >= 60 ? (m / 60).toFixed(1) + 'h' : m + 'm'; };

  /* ---------------- 数据索引 ---------------- */
  var LBY = {}, PBY = {}, NBY = {};
  D.lessons.forEach(function (l) { LBY[l.id] = l; });
  D.projects.forEach(function (p) { PBY[p.id] = p; });
  NODES.list.forEach(function (n) { NBY[n.name] = n; });
  var TOTAL = D.lessons.length;
  var ORDER = D.lessons.map(function (l) { return l.id; });
  var idxOf = function (id) { return ORDER.indexOf(id); };

  /* ---------------- 通用 ---------------- */
  var toastTimer;
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('on');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('on'); }, 2200);
  }
  function pathOf(l) { return (S.settings.base || 'videos/').replace(/\/?$/, '/') + encodeURIComponent(l.file); }
  function isDone(id) { return !!(S.prog[id] && S.prog[id].done); }
  function pctOf(id) { var p = S.prog[id]; return p ? (p.done ? 100 : Math.min(99, Math.round((p.t / dur(id)) * 100))) : 0; }
  function lDur(id) { return (LBY[id] && LBY[id].est) || 600; }
  function doneCount() { return ORDER.filter(isDone).length; }
  function fmtSize(mb) { return mb >= 1024 ? (mb / 1024).toFixed(1) + ' GB' : mb + ' MB'; }

  function streak() {
    var n = 0, d = new Date();
    for (var i = 0; i < 400; i++) {
      var k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      if (S.days[k] && S.days[k] > 30) n++; else if (i > 0) break;
      d.setDate(d.getDate() - 1);
    }
    return n;
  }
  function weekSeconds() {
    var s = 0, d = new Date();
    for (var i = 0; i < 7; i++) { s += S.days[dayKey(d.getTime())] || 0; d.setDate(d.getDate() - 1); }
    return s;
  }
  function totalSeconds() { return Object.keys(S.days).reduce(function (a, k) { return a + S.days[k]; }, 0); }
  function noteCount() { return Object.keys(S.notes).reduce(function (a, k) { return a + S.notes[k].length; }, 0); }

  /* ---------------- 侧栏 / 路由 ---------------- */
  var view = 'dashboard', param = null, hashLock = false, lastNonPlayer = { v: 'dashboard', p: null };
  var VIEWS = { dashboard: '学习概览', courses: '课程库', nodes: '节点图鉴', keys: '快捷键键盘', menus: '菜单导览', video: '交付格式与媒体规范', delivery: '渲染与交付' };
  function toHash(v, p) { return '#/' + v + (p ? '/' + encodeURIComponent(p) : ''); }
  function go(v, p) {
    view = v; param = p || null;
    if (v !== 'player') { lastNonPlayer = { v: v, p: param }; setHash(toHash(v, param)); }
    $$('.view').forEach(function (el) { el.classList.add('hide'); });
    $('#view-' + v).classList.remove('hide');
    $$('#navMain button,#navMine button,#mobileNav button').forEach(function (b) { b.classList.toggle('active', b.dataset.view === v); });
    var ct = VIEWS[v];
    if (p) {
      if (/^p\d+$/.test(p)) ct += '<span>/</span> 项目' + esc(p.slice(1));
      else if (p.indexOf('track:') === 0 && D.tracks[p.split(':')[1]]) ct += '<span>/</span> ' + esc(D.tracks[p.split(':')[1]].name);
      else ct += '<span>/</span> ' + esc(p);
    }
    $('#crumb').innerHTML = 'NUKE LAB <span>/</span> ' + ct;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (v === 'dashboard') renderDash();
    if (v === 'courses') renderCourses();
    if (v === 'nodes') renderNodes();
    if (v === 'keys') renderKeys();
    if (v === 'menus') renderMenus();
    if (v === 'video') renderVideoGuide();
    if (v === 'delivery') renderDelivery();
  }
  function setHash(h) {
    if (location.hash === h) return;
    hashLock = true;
    if (history.replaceState) history.replaceState(null, '', h); else location.hash = h;
    setTimeout(function () { hashLock = false; }, 0);
  }
  function fromHash() {
    var h = (location.hash || '').replace(/^#\/?/, '');
    if (!h) return null;
    var ps = h.split('/'), v = ps[0], p = ps[1] ? decodeURIComponent(ps[1]) : null;
    if (v === 'player' && p && LBY[p]) return { v: 'player', p: p };
    if (!VIEWS[v]) return null;
    return { v: v, p: p };
  }

  /* ---------------- 概览 ---------------- */
  function renderSide() {
    $('#cntLessons').textContent = TOTAL;
    $('#cntNodes').textContent = NODES.list.length;
  }

  function renderDash() {
    renderSide();
    var h = new Date().getHours();
    var hi = h < 6 ? '夜深了。' : h < 11 ? '早上好。' : h < 14 ? '中午好。' : h < 18 ? '下午好。' : '晚上好。';
    $('#greetTitle').innerHTML = hi + '<br>把 Nuke 常用信息放在手边。';
    $('#greetSub').textContent = TOTAL + ' 节视频参考 · ' + NODES.list.length + ' 个节点条目 · 菜单与媒体规范速查。';

    // 继续学习
    $('#btnContinue').onclick = function () { go('courses'); };
    var list = ORDER.slice(0, 6);
    $('#dashLessons').innerHTML = list.map(function (id) { return lessonRow(id, true); }).join('') || '<div class="empty">全部课程已完成 🎉</div>';
    bindRows($('#dashLessons'));

    // 学习路径
    $('#trackGrid').innerHTML = Object.keys(D.tracks).map(function (k) {
      var t = D.tracks[k];
      var ps = D.projects.filter(function (p) { return p.track === k; });
      var ids = [].concat.apply([], ps.map(function (p) { return p.lessons; }));
      var colors = { foundation: 'purple', color: 'sand', key: 'rose', roto: 'lime', cleanup: 'teal', track: 'sky', composite: 'peach' };
      var icons = { foundation: '◫', color: '❋', key: '✣', roto: '✎', cleanup: '⌫', track: '⌖', composite: '◌' };
      return '<button class="path-card" data-track="' + k + '"><div class="path-icon ' + (colors[k] || 'purple') + '">' + (icons[k] || '◈') + '</div>' +
        '<h3>' + esc(t.name) + '</h3><p>' + esc(t.desc) + '</p>' +
        '<div class="path-meta"><span>' + ps.length + ' 项目 · ' + ids.length + ' 节</span><span>浏览 →</span></div></button>';
    }).join('');
    $$('#trackGrid .path-card').forEach(function (b) { b.onclick = function () { go('courses', 'track:' + b.dataset.track); }; });

    // 今日节点
    var seed = new Date(today()).getTime() / 86400000;
    var n = NODES.list[Math.floor(seed) % NODES.list.length];
    $('#dailyTitle').textContent = '今日节点 · ' + n.name;
    $('#dailyDesc').textContent = n.desc;
    $('#dailyTag').textContent = (NODES.cats.filter(function (c) { return c.id === n.cat; })[0] || {}).name || '节点';
    $('#btnDaily').onclick = function () {
      go('nodes'); openNode(n.name);
    };
  }

  function lessonRow(id, compact) {
    var l = LBY[id]; if (!l) return '';
    var p = PBY[l.project];
    return '<div class="lesson" data-id="' + id + '">' +
      '<span class="lesson-index">' + id.replace('L', '') + '</span>' +
      '<div><div class="lesson-title">' + esc(l.title) + ' <span class="tag ' + l.kind + '">' + esc(l.taskLabel) + '</span></div>' +
      '<div class="lesson-sub"><span>项目' + l.project + ' · ' + esc(p ? p.title : '') + '</span></div></div>' +
      '<div class="lesson-right">' + (compact ? '' : '<span>' + fmtSize(l.sizeMB) + '</span>') +
      '<button class="play' + (compact ? ' sm' : '') + '">▶</button></div></div>';
  }
  function dur(id) { if (S.durs[id]) return S.durs[id]; var p = S.prog[id]; if (p && p.d) return p.d; return lDur(id); }
  function bindRows(root) {
    $$('.lesson', root).forEach(function (el) {
      el.onclick = function (e) { openPlayer(el.dataset.id); };
    });
  }

  /* ---------------- 课程库 ---------------- */
  var filter = { kind: 'all', status: 'all', track: null };
  function renderCourses() {
    renderSide();
    // 路由参数只消费一次，避免筛选操作被旧参数覆盖
    if (typeof param === 'string' && param.indexOf('track:') === 0) { filter.track = param.split(':')[1]; param = null; }
    else if (typeof param === 'string' && /^p\d+$/.test(param)) { state.selProject = +param.slice(1); param = null; }
    $('#cTotal').textContent = TOTAL;

    var kinds = [['all', '全部类型'], ['intro', '项目简介'], ['task', '任务实操'], ['lab', '综合实训'], ['ext', '项目扩展']];
    var chips = kinds.map(function (k) {
      var on = (k[0] === filter.kind) ? ' on' : '';
      return '<button class="chip' + on + '" data-kind="' + k[0] + '">' + k[1] + '</button>';
    }).join('');
    if (filter.track) chips = '<button class="chip on" data-track="1">路径：' + esc(D.tracks[filter.track].name) + ' ×</button>' + chips;
    $('#kindChips').innerHTML = chips;
    $$('#kindChips .chip').forEach(function (b) {
      b.onclick = function () {
        if (b.dataset.track) {
          filter.track = null; param = null;
          setHash(toHash('courses', 'p' + state.selProject));
        }
        else {
          filter.kind = b.dataset.kind; filter.status = 'all';
        }
        renderCourses();
      };
    });

    // 项目列表
    $('#projList').innerHTML = D.projects.filter(function (p) { return !filter.track || p.track === filter.track; }).map(function (p) {
      var dn = p.lessons.filter(isDone).length;
      var pc = Math.round(dn / p.lessons.length * 100);
      return '<button class="proj-item' + (state.selProject === p.id ? ' on' : '') + '" data-p="' + p.id + '">' +
        '<div class="row1"><span class="pno">' + String(p.id).padStart(2, '0') + '</span><span class="pname">' + esc(p.title) + '</span>' +
        '<span class="pcount">' + dn + '/' + p.lessons.length + '</span></div>' +
        '<div class="psub">' + esc(p.subtitle) + '</div>' +
        '<div class="bar" style="margin-left:28px"><i style="width:' + pc + '%"></i></div></button>';
    }).join('') || '<div class="empty">没有匹配的项目</div>';
    $$('#projList .proj-item').forEach(function (b) {
      b.onclick = function () { state.selProject = +b.dataset.p; renderCourses(); };
    });

    var visProjs = D.projects.filter(function (p) { return !filter.track || p.track === filter.track; });
    if (!state.selProject || !PBY[state.selProject] || (filter.track && PBY[state.selProject].track !== filter.track))
      state.selProject = (visProjs[0] || D.projects[0]).id;
    var p = PBY[state.selProject];
    $('#crumb').innerHTML = 'NUKE LAB <span>/</span> 课程库' +
      (filter.track ? '<span>/</span> ' + esc(D.tracks[filter.track].name) : '') +
      '<span>/</span> 项目' + p.id;
    var ls = p.lessons.map(function (id) { return LBY[id]; }).filter(function (l) {
      if (filter.kind !== 'all' && l.kind !== filter.kind) return false;
      if (filter.status === 'done' && !isDone(l.id)) return false;
      if (filter.status === 'undone' && isDone(l.id)) return false;
      return true;
    });
    var dnAll = p.lessons.filter(isDone).length;
    var groups = {};
    ls.forEach(function (l) { var k = l.taskLabel || '课程'; (groups[k] = groups[k] || []).push(l); });
    var html = '<div class="detail-head"><div style="flex:1;min-width:260px">' +
      '<div style="display:flex;align-items:center;gap:10px"><h2>项目' + p.id + ' · ' + esc(p.title) + '</h2><span class="tag ' + (p.level === '入门' ? 'task' : p.level === '实战' ? 'lab' : 'ext') + '">' + esc(p.level) + '</span></div>' +
      '<p class="sub">' + esc(p.desc) + '</p>' +
      '<div class="meta"><span>' + p.lessons.length + ' 节</span><span>约 ' + humanMin(p.totalEst) + '</span><span>已完成 ' + dnAll + '</span><span>路径：' + esc(D.tracks[p.track].name) + '</span></div>' +
      '<div class="node-pills">' + p.nodes.map(function (n) { return '<span class="node-pill" data-node="' + esc(n) + '">' + esc(n) + '</span>'; }).join('') + '</div>' +
      '</div><div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end">' +
      '<button class="btn primary" id="playAll">▶ 从第 1 节开始</button>' +
      '<button class="btn" id="playNext">▶ 播放第一个未完成</button></div></div>';
    html += Object.keys(groups).map(function (g) {
      return '<div class="lesson-group"><div class="group-title">' + esc(g) + '<span class="line"></span><span>' + groups[g].length + ' 节</span></div>' +
        groups[g].map(function (l) { return lessonRow(l.id, false); }).join('') + '</div>';
    }).join('') || '<div class="empty">当前筛选下没有课程</div>';
    $('#courseDetail').innerHTML = html;
    bindRows($('#courseDetail'));
    $$('#courseDetail .node-pill').forEach(function (b) { b.onclick = function () { go('nodes'); openNode(b.dataset.node); }; });
    $('#playAll').onclick = function () { openPlayer(p.lessons[0]); };
    $('#playNext').onclick = function () { var n = p.lessons.filter(function (id) { return !isDone(id); })[0] || p.lessons[0]; openPlayer(n); };
  }
  var state = { selProject: null };

  /* ---------------- 节点图鉴 ---------------- */
  var nodeCat = 'all', nodeQ = '';
  var NODE_RECIPES = [
    { title: '绿幕抠像', note: '取样、清边、去溢色再压背景', nodes: ['Read', 'Keylight', 'Erode / Dilate', 'EdgeBlur', 'Despill', 'Merge'] },
    { title: '屏幕替换', note: '平面跟踪驱动贴图与匹配', nodes: ['Read', 'PlanarTracker', 'CornerPin', 'Grade', 'Merge'] },
    { title: 'CG 元素合成', note: 'AOV、光照、景深与融合', nodes: ['Read', 'Shuffle', 'Grade', 'Defocus', 'VectorBlur', 'Merge'] },
    { title: '擦除与修补', note: '定帧取底板，局部绘制修复', nodes: ['Read', 'FrameHold', 'RotoPaint', 'Merge'] }
  ];
  var NODE_PARTNERS = { 'Read':['Reformat','Shuffle','Grade','Write'], 'Merge':['Premult / Unpremult','Keymix','Grade','Copy'], 'Keylight':['Erode / Dilate','EdgeBlur','Despill','Merge'], 'PlanarTracker':['CornerPin','Roto','Merge'], 'Tracker':['Transform','CornerPin','Roto'], 'Grade':['ColorCorrect','Saturation','Merge','Keymix'], 'Shuffle':['Copy','Grade','VectorBlur','Defocus'], 'Roto':['RotoPaint','Keymix','EdgeBlur','Merge'], 'RotoPaint':['FrameHold','Tracker','Merge'], 'CameraTracker':['Camera','Axis','Card','Scene'], 'Card':['Axis','Scene','ScanlineRender'], 'Scene':['Camera','Card','ScanlineRender'], 'ScanlineRender':['Defocus','VectorBlur','Merge'], 'DeepRead':['DeepMerge','DeepHoldout','DeepToImage'], 'DeepMerge':['DeepHoldout','DeepToImage','Merge'], 'Transform':['Crop','Reformat','Merge'], 'CornerPin':['PlanarTracker','Grade','Merge'], 'Defocus':['Dilate','Shuffle','Merge'], 'VectorBlur':['Shuffle','Merge'], 'Write':['Reformat','Remove','Viewer'] };
  function renderNodes() {
    renderSide();
    $('#nodeChips').innerHTML = '<button class="chip' + (nodeCat === 'all' ? ' on' : '') + '" data-c="all">全部 ' + NODES.list.length + '</button>' +
      NODES.cats.map(function (c) {
        var n = NODES.list.filter(function (x) { return x.cat === c.id; }).length;
        return '<button class="chip' + (nodeCat === c.id ? ' on' : '') + '" data-c="' + c.id + '">' + esc(c.name) + ' ' + n + '</button>';
      }).join('');
    $$('#nodeChips .chip').forEach(function (b) { b.onclick = function () { nodeCat = b.dataset.c; renderNodes(); }; });
    renderNodeRecipes();
    renderNodeGrid();
  }
  function renderNodeRecipes() {
    $('#nodeRecipes').innerHTML = '<div class="recipe-head"><span>常用节点组合</span><small>先理解链路，再记单个节点</small></div>' + NODE_RECIPES.map(function (r, ri) { return '<article class="recipe-card"><div class="recipe-title"><b>' + esc(r.title) + '</b><small>' + esc(r.note) + '</small></div><div class="recipe-flow">' + r.nodes.map(function (name, i) { var n = NBY[name], c = n && NODES.cats.filter(function (x) { return x.id === n.cat; })[0]; return (i ? '<i></i>' : '') + '<button data-recipe-node="' + esc(name) + '" style="--node-color:' + esc((c || {}).color || '#6658e8') + '">' + esc(name) + '</button>'; }).join('') + '</div><button class="recipe-open" data-recipe="' + ri + '">查看流程详情 <span>→</span></button></article>'; }).join('');
    $$('#nodeRecipes [data-recipe-node]').forEach(function (b) { b.onclick = function () { openNode(b.dataset.recipeNode); }; });
    $$('#nodeRecipes [data-recipe]').forEach(function (b) { b.onclick = function () { openRecipe(+b.dataset.recipe); }; });
  }
  function openRecipe(index) {
    var r = NODE_RECIPES[index]; if (!r) return;
    var steps = r.nodes.map(function (name, i) { var n = NBY[name]; return '<li><b>' + String(i + 1).padStart(2, '0') + '</b><span><strong>' + esc(name) + '</strong><small>' + esc((n || {}).desc || '') + '</small></span></li>'; }).join('');
    $('#nodeDetail').innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center"><span class="tag task">NODE WORKFLOW</span><button id="ndClose" style="font-size:18px;color:#98a2b3">✕</button></div>' +
      '<h2>' + esc(r.title) + '</h2><p class="recipe-detail-intro">' + esc(r.note) + '。点击下方任一节点，可进入对应的参数与搭配说明。</p>' +
      '<div class="recipe-detail-flow">' + r.nodes.map(function (name, i) { var n = NBY[name], c = n && NODES.cats.filter(function (x) { return x.id === n.cat; })[0]; return (i ? '<i>→</i>' : '') + '<button data-workflow-node="' + esc(name) + '" style="--node-color:' + esc((c || {}).color || '#6658e8') + '"><b>' + esc(name) + '</b><small>' + esc((n || {}).en || '') + '</small></button>'; }).join('') + '</div>' +
      '<div class="section-heading" style="margin:22px 0 0"><h2 style="font-size:14px">流程逐步说明</h2></div><ol class="workflow-steps">' + steps + '</ol><div class="tip-box"><b>使用方式 · </b>先按此顺序搭建基础链路，再根据镜头问题加入 Roto、ColorCorrect 或额外的 Merge 分支。</div>';
    $('#nodeDetail').classList.add('open'); $('#scrim').classList.add('on');
    $('#ndClose').onclick = closeNode;
    $$('#nodeDetail [data-workflow-node]').forEach(function (b) { b.onclick = function () { openNode(b.dataset.workflowNode); }; });
  }
  function renderNodeGrid() {
    var q = nodeQ.toLowerCase();
    var list = NODES.list.filter(function (n) {
      if (nodeCat !== 'all' && n.cat !== nodeCat) return false;
      if (!q) return true;
      return (n.name + n.desc + n.en + n.tips + n.params.map(function (p) { return p[0]; }).join(' ')).toLowerCase().indexOf(q) >= 0;
    });
    $('#nodeGrid').innerHTML = list.map(function (n) {
      var c = NODES.cats.filter(function (x) { return x.id === n.cat; })[0] || {};
      return '<button class="node-card" data-n="' + esc(n.name) + '"><div class="node-preview"><span class="node-in"></span><span class="node-in second"></span><b style="background:' + c.color + '">' + esc(n.name) + '</b><span class="node-out"></span></div><div class="nname"><span class="dot" style="background:' + c.color + '"></span>' + esc(n.name) + '</div>' +
        '<div class="cat">' + esc(c.name) + ' · ' + esc(n.en) + '</div><p>' + esc(n.desc) + '</p>' +
        '<div class="node-card-more">点击打开节点详情 <span>→</span></div></button>';
    }).join('') || '<div class="empty">没有匹配的节点</div>';
    $$('#nodeGrid .node-card').forEach(function (b) { b.onclick = function () { openNode(b.dataset.n); }; });
  }
  function openNode(name) {
    var n = NBY[name]; if (!n) return;
    var c = NODES.cats.filter(function (x) { return x.id === n.cat; })[0] || {};
    var flow = { io:['读取或生成素材','检查色彩空间与帧范围','连接到处理链路'], merge:['准备 A / B 图像输入','选择 operation 与通道','检查 alpha 与边缘'], transform:['确定参考画幅','调整变换或裁切','在 Viewer 比对位置'], color:['必要时先 Unpremult','从整体影调开始调整','Premult 后检查边缘'], key:['提取 alpha / matte','清理边缘与溢色','放回背景核验'], roto:['绘制遮罩或修复笔触','设置关键帧与羽化','用 alpha 通道检查'], track:['选择稳定的特征区域','跟踪并检查误差','导出变换或数据'], warp:['在参考帧确定效果','动画化或接入数据','检查边缘与包围盒'], time:['设定源、目标时间范围','选择插帧或光流质量','逐帧检查遮挡'], filter:['必要时先处理 alpha','控制效果半径与通道','与原图 wipe 对比'], '3d':['准备几何、贴图或相机','在 Scene 组织层级','渲染回 2D 并检查通道'], deep:['保持 Deep 数据在同一空间','完成遮挡/合并运算','最后再扁平化为 2D'], gen:['设置格式和基础属性','接入后续节点图','用作辅助或最终画面'], tool:['整理节点与对外接口','清晰标记用途','保持可复用性'] }[n.cat] || ['连接输入','调整参数','在 Viewer 检查结果'];
    var partners = (NODE_PARTNERS[name] || []).filter(function (x) { return NBY[x]; });
    var diagram = '<div class="node-diagram"><div class="diagram-label">典型连接示意</div><div class="diagram-flow"><span class="diagram-input">输入</span><i></i><strong style="background:' + esc(c.color) + '">' + esc(n.name) + '</strong><i></i><span class="diagram-output">输出</span></div><p>节点在 Nuke 的节点图中通常按此方向接入；实际输入数量和通道以节点属性面板为准。</p></div>';
    $('#nodeDetail').innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center"><span class="tag task">' + esc(c.name) + '</span><button id="ndClose" style="font-size:18px;color:#98a2b3">✕</button></div>' +
      '<h2>' + esc(n.name) + '</h2><div style="color:var(--muted);font-size:12px;margin-bottom:14px">' + esc(n.en) + '</div>' +
      '<p style="font-size:13px;line-height:1.9;color:#4a556a;margin:0">' + esc(n.desc) + '</p>' +
      diagram +
      '<div class="section-heading" style="margin:20px 0 0"><h2 style="font-size:14px">使用步骤</h2></div><ol class="node-steps">' + flow.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>' +
      '<div class="section-heading" style="margin:20px 0 0"><h2 style="font-size:14px">关键参数</h2></div>' +
      '<table class="param-table">' + n.params.map(function (p) { return '<tr><td>' + esc(p[0]) + '</td><td>' + esc(p[1]) + '</td></tr>'; }).join('') + '</table>' +
      '<div class="tip-box"><b>实战提示 · </b>' + esc(n.tips) + '</div>' +
      (partners.length ? '<div class="section-heading" style="margin:20px 0 0"><h2 style="font-size:14px">常搭配节点</h2><span class="hint">按用途组合</span></div><div class="partner-list">' + partners.map(function (x) { var pn = NBY[x], pc = NODES.cats.filter(function (y) { return y.id === pn.cat; })[0] || {}; return '<button data-partner="' + esc(x) + '"><i style="background:' + esc(pc.color) + '"></i>' + esc(x) + '<small>' + esc(pn.en) + '</small></button>'; }).join('') + '</div>' : '') +
      '<div class="node-source">Nuke 内置节点参考 · 图鉴内容不依赖本站视频课程</div>';
    $('#nodeDetail').classList.add('open'); $('#scrim').classList.add('on');
    $('#ndClose').onclick = closeNode;
    $$('#nodeDetail [data-partner]').forEach(function (b) { b.onclick = function () { openNode(b.dataset.partner); }; });
  }
  function closeNode() { $('#nodeDetail').classList.remove('open'); $('#scrim').classList.remove('on'); }

  /* ---------------- 菜单 / 视频参数参考 ---------------- */
  var MENU_GUIDE = [
    { icon: 'F', name: 'File', color: 'violet', intro: '新建、打开、保存脚本与导入/导出工程，是项目文件管理的入口。', items: [['New Comp', '新建 .nk 脚本；开始镜头前先确认项目格式。'], ['Open / Save As', '打开或另存脚本；版本号建议递增，如 shot_v003.nk。'], ['Project Settings', '设置 format、fps、色彩管理、代理和时间线范围。'], ['Import / Export', '导入节点图或导出选中节点，便于在镜头间复用。']] },
    { icon: 'E', name: 'Edit', color: 'teal', intro: '用于节点图编辑、复制粘贴、查找与偏好设置。', items: [['Undo / Redo', '撤销与重做操作；复杂调整前可以先保存一个版本。'], ['Node > Disable', '临时禁用节点，快速比较处理前后。'], ['Find', '在大型脚本中按节点名、标签或注释定位内容。'], ['Preferences', '设置默认 viewer process、缓存、快捷键与界面习惯。']] },
    { icon: 'V', name: 'Viewer', color: 'sky', intro: '控制 Viewer 的查看、对比、通道与播放方式。', items: [['Channels', '查看 rgba、alpha、depth、motion vector 等通道。'], ['Viewer Process', '只影响显示的 LUT / OCIO 处理，不等同于最终输出。'], ['Wipe / Compare', '分屏对比两个输入，检查边缘、色彩和位置偏差。'], ['Playback', '设置播放缓存、代理分辨率和循环方式。']] },
    { icon: 'N', name: 'Node', color: 'peach', intro: '按功能分类创建 Nuke 节点，是搭建节点图最常用的菜单。', items: [['Image / Draw', '创建 Read、Write、Merge、Transform、Grade、Roto 等 2D 节点。'], ['Channel', '创建 Shuffle、Copy、Premult、Remove 等通道处理节点。'], ['Time', '创建 FrameHold、TimeOffset、Retime、Kronos 等时间节点。'], ['3D / Deep', '创建 Camera、Card、Scene、ScanlineRender 及 Deep 节点。']] },
    { icon: 'C', name: 'Cache', color: 'rose', intro: '管理磁盘缓存和内存缓存，帮助提高预览与交互性能。', items: [['Clear All', '清除缓存，解决缓存内容过期或异常显示。'], ['Disk Cache', '查看或设置磁盘缓存位置与占用上限。'], ['Precache', '提前缓存指定节点或帧范围，适合反复审片。']] },
    { icon: 'R', name: 'Render', color: 'sand', intro: '设置渲染队列与执行 Write 节点输出。', items: [['Render All', '渲染脚本中已启用的 Write 节点。'], ['Render Selected', '只渲染当前选中的 Write，适合单镜头测试。'], ['Frame Range', '确认首尾帧与帧步长，避免漏帧或超范围渲染。'], ['Background Render', '将渲染放入后台，继续进行节点图编辑。']] },
    { icon: 'H', name: 'Help', color: 'purple', intro: '获取节点文档、快捷键与版本信息。', items: [['Documentation', '查看官方节点参数与工作流说明。'], ['Keyboard Shortcuts', '查询并自定义常用快捷键。'], ['About Nuke', '确认版本号、许可证状态与插件环境。']] }
  ];
  function renderMenus() {
    $('#menuGuide').innerHTML = MENU_GUIDE.map(function (m) {
      return '<details class="menu-item"><summary><span class="menu-symbol ' + m.color + '">' + m.icon + '</span><span><b>' + m.name + '</b><small>' + m.intro + '</small></span><span class="menu-expand">＋</span></summary><div class="menu-content">' + m.items.map(function (x) { return '<div><code>' + esc(x[0]) + '</code><p>' + esc(x[1]) + '</p></div>'; }).join('') + '</div></details>';
    }).join('');
  }
  var VIDEO_GUIDE = [
    { title: '项目与画面', tone: 'violet', rows: [['分辨率 / Format', '图像的像素宽 × 高，如 1920×1080、3840×2160。', '项目内素材尺寸不同时，先用 Reformat 统一到项目格式。'], ['帧率 / FPS', '每秒画面数量，如 24、25、23.976、29.97 fps。', '必须和拍摄素材及最终交付一致；混用时会出现时间漂移。'], ['像素长宽比 / Pixel Aspect', '单个像素的形状；HD/UHD 通常为 1.0。', '非方形像素素材需正确解释，否则画面会横向或纵向变形。'], ['帧范围 / Frame Range', '镜头起止帧与句柄（handles）的范围。', '项目设置和每个 Write 的范围都要检查，避免少渲或多渲。']] },
    { title: '色彩与动态范围', tone: 'teal', rows: [['色彩空间 / Colorspace', 'RGB 数值如何映射为真实颜色，如 sRGB、Rec.709、ACEScg。', 'Read 输入与 Write 输出都要明确；不要仅靠 Viewer 显示判断。'], ['Gamma / 伽马', '中间调的非线性编码或调整方式。', '合成和模糊通常应在线性空间完成，再做显示变换。'], ['Log / Linear', 'Log 保留高光细节；Linear 对应光能量运算。', 'Log 素材先做色彩空间转换再进行 Merge、Grade 等操作。'], ['位深 / Bit Depth', '每个通道的精度：8-bit、10-bit、16-bit、32-bit float。', '合成中间文件优先 16/32-bit EXR，避免渐变断层。'], ['色彩范围 / Data Range', 'Full（0–1）与 Video/Legal（16–235）范围。', '广播素材与 H.264 常见范围问题；错误会导致灰雾或压黑。']] },
    { title: '通道与透明度', tone: 'orange', rows: [['RGBA', '红绿蓝与 Alpha（透明度）四个基本通道。', 'Viewer 中单独查看 alpha，能更快发现抠像或边缘问题。'], ['Premult / Unpremult', 'RGB 是否已经乘以 alpha。', '调色、模糊、变形前常先 Unpremult，完成后 Premult。'], ['AOV / 多通道 EXR', 'CG 渲染附带 diffuse、specular、Z、motion 等附加通道。', '用 Shuffle / Shuffle2 提取并规范命名，避免直接破坏原层。'], ['Z-depth', '每像素深度距离，用于景深、雾效和遮挡。', '确认是 camera space 的正向深度；数值范围要与效果节点匹配。']] },
    { title: '编码与交付', tone: 'pink', rows: [['文件序列 / Image Sequence', '每帧一个文件，如 .exr、.dpx、.png。', '合成主交付首选序列帧：可断点续渲、单帧修复且不易损坏。'], ['EXR 压缩', 'ZIP、PIZ、DWAA 等无损或有损压缩选择。', '通用合成中间文件常用 PIZ/ZIP；DWAA 更省空间但需确认品质。'], ['编码器 / Codec', '视频压缩算法，如 ProRes、DNxHR、H.264/H.265。', '审片可用 H.264；母版或后期流程优先 ProRes/DNxHR 或 EXR。'], ['码率 / Bitrate', '压缩视频每秒使用的数据量。', '码率越低体积越小但伪影越明显；不要把它与位深混为一谈。'], ['Alpha 输出', '输出文件是否保留透明通道。', '要交付带透明的元素时，使用支持 Alpha 的 EXR/PNG/ProRes 4444。']] },
    { title: '常见交付格式速查', tone: 'violet', rows: [['ProRes 4444 / 4444 XQ', 'Apple 高品质编码，4444 支持 RGB 与 Alpha；XQ 码率、位深余量更高。', '带透明的广告元素、动画或客户中间件常用 4444；需要最高质量再选 4444 XQ。'], ['ProRes 422 HQ', '10-bit 4:2:2 高质量审片/母版格式，不含 Alpha。', '适合无透明需求的高质量审片与播出文件；不要用于透明元素交付。'], ['DNxHR HQX / 444', 'Avid 系列高质量编码；HQX 多为 10-bit 4:2:2，444 可保留 4:4:4 信息。', '跨 Windows/Avid 工作流优先考虑；具体 Alpha 支持请按交付方编码规范确认。'], ['H.264 / H.265', '高压缩分发编码，体积小；H.265 更省码率但兼容性与解码压力更高。', '用于审片、邮件和网页，不建议作为多轮合成的中间母版。'], ['PNG 序列', '无损 8/16-bit 图像序列，可携带 Alpha，体积通常大于压缩视频。', '适合网页动画、图形元素或需要简单透明的交付；不适合高动态范围 CG。'], ['DPX 序列', '电影/调色流程常见的逐帧格式，通常为 10/12-bit，文件较大。', '交给传统 DI/调色流程前，先与对方确认帧号、位深、Log 和色彩空间。'], ['OpenEXR 序列', '后期标准的浮点、多通道、高动态范围序列格式。', 'Nuke 合成中间件的首选，可保留 RGBA、AOV、Z-depth 与 motion vector。'], ['WAV / PCM 音频', '无压缩音频；视频封装常需明确采样率与位深。', '常用交付为 48 kHz / 24-bit PCM；不要把 44.1 kHz 的音乐文件直接当播出母版。']] }
  ];
  function renderVideoGuide() {
    $('#videoGuide').innerHTML = VIDEO_GUIDE.map(function (g) {
      return '<section class="param-section"><h2><span class="param-tone ' + g.tone + '"></span>' + g.title + '</h2><div class="param-table-wrap"><table><thead><tr><th>参数</th><th>它是什么</th><th>在 Nuke 中的建议</th></tr></thead><tbody>' + g.rows.map(function (r) { return '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>'; }).join('') + '</tbody></table></div></section>';
    }).join('');
  }
  var DELIVERY_PRESETS = [
    { icon:'▶', tone:'violet', title:'客户审片 / Review', purpose:'供客户在线查看、批注和确认版本。', output:'H.264 MP4 · Rec.709 · 无 Alpha', settings:[['分辨率','通常 1920×1080；客户要求 4K 再输出 UHD'],['帧率','与项目一致，常见 24 / 25 fps'],['码率','1080p 建议 12–20 Mbps；高运动镜头适当提高'],['辅助信息','按需求烧录镜头号、版本号、帧号与日期']], tip:'审片文件只用于沟通，不应作为后续合成或调色的母版。', cfg:{ codec:'h264', depth:'8-bit', space:'Rec.709 (Gamma 2.4)', alpha:false } },
    { icon:'◆', tone:'teal', title:'最终成片 / Master', purpose:'交付剪辑、调色、播出或归档的高质量成片。', output:'ProRes 422 HQ / 4444 或 DNxHR HQX', settings:[['分辨率','严格按交付规格：HD、UHD、DCI 4K 等'],['色彩空间','按项目交付规范：Rec.709、P3、ACES 或 Log'],['编码','无透明常用 ProRes 422 HQ；高品质/透明改用 4444'],['音频','若包含音频，常用 48 kHz / 24-bit PCM']], tip:'先输出 10 帧样片给交付方确认色彩、帧率和烧录要求，再跑整条。', cfg:{ codec:'prores422hq', depth:'10-bit', space:'Rec.709 (Gamma 2.4)', alpha:false } },
    { icon:'◌', tone:'pink', title:'抠像元素 / Alpha 文件', purpose:'给剪辑、AE 或其他合成软件继续使用的透明前景。', output:'ProRes 4444 / 4444 XQ 或 PNG / EXR 序列', settings:[['Alpha','确认 Write 输出为 rgba，并检查 Alpha 是否预乘正确'],['推荐格式','短元素可用 ProRes 4444；高质量合成优先 EXR 序列'],['边缘检查','在黑、白、彩色背景上检查绿边、黑边与半透明发灰'],['命名','明确标注 premult 状态、色彩空间和帧范围']], tip:'交付透明元素时，最好同时提供一张 checkerboard 预览和一份使用说明。', cfg:{ codec:'prores4444', depth:'12-bit', space:'Rec.709 (Gamma 2.4)', alpha:true } },
    { icon:'▦', tone:'orange', title:'Matte / 技术通道', purpose:'交付选区、抠像遮罩、Z-depth、motion vector 等技术数据。', output:'OpenEXR 多通道序列 · 16/32-bit float', settings:[['通道','明确命名：rgba、alpha、depth、forward、backward 等'],['位深','普通 matte 可 16-bit；深度/向量优先 32-bit float'],['压缩','常用 ZIP / PIZ；避免不支持多通道的普通视频封装'],['说明','附上通道清单、数值空间与 premult 状态']], tip:'技术通道不要随意套显示 LUT；交付前用 Shuffle 单独检查每一个关键层。', cfg:{ codec:'exr', depth:'32-bit float', space:'Scene Linear', alpha:false } }
  ];
  var DELIVERY_CHECKS = ['帧范围、帧率和项目格式与交付单一致', 'Write 路径、文件名与版本号正确，且不会覆盖已批准版本', '输入/输出色彩空间明确；Viewer 显示 LUT 没有被误当作输出变换', 'Alpha、AOV、Z-depth 等所需通道已保留，并单独检查过', '在首帧、中间帧、尾帧各抽检一帧；检查黑帧、闪帧、边缘和噪点', '输出文件能在目标软件/播放器中正常打开，且音频、烧录信息符合要求'];

  /* —— Write 交付配置器 —— */
  var DEFCFG = { preset:0, format:'hd', fps:24, start:1001, end:1040, handles:8, codec:'h264', depth:'8-bit', comp:'ZIP (16 scanline)', alpha:false, space:'Rec.709 (Gamma 2.4)', show:'nlk', shot:'sh0100', task:'comp', ver:3 };
  S.dcfg = Object.assign({}, DEFCFG, S.dcfg || {});
  if (!Array.isArray(S.rq)) S.rq = [];
  if (!S.dchk) S.dchk = {};
  S.rq.forEach(function (j) { if (j.status === 'running') { j.status = 'queued'; j.prog = 0; } });
  var DC = S.dcfg;

  var CODECS = {
    exr: { name:'OpenEXR 序列', ext:'exr', kind:'seq', alpha:true, depths:['16-bit half','32-bit float'], comps:['ZIP (16 scanline)','PIZ','DWAA (有损)','无压缩'], factor:{ 'ZIP (16 scanline)':0.42, 'PIZ':0.5, 'DWAA (有损)':0.16, '无压缩':1 } },
    png: { name:'PNG 序列', ext:'png', kind:'seq', alpha:true, depths:['8-bit','16-bit'], comps:[] },
    dpx: { name:'DPX 序列', ext:'dpx', kind:'seq', alpha:false, depths:['10-bit','16-bit'], comps:[] },
    prores4444: { name:'ProRes 4444', ext:'mov', kind:'mov', alpha:true, depths:['12-bit'], mbps:300 },
    prores422hq: { name:'ProRes 422 HQ', ext:'mov', kind:'mov', alpha:false, depths:['10-bit'], mbps:188 },
    dnxhrhqx: { name:'DNxHR HQX', ext:'mov', kind:'mov', alpha:false, depths:['10-bit'], mbps:184 },
    h264: { name:'H.264 MP4', ext:'mp4', kind:'mov', alpha:false, depths:['8-bit'], mbps:16 },
    h265: { name:'H.265 MP4', ext:'mp4', kind:'mov', alpha:false, depths:['10-bit'], mbps:10 }
  };
  var FORMATS = { hd:{ label:'HD 1920×1080', w:1920, h:1080 }, uhd:{ label:'UHD 3840×2160', w:3840, h:2160 }, dci2k:{ label:'DCI 2K 2048×1080', w:2048, h:1080 }, dci4k:{ label:'DCI 4K 4096×2160', w:4096, h:2160 } };
  var DEPTH_BYTES = { '8-bit':1, '10-bit':2, '12-bit':2, '16-bit':2, '16-bit half':2, '32-bit float':4 };
  var SPACES = ['Rec.709 (Gamma 2.4)', 'sRGB (Gamma 2.2)', 'Rec.2020 ST 2084', 'ACEScg', 'ACES 2065-1', 'Scene Linear', 'Cineon Log', 'Alexa LogC (EI 800)'];
  var FPS_OPTS = [23.976, 24, 25, 29.97, 30, 50, 60];

  function dPad(n) { return String(n || 1).padStart(3, '0'); }
  function dBase() { return (DC.show || 'show') + '_' + (DC.shot || 'shot') + '_' + (DC.task || 'comp') + '_v' + dPad(DC.ver); }
  function hStart() { return String(Math.max(0, DC.start - DC.handles)).padStart(4, '0'); }
  function hEnd() { return String(DC.end + DC.handles).padStart(4, '0'); }
  function fmtBytes(b) { if (!isFinite(b) || b <= 0) return '—'; if (b >= 1073741824) return (b / 1073741824).toFixed(1) + ' GB'; var mb = b / 1048576; if (mb >= 1) return (mb >= 100 ? mb.toFixed(0) : mb.toFixed(1)) + ' MB'; return (b / 1024).toFixed(0) + ' KB'; }
  function fixCodec() { var cd = CODECS[DC.codec]; if (cd.depths.indexOf(DC.depth) < 0) DC.depth = cd.depths[0]; if (DC.codec === 'exr' && cd.comps.indexOf(DC.comp) < 0) DC.comp = cd.comps[0]; if (!cd.alpha) DC.alpha = false; }
  function perFrameBytes() {
    var f = FORMATS[DC.format], px = f.w * f.h;
    if (DC.codec === 'exr') return px * (DC.alpha ? 4 : 3) * DEPTH_BYTES[DC.depth] * (CODECS.exr.factor[DC.comp] || 1);
    if (DC.codec === 'png') return px * (DC.alpha ? 4 : 3) * DEPTH_BYTES[DC.depth] * (DC.depth === '16-bit' ? 0.62 : 0.55);
    if (DC.codec === 'dpx') return px * 4;
    return 0;
  }
  function estSize() {
    var frames = Math.max(1, DC.end - DC.start + 1), cd = CODECS[DC.codec];
    if (cd.kind === 'seq') { var per = perFrameBytes(); return { text: fmtBytes(per * frames), sub: frames.toLocaleString() + ' 帧 · 单帧 ≈ ' + fmtBytes(per) }; }
    var secs = frames / DC.fps, scale = Math.min(4, Math.max(0.4, (FORMATS[DC.format].w * FORMATS[DC.format].h * DC.fps) / (1920 * 1080 * 24)));
    var mbps = cd.mbps * scale;
    return { text: fmtBytes(mbps * 131072 * secs), sub: '时长 ' + secs.toFixed(1) + ' 秒 · ≈ ' + Math.round(mbps) + ' Mbps' };
  }
  function copyText(txt, tip) {
    function fb() { var ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); toast(tip); } catch (e) { toast('复制失败，请手动复制'); } document.body.removeChild(ta); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function () { toast(tip); }, fb); else fb();
  }
  function dWarnings() {
    var cd = CODECS[DC.codec], w = [];
    if (cd.kind === 'seq') w.push(['ok', '序列帧支持断点续渲与单帧重渲，出错无需整条重跑']);
    if (DC.alpha) w.push(['warn', '交付透明元素：确认 Premult 状态，并在棋盘格背景上检查边缘与溢色']);
    if (!cd.alpha && DC.preset === 2) w.push(['warn', '当前编码不支持 Alpha；透明元素请改用 ProRes 4444 或 EXR 序列']);
    if (cd.kind === 'mov' && DC.preset !== 0) w.push(['warn', '视频封装仅建议用于审片/交付；多轮修改的中间文件请用 EXR 序列']);
    if (DC.handles > 0) w.push(['ok', '已含 ' + DC.handles + ' 帧句柄，实际渲染 ' + hStart() + ' - ' + hEnd() + '，交接前与下游确认']);
    if (DC.preset === 3) w.push(['warn', '技术通道：确认通道命名与数值空间，不要套用显示 LUT']);
    return w.slice(0, 5);
  }
  function applyPreset(i, scroll) {
    var p = DELIVERY_PRESETS[i]; if (!p) return;
    DC.preset = i; Object.assign(DC, p.cfg); fixCodec(); save();
    renderDconfForm(); renderDconfPrev();
    if (scroll) { $('#deliveryConfig').scrollIntoView({ behavior: 'smooth', block: 'start' }); toast('已应用「' + p.title.split(' /')[0] + '」推荐参数'); }
  }
  function writeText() {
    var cd = CODECS[DC.codec], f = FORMATS[DC.format], seq = cd.kind === 'seq', est = estSize();
    var name = dBase() + (seq ? '.####.' + cd.ext : '.' + cd.ext);
    return ['【Write 设置】' + DELIVERY_PRESETS[DC.preset].title,
      '输出文件: …/' + (DC.show || 'show') + '/03_renders/' + (DC.task || 'comp') + '/v' + dPad(DC.ver) + '/' + name,
      '渲染范围: ' + DC.start + ' - ' + DC.end + (DC.handles > 0 ? '（含句柄 ' + hStart() + ' - ' + hEnd() + '）' : ''),
      '格式: ' + f.w + '×' + f.h + ' @ ' + DC.fps + ' fps',
      '色彩空间: ' + DC.space,
      '编码: ' + cd.name + ' · ' + DC.depth + (DC.codec === 'exr' && DC.comp ? ' · ' + DC.comp : ''),
      '通道: ' + (DC.alpha ? 'rgba（含 Alpha）' : 'rgb'),
      '预计体积: ≈ ' + est.text].join('\n');
  }
  function renderDconfForm() {
    var cd = CODECS[DC.codec];
    var chips = '<div class="chipbar" style="margin:0">' + DELIVERY_PRESETS.map(function (p, i) { return '<button class="chip' + (DC.preset === i ? ' on' : '') + '" data-dp="' + i + '">' + esc(p.title.split(' /')[0]) + '</button>'; }).join('') + '</div>';
    var fmtSel = '<div><small>画面格式</small><select class="sel" id="dcFmt">' + Object.keys(FORMATS).map(function (k) { return '<option value="' + k + '"' + (DC.format === k ? ' selected' : '') + '>' + FORMATS[k].label + '</option>'; }).join('') + '</select></div>';
    var fpsSel = '<div><small>帧率</small><select class="sel" id="dcFps">' + FPS_OPTS.map(function (f) { return '<option value="' + f + '"' + (String(DC.fps) === String(f) ? ' selected' : '') + '>' + f + ' fps</option>'; }).join('') + '</select></div>';
    var hanInp = '<div><small>句柄（帧）</small><input type="number" class="inp" id="dcHan" min="0" max="48" step="1" value="' + DC.handles + '"></div>';
    var rangeRow = '<div class="frow" style="grid-template-columns:1fr 1fr"><div><small>起始帧</small><input type="number" class="inp" id="dcStart" min="0" step="1" value="' + DC.start + '"></div><div><small>结束帧</small><input type="number" class="inp" id="dcEnd" min="0" step="1" value="' + DC.end + '"></div></div>';
    var codecSel = '<div style="grid-column:1/-1"><small>编码 / 容器</small><select class="sel" id="dcCodec">' +
      '<optgroup label="序列帧 — 合成中间件首选">' + ['exr', 'png', 'dpx'].map(function (k) { return '<option value="' + k + '"' + (DC.codec === k ? ' selected' : '') + '>' + CODECS[k].name + '</option>'; }).join('') + '</optgroup>' +
      '<optgroup label="视频封装 — 审片与交付">' + ['prores4444', 'prores422hq', 'dnxhrhqx', 'h264', 'h265'].map(function (k) { return '<option value="' + k + '"' + (DC.codec === k ? ' selected' : '') + '>' + CODECS[k].name + '</option>'; }).join('') + '</optgroup></select></div>';
    var depthSel = '<div><small>位深</small><select class="sel" id="dcDepth">' + cd.depths.map(function (d) { return '<option' + (DC.depth === d ? ' selected' : '') + '>' + d + '</option>'; }).join('') + '</select></div>';
    var compSel = DC.codec === 'exr' ? '<div><small>EXR 压缩</small><select class="sel" id="dcComp">' + cd.comps.map(function (c2) { return '<option' + (DC.comp === c2 ? ' selected' : '') + '>' + c2 + '</option>'; }).join('') + '</select></div>' : '';
    var alphaRow = '<label class="dalpha' + (cd.alpha ? '' : ' off') + '"><input type="checkbox" id="dcAlpha"' + (DC.alpha ? ' checked' : '') + (cd.alpha ? '' : ' disabled') + '> 输出 Alpha（rgba）' + (cd.alpha ? '' : ' — 当前编码不支持') + '</label>';
    var spaceSel = '<div><small>色彩空间</small><select class="sel" id="dcSpace">' + SPACES.map(function (s) { return '<option' + (DC.space === s ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></div>';
    var nameRow = '<div class="frow4"><div><small>项目代号 show</small><input class="inp" id="dcShow" value="' + esc(DC.show) + '"></div><div><small>镜头号 shot</small><input class="inp" id="dcShot" value="' + esc(DC.shot) + '"></div><div><small>任务 task</small><input class="inp" id="dcTask" value="' + esc(DC.task) + '"></div><div><small>版本 v</small><input type="number" class="inp" id="dcVer" min="1" max="999" value="' + DC.ver + '"></div></div>';
    $('#dconfForm').innerHTML =
      '<div class="fg"><span class="flabel">交付方案</span>' + chips + '</div>' +
      '<div class="fg"><span class="flabel">画面与时间线</span><div class="frow">' + fmtSel + fpsSel + hanInp + '</div>' + rangeRow + '</div>' +
      '<div class="fg"><span class="flabel">编码与通道</span><div class="frow">' + codecSel + depthSel + compSel + '</div>' + alphaRow + '</div>' +
      '<div class="fg"><span class="flabel">输出命名</span>' + nameRow + '</div>' +
      '<div class="fg"><span class="flabel">色彩空间</span>' + spaceSel + '</div>';
    $$('#dconfForm [data-dp]').forEach(function (b) { b.onclick = function () { applyPreset(+b.dataset.dp, false); }; });
    $('#dcFmt').onchange = function () { DC.format = this.value; save(); renderDconfPrev(); };
    $('#dcFps').onchange = function () { DC.fps = parseFloat(this.value); save(); renderDconfPrev(); };
    $('#dcHan').oninput = function () { var v = parseInt(this.value, 10); if (!isNaN(v)) { DC.handles = Math.min(48, Math.max(0, v)); save(); renderDconfPrev(); } };
    $('#dcStart').oninput = function () { var v = parseInt(this.value, 10); if (!isNaN(v)) { DC.start = v; if (DC.end < DC.start) DC.end = DC.start; save(); renderDconfPrev(); } };
    $('#dcEnd').oninput = function () { var v = parseInt(this.value, 10); if (!isNaN(v)) { DC.end = Math.max(DC.start, v); save(); renderDconfPrev(); } };
    $('#dcCodec').onchange = function () { DC.codec = this.value; fixCodec(); save(); renderDconfForm(); renderDconfPrev(); };
    $('#dcDepth').onchange = function () { DC.depth = this.value; save(); renderDconfPrev(); };
    if ($('#dcComp')) $('#dcComp').onchange = function () { DC.comp = this.value; save(); renderDconfPrev(); };
    if ($('#dcAlpha')) $('#dcAlpha').onchange = function () { DC.alpha = this.checked; save(); renderDconfPrev(); };
    $('#dcSpace').onchange = function () { DC.space = this.value; save(); renderDconfPrev(); };
    $('#dcShow').oninput = function () { DC.show = this.value.trim().replace(/\s+/g, ''); save(); renderDconfPrev(); };
    $('#dcShot').oninput = function () { DC.shot = this.value.trim().replace(/\s+/g, ''); save(); renderDconfPrev(); };
    $('#dcTask').oninput = function () { DC.task = this.value.trim().replace(/\s+/g, ''); save(); renderDconfPrev(); };
    $('#dcVer').oninput = function () { var v = parseInt(this.value, 10); if (!isNaN(v) && v > 0) { DC.ver = Math.min(999, v); save(); renderDconfPrev(); } };
  }
  function renderDconfPrev() {
    var cd = CODECS[DC.codec], f = FORMATS[DC.format], seq = cd.kind === 'seq', est = estSize();
    var name = dBase() + (seq ? '.####.' + cd.ext : '.' + cd.ext);
    var rows = [
      ['输出文件', '…/' + (DC.show || 'show') + '/03_renders/' + (DC.task || 'comp') + '/v' + dPad(DC.ver) + '/' + name],
      ['渲染范围', DC.start + ' - ' + DC.end + (DC.handles > 0 ? '（含句柄 ' + hStart() + ' - ' + hEnd() + '）' : '（无句柄）')],
      ['格式 / 帧率', f.label + ' · ' + DC.fps + ' fps'],
      ['色彩空间', DC.space],
      ['编码', cd.name + ' · ' + DC.depth + (DC.codec === 'exr' && DC.comp ? ' · ' + DC.comp : '')],
      ['通道', DC.alpha ? 'rgba（含 Alpha）' : 'rgb'],
      ['文件类型', seq ? '序列帧 · 支持断点续渲与单帧重渲' : '视频封装 · ' + cd.ext.toUpperCase()]
    ];
    $('#dconfPrev').innerHTML =
      '<div class="fname-box" id="dcName" title="点击复制文件名"><small>输出文件名（点击复制）</small><div class="fname">' + esc(name) + '</div><span class="fpath">…/' + esc(DC.show || 'show') + '/03_renders/' + esc(DC.task || 'comp') + '/v' + dPad(DC.ver) + '/</span></div>' +
      '<table class="param-table dset">' + rows.map(function (r) { return '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td></tr>'; }).join('') + '</table>' +
      '<div class="dwarns">' + dWarnings().map(function (w) { return '<div class="dwarn ' + w[0] + '"><i>' + (w[0] === 'ok' ? '✓' : '!') + '</i><span>' + esc(w[1]) + '</span></div>'; }).join('') + '</div>' +
      '<div class="dsize"><b>≈ ' + esc(est.text) + '</b><span>' + esc(est.sub) + '（粗略估算）</span></div>' +
      '<div class="dbtns"><button class="btn" id="dcCopy">⧉ 复制 Write 设置</button><button class="btn primary" id="dcQueue">⇧ 添加到渲染队列</button></div>' +
      '<div class="node-pills"><button class="node-pill" data-dlesson="L006">▶ 观看课程：渲染输出</button><button class="node-pill" data-dlesson="L005">▶ 观看课程：项目设置</button></div>';
    $('#dcName').onclick = function () { copyText(name, '文件名已复制'); };
    $('#dcCopy').onclick = function () { copyText(writeText(), 'Write 设置已复制'); };
    $('#dcQueue').onclick = queueAdd;
    $$('#dconfPrev [data-dlesson]').forEach(function (b) { b.onclick = function () { openPlayer(b.dataset.dlesson); }; });
  }
  function queueAdd() {
    var est = estSize(), cd = CODECS[DC.codec], seq = cd.kind === 'seq';
    S.rq.unshift({ id: 'R' + Date.now().toString(36), name: dBase() + (seq ? '.####.' + cd.ext : '.' + cd.ext), preset: DELIVERY_PRESETS[DC.preset].title.split(' /')[0] + '（' + cd.name + '）', range: hStart() + ' - ' + hEnd(), info: DC.depth + (DC.codec === 'exr' && DC.comp ? ' · ' + DC.comp.split(' (')[0] : '') + ' · ' + (DC.alpha ? 'rgba' : 'rgb') + ' · ' + DC.space.split(' (')[0], size: est.text, status: 'queued', prog: 0, at: 0 });
    save(); renderQueue();
    $('#deliveryQueue').scrollIntoView({ behavior: 'smooth', block: 'start' });
    toast('已加入渲染队列');
  }
  function qTime(ts) { var d = new Date(ts || Date.now()); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
  function renderQueue() {
    var q = S.rq;
    var dn = q.filter(function (j) { return j.status === 'done'; }).length;
    var run = q.filter(function (j) { return j.status === 'running'; }).length;
    $('#queueMeta').textContent = q.length ? ('排队 ' + (q.length - dn - run) + ' · 渲染中 ' + run + ' · 已完成 ' + dn) : '';
    $('#qClear').style.display = dn ? '' : 'none';
    $('#queueList').innerHTML = q.map(function (j) {
      var st = j.status === 'done' ? '<span class="q-status done">已完成</span>' : j.status === 'running' ? '<span class="q-status run">渲染中</span>' : '<span class="q-status">排队中</span>';
      return '<div class="q-item' + (j.status === 'done' ? ' ok' : '') + '">' +
        '<div>' + st + '</div>' +
        '<div style="min-width:0"><div class="q-name">' + esc(j.name) + '</div><div class="q-meta">' + esc(j.preset) + ' · ' + esc(j.range) + ' · ' + esc(j.info) + ' · ≈ ' + esc(j.size) + '</div></div>' +
        '<div class="q-act">' + (j.status === 'queued' ? '<button class="btn" data-qrun="' + j.id + '">▶ 渲染</button>' : '') +
        (j.status === 'done' ? '<span class="q-doneat">' + esc(qTime(j.at)) + ' 完成</span>' : '') +
        '<button class="q-del" data-qdel="' + j.id + '" title="删除任务">✕</button></div>' +
        (j.status === 'running' ? '<div class="q-prog" data-prog="' + j.id + '"><i style="width:' + Math.round(j.prog) + '%"></i></div>' : '') +
        '</div>';
    }).join('') || '<div class="empty" style="padding:26px">队列为空 —— 在上方配置好 Write 后点「添加到渲染队列」。</div>';
    $$('#queueList [data-qrun]').forEach(function (b) { b.onclick = function () { queueRun(b.dataset.qrun); }; });
    $$('#queueList [data-qdel]').forEach(function (b) { b.onclick = function () { S.rq = S.rq.filter(function (x) { return x.id !== b.dataset.qdel; }); save(); renderQueue(); }; });
    $('#qClear').onclick = function () { S.rq = S.rq.filter(function (x) { return x.status !== 'done'; }); save(); renderQueue(); toast('已清空已完成任务'); };
  }
  function queueRun(id) {
    var j = S.rq.filter(function (x) { return x.id === id; })[0];
    if (!j || j.status !== 'queued') return;
    j.status = 'running'; j.prog = 0; save(); renderQueue();
    var t = setInterval(function () {
      j.prog += 2.5 + Math.random() * 5;
      if (j.prog >= 100) {
        j.prog = 100; j.status = 'done'; j.at = Date.now(); clearInterval(t); save(); renderQueue();
        toast('渲染完成 ✓ ' + j.name);
      } else {
        var bar = $('#queueList [data-prog="' + j.id + '"] i');
        if (bar) { bar.style.width = Math.round(j.prog) + '%'; save(); }
        else renderQueue();
      }
    }, 160);
  }
  function renderChecks() {
    var total = DELIVERY_CHECKS.length;
    var done = DELIVERY_CHECKS.filter(function (x, i) { return !!S.dchk[i]; }).length;
    $('#dchkMeta').innerHTML = '<span class="dchk-count">' + done + ' / ' + total + '</span><span class="dchk-bar"><i style="width:' + Math.round(done / total * 100) + '%"></i></span>' + (done === total ? '<b class="dchk-ok">全部确认，可以开始渲染 🎉</b>' : '');
    $('#deliveryChecks').innerHTML = DELIVERY_CHECKS.map(function (x, i) {
      var on = !!S.dchk[i];
      return '<div class="check-item' + (on ? ' on' : '') + '" data-dchk="' + i + '" title="点击勾选 / 取消"><b>' + String(i + 1).padStart(2, '0') + '</b><span>' + esc(x) + '</span><i>' + (on ? '✓' : '') + '</i></div>';
    }).join('');
    $$('#deliveryChecks [data-dchk]').forEach(function (el) {
      el.onclick = function () {
        var i = +el.dataset.dchk;
        if (S.dchk[i]) delete S.dchk[i];
        else { S.dchk[i] = Date.now(); if (DELIVERY_CHECKS.every(function (x, j2) { return !!S.dchk[j2]; })) toast('交付前检查全部通过 ✓'); }
        save(); renderChecks();
      };
    });
    $('#dchkReset').onclick = function () { S.dchk = {}; save(); renderChecks(); toast('检查清单已重置'); };
  }
  function renderDeliveryPresets() {
    $('#deliveryGrid').innerHTML = DELIVERY_PRESETS.map(function (p, i) {
      return '<article class="delivery-card"><div class="delivery-icon ' + p.tone + '">' + p.icon + '</div><div class="delivery-kind">交付方案 0' + (i + 1) + '</div><h3>' + esc(p.title) + '</h3><p>' + esc(p.purpose) + '</p><div class="delivery-output">' + esc(p.output) + '</div><div class="delivery-settings">' + p.settings.map(function (s) { return '<div><b>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span></div>'; }).join('') + '</div><div class="delivery-tip"><b>提示 · </b>' + esc(p.tip) + '</div><button class="delivery-use" data-duse="' + i + '">采用此方案，配置 Write →</button></article>';
    }).join('');
    $$('#deliveryGrid [data-duse]').forEach(function (b) { b.onclick = function () { applyPreset(+b.dataset.duse, true); }; });
  }
  function renderDelivery() {
    renderSide();
    renderDeliveryPresets();
    renderDconfForm();
    renderDconfPrev();
    renderQueue();
    renderChecks();
    $$('[data-delivery-scroll]').forEach(function (b) { b.onclick = function () { var t = b.dataset.deliveryScroll === 'check' ? $('#deliveryCheck') : $('#deliveryConfig'); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }; });
  }

  /* ---------------- 练习项目 ---------------- */
  var EX = [
    { id: 'ex1', p: 2, title: '完整跑通一枪镜头', level: '入门', desc: '从项目设置到渲染输出，不改任何花活，先把标准流程走顺一遍。', steps: ['设置正确的分辨率/帧率/色彩空间', '导入素材并 Reformat 到项目格式', '用 Merge over 完成叠加', '整理节点图并渲染输出'], pick: ['项目设置', '导入素材', 'Merge节点的使用方法', '工程优化', '渲染输出'] },
    { id: 'ex2', p: 3, title: '夏天转冬天 / 秋天', level: '进阶', desc: '同一个镜头做两种季节氛围，练习整体色调与局部色彩分离处理。', steps: ['统一整体色温', '单独处理植被与地面', '加入氛围元素（雾/霜）'], pick: ['夏天转冬天', '夏天转秋天'] },
    { id: 'ex3', p: 3, title: '小汽车多元素合成', level: '进阶', desc: '7 节长案例，练习分层合成、阴影与反射、氛围统一。', steps: ['分层处理车身与环境', '匹配透视与运动模糊', '统一颗粒与色彩'], pick: ['小汽车的合成1', '小汽车的合成7'] },
    { id: 'ex4', p: 3, title: '飞行器合成全流程', level: '进阶', desc: '9 节长案例 + 4 节扩展，完整模拟一个 CG 元素进实拍的流程。', steps: ['通道与特殊层的运用', '匹配光照方向', '加入运动模糊与景深'], pick: ['特殊层的使用方法1', '合成飞行器1', '合成飞行器9', '合成小飞行器1'] },
    { id: 'ex5', p: 4, title: '雪地汽车调色匹配', level: '进阶', desc: '典型的高反差雪景匹配：控制高光不过曝，同时把 CG 车压进环境。', steps: ['先对黑场再对白场', '处理雪地高光溢出', '局部压暗车底接触面'], pick: ['为雪地汽车调色1', '为雪地汽车调色6', '为飞行器调色1'] },
    { id: 'ex6', p: 5, title: '运动模糊与难抠素材', level: '进阶', desc: '掌握 VectorBlur 的正确接法，并用石头案例练习硬边物体抠像。', steps: ['确认 motion vector 通道方向', '调整快门角度匹配实拍', '石头类硬边素材的边缘处理'], pick: ['运动模糊的添加方法1', '石头抠像'] },
    { id: 'ex7', p: 6, title: '镜头畸变与创意变形', level: '进阶', desc: '先校正畸变保证对位准确，再用 SplineWarp 做一个夸张的创意变形。', steps: ['用网格图分析镜头畸变', 'undistort → 合成 → distort 输出', '用样条做夸张变形并加运动模糊'], pick: ['去除镜头畸变', '制作“狮吼功”效果'] },
    { id: 'ex8', p: 7, title: '跟踪三件套', level: '高阶', desc: '点跟踪贴附、平面跟踪替换屏幕、摄像机反求 CG 场景，一次练全。', steps: ['选点原则与误差检查', '平面跟踪做屏幕替换', '反求后检查点云平面度'], pick: ['点跟踪', '平面跟踪', '摄像机反求', '跟踪及擦除'] },
    { id: 'ex9', p: 8, title: 'Roto 与边缘融合', level: '高阶', desc: '画遮罩只是开始，让边缘看不出接缝才是关键。', steps: ['用 RotoPaint 画动态遮罩', 'LightWrap 让前景吸光', '匹配噪点消除贴纸感'], pick: ['RotoPaint节点的应用', 'LightWrap节点的应用', 'Noise节点的应用', '单帧擦除'] },
    { id: 'ex10', p: 9, title: '威亚与穿帮擦除', level: '高阶', desc: '逐帧、左右帧互补、静帧贴片三种思路，外加 F_WireRemoval 插件。', steps: ['判断用哪种擦除思路', '用 FrameHold 造干净底板', '插件与手工结合处理细线'], pick: ['逐帧擦除', '左右帧互补擦除', '静帧贴片擦除', 'F_WireRemoval节点擦除', '擦除1-1'] },
    { id: 'ex11', p: 10, title: '四种抠像器横向对比', level: '高阶', desc: '同一段素材分别用 Keylight / Primatte / IBK / Keyer 抠一遍，对比边缘与溢色。', steps: ['统一取样同一块幕布', '记录每种抠像器的参数差异', '总结适用场景'], pick: ['使用Keylight节点抠像', '使用Primatte节点抠像', '使用IBK节点抠像', '使用Keyer节点抠像', '抠像综合练习'] },
    { id: 'ex12', p: 11, title: '综合实训：花瓣 / 烟雾', level: '实战', desc: '两个完整镜头：花瓣考验大量小元素的层次，房屋与烟雾考验半透明素材。', steps: ['半透明素材的 alpha 处理', '大量元素的层次与随机性', '按交付标准输出'], pick: ['花瓣合成', '房屋与烟雾的合成'] }
  ];
  var exCat = 'all';
  function renderPractice() {
    renderSide();
    $('#exChips').innerHTML = '<button class="chip' + (exCat === 'all' ? ' on' : '') + '" data-c="all">全部 ' + EX.length + '</button>' +
      '<button class="chip' + (exCat === 'undone' ? ' on' : '') + '" data-c="undone">未完成</button>' +
      '<button class="chip' + (exCat === 'done' ? ' on' : '') + '" data-c="done">已完成 ' + Object.keys(S.ex).length + '</button>';
    $$('#exChips .chip').forEach(function (b) { b.onclick = function () { exCat = b.dataset.c; renderPractice(); }; });
    var list = EX.filter(function (e) { return exCat === 'all' || (exCat === 'done' ? !!S.ex[e.id] : !S.ex[e.id]); });
    $('#exGrid').innerHTML = list.map(function (e) {
      var dn = !!S.ex[e.id];
      var refs = (e.pick || []).map(function (t) { return D.lessons.filter(function (l) { return l.title.indexOf(t) >= 0; })[0]; }).filter(Boolean);
      return '<div class="ex-card' + (dn ? ' done' : '') + '"><h3>' + esc(e.title) + ' <span class="tag ' + (e.level === '入门' ? 'task' : e.level === '实战' ? 'lab' : 'ext') + '">' + esc(e.level) + '</span></h3>' +
        '<p>' + esc(e.desc) + '</p>' +
        '<div style="margin-top:12px">' + e.steps.map(function (s, i) { return '<div style="font-size:12px;color:#5c6675;line-height:2">· ' + esc(s) + '</div>'; }).join('') + '</div>' +
        '<div class="ex-links">' + refs.slice(0, 5).map(function (l) { return '<button class="node-pill" data-id="' + l.id + '">▶ ' + esc(l.title) + '</button>'; }).join('') +
        '<button class="node-pill" data-p="' + e.p + '">项目' + e.p + ' 全部 →</button></div>' +
        '<label class="ex-check"><input type="checkbox" data-ex="' + e.id + '"' + (dn ? ' checked' : '') + '> 标记为已完成</label></div>';
    }).join('');
    $$('#exGrid [data-id]').forEach(function (b) { b.onclick = function () { openPlayer(b.dataset.id); }; });
    $$('#exGrid [data-p]').forEach(function (b) { b.onclick = function () { go('courses', 'p' + b.dataset.p); }; });
    $$('#exGrid [data-ex]').forEach(function (b) {
      b.onchange = function () { if (b.checked) { S.ex[b.dataset.ex] = Date.now(); toast('练习已完成 ✓'); } else delete S.ex[b.dataset.ex]; save(); renderPractice(); };
    });
  }

  /* ---------------- 学习记录 ---------------- */
  function renderHistory() {
    renderSide();
    var d = doneCount();
    $('#hDone').textContent = d; $('#hDoneSub').textContent = '完成率 ' + Math.round(d / TOTAL * 100) + '%';
    $('#hHours').textContent = (totalSeconds() / 3600).toFixed(1) + 'h';
    $('#hHoursSub').textContent = '本周 ' + humanMin(weekSeconds());
    $('#hStreak').textContent = streak();
    $('#hNotes').textContent = noteCount();
    var days = [], max = 1;
    for (var i = 13; i >= 0; i--) { var dt = new Date(); dt.setDate(dt.getDate() - i); var k = dayKey(dt.getTime()); var v = Math.round((S.days[k] || 0) / 60); days.push({ k: k, v: v, lbl: (dt.getMonth() + 1) + '/' + dt.getDate() }); if (v > max) max = v; }
    $('#histChart').innerHTML = days.map(function (x) {
      return '<div class="col" title="' + x.k + '：' + x.v + ' 分钟"><b>' + (x.v || '') + '</b><i style="height:' + Math.max(3, x.v / max * 100) + '%"></i><span>' + x.lbl + '</span></div>';
    }).join('');
    $('#histCount').textContent = S.recent.length + ' 条';
    $('#histList').innerHTML = S.recent.length ? S.recent.map(function (r) { return lessonRow(r.id, true); }).join('') : '<div class="empty">还没有观看记录</div>';
    bindRows($('#histList'));
    var done = ORDER.filter(isDone);
    $('#doneCount').textContent = done.length + ' 节';
    $('#doneList').innerHTML = done.length ? done.map(function (id) { return lessonRow(id, true); }).join('') : '<div class="empty">还没有完成的课程</div>';
    bindRows($('#doneList'));
  }

  /* ---------------- 设置 ---------------- */
  var SHORTCUTS = [['播放 / 暂停', 'Space / K'], ['快退 / 快进 10 秒', 'J / L'], ['上一节 / 下一节', 'P / N'], ['标记完成', 'M'], ['全屏', 'F'], ['关闭播放器', 'Esc'], ['聚焦搜索', '/'], ['打开 / 关闭快捷键帮助', '?']];
  function renderSettings() {
    renderSide();
    $('#setBase').value = S.settings.base;
    $('#setResume').classList.toggle('on', S.settings.resume);
    $('#setAutoNext').classList.toggle('on', S.settings.autoNext);
    $('#setAutoDone').classList.toggle('on', S.settings.autoDone);
    $('#setSpeed').value = String(S.settings.speed);
    $('#shortcutGrid').innerHTML = SHORTCUTS.map(function (s) { return '<div><span>' + s[0] + '</span><span class="kbd">' + s[1] + '</span></div>'; }).join('');
  }

  /* ---------------- 快捷键键盘 ---------------- */
  var KB = window.NUKE_KEYS || { areas: {}, rows: [], keys: {} };
  var kbMods = { ctrl: false, alt: false, shift: false };
  var kbSel = null, kbPin = false;
  var AREA_COLOR = { node: '#6658e8', prop: '#715ee0', view: '#38aa8e', d3: '#4b8fd6', curve: '#f169a1', roto: '#c98a2e', time: '#e77e5e', glob: '#7c879b' };
  function keyLabel(k) { var d = KB.keys[k]; return (d && d.label) || k; }
  function comboPrefix() { return (kbMods.ctrl ? 'Ctrl+' : '') + (kbMods.alt ? 'Alt+' : '') + (kbMods.shift ? 'Shift+' : ''); }
  function activeMods() { return !!(kbMods.ctrl || kbMods.alt || kbMods.shift); }
  function parseCombo(str) {
    var parts = String(str).split('+'), key = parts.pop(), mods = { ctrl: false, alt: false, shift: false };
    parts.forEach(function (m) { if (m === 'Ctrl') mods.ctrl = true; if (m === 'Alt') mods.alt = true; if (m === 'Shift') mods.shift = true; });
    return { key: key, mods: mods };
  }
  function renderKeys() {
    renderSide();
    $('#keyLegend').innerHTML = Object.keys(KB.areas).map(function (k) {
      return '<span class="kbd-legend-item"><i style="background:' + (AREA_COLOR[k] || '#7c879b') + '"></i>' + esc(KB.areas[k]) + '</span>';
    }).join('');
    $('#keyBoard').innerHTML = KB.rows.map(function (row) {
      return '<div class="kbd-row">' + row.keys.map(function (kd) {
        var k = kd[0], w = kd[1] || 1;
        if (kd[2]) return '<span class="kbd-spacer" style="flex:' + w + '"></span>';
        var d = KB.keys[k];
        var has = !!(d && ((d.fn && d.fn.length) || (d.combo && d.combo.length)));
        return '<button class="key' + (has ? ' has' : '') + '" data-k="' + esc(k) + '" style="flex:' + w + '">' +
          '<span class="key-cap">' + esc(keyLabel(k)) + '</span></button>';
      }).join('') + '</div>';
    }).join('');
    $$('#keyBoard .key').forEach(function (b) {
      b.onmouseenter = function () { if (!kbPin) showKey(b.dataset.k); };
      b.onfocus = function () { if (!kbPin) showKey(b.dataset.k); };
      b.onclick = function () {
        if (kbPin && kbSel === b.dataset.k) { kbPin = false; showKey(b.dataset.k); }
        else { kbPin = true; showKey(b.dataset.k); }
        syncBoard();
      };
    });
    $$('.kbd-mods .chip').forEach(function (b) {
      b.onclick = function () {
        if (b.dataset.mod === 'clear') { kbMods = { ctrl: false, alt: false, shift: false }; }
        else kbMods[b.dataset.mod] = !kbMods[b.dataset.mod];
        syncBoard(); if (kbSel) showKey(kbSel);
      };
    });
    syncBoard();
    showKey(kbSel || 'Tab');
  }
  function syncBoard() {
    $$('.kbd-mods .chip').forEach(function (b) { if (b.dataset.mod !== 'clear') b.classList.toggle('on', !!kbMods[b.dataset.mod]); });
    $$('#keyBoard .key').forEach(function (b) {
      var k = b.dataset.k;
      b.classList.toggle('on', k === kbSel);
      b.classList.toggle('mod-on', (k === 'Ctrl' && kbMods.ctrl) || (k === 'Shift' && kbMods.shift) || (k === 'Alt' && kbMods.alt) || (k === 'Space' && false));
    });
  }
  function showKey(k) {
    kbSel = k;
    var d = KB.keys[k] || {};
    var fn = d.fn || [], combo = (d.combo || []).filter(function (c) { return c[1]; });
    var prefix = comboPrefix(), cur = null;
    if (activeMods()) {
      for (var i = 0; i < combo.length; i++) {
        if (combo[i][0].toLowerCase() === (prefix + keyLabel(k)).toLowerCase()) { cur = combo[i]; break; }
      }
      if (!cur) { for (var j = 0; j < combo.length; j++) { if (combo[j][0].toLowerCase().indexOf(prefix.toLowerCase()) === 0) { cur = combo[j]; break; } } }
    }
    var html = '<div class="kd-head"><div class="kd-cap">' + esc(keyLabel(k)) + '</div><div class="kd-meta">' +
      '<b>' + esc(keyLabel(k)) + ' 键</b>' +
      (kbPin ? '<span class="kd-pin">已锁定 · 再次点击键可解锁</span>' : '<span>鼠标移开即切换（点击可锁定）</span>') +
      '</div></div>';
    if (cur) {
      html += '<div class="kd-cur"><span class="kd-cur-tag">当前组合</span><div class="kd-cur-key">' + esc(cur[0]) + '</div>' +
        '<p>' + esc(cur[1]) + '</p></div>';
    } else if (activeMods()) {
      html += '<div class="kd-cur none"><span class="kd-cur-tag">当前组合</span><div class="kd-cur-key">' + esc(prefix + keyLabel(k)) + '</div>' +
        '<p>该组合在 Nuke 默认键位中没有指定功能。</p></div>';
    }
    if (fn.length) {
      html += '<div class="kd-sec"><h4>功能</h4>' + fn.map(function (f) {
        return '<div class="kd-fn"><span class="kd-area" style="background:' + (AREA_COLOR[f[0]] || '#7c879b') + '">' + esc(KB.areas[f[0]] || f[0]) + '</span><span>' + esc(f[1]) + '</span></div>';
      }).join('') + '</div>';
    } else if (!cur) {
      html += '<div class="kd-sec"><h4>功能</h4><p class="kd-empty">Nuke 默认键位未给这个键分配功能。</p></div>';
    }
    if (combo.length) {
      html += '<div class="kd-sec"><h4>与其他键组合</h4>' + combo.map(function (c) {
        var pc = parseCombo(c[0]);
        return '<button class="kd-combo" data-combo="' + esc(c[0]) + '"><span class="kd-combo-key">' + esc(c[0]) + '</span>' +
          '<span class="kd-combo-fn">' + esc(c[1]) + '</span></button>';
      }).join('') + '</div>';
    }
    if ((d.link || []).length) {
      html += '<div class="kd-sec"><h4>相关按键</h4><div class="kd-links">' + d.link.filter(function (x) { return KB.keys[x]; }).map(function (x) {
        return '<button class="kd-link" data-link="' + esc(x) + '">' + esc(keyLabel(x)) + '</button>';
      }).join('') + '</div></div>';
    }
    if (d.tip) html += '<div class="tip-box"><b>实战提示 · </b>' + esc(d.tip) + '</div>';
    $('#keyDetail').innerHTML = html;
    $$('#keyDetail .kd-combo').forEach(function (b) {
      b.onclick = function () {
        var pc = parseCombo(b.dataset.combo);
        kbMods = pc.mods; kbPin = true;
        var target = KB.keys[pc.key] ? pc.key : kbSel;
        syncBoard(); showKey(target);
      };
    });
    $$('#keyDetail .kd-link').forEach(function (b) {
      b.onclick = function () {
        var t = b.dataset.link;
        if (t === 'Ctrl' || t === 'Shift' || t === 'Alt') { kbMods[t.toLowerCase()] = true; t = kbSel; }
        kbPin = true; syncBoard(); showKey(t);
      };
    });
    $$('#keyBoard .key').forEach(function (b) { b.classList.toggle('on', b.dataset.k === kbSel); });
    $$('#keyBoard .key').forEach(function (b) {
      b.classList.toggle('rel', (d.link || []).indexOf(b.dataset.k) >= 0);
    });
    syncBoard();
  }

  /* ---------------- 播放器 ---------------- */
  var cur = null;
  var vid = $('#video');
  function openPlayer(id) {
    var l = LBY[id]; if (!l) return;
    cur = id;
    setHash(toHash('player', id));
    $('#player').classList.remove('hide');
    document.body.style.overflow = 'hidden';
    renderPlayerMeta();
    loadVideo(id);
    renderPlaylist();
    $('#video').focus();
  }
  function closePlayer() {
    setHash(toHash(lastNonPlayer.v, lastNonPlayer.p));
    $('#player').classList.add('hide');
    document.body.style.overflow = '';
    vid.pause();
    if (view === 'dashboard') renderDash(); if (view === 'courses') renderCourses();
    renderSide();
  }
  function loadVideo(id) {
    var l = LBY[id]; cur = id;
    $('#vErr').classList.add('hide');
    var src = pathOf(l);
    vid.src = src;
    vid.playbackRate = parseFloat(S.settings.speed) || 1;
    $('#vSpeed').value = String(S.settings.speed);
    vid.load();
    vid.onloadedmetadata = null;
    renderPlayerMeta();
  }
  function renderPlayerMeta() {
    var l = LBY[cur]; if (!l) return;
    var p = PBY[l.project];
    $('#pvTitle').textContent = l.title;
    $('#pvSub').textContent = '项目' + l.project + ' · ' + (p ? p.title : '') + ' · ' + l.taskLabel + ' · ' + fmtSize(l.sizeMB);
    var i = idxOf(cur);
    $('#btnPrev').disabled = i <= 0; $('#btnNext').disabled = i >= ORDER.length - 1;
  }
  function renderPlaylist() {
    var l = LBY[cur], p = PBY[l.project];
    $('#spList').innerHTML = p.lessons.map(function (id, i) {
      var x = LBY[id];
      return '<div class="pl-item' + (id === cur ? ' on' : '') + '" data-id="' + id + '">' +
        '<span class="pl-idx">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<span class="pl-title">' + esc(x.title) + '</span>' +
        '<span class="pl-idx">' + mmss(dur(id)) + '</span></div>';
    }).join('');
    $$('#spList .pl-item').forEach(function (el) { el.onclick = function () { loadVideo(el.dataset.id); renderPlaylist(); }; });
  }
  function renderNotes() {
    var ns = S.notes[cur] || [];
    $('#noteCount').textContent = ns.length;
    $('#spNotes').innerHTML = ns.length ? ns.slice().sort(function (a, b) { return a.t - b.t; }).map(function (n, i) {
      return '<div class="note-item"><span class="del" data-di="' + i + '">✕</span><span class="nt" data-t="' + n.t + '">⏱ ' + mmss(n.t) + '</span>' +
        '<div class="nx">' + esc(n.text) + '</div></div>';
    }).join('') : '<div class="empty" style="color:#7c8699">还没有笔记，看课时随手记一笔。</div>';
    $$('#spNotes .nt').forEach(function (b) { b.onclick = function () { try { vid.currentTime = parseFloat(b.dataset.t); } catch (e) { } }; });
    $$('#spNotes .del').forEach(function (b) { b.onclick = function () { var arr = S.notes[cur]; var n = arr.splice(+b.dataset.di, 1)[0]; if (!arr.length) delete S.notes[cur]; save(); renderNotes(); toast('已删除笔记'); }; });
  }
  function markDone(id, val) {
    var p = S.prog[id] || (S.prog[id] = { t: 0, d: 0 });
    p.done = val === undefined ? !p.done : val;
    if (p.done) { p.t = p.d || p.t; }
    save(); renderPlayerMeta(); renderPlaylist(); renderSide();
    toast(p.done ? '已标记完成 ✓' : '已取消完成标记');
  }
  function flushProgress() {
    if (!cur) return;
    var p = S.prog[cur] || (S.prog[cur] = { t: 0, d: 0 });
    p.t = vid.currentTime || 0;
    if (isFinite(vid.duration) && vid.duration > 0) p.d = vid.duration;
    p.at = Date.now();
    S.last = { id: cur, t: p.t };
    save();
  }
  function startWatch() {
    if (watchTimer) return;
    watchTimer = setInterval(function () {
      if (vid.paused) return;
      var k = today(); S.days[k] = (S.days[k] || 0) + 5;
      if (Math.round(S.days[k]) % 60 === 0) { flushProgress(); }
    }, 5000);
  }
  function pauseWatch() { clearInterval(watchTimer); watchTimer = null; flushProgress(); }

  vid.addEventListener('loadedmetadata', function () {
    updateTime();
  });
  vid.addEventListener('timeupdate', function () {
    updateTime();
  });
  vid.addEventListener('play', function () { $('#btnPlay').textContent = '❚❚ 暂停'; });
  vid.addEventListener('pause', function () { $('#btnPlay').textContent = '▶ 播放'; });
  vid.addEventListener('ended', function () {
    var i = idxOf(cur);
    if (S.settings.autoNext && i < ORDER.length - 1) { loadVideo(ORDER[i + 1]); renderPlaylist(); toast('自动播放下一节'); }
    else { renderPlayerMeta(); renderPlaylist(); }
  });
  vid.addEventListener('error', function () {
    $('#vErr').classList.remove('hide');
    var vname = '';
    try { vname = decodeURIComponent((vid.src.split('/').pop() || '')); } catch (e) { vname = vid.src.split('/').pop() || ''; }
    if (isOnline()) {
      $('#vErr').innerHTML = '在线版未包含教学视频：' + esc(vname) +
        '<br><span style="color:#c3cad8">课程索引、节点图鉴、菜单与交付工具线上完全可用；观看视频请使用本地完整版。</span>';
    } else {
      $('#vErr').innerHTML = '视频加载失败：' + esc(vname) +
        '<br><span style="color:#c3cad8">请确认站点下的 videos 目录存在，并保留原有文件结构。</span>';
    }
  });
  function isOnline() { return location.protocol === 'https:' && location.hostname.indexOf('github.io') >= 0; }
  function updateTime() {
    $('#vTime').textContent = mmss(vid.currentTime) + ' / ' + mmss(vid.duration || dur(cur));
  }
  function nextLesson(step) {
    var i = idxOf(cur) + step;
    if (i >= 0 && i < ORDER.length) { loadVideo(ORDER[i]); renderPlaylist(); }
  }

  /* ---------------- 事件绑定 ---------------- */
  $$('#navMain button,#navMine button,#mobileNav button').forEach(function (b) { b.onclick = function () { if (b.dataset.view === 'courses') filter.track = null; go(b.dataset.view); }; });
  $$('[data-go]').forEach(function (b) { b.onclick = function () { if (b.dataset.go === 'courses') filter.track = null; go(b.dataset.go); }; });
  $('#btnClose').onclick = closePlayer;
  $('#btnPlay').onclick = function () { vid.paused ? vid.play() : vid.pause(); };
  $('#btnBack10').onclick = function () { vid.currentTime = Math.max(0, vid.currentTime - 10); };
  $('#btnFwd10').onclick = function () { vid.currentTime = Math.min(vid.duration || 0, vid.currentTime + 10); };
  $('#btnPrev').onclick = function () { nextLesson(-1); };
  $('#btnNext').onclick = function () { nextLesson(1); };
  $('#btnFull').onclick = function () { var w = $('.video-wrap'); if (document.fullscreenElement) document.exitFullscreen(); else (w.requestFullscreen || w.webkitRequestFullscreen).call(w); };
  $('#vSpeed').onchange = function () { vid.playbackRate = parseFloat(this.value); };
  $('#scrim').onclick = closeNode;
  $('#nodeSearch').addEventListener('input', function (e) { nodeQ = e.target.value; renderNodeGrid(); });

  // 搜索
  var sr = $('#searchRes');
  $('#search').addEventListener('input', function (e) {
    var q = e.target.value.trim().toLowerCase();
    $('#searchWrap').classList.toggle('has', !!q);
    if (!q) { sr.classList.remove('on'); return; }
    var ls = D.lessons.filter(function (l) { return (l.title + l.raw + '项目' + l.project + (PBY[l.project] || {}).title).toLowerCase().indexOf(q) >= 0; }).slice(0, 8);
    var ns = NODES.list.filter(function (n) { return (n.name + n.en + n.desc).toLowerCase().indexOf(q) >= 0; }).slice(0, 5);
    var html = '';
    if (ls.length) html += '<div class="sr-group">课程</div>' + ls.map(function (l) {
      return '<div class="sr-item" data-id="' + l.id + '"><span class="tag ' + l.kind + '">' + esc(l.taskLabel) + '</span><span class="t">' + esc(l.title) + '</span><span class="m">项目' + l.project + '</span></div>';
    }).join('');
    if (ns.length) html += '<div class="sr-group">节点</div>' + ns.map(function (n) {
      return '<div class="sr-item" data-node="' + esc(n.name) + '"><span class="t">' + esc(n.name) + '</span><span class="m">' + esc(n.en) + '</span></div>';
    }).join('');
    sr.innerHTML = html || '<div class="empty" style="padding:24px">没有找到相关内容</div>';
    sr.classList.add('on');
    $$('.sr-item[data-id]', sr).forEach(function (x) { x.onclick = function () { sr.classList.remove('on'); $('#search').value = ''; openPlayer(x.dataset.id); }; });
    $$('.sr-item[data-node]', sr).forEach(function (x) { x.onclick = function () { sr.classList.remove('on'); $('#search').value = ''; go('nodes'); openNode(x.dataset.node); }; });
  });
  $('#searchClear').onclick = function () { $('#search').value = ''; sr.classList.remove('on'); $('#searchWrap').classList.remove('has'); };
  document.addEventListener('click', function (e) { if (!e.target.closest('#searchWrap')) sr.classList.remove('on'); });

  // 快捷键
  document.addEventListener('keydown', function (e) {
    var inField = /input|textarea|select/i.test((e.target.tagName || ''));
    var k = e.key.toLowerCase();
    if (e.key === '/' && !inField) { e.preventDefault(); $('#search').focus(); return; }
    if (e.key === 'Escape') {
      if ($('#nodeDetail').classList.contains('open')) { closeNode(); return; }
      if (!$('#player').classList.contains('hide')) { closePlayer(); return; }
      sr.classList.remove('on'); return;
    }
    if ($('#player').classList.contains('hide') || inField) return;
    if (k === ' ' || k === 'k') { e.preventDefault(); vid.paused ? vid.play() : vid.pause(); }
    else if (k === 'j') { vid.currentTime = Math.max(0, vid.currentTime - 10); }
    else if (k === 'l') { vid.currentTime = Math.min(vid.duration || 0, vid.currentTime + 10); }
    else if (k === 'n') { nextLesson(1); }
    else if (k === 'p') { nextLesson(-1); }
    else if (k === 'f') { $('#btnFull').click(); }
  });

  /* ---------------- 启动 ---------------- */
  window.addEventListener('hashchange', function () {
    if (hashLock) { hashLock = false; return; }
    var r = fromHash();
    if (!r) return;
    if (r.v === 'player') { if (cur !== r.p) openPlayer(r.p); }
    else {
      if (!$('#player').classList.contains('hide')) { $('#player').classList.add('hide'); document.body.style.overflow = ''; vid.pause(); }
      if (view !== r.v || param !== r.p) go(r.v, r.p);
    }
  });
  var init = fromHash();
  if (init && init.v === 'player') { go('dashboard'); openPlayer(init.p); }
  else go(init ? init.v : 'dashboard', init ? init.p : null);

  // 后台批量读取真实时长（只取元数据）
  function refreshView() {
    if (!$('#player').classList.contains('hide')) return;
    if (view === 'dashboard') renderDash();
    else if (view === 'courses') renderCourses();
  }
  function prefetchDurations() {
    if (isOnline()) return; // 线上版不含视频文件，直接使用 data.js 里的估算时长
    var ids = ORDER.filter(function (id) { return !(id in S.durs); });
    if (!ids.length) return;
    var i = 0, v = document.createElement('video');
    v.preload = 'metadata'; v.muted = true;
    function step() {
      if (i >= ids.length) { refreshView(); return; }
      var id = ids[i];
      v.onloadedmetadata = function () { S.durs[id] = Math.round(v.duration) || 0; i++; step(); };
      v.onerror = function () { S.durs[id] = 0; i++; save(); step(); };
      v.src = pathOf(LBY[id]);
    }
    step();
  }
  setTimeout(prefetchDurations, 800);
  console.log('[NukeLab] 课程', TOTAL, '节 / 项目', D.projects.length, '/ 节点', NODES.list.length);
})();
