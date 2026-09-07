window.NUKE_DATA = {
  "generatedAt": "2026-09-06",
  "tracks": {
    "foundation": {
      "name": "基础入门",
      "desc": "界面、工程设置与基础合成流程"
    },
    "color": {
      "name": "色彩与调色",
      "desc": "色彩空间、匹配与风格化"
    },
    "key": {
      "name": "键控抠像",
      "desc": "抠像器、边缘与溢色控制"
    },
    "roto": {
      "name": "Roto 与边缘",
      "desc": "遮罩绘制、边缘融合与噪点"
    },
    "cleanup": {
      "name": "擦除修复",
      "desc": "威亚、穿帮与逐帧修补"
    },
    "track": {
      "name": "跟踪与反求",
      "desc": "点跟踪、平面跟踪与摄像机反求"
    },
    "composite": {
      "name": "综合合成",
      "desc": "多元素镜头与完整交付"
    }
  },
  "projects": [
    {
      "id": 1,
      "count": 1,
      "totalEst": 76,
      "lessons": [
        "L001"
      ],
      "title": "初识 Nuke",
      "subtitle": "软件定位 · 界面 · 合成思维",
      "desc": "建立对节点式合成的整体认知：Nuke 在视效流程中的位置、界面布局与节点图的基本工作方式。",
      "level": "入门",
      "goals": [
        "理解节点式合成与图层式合成的差异",
        "熟悉 Nuke 界面与 Viewer / Node Graph / 属性面板",
        "建立\"从素材到交付\"的整体流程概念"
      ],
      "nodes": [
        "Read",
        "Viewer",
        "Write"
      ],
      "track": "foundation"
    },
    {
      "id": 2,
      "count": 7,
      "totalEst": 801,
      "lessons": [
        "L002",
        "L003",
        "L004",
        "L005",
        "L006",
        "L007",
        "L008"
      ],
      "title": "工程与工作流",
      "subtitle": "项目设置 · 素材 · 渲染输出",
      "desc": "完整跑通一枪镜头：项目设置、导入素材、Merge 合成、工程优化与渲染输出。",
      "level": "入门",
      "goals": [
        "正确设置项目分辨率、帧率与色彩空间",
        "掌握 Read / Merge / Write 的基础组合",
        "理解代理、缓存与工程优化的意义"
      ],
      "nodes": [
        "Read",
        "Merge",
        "Write",
        "Reformat",
        "Constant"
      ],
      "track": "foundation"
    },
    {
      "id": 3,
      "count": 25,
      "totalEst": 3205,
      "lessons": [
        "L009",
        "L010",
        "L011",
        "L012",
        "L013",
        "L014",
        "L015",
        "L016",
        "L017",
        "L018",
        "L019",
        "L020",
        "L021",
        "L022",
        "L023",
        "L024",
        "L025",
        "L026",
        "L027",
        "L028",
        "L029",
        "L030",
        "L031",
        "L032",
        "L033"
      ],
      "title": "图层合成实战",
      "subtitle": "多元素合成 · 通道 · 综合案例",
      "desc": "通过\"夏天转冬天\"\"小汽车合成\"\"飞行器合成\"三个完整案例，练习多元素叠加、氛围统一与通道运用。",
      "level": "进阶",
      "goals": [
        "用 Grade / ColorCorrect 统一不同素材的氛围",
        "理解并运用特殊层（深度、法线、运动向量）",
        "独立完成多元素镜头的分层合成"
      ],
      "nodes": [
        "Merge",
        "Transform",
        "Grade",
        "Shuffle",
        "Copy"
      ],
      "track": "composite"
    },
    {
      "id": 4,
      "count": 9,
      "totalEst": 791,
      "lessons": [
        "L034",
        "L035",
        "L036",
        "L037",
        "L038",
        "L039",
        "L040",
        "L041",
        "L042"
      ],
      "title": "调色与色彩匹配",
      "subtitle": "色彩空间 · 匹配 · 风格化",
      "desc": "把不同光照条件下拍摄的素材调到同一个时空里，是合成师最日常也最见功力的工作。",
      "level": "进阶",
      "goals": [
        "掌握 Grade / ColorCorrect / ColorLookup 的分工",
        "学会用黑场、白场与伽马匹配前景背景",
        "建立色彩空间（linear / sRGB）的正确观念"
      ],
      "nodes": [
        "Grade",
        "ColorCorrect",
        "ColorLookup",
        "Saturation"
      ],
      "track": "color"
    },
    {
      "id": 5,
      "count": 4,
      "totalEst": 1432,
      "lessons": [
        "L043",
        "L044",
        "L045",
        "L046"
      ],
      "title": "运动模糊与抠像基础",
      "subtitle": "VectorBlur · 边缘质量",
      "desc": "运动模糊决定元素是否\"长在\"画面里；抠像的边缘质量决定合成是否可信。",
      "level": "进阶",
      "goals": [
        "用 VectorBlur 为 CG 元素添加真实运动模糊",
        "理解边缘宽度、收缩与溢色控制",
        "处理毛发、半透明等难抠素材"
      ],
      "nodes": [
        "VectorBlur",
        "Keylight",
        "EdgeBlur",
        "Erode"
      ],
      "track": "key"
    },
    {
      "id": 6,
      "count": 3,
      "totalEst": 698,
      "lessons": [
        "L047",
        "L048",
        "L049"
      ],
      "title": "变形与镜头校正",
      "subtitle": "LensDistortion · 创意变形",
      "desc": "镜头畸变校正让 CG 与实拍严丝合缝，创意变形则能做出\"狮吼功\"这类戏剧效果。",
      "level": "进阶",
      "goals": [
        "用 LensDistortion 去除/添加镜头畸变",
        "掌握 Grid Warp / SplineWarp 的变形逻辑",
        "把变形用于叙事性视觉效果"
      ],
      "nodes": [
        "LensDistortion",
        "SplineWarp",
        "GridWarp",
        "Transform"
      ],
      "track": "composite"
    },
    {
      "id": 7,
      "count": 5,
      "totalEst": 1373,
      "lessons": [
        "L050",
        "L051",
        "L052",
        "L053",
        "L054"
      ],
      "title": "跟踪与摄像机反求",
      "subtitle": "点跟踪 · 平面跟踪 · 3D 反求",
      "desc": "跟踪是合成的地基：反求出的摄像机决定了 CG 元素的透视与运动是否准确。",
      "level": "高阶",
      "goals": [
        "用 Tracker 做点跟踪与稳定",
        "用 PlanarTracker 处理平面替换与擦除",
        "用 CameraTracker 反求三维摄像机并解算场景"
      ],
      "nodes": [
        "Tracker",
        "PlanarTracker",
        "CameraTracker",
        "CornerPin"
      ],
      "track": "track"
    },
    {
      "id": 8,
      "count": 5,
      "totalEst": 1067,
      "lessons": [
        "L055",
        "L056",
        "L057",
        "L058",
        "L059"
      ],
      "title": "Roto 与边缘处理",
      "subtitle": "RotoPaint · 边缘融合 · 噪点",
      "desc": "手工绘制遮罩与边缘融合技巧，让前景与背景之间看不出接缝。",
      "level": "高阶",
      "goals": [
        "用 RotoPaint 绘制动态遮罩与逐帧修复",
        "用 LightWrap 让前景吸收背景光",
        "匹配噪点与颗粒，避免\"贴纸感\""
      ],
      "nodes": [
        "RotoPaint",
        "LightWrap",
        "Noise",
        "AddMix"
      ],
      "track": "roto"
    },
    {
      "id": 9,
      "count": 10,
      "totalEst": 4224,
      "lessons": [
        "L060",
        "L061",
        "L062",
        "L063",
        "L064",
        "L065",
        "L066",
        "L067",
        "L068",
        "L069"
      ],
      "title": "擦除与穿帮修复",
      "subtitle": "威亚 · 标记点 · 逐帧修补",
      "desc": "影视合成里最耗时的活：把穿帮的东西干净地抹掉，还不能看出修过的痕迹。",
      "level": "高阶",
      "goals": [
        "用逐帧 / 左右帧互补 / 静帧贴片三种思路擦除物体",
        "用 F_WireRemoval 处理威亚与细线",
        "修复运动镜头中的大面积穿帮"
      ],
      "nodes": [
        "RotoPaint",
        "F_WireRemoval",
        "FrameHold",
        "Tracker"
      ],
      "track": "cleanup"
    },
    {
      "id": 10,
      "count": 6,
      "totalEst": 1170,
      "lessons": [
        "L070",
        "L071",
        "L072",
        "L073",
        "L074",
        "L075"
      ],
      "title": "键控抠像专题",
      "subtitle": "Keylight · Primatte · IBK · Keyer",
      "desc": "四大抠像器逐个拆解：什么时候用谁，遇到问题该调哪个参数。",
      "level": "高阶",
      "goals": [
        "掌握 Keylight 的 Screen Colour / Gain 与边缘处理",
        "用 Primatte 处理复杂蓝绿幕",
        "用 IBK 处理溢色严重的素材",
        "用 Keyer 做快速差值抠像",
        "组合多种抠像器完成综合练习"
      ],
      "nodes": [
        "Keylight",
        "Primatte",
        "IBKColour",
        "IBKGizmo",
        "Keyer",
        "Despill"
      ],
      "track": "key"
    },
    {
      "id": 11,
      "count": 3,
      "totalEst": 1096,
      "lessons": [
        "L076",
        "L077",
        "L078"
      ],
      "title": "综合实训",
      "subtitle": "花瓣 · 房屋与烟雾",
      "desc": "两个完整实训镜头，把抠像、调色、跟踪、边缘处理串成一条完整生产线。",
      "level": "实战",
      "goals": [
        "独立完成一个含多层元素的完整镜头",
        "合理组织节点图，保证可读性与可维护性",
        "按交付标准输出最终画面"
      ],
      "nodes": [
        "Keylight",
        "Merge",
        "Grade",
        "Transform",
        "Noise"
      ],
      "track": "composite"
    }
  ],
  "lessons": [
    {
      "file": "项目1简介.mp4",
      "title": "初识 Nuke",
      "raw": "项目1简介",
      "project": 1,
      "kind": "intro",
      "taskNo": null,
      "taskLabel": "项目简介",
      "part": null,
      "sizeMB": 8.4,
      "est": 76,
      "estText": "1:16",
      "nodes": [
        "Read",
        "Viewer",
        "Write"
      ],
      "id": "L001"
    },
    {
      "file": "项目2简介.mp4",
      "title": "工程与工作流",
      "raw": "项目2简介",
      "project": 2,
      "kind": "intro",
      "taskNo": null,
      "taskLabel": "项目简介",
      "part": null,
      "sizeMB": 19.1,
      "est": 172,
      "estText": "2:52",
      "nodes": [
        "Read",
        "Merge",
        "Write"
      ],
      "id": "L002"
    },
    {
      "file": "项目2 任务四 导入素材.mp4",
      "title": "导入素材",
      "raw": "项目2 任务四 导入素材",
      "project": 2,
      "kind": "task",
      "taskNo": 4,
      "taskLabel": "任务四",
      "part": null,
      "sizeMB": 8.9,
      "est": 80,
      "estText": "1:20",
      "nodes": [
        "Read",
        "Merge",
        "Write"
      ],
      "id": "L003"
    },
    {
      "file": "项目2 任务四 工程优化.mp4",
      "title": "工程优化",
      "raw": "项目2 任务四 工程优化",
      "project": 2,
      "kind": "task",
      "taskNo": 4,
      "taskLabel": "任务四",
      "part": null,
      "sizeMB": 8.9,
      "est": 81,
      "estText": "1:21",
      "nodes": [
        "Read",
        "Merge",
        "Write"
      ],
      "id": "L004"
    },
    {
      "file": "项目2 任务四 项目设置.mp4",
      "title": "项目设置",
      "raw": "项目2 任务四 项目设置",
      "project": 2,
      "kind": "task",
      "taskNo": 4,
      "taskLabel": "任务四",
      "part": null,
      "sizeMB": 5.7,
      "est": 51,
      "estText": "0:51",
      "nodes": [
        "Read",
        "Merge",
        "Write"
      ],
      "id": "L005"
    },
    {
      "file": "项目2 任务四 渲染输出.mp4",
      "title": "渲染输出",
      "raw": "项目2 任务四 渲染输出",
      "project": 2,
      "kind": "task",
      "taskNo": 4,
      "taskLabel": "任务四",
      "part": null,
      "sizeMB": 6.3,
      "est": 57,
      "estText": "0:57",
      "nodes": [
        "Write"
      ],
      "id": "L006"
    },
    {
      "file": "项目2 任务四 Merge节点的使用方法.mp4",
      "title": "Merge节点的使用方法",
      "raw": "项目2 任务四 Merge节点的使用方法",
      "project": 2,
      "kind": "task",
      "taskNo": 4,
      "taskLabel": "任务四",
      "part": null,
      "sizeMB": 11,
      "est": 99,
      "estText": "1:39",
      "nodes": [
        "Merge"
      ],
      "id": "L007"
    },
    {
      "file": "项目2 项目扩展 合成汽车广告.mp4",
      "title": "合成汽车广告",
      "raw": "项目2 项目扩展 合成汽车广告",
      "project": 2,
      "kind": "ext",
      "taskNo": null,
      "taskLabel": "项目扩展",
      "part": null,
      "sizeMB": 29,
      "est": 261,
      "estText": "4:21",
      "nodes": [
        "Merge"
      ],
      "id": "L008"
    },
    {
      "file": "项目3简介.mp4",
      "title": "图层合成实战",
      "raw": "项目3简介",
      "project": 3,
      "kind": "intro",
      "taskNo": null,
      "taskLabel": "项目简介",
      "part": null,
      "sizeMB": 7.5,
      "est": 67,
      "estText": "1:07",
      "nodes": [
        "Merge",
        "Transform",
        "Grade"
      ],
      "id": "L009"
    },
    {
      "file": "项目3 任务一 夏天转冬天.mp4",
      "title": "夏天转冬天",
      "raw": "项目3 任务一 夏天转冬天",
      "project": 3,
      "kind": "task",
      "taskNo": 1,
      "taskLabel": "任务一",
      "part": null,
      "sizeMB": 5.4,
      "est": 48,
      "estText": "0:48",
      "nodes": [
        "Grade"
      ],
      "id": "L010"
    },
    {
      "file": "项目3 任务一 夏天转秋天.mp4",
      "title": "夏天转秋天",
      "raw": "项目3 任务一 夏天转秋天",
      "project": 3,
      "kind": "task",
      "taskNo": 1,
      "taskLabel": "任务一",
      "part": null,
      "sizeMB": 8.4,
      "est": 76,
      "estText": "1:16",
      "nodes": [
        "Grade"
      ],
      "id": "L011"
    },
    {
      "file": "项目3 任务三 小汽车的合成1.mp4",
      "title": "小汽车的合成1",
      "raw": "项目3 任务三 小汽车的合成1",
      "project": 3,
      "kind": "task",
      "taskNo": 3,
      "taskLabel": "任务三",
      "part": 1,
      "sizeMB": 10.6,
      "est": 96,
      "estText": "1:36",
      "nodes": [
        "Merge"
      ],
      "id": "L012"
    },
    {
      "file": "项目3 任务三 小汽车的合成2.mp4",
      "title": "小汽车的合成2",
      "raw": "项目3 任务三 小汽车的合成2",
      "project": 3,
      "kind": "task",
      "taskNo": 3,
      "taskLabel": "任务三",
      "part": 2,
      "sizeMB": 5.3,
      "est": 47,
      "estText": "0:47",
      "nodes": [
        "Merge"
      ],
      "id": "L013"
    },
    {
      "file": "项目3 任务三 小汽车的合成3.mp4",
      "title": "小汽车的合成3",
      "raw": "项目3 任务三 小汽车的合成3",
      "project": 3,
      "kind": "task",
      "taskNo": 3,
      "taskLabel": "任务三",
      "part": 3,
      "sizeMB": 13.9,
      "est": 125,
      "estText": "2:05",
      "nodes": [
        "Merge"
      ],
      "id": "L014"
    },
    {
      "file": "项目3 任务三 小汽车的合成4.mp4",
      "title": "小汽车的合成4",
      "raw": "项目3 任务三 小汽车的合成4",
      "project": 3,
      "kind": "task",
      "taskNo": 3,
      "taskLabel": "任务三",
      "part": 4,
      "sizeMB": 13.5,
      "est": 121,
      "estText": "2:01",
      "nodes": [
        "Merge"
      ],
      "id": "L015"
    },
    {
      "file": "项目3 任务三 小汽车的合成5.mp4",
      "title": "小汽车的合成5",
      "raw": "项目3 任务三 小汽车的合成5",
      "project": 3,
      "kind": "task",
      "taskNo": 3,
      "taskLabel": "任务三",
      "part": 5,
      "sizeMB": 16.1,
      "est": 145,
      "estText": "2:25",
      "nodes": [
        "Merge"
      ],
      "id": "L016"
    },
    {
      "file": "项目3 任务三 小汽车的合成6.mp4",
      "title": "小汽车的合成6",
      "raw": "项目3 任务三 小汽车的合成6",
      "project": 3,
      "kind": "task",
      "taskNo": 3,
      "taskLabel": "任务三",
      "part": 6,
      "sizeMB": 25.6,
      "est": 230,
      "estText": "3:50",
      "nodes": [
        "Merge"
      ],
      "id": "L017"
    },
    {
      "file": "项目3 任务三 小汽车的合成7.mp4",
      "title": "小汽车的合成7",
      "raw": "项目3 任务三 小汽车的合成7",
      "project": 3,
      "kind": "task",
      "taskNo": 3,
      "taskLabel": "任务三",
      "part": 7,
      "sizeMB": 17,
      "est": 153,
      "estText": "2:33",
      "nodes": [
        "Merge"
      ],
      "id": "L018"
    },
    {
      "file": "项目3 任务四 特殊层的使用方法1.mp4",
      "title": "特殊层的使用方法1",
      "raw": "项目3 任务四 特殊层的使用方法1",
      "project": 3,
      "kind": "task",
      "taskNo": 4,
      "taskLabel": "任务四",
      "part": 1,
      "sizeMB": 8,
      "est": 72,
      "estText": "1:12",
      "nodes": [
        "Shuffle"
      ],
      "id": "L019"
    },
    {
      "file": "项目3 任务四 特殊层的使用方法2.mp4",
      "title": "特殊层的使用方法2",
      "raw": "项目3 任务四 特殊层的使用方法2",
      "project": 3,
      "kind": "task",
      "taskNo": 4,
      "taskLabel": "任务四",
      "part": 2,
      "sizeMB": 10.8,
      "est": 97,
      "estText": "1:37",
      "nodes": [
        "Shuffle"
      ],
      "id": "L020"
    },
    {
      "file": "项目3 任务五 合成飞行器1.mp4",
      "title": "合成飞行器1",
      "raw": "项目3 任务五 合成飞行器1",
      "project": 3,
      "kind": "task",
      "taskNo": 5,
      "taskLabel": "任务五",
      "part": 1,
      "sizeMB": 25.3,
      "est": 228,
      "estText": "3:48",
      "nodes": [
        "Merge"
      ],
      "id": "L021"
    },
    {
      "file": "项目3 任务五 合成飞行器2.mp4",
      "title": "合成飞行器2",
      "raw": "项目3 任务五 合成飞行器2",
      "project": 3,
      "kind": "task",
      "taskNo": 5,
      "taskLabel": "任务五",
      "part": 2,
      "sizeMB": 7.9,
      "est": 71,
      "estText": "1:11",
      "nodes": [
        "Merge"
      ],
      "id": "L022"
    },
    {
      "file": "项目3 任务五 合成飞行器3.mp4",
      "title": "合成飞行器3",
      "raw": "项目3 任务五 合成飞行器3",
      "project": 3,
      "kind": "task",
      "taskNo": 5,
      "taskLabel": "任务五",
      "part": 3,
      "sizeMB": 13,
      "est": 117,
      "estText": "1:57",
      "nodes": [
        "Merge"
      ],
      "id": "L023"
    },
    {
      "file": "项目3 任务五 合成飞行器4.mp4",
      "title": "合成飞行器4",
      "raw": "项目3 任务五 合成飞行器4",
      "project": 3,
      "kind": "task",
      "taskNo": 5,
      "taskLabel": "任务五",
      "part": 4,
      "sizeMB": 14.6,
      "est": 132,
      "estText": "2:12",
      "nodes": [
        "Merge"
      ],
      "id": "L024"
    },
    {
      "file": "项目3 任务五 合成飞行器5.mp4",
      "title": "合成飞行器5",
      "raw": "项目3 任务五 合成飞行器5",
      "project": 3,
      "kind": "task",
      "taskNo": 5,
      "taskLabel": "任务五",
      "part": 5,
      "sizeMB": 20.9,
      "est": 188,
      "estText": "3:08",
      "nodes": [
        "Merge"
      ],
      "id": "L025"
    },
    {
      "file": "项目3 任务五 合成飞行器6.mp4",
      "title": "合成飞行器6",
      "raw": "项目3 任务五 合成飞行器6",
      "project": 3,
      "kind": "task",
      "taskNo": 5,
      "taskLabel": "任务五",
      "part": 6,
      "sizeMB": 16.5,
      "est": 149,
      "estText": "2:29",
      "nodes": [
        "Merge"
      ],
      "id": "L026"
    },
    {
      "file": "项目3 任务五 合成飞行器7.mp4",
      "title": "合成飞行器7",
      "raw": "项目3 任务五 合成飞行器7",
      "project": 3,
      "kind": "task",
      "taskNo": 5,
      "taskLabel": "任务五",
      "part": 7,
      "sizeMB": 10.2,
      "est": 91,
      "estText": "1:31",
      "nodes": [
        "Merge"
      ],
      "id": "L027"
    },
    {
      "file": "项目3 任务五 合成飞行器8.mp4",
      "title": "合成飞行器8",
      "raw": "项目3 任务五 合成飞行器8",
      "project": 3,
      "kind": "task",
      "taskNo": 5,
      "taskLabel": "任务五",
      "part": 8,
      "sizeMB": 35,
      "est": 315,
      "estText": "5:15",
      "nodes": [
        "Merge"
      ],
      "id": "L028"
    },
    {
      "file": "项目3 任务五 合成飞行器9.mp4",
      "title": "合成飞行器9",
      "raw": "项目3 任务五 合成飞行器9",
      "project": 3,
      "kind": "task",
      "taskNo": 5,
      "taskLabel": "任务五",
      "part": 9,
      "sizeMB": 19.4,
      "est": 175,
      "estText": "2:55",
      "nodes": [
        "Merge"
      ],
      "id": "L029"
    },
    {
      "file": "项目3 项目扩展 合成小飞行器1.mp4",
      "title": "合成小飞行器1",
      "raw": "项目3 项目扩展 合成小飞行器1",
      "project": 3,
      "kind": "ext",
      "taskNo": null,
      "taskLabel": "项目扩展",
      "part": 1,
      "sizeMB": 9.1,
      "est": 82,
      "estText": "1:22",
      "nodes": [
        "Merge"
      ],
      "id": "L030"
    },
    {
      "file": "项目3 项目扩展 合成小飞行器2.mp4",
      "title": "合成小飞行器2",
      "raw": "项目3 项目扩展 合成小飞行器2",
      "project": 3,
      "kind": "ext",
      "taskNo": null,
      "taskLabel": "项目扩展",
      "part": 2,
      "sizeMB": 6.7,
      "est": 60,
      "estText": "1:00",
      "nodes": [
        "Merge"
      ],
      "id": "L031"
    },
    {
      "file": "项目3 项目扩展 合成小飞行器3.mp4",
      "title": "合成小飞行器3",
      "raw": "项目3 项目扩展 合成小飞行器3",
      "project": 3,
      "kind": "ext",
      "taskNo": null,
      "taskLabel": "项目扩展",
      "part": 3,
      "sizeMB": 19.4,
      "est": 175,
      "estText": "2:55",
      "nodes": [
        "Merge"
      ],
      "id": "L032"
    },
    {
      "file": "项目3 项目扩展 合成小飞行器4.mp4",
      "title": "合成小飞行器4",
      "raw": "项目3 项目扩展 合成小飞行器4",
      "project": 3,
      "kind": "ext",
      "taskNo": null,
      "taskLabel": "项目扩展",
      "part": 4,
      "sizeMB": 16.1,
      "est": 145,
      "estText": "2:25",
      "nodes": [
        "Merge"
      ],
      "id": "L033"
    },
    {
      "file": "项目4简介.mp4",
      "title": "调色与色彩匹配",
      "raw": "项目4简介",
      "project": 4,
      "kind": "intro",
      "taskNo": null,
      "taskLabel": "项目简介",
      "part": null,
      "sizeMB": 8.6,
      "est": 77,
      "estText": "1:17",
      "nodes": [
        "Grade",
        "ColorCorrect",
        "ColorLookup"
      ],
      "id": "L034"
    },
    {
      "file": "项目4 任务二 为雪地汽车调色1.mp4",
      "title": "为雪地汽车调色1",
      "raw": "项目4 任务二 为雪地汽车调色1",
      "project": 4,
      "kind": "task",
      "taskNo": 2,
      "taskLabel": "任务二",
      "part": 1,
      "sizeMB": 5.6,
      "est": 50,
      "estText": "0:50",
      "nodes": [
        "Grade"
      ],
      "id": "L035"
    },
    {
      "file": "项目4 任务二 为雪地汽车调色2.mp4",
      "title": "为雪地汽车调色2",
      "raw": "项目4 任务二 为雪地汽车调色2",
      "project": 4,
      "kind": "task",
      "taskNo": 2,
      "taskLabel": "任务二",
      "part": 2,
      "sizeMB": 4.7,
      "est": 45,
      "estText": "0:45",
      "nodes": [
        "Grade"
      ],
      "id": "L036"
    },
    {
      "file": "项目4 任务二 为雪地汽车调色3.mp4",
      "title": "为雪地汽车调色3",
      "raw": "项目4 任务二 为雪地汽车调色3",
      "project": 4,
      "kind": "task",
      "taskNo": 2,
      "taskLabel": "任务二",
      "part": 3,
      "sizeMB": 11.1,
      "est": 100,
      "estText": "1:40",
      "nodes": [
        "Grade"
      ],
      "id": "L037"
    },
    {
      "file": "项目4 任务二 为雪地汽车调色4.mp4",
      "title": "为雪地汽车调色4",
      "raw": "项目4 任务二 为雪地汽车调色4",
      "project": 4,
      "kind": "task",
      "taskNo": 2,
      "taskLabel": "任务二",
      "part": 4,
      "sizeMB": 7.2,
      "est": 65,
      "estText": "1:05",
      "nodes": [
        "Grade"
      ],
      "id": "L038"
    },
    {
      "file": "项目4 任务二 为雪地汽车调色5.mp4",
      "title": "为雪地汽车调色5",
      "raw": "项目4 任务二 为雪地汽车调色5",
      "project": 4,
      "kind": "task",
      "taskNo": 2,
      "taskLabel": "任务二",
      "part": 5,
      "sizeMB": 12.7,
      "est": 114,
      "estText": "1:54",
      "nodes": [
        "Grade"
      ],
      "id": "L039"
    },
    {
      "file": "项目4 任务二 为雪地汽车调色6.mp4",
      "title": "为雪地汽车调色6",
      "raw": "项目4 任务二 为雪地汽车调色6",
      "project": 4,
      "kind": "task",
      "taskNo": 2,
      "taskLabel": "任务二",
      "part": 6,
      "sizeMB": 10.1,
      "est": 91,
      "estText": "1:31",
      "nodes": [
        "Grade"
      ],
      "id": "L040"
    },
    {
      "file": "项目4 项目扩展 为飞行器调色1.mp4",
      "title": "为飞行器调色1",
      "raw": "项目4 项目扩展 为飞行器调色1",
      "project": 4,
      "kind": "ext",
      "taskNo": null,
      "taskLabel": "项目扩展",
      "part": 1,
      "sizeMB": 13,
      "est": 117,
      "estText": "1:57",
      "nodes": [
        "Grade"
      ],
      "id": "L041"
    },
    {
      "file": "项目4 项目扩展 为飞行器调色2.mp4",
      "title": "为飞行器调色2",
      "raw": "项目4 项目扩展 为飞行器调色2",
      "project": 4,
      "kind": "ext",
      "taskNo": null,
      "taskLabel": "项目扩展",
      "part": 2,
      "sizeMB": 14.6,
      "est": 132,
      "estText": "2:12",
      "nodes": [
        "Grade"
      ],
      "id": "L042"
    },
    {
      "file": "项目5简介.mp4",
      "title": "运动模糊与抠像基础",
      "raw": "项目5简介",
      "project": 5,
      "kind": "intro",
      "taskNo": null,
      "taskLabel": "项目简介",
      "part": null,
      "sizeMB": 9.5,
      "est": 85,
      "estText": "1:25",
      "nodes": [
        "VectorBlur",
        "Keylight",
        "EdgeBlur"
      ],
      "id": "L043"
    },
    {
      "file": "项目5 任务二 运动模糊的添加方法1.mp4",
      "title": "运动模糊的添加方法1",
      "raw": "项目5 任务二 运动模糊的添加方法1",
      "project": 5,
      "kind": "task",
      "taskNo": 2,
      "taskLabel": "任务二",
      "part": 1,
      "sizeMB": 22.4,
      "est": 201,
      "estText": "3:21",
      "nodes": [
        "VectorBlur"
      ],
      "id": "L044"
    },
    {
      "file": "项目5 任务二 运动模糊的添加方法2.mp4",
      "title": "运动模糊的添加方法2",
      "raw": "项目5 任务二 运动模糊的添加方法2",
      "project": 5,
      "kind": "task",
      "taskNo": 2,
      "taskLabel": "任务二",
      "part": 2,
      "sizeMB": 9.2,
      "est": 83,
      "estText": "1:23",
      "nodes": [
        "VectorBlur"
      ],
      "id": "L045"
    },
    {
      "file": "项目5 项目扩展 石头抠像.mp4",
      "title": "石头抠像",
      "raw": "项目5 项目扩展 石头抠像",
      "project": 5,
      "kind": "ext",
      "taskNo": null,
      "taskLabel": "项目扩展",
      "part": null,
      "sizeMB": 118.1,
      "est": 1063,
      "estText": "17:43",
      "nodes": [
        "Despill"
      ],
      "id": "L046"
    },
    {
      "file": "项目6简介.mp4",
      "title": "变形与镜头校正",
      "raw": "项目6简介",
      "project": 6,
      "kind": "intro",
      "taskNo": null,
      "taskLabel": "项目简介",
      "part": null,
      "sizeMB": 9.8,
      "est": 88,
      "estText": "1:28",
      "nodes": [
        "LensDistortion",
        "SplineWarp",
        "GridWarp"
      ],
      "id": "L047"
    },
    {
      "file": "项目6 任务 制作“狮吼功”效果.mp4",
      "title": "制作“狮吼功”效果",
      "raw": "项目6 任务 制作“狮吼功”效果",
      "project": 6,
      "kind": "task",
      "taskNo": null,
      "taskLabel": "实操",
      "part": null,
      "sizeMB": 40.4,
      "est": 363,
      "estText": "6:03",
      "nodes": [
        "SplineWarp"
      ],
      "id": "L048"
    },
    {
      "file": "项目6 项目扩展 去除镜头畸变.mp4",
      "title": "去除镜头畸变",
      "raw": "项目6 项目扩展 去除镜头畸变",
      "project": 6,
      "kind": "ext",
      "taskNo": null,
      "taskLabel": "项目扩展",
      "part": null,
      "sizeMB": 27.4,
      "est": 247,
      "estText": "4:07",
      "nodes": [
        "LensDistortion"
      ],
      "id": "L049"
    },
    {
      "file": "项目7简介.mp4",
      "title": "跟踪与摄像机反求",
      "raw": "项目7简介",
      "project": 7,
      "kind": "intro",
      "taskNo": null,
      "taskLabel": "项目简介",
      "part": null,
      "sizeMB": 9.3,
      "est": 84,
      "estText": "1:24",
      "nodes": [
        "Tracker",
        "PlanarTracker",
        "CameraTracker"
      ],
      "id": "L050"
    },
    {
      "file": "项目7 任务一 点跟踪.mp4",
      "title": "点跟踪",
      "raw": "项目7 任务一 点跟踪",
      "project": 7,
      "kind": "task",
      "taskNo": 1,
      "taskLabel": "任务一",
      "part": null,
      "sizeMB": 32.4,
      "est": 291,
      "estText": "4:51",
      "nodes": [
        "Tracker"
      ],
      "id": "L051"
    },
    {
      "file": "项目7 任务二 平面跟踪.mp4",
      "title": "平面跟踪",
      "raw": "项目7 任务二 平面跟踪",
      "project": 7,
      "kind": "task",
      "taskNo": 2,
      "taskLabel": "任务二",
      "part": null,
      "sizeMB": 26.4,
      "est": 238,
      "estText": "3:58",
      "nodes": [
        "Tracker",
        "PlanarTracker"
      ],
      "id": "L052"
    },
    {
      "file": "项目7 任务三 摄像机反求.mp4",
      "title": "摄像机反求",
      "raw": "项目7 任务三 摄像机反求",
      "project": 7,
      "kind": "task",
      "taskNo": 3,
      "taskLabel": "任务三",
      "part": null,
      "sizeMB": 44.2,
      "est": 398,
      "estText": "6:38",
      "nodes": [
        "CameraTracker"
      ],
      "id": "L053"
    },
    {
      "file": "项目7 项目扩展 跟踪及擦除.mp4",
      "title": "跟踪及擦除",
      "raw": "项目7 项目扩展 跟踪及擦除",
      "project": 7,
      "kind": "ext",
      "taskNo": null,
      "taskLabel": "项目扩展",
      "part": null,
      "sizeMB": 40.2,
      "est": 362,
      "estText": "6:02",
      "nodes": [
        "Tracker"
      ],
      "id": "L054"
    },
    {
      "file": "项目8简介.mp4",
      "title": "Roto 与边缘处理",
      "raw": "项目8简介",
      "project": 8,
      "kind": "intro",
      "taskNo": null,
      "taskLabel": "项目简介",
      "part": null,
      "sizeMB": 10.1,
      "est": 91,
      "estText": "1:31",
      "nodes": [
        "RotoPaint",
        "LightWrap",
        "Noise"
      ],
      "id": "L055"
    },
    {
      "file": "项目8 任务一 RotoPaint节点的应用.mp4",
      "title": "RotoPaint节点的应用",
      "raw": "项目8 任务一 RotoPaint节点的应用",
      "project": 8,
      "kind": "task",
      "taskNo": 1,
      "taskLabel": "任务一",
      "part": null,
      "sizeMB": 29.1,
      "est": 262,
      "estText": "4:22",
      "nodes": [
        "RotoPaint"
      ],
      "id": "L056"
    },
    {
      "file": "项目8 任务二 LightWrap节点的应用.mp4",
      "title": "LightWrap节点的应用",
      "raw": "项目8 任务二 LightWrap节点的应用",
      "project": 8,
      "kind": "task",
      "taskNo": 2,
      "taskLabel": "任务二",
      "part": null,
      "sizeMB": 21.6,
      "est": 194,
      "estText": "3:14",
      "nodes": [
        "LightWrap"
      ],
      "id": "L057"
    },
    {
      "file": "项目8 任务三 Noise节点的应用.mp4",
      "title": "Noise节点的应用",
      "raw": "项目8 任务三 Noise节点的应用",
      "project": 8,
      "kind": "task",
      "taskNo": 3,
      "taskLabel": "任务三",
      "part": null,
      "sizeMB": 18,
      "est": 162,
      "estText": "2:42",
      "nodes": [
        "Noise"
      ],
      "id": "L058"
    },
    {
      "file": "项目8 项目扩展 单帧擦除.mp4",
      "title": "单帧擦除",
      "raw": "项目8 项目扩展 单帧擦除",
      "project": 8,
      "kind": "ext",
      "taskNo": null,
      "taskLabel": "项目扩展",
      "part": null,
      "sizeMB": 39.8,
      "est": 358,
      "estText": "5:58",
      "nodes": [
        "RotoPaint",
        "LightWrap",
        "Noise"
      ],
      "id": "L059"
    },
    {
      "file": "项目9简介.mp4",
      "title": "擦除与穿帮修复",
      "raw": "项目9简介",
      "project": 9,
      "kind": "intro",
      "taskNo": null,
      "taskLabel": "项目简介",
      "part": null,
      "sizeMB": 11.5,
      "est": 104,
      "estText": "1:44",
      "nodes": [
        "RotoPaint",
        "F_WireRemoval",
        "FrameHold"
      ],
      "id": "L060"
    },
    {
      "file": "项目9 任务一 逐帧擦除.mp4",
      "title": "逐帧擦除",
      "raw": "项目9 任务一 逐帧擦除",
      "project": 9,
      "kind": "task",
      "taskNo": 1,
      "taskLabel": "任务一",
      "part": null,
      "sizeMB": 10.9,
      "est": 98,
      "estText": "1:38",
      "nodes": [
        "RotoPaint",
        "F_WireRemoval",
        "FrameHold"
      ],
      "id": "L061"
    },
    {
      "file": "项目9 任务二 左右帧互补擦除.mp4",
      "title": "左右帧互补擦除",
      "raw": "项目9 任务二 左右帧互补擦除",
      "project": 9,
      "kind": "task",
      "taskNo": 2,
      "taskLabel": "任务二",
      "part": null,
      "sizeMB": 22.8,
      "est": 205,
      "estText": "3:25",
      "nodes": [
        "RotoPaint",
        "F_WireRemoval",
        "FrameHold"
      ],
      "id": "L062"
    },
    {
      "file": "项目9 任务三 静帧贴片擦除.mp4",
      "title": "静帧贴片擦除",
      "raw": "项目9 任务三 静帧贴片擦除",
      "project": 9,
      "kind": "task",
      "taskNo": 3,
      "taskLabel": "任务三",
      "part": null,
      "sizeMB": 32.3,
      "est": 290,
      "estText": "4:50",
      "nodes": [
        "RotoPaint",
        "F_WireRemoval",
        "FrameHold"
      ],
      "id": "L063"
    },
    {
      "file": "项目9 任务四 F_WireRemoval节点擦除.mp4",
      "title": "F_WireRemoval节点擦除",
      "raw": "项目9 任务四 F_WireRemoval节点擦除",
      "project": 9,
      "kind": "task",
      "taskNo": 4,
      "taskLabel": "任务四",
      "part": null,
      "sizeMB": 16.6,
      "est": 149,
      "estText": "2:29",
      "nodes": [
        "F_WireRemoval"
      ],
      "id": "L064"
    },
    {
      "file": "项目9 任务五 擦除1-1.mp4",
      "title": "擦除1-1",
      "raw": "项目9 任务五 擦除1-1",
      "project": 9,
      "kind": "task",
      "taskNo": 5,
      "taskLabel": "任务五",
      "part": 1,
      "sizeMB": 91.8,
      "est": 826,
      "estText": "13:46",
      "nodes": [
        "RotoPaint",
        "F_WireRemoval",
        "FrameHold"
      ],
      "id": "L065"
    },
    {
      "file": "项目9 任务五 擦除1-2.mp4",
      "title": "擦除1-2",
      "raw": "项目9 任务五 擦除1-2",
      "project": 9,
      "kind": "task",
      "taskNo": 5,
      "taskLabel": "任务五",
      "part": 2,
      "sizeMB": 84.2,
      "est": 758,
      "estText": "12:38",
      "nodes": [
        "RotoPaint",
        "F_WireRemoval",
        "FrameHold"
      ],
      "id": "L066"
    },
    {
      "file": "项目9 任务五 擦除1-3.mp4",
      "title": "擦除1-3",
      "raw": "项目9 任务五 擦除1-3",
      "project": 9,
      "kind": "task",
      "taskNo": 5,
      "taskLabel": "任务五",
      "part": 3,
      "sizeMB": 50.5,
      "est": 455,
      "estText": "7:35",
      "nodes": [
        "RotoPaint",
        "F_WireRemoval",
        "FrameHold"
      ],
      "id": "L067"
    },
    {
      "file": "项目9 项目扩展 擦除2-1.mp4",
      "title": "擦除2-1",
      "raw": "项目9 项目扩展 擦除2-1",
      "project": 9,
      "kind": "ext",
      "taskNo": null,
      "taskLabel": "项目扩展",
      "part": 1,
      "sizeMB": 81.3,
      "est": 732,
      "estText": "12:12",
      "nodes": [
        "RotoPaint",
        "F_WireRemoval",
        "FrameHold"
      ],
      "id": "L068"
    },
    {
      "file": "项目9 项目扩展 擦除2-2.mp4",
      "title": "擦除2-2",
      "raw": "项目9 项目扩展 擦除2-2",
      "project": 9,
      "kind": "ext",
      "taskNo": null,
      "taskLabel": "项目扩展",
      "part": 2,
      "sizeMB": 67.4,
      "est": 607,
      "estText": "10:07",
      "nodes": [
        "RotoPaint",
        "F_WireRemoval",
        "FrameHold"
      ],
      "id": "L069"
    },
    {
      "file": "项目10简介.mp4",
      "title": "键控抠像专题",
      "raw": "项目10简介",
      "project": 10,
      "kind": "intro",
      "taskNo": null,
      "taskLabel": "项目简介",
      "part": null,
      "sizeMB": 11.1,
      "est": 100,
      "estText": "1:40",
      "nodes": [
        "Keylight",
        "Primatte",
        "IBKColour"
      ],
      "id": "L070"
    },
    {
      "file": "项目10 任务一 使用Primatte节点抠像.mp4",
      "title": "使用Primatte节点抠像",
      "raw": "项目10 任务一 使用Primatte节点抠像",
      "project": 10,
      "kind": "task",
      "taskNo": 1,
      "taskLabel": "任务一",
      "part": null,
      "sizeMB": 29,
      "est": 261,
      "estText": "4:21",
      "nodes": [
        "Primatte",
        "Despill"
      ],
      "id": "L071"
    },
    {
      "file": "项目10 任务二 使用Keylight节点抠像.mp4",
      "title": "使用Keylight节点抠像",
      "raw": "项目10 任务二 使用Keylight节点抠像",
      "project": 10,
      "kind": "task",
      "taskNo": 2,
      "taskLabel": "任务二",
      "part": null,
      "sizeMB": 4.4,
      "est": 45,
      "estText": "0:45",
      "nodes": [
        "Keylight",
        "Despill"
      ],
      "id": "L072"
    },
    {
      "file": "项目10 任务三 使用IBK节点抠像.mp4",
      "title": "使用IBK节点抠像",
      "raw": "项目10 任务三 使用IBK节点抠像",
      "project": 10,
      "kind": "task",
      "taskNo": 3,
      "taskLabel": "任务三",
      "part": null,
      "sizeMB": 23.6,
      "est": 212,
      "estText": "3:32",
      "nodes": [
        "IBKColour",
        "Despill"
      ],
      "id": "L073"
    },
    {
      "file": "项目10 任务四 使用Keyer节点抠像.mp4",
      "title": "使用Keyer节点抠像",
      "raw": "项目10 任务四 使用Keyer节点抠像",
      "project": 10,
      "kind": "task",
      "taskNo": 4,
      "taskLabel": "任务四",
      "part": null,
      "sizeMB": 12.2,
      "est": 110,
      "estText": "1:50",
      "nodes": [
        "Keyer",
        "Despill"
      ],
      "id": "L074"
    },
    {
      "file": "项目10 项目扩展 抠像综合练习.mp4",
      "title": "抠像综合练习",
      "raw": "项目10 项目扩展 抠像综合练习",
      "project": 10,
      "kind": "ext",
      "taskNo": null,
      "taskLabel": "项目扩展",
      "part": null,
      "sizeMB": 49.1,
      "est": 442,
      "estText": "7:22",
      "nodes": [
        "Despill"
      ],
      "id": "L075"
    },
    {
      "file": "项目11简介.mp4",
      "title": "综合实训",
      "raw": "项目11简介",
      "project": 11,
      "kind": "intro",
      "taskNo": null,
      "taskLabel": "项目简介",
      "part": null,
      "sizeMB": 10.7,
      "est": 96,
      "estText": "1:36",
      "nodes": [
        "Keylight",
        "Merge",
        "Grade"
      ],
      "id": "L076"
    },
    {
      "file": "项目11 实训一 花瓣合成.mp4",
      "title": "花瓣合成",
      "raw": "项目11 实训一 花瓣合成",
      "project": 11,
      "kind": "lab",
      "taskNo": 1,
      "taskLabel": "实训一",
      "part": null,
      "sizeMB": 70,
      "est": 630,
      "estText": "10:30",
      "nodes": [
        "Merge"
      ],
      "id": "L077"
    },
    {
      "file": "项目11 实训二 房屋与烟雾的合成.mp4",
      "title": "房屋与烟雾的合成",
      "raw": "项目11 实训二 房屋与烟雾的合成",
      "project": 11,
      "kind": "lab",
      "taskNo": 2,
      "taskLabel": "实训二",
      "part": null,
      "sizeMB": 41.1,
      "est": 370,
      "estText": "6:10",
      "nodes": [
        "Merge"
      ],
      "id": "L078"
    }
  ]
};
