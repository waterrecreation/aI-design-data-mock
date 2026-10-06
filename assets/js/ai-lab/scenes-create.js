/* AI 辅助原型 · 01 创建前（A01–A10）· 全部网页端 · 第三轮按反馈调整 */
(function () {
  'use strict';
  var R = window.AILab.register;

  // ---------- P00 优先级总览：先打通 AI 对话与创建前 ----------
  var PRIO = [
  [
    "P0",
    "先打通 AI 对话与创建前",
    [
      [
        "X00",
        "够不够判定",
        "共用生成与追问分流"
      ],
      [
        "X01",
        "AI 对话页",
        "保留来源、上下文和返回位置"
      ],
      [
        "A00",
        "主办方介绍",
        "创建前完善主办方，首次办活动也能写"
      ],
      [
        "A01",
        "快速创建",
        "创建页进入统一活动 AI，确认后继续编辑"
      ],
      [
        "A02",
        "介绍 / 详情起草润色",
        "接住草稿，确认后补全内容"
      ],
      [
        "A07",
        "发布前冲突检查",
        "创建主线最后一步，人工确认发布"
      ],
      [
        "A08",
        "帮我起名",
        "接住对话确定的主题"
      ],
      [
        "A03",
        "标签建议",
        "创建表单补充"
      ]
    ]
  ],
  [
    "P1",
    "补齐创建体验，再接活动与通知",
    [
      [
        "A06",
        "复制活动",
        "系列活动创建入口"
      ],
      [
        "A05",
        "海报",
        "发布后分享出口"
      ],
      [
        "B02",
        "批量审核",
        "主线完成后接报名审核"
      ],
      [
        "B03",
        "逐个看",
        "审核剩余项"
      ],
      [
        "B01",
        "AI 优化",
        "发布后优化"
      ],
      [
        "B05",
        "详情整理",
        "有嘉宾时整理流程"
      ],
      [
        "N01",
        "通知起草",
        "按阶段起草，人工发送"
      ],
      [
        "N03",
        "回私信",
        "逐条起草，人工发送"
      ],
      [
        "C01",
        "到场率提示",
        "现场一次提醒"
      ],
      [
        "D01",
        "反馈汇总",
        "至少五条才汇总"
      ]
    ]
  ],
  [
    "P2",
    "按需要补充推荐、数据与增强",
    [
      [
        "A04",
        "封面底图（VIP）",
        "默认封面可用"
      ],
      [
        "B04",
        "嘉宾推荐",
        "需要候选池积累"
      ],
      [
        "B06",
        "主持稿",
        "少数活动需要"
      ],
      [
        "N02",
        "告诉老朋友",
        "已有邀请功能上的增强"
      ],
      [
        "D02",
        "数据入口",
        "固定数据页接对话"
      ],
      [
        "X02",
        "问数据",
        "数据积累后补充"
      ]
    ]
  ],
  [
    "规则",
    "不用模型，单独安排",
    [
      [
        "A09",
        "问卷常用问题",
        ""
      ],
      [
        "A10",
        "同天同城撞车",
        ""
      ],
      [
        "B07",
        "需处理待办",
        ""
      ],
      [
        "C02",
        "现场进度",
        ""
      ]
    ]
  ]
];
  R({
    id: 'P00', stage: 'prio', title: '优先级总览：先打通 AI 对话与创建前', where: '24 个 AI 功能点 + 4 个规则功能 · 2026-10-06 重排', surface: 'wide', flag: 'P0',
    states: ['总览'],
    stateNotes: ['先完成 AI 对话与创建前的衔接；活动、通知和活动后的功能按 P1 / P2 接入。'],
    notes: [["当前主线", "先判断信息是否足够（X00），不足就进入 X01；有资料直接起草。主办方介绍在 A00 完善，可跳过，不作为创建活动的门槛。活动输入进入 A01，确认内容后接 A02，再由 A07 检查后人工发布。对话保留原来的编辑位置、已知信息和返回位置；退出不覆盖表单，只有确认使用才写入。未创建活动时使用主办方与新活动草稿上下文，不要求已有 event id。"], ["本次调整", "D03 改为 A00，移到创建前首项；B02、N01 改为 P1；A08、A03 改为 P0。P0 八项、P1 十项、P2 六项，规则四项。"], ["范围", "本轮修改原型与文档；发布、发送和审核仍由人确认。"]],
    render: function (s, h) {
      var html = '<h3 class="ce2-panel-h3">优先级</h3><p class="ce2-panel-sub">先打通 AI 对话与创建前：每场用不用得上、省多少时间、不做会不会出事。点编号跳到场景。</p>';
      PRIO.forEach(function (g) {
        html += '<div class="jd-section-head" style="margin-top:22px"><span class="jd-section-title">' + g[0] + '</span><span class="jd-section-meta">' + g[1] + ' · ' + g[2].length + ' 项</span></div><div class="al-facts" style="margin-top:10px">' +
          g[2].map(function (r, i) { return '<div class="al-fact"><span class="k" style="width:28px;color:var(--v-text-tertiary);font-variant-numeric:tabular-nums">' + (i + 1) + '</span><button type="button" class="al-line-link" data-go="' + r[0] + '" style="flex:none;width:44px;text-align:left;font-size:12.5px">' + r[0] + '</button><span class="v" style="flex:1.2;color:var(--v-text-primary)">' + r[1] + '</span><span class="v" style="flex:2;color:var(--v-text-secondary)">' + r[2] + '</span></div>'; }).join('') + '</div>';
      });
      return h.webShell({ tabs: [], title: '优先级总览', sub: '2026-10-06 · 按创建衔接重排', actions: '', body: html });
    }
  });

  var TITLE = '产品夜聊 Vol.8 · AI 产品怎么找到第一批用户';
  var ABOUT = '聊 AI 产品怎么找到第一批用户，带着正在做的东西来。';

  // ---- 创建屏共用：页头右侧一个「AI 起草」按钮；点开后快速创建在页面顶部全宽展开；封面列 + 表单列 ----
  function draftBtn(h, mode) {
    if (mode === 'open') return '<button type="button" data-go="X01" data-go-state="4" class="ce2-btn-outline" style="gap:6px;background:color-mix(in srgb, var(--v-brand-signal) 12%, transparent);border-color:var(--v-brand-signal);color:var(--v-signal-text)">' + h.SPARK + '继续和 AI 聊</button>';
    if (mode === 'done') return '<button type="button" data-go="X01" data-go-state="4" class="ce2-btn-outline" style="gap:6px;border-color:color-mix(in srgb, var(--v-brand-signal) 55%, transparent);color:var(--v-signal-text)">' + h.SPARK + '继续和 AI 聊</button>';
    return '<button type="button" data-go="X01" data-go-state="4" class="ce2-btn-outline" style="gap:6px;border-color:color-mix(in srgb, var(--v-brand-signal) 55%, transparent);color:var(--v-signal-text)">' + h.SPARK + 'AI 起草</button>';
  }
  function coverCol(h) {
    return '<div class="ce2-create-cover-col"><div class="ce2-cover" style="height:225px;border-radius:20px"><div class="ce2-cover-fallback"><div class="ce2-cover-fallback-glow"></div><div class="ce2-cover-fallback-mark">' + h.ICON.img + '</div></div><span class="ce2-cover-badge">默认封面</span></div><div class="ce2-cover-hint">默认封面已就位，直接发布也成立</div></div>';
  }
  function row(h, icon, value, ph, chip, sub, focus) {
    return '<div class="ce2-create-row"' + (focus ? ' style="box-shadow:inset 2px 0 0 var(--v-brand-signal)"' : '') + '><span class="ce2-create-row-icon">' + h.ICON[icon] + '</span><div style="flex:1;min-width:0"><div>' + (value ? h.esc(value) : '<span class="ph">' + h.esc(ph) + '</span>') + '</div>' + (sub ? '<div class="sub">' + sub + '</div>' : '') + '</div>' + (chip || '') + '</div>';
  }
  function optRow(label, sub, ctrl) {
    return '<div class="ce2-create-row"><div style="flex:1"><div class="ce2-create-opt-label">' + label + '</div>' + (sub ? '<div class="ce2-create-opt-sub">' + sub + '</div>' : '') + '</div>' + ctrl + '</div>';
  }
  function form(h, d) {
    d = d || {};
    var c = function (k) { return d.chips && d.chips[k] ? h.srcChip(d.chips[k]) : ''; };
    var html = '<div class="ce2-create-form-col">';
    if (d.chips && d.chips.title) html += '<div class="ce2-create-src-row">' + c('title') + '<span style="font-size:12px;color:var(--v-text-tertiary)">' + h.esc(d.srcNote || '改动后标记消失') + '</span></div>';
    html += '<div class="ce2-create-title' + (d.title ? '' : ' ce2-create-title--empty') + '">' + h.esc(d.title || '活动名称') + '</div>';
    if (d.titleExtra) html += d.titleExtra;
    if (d.chips && d.chips.about) html += '<div class="ce2-create-src-row" style="margin:8px 0 0">' + c('about') + '</div>';
    html += '<div class="ce2-create-about' + (d.about ? '' : ' ce2-create-about--empty') + '">' + h.esc(d.about || '一句话说清楚这是场什么活动，可以先空着') + '</div>';
    html += '<div class="ce2-create-block">' +
      row(h, 'cal', d.date, '日期', c('date'), d.dateSub) +
      row(h, 'clock', d.time, '时间段，如 19:30–21:30', c('time'), d.timeSub, d.timeFocus) +
      row(h, 'pin', d.addr, '输入地点名或地址，自动匹配场地', c('addr')) +
      row(h, 'pin', d.addrFull, '门牌号，报名通过后才展示', c('addrFull'), d.addrFull ? '只给报名成功的人看' : '') +
      '</div>';
    if (d.details) html += d.details;
    html += '<div class="ce2-create-options-label">活动选项 <span>· 都有默认值</span></div><div class="ce2-create-block">' +
      optRow('票价', '免费', '<span style="font-size:13px;color:var(--v-text-secondary)">免费</span>') +
      optRow('报名审核', '关 · 提交即通过', h.switchEl(false)) +
      optRow('人数上限', d.capSub || '不限', '<span style="font-size:13px;color:var(--v-text-secondary)">' + h.esc(d.cap || '不限') + '</span>') +
      '</div>';
    if (d.capNote) html += d.capNote;
    html += '<button type="button" class="ce2-create-publish"' + (d.canPublish ? '' : ' disabled') + '>发布</button><div class="ce2-create-gate-hint">' + (d.gate || '还差：名称 · 日期 · 公开地址') + '</div>';
    if (d.after) html += d.after;
    html += '</div>';
    return html;
  }
  // 页面顶部展开的快速创建（全宽）
  function createShell(h, body, btnMode) {
    return h.webShell({ status: 'draft', title: '新活动', sub: 'Vibers Shanghai · 草稿', tabs: [], actions: draftBtn(h, btnMode || 'idle') + '<button type="button" class="ce2-btn-outline">存草稿</button>', body: body });
  }
  // top：页面顶部展开的快速创建（或起草完成的一行）；btnMode：页头「AI 起草」按钮的样子
  function createPage(h, top, d, btnMode) { return createShell(h, (top || '') + '<div class="ce2-create"' + (top ? ' style="margin-top:24px"' : '') + '>' + coverCol(h) + form(h, d) + '</div>', btnMode); }

  // A01 only owns the editor entry and confirmed draft; all inputs live in X01.
  R({
    id: 'A01', stage: 'create', title: 'AI 创建：进入活动 AI，确认后继续编辑', where: '创建页「AI 起草」→ X01 活动 AI', surface: 'web', flag: 'P0',
    states: ['创建页 · AI 起草入口', '确认后 · 活动草稿'],
    stateNotes: ['点击 AI 起草进入独立活动 AI。创建页保留手动编辑，不再展开第二个输入框。', '对话中确认的信息进入草稿；继续编辑和发布前检查，不会自动发布。'],
    notes: [['统一入口', '文字、群公告、语音和海报都在 X01 对话中处理。A01 仅保留进入对话和返回编辑的衔接。'], ['确认内容', 'AI 展示名称、介绍、日期、时间和地点；缺事实标待定。票价、人数、审核规则单独明确确认。'], ['优先级', '<code>P0</code>']],
    render: function(s,h) {
      if(s===0) return createPage(h, '', {}, 'idle');
      return createPage(h, h.note('已使用你确认的信息创建草稿。你可以继续修改，准备好后再发布。'), { title: TITLE, about: ABOUT, date: '10 月 8 日 周四', time: '19:30–21:30', addr: '深圳南山 · 科兴科学园', addrFull: 'B 栋 2 楼 Hub 空间', canPublish: true, capNote: h.note('公告里提到 20 人，是否设置人数上限？', '设为 20') }, 'done');
    }
  });

  // ---------- A02 AI 起草 / AI 润色 ----------
  var DETAILS_MESSY = '这次主要聊踩坑。大家最近都在做 AI 产品，找用户很难，来分享一下各自怎么找到第一批人的。老地方巨鹿路，七点开始。';
  var DETAILS_FULL = '流程安排\n19:00 签到入场，自由交流\n19:30 三位创业者各讲 15 分钟最近踩的坑\n20:30 圆桌，带着问题来问\n21:30 结束\n\n适合谁来\n正在做 AI 产品、卡在找第一批用户的人。不限阶段。\n\n需要带什么\n一个正在做的东西，能打开给别人看就行。';
  R({
    id: 'A02', stage: 'create', title: '一句话介绍 / 详情：AI 起草 · AI 润色', where: 'pub-c-editor · 活动信息 tab，两个字段的标签行', surface: 'web', flag: 'P0',
    states: ['字段为空 · AI 起草', '写着', '已起草', '有内容 · AI 润色', '替换后可撤销'],
    stateNotes: ['字段为空时按钮叫「AI 起草」。只有这一个按钮：信息够就直接写，不够就进 X01 对话页问出来。', '字段内两三行骨架，按钮变「写着」。超过 3 秒加一句「还在写」。', '直接填入，带「AI」标记。右侧标注这次起草依据了哪些信息。', '字段有内容时按钮叫「AI 润色」：不覆盖，先出预览块，补的部分高亮，二选一。', 'toast 5 秒内可撤销，撤了回到原文。'],
    notes: [
      ['两个动作', '<b>AI 起草</b>：字段为空时，从零写。<b>AI 润色</b>：字段有内容时，只补结构和通顺，原文保留，补的部分高亮。'],
      ['起草依据（按优先级）', '<b>① 本表单已填的</b>：活动名称、日期时间、公开地址、标签、票价 / 审核 / 人数。<b>② 嘉宾名单</b>：嘉宾名字和一句话头衔（有则写进「流程安排」和「适合谁来」）。<b>③ 主办方资料</b>：主办方介绍、往期同系列活动的详情（复制上一场时沿用结构）。<b>④ 主办方个人名片</b>：经历、此刻（用来判断口吻和这场想聊什么）。<b>不用的</b>：报名者资料、其他主办方的活动。'],
      ['详情的固定结构', '按现有占位写三段：流程安排 / 适合谁来 / 需要带什么。有嘉宾就按嘉宾名单 顺序排流程（见 B05 的规则）。'],
      ['信息不够时', '<b>不另设「问问 AI」按钮</b>。按 X00 的判定表：现有内容能说明这场具体聊什么或做什么，就可以先写；日期地点可待定。不够就点同一个「AI 起草」进 X01 对话页，问出主题后确认后使用，<b>不硬生成</b>。事实字段缺了照常生成，写占位「（地点待定）」，不编。'],
      ['取舍', '不给 3 个候选版本。一个够用的版本 + 可编辑。不做「换语气」。'],
      ['层级 · 优先级', '表现层 + 框架层。<code>P0</code>']
    ],
    render: function (s, h) {
      var about, details, toastHtml = '';
      var aboutText = '创业者聊最近踩的坑，30 人，免费，带着问题来。';
      if (s === 0) { about = h.textarea('', '一句话说清楚这是场什么活动'); details = h.textarea('', '流程安排、适合谁来、需要带什么', { tall: true }); }
      else if (s === 1) { about = h.skeleton('通常 3 秒 · 超过会告诉你还在写'); details = h.textarea('', '流程安排、适合谁来、需要带什么', { tall: true }); }
      else if (s === 2) { about = h.textarea(aboutText); details = h.textarea(DETAILS_FULL, '', { tall: true }); }
      else if (s === 3) {
        about = h.textarea(aboutText);
        details = h.textarea(DETAILS_MESSY) + h.preview('AI 润色 · 原文保留，补的高亮', '<ins>流程安排</ins>\n19:00 签到入场\n19:30 三位创业者各讲 15 分钟最近踩的坑\n<ins>20:30 圆桌，带着问题来问</ins>\n\n<ins>适合谁来</ins>\n最近都在做 AI 产品、找用户很难的人，来分享各自怎么找到第一批人的。\n\n<ins>需要带什么</ins>\n<ins>一个正在做的东西，能打开给别人看就行。</ins>');
      } else { about = h.textarea(aboutText); details = h.textarea(DETAILS_FULL, '', { tall: true }); toastHtml = h.toast('已替换', '撤销'); }
      var basis = s === 2 ? '<div class="al-line" style="margin-top:8px">依据：名称、8 月 29 日 19:00–21:30、巨鹿路、标签「创业」、主办方介绍、Vol.6 的详情结构<button type="button" class="al-line-link">看依据</button></div>' : '';
      var aboutBtn = s === 0 ? h.aiBtn('AI 起草') : s === 1 ? h.aiBtn('写着', { busy: true }) : s === 2 ? h.srcChip('draft') : h.aiBtn('AI 润色');
      var detailsBtn = s === 0 || s === 1 ? h.aiBtn('AI 起草') : s === 2 ? h.srcChip('draft') + h.aiBtn('AI 润色') : s === 3 ? h.aiBtn('润色中', { busy: true }) : h.srcChip('draft');
      var body = h.panel('活动信息', '这些内容会出现在活动页顶部。带 <span style="color:var(--v-signal-text)">AI</span> 标记的是生成的，直接改就行。',
        h.field('活动名称', h.input('创业者夜聊 Vol.7 · 最近踩的坑')) +
        h.field('一句话介绍', about, aboutBtn) +
        '<div class="ce2-row-2" style="margin-top:22px"><div class="ce2-field" style="margin-top:0">' + h.labelRow('日期') + h.input('8 月 29 日 周六') + '</div><div class="ce2-field" style="margin-top:0">' + h.labelRow('时间段') + h.input('19:00–21:30') + '</div></div>' +
        '<details class="ce2-details-toggle" open><summary>' + h.ICON.chevron + '活动详情<span style="margin-left:auto;font-size:12px;color:var(--v-text-tertiary);font-weight:400">比一句话介绍更完整</span></summary><div class="ce2-details-toggle-body"><div class="ce2-field-label-row" style="margin-top:4px"><span class="ce2-field-label">正文</span>' + detailsBtn + '</div>' + details + basis + '</div></details>');
      return h.webShell({ tab: '活动信息', body: body }) + toastHtml;
    }
  });

  // ---------- A03 标签建议 ----------
  R({
    id: 'A03', stage: 'create', title: '标签建议', where: 'pub-c-editor · 活动信息 tab「标签」字段', surface: 'web', flag: 'P0',
    states: ['建议出现', '采纳一个'],
    stateNotes: ['名称和一句话介绍填完后出现，虚线边框前缀「建议」，每个建议带来源。', '点一下变正式 chip，带 AI 标记直到你再改标签。'],
    notes: [
      ['放哪', '标签字段里，已选 chip 后面。'],
      ['数据依据（三路，取交集优先）', '<b>① 文本匹配</b>：名称 + 一句话介绍 + 详情，和标签库里每个标签的描述做语义匹配，取前 3。<b>② 主办方历史</b>：这个主办方往期活动用过的标签，出现 2 次以上的优先。<b>③ 同类活动</b>：平台上名称 / 介绍相近的已发布活动最常用的标签。三路都命中的排最前；只有一路命中的最多出 1 个。'],
      ['不看的', '不看报名者，不看其他主办方的私密活动。'],
      ['交互', '最多 2 个建议 chip，虚线边框，hover 显示来源（「你上 3 场都用过」「同类活动常用」）。点一下变正式 chip。不自动加，不替换已选的。'],
      ['层级 · 优先级', '框架层。<code>P1</code> · 每场都会用，但省的只是选两个标签的时间，排在起草和审核后面。']
    ],
    render: function (s, h) {
      var chips = h.tagChip('创业') + (s === 1 ? '<span class="ce2-tag-chip">' + h.SPARK + '分享会<span class="ce2-tag-chip-x">×</span></span>' : '') + (s === 0 ? h.suggest('分享会', '你上 3 场都用过') : '') + h.suggest('Networking', '同类活动常用');
      var body = h.panel('活动信息', '',
        h.field('活动名称', h.input('创业者夜聊 Vol.7 · 最近踩的坑')) +
        h.field('一句话介绍', h.input('创业者聊最近踩的坑，30 人，免费，带着问题来。')) +
        h.field('标签', '<div class="ce2-tag-chips">' + chips + '</div><div style="margin-top:10px" class="ce2-tag-chips">' + ['AI', '设计', '读书会', '市集', '线下沙龙'].map(h.tagOff).join('') + '</div>' + h.note(s === 0 ? '虚线的是建议，点了才加 · 建议来自名称介绍、你的往期活动、同类活动 · 最多 5 个' : '已采纳 1 个建议 · 最多 5 个'), '<span style="font-size:12px;color:var(--v-text-tertiary)">' + (s === 1 ? '2' : '1') + ' / 5</span>'));
      return h.webShell({ tab: '活动信息', body: body });
    }
  });

  // ---------- A04 封面：板式固定，只有底图 AI 生成 ----------
  R({
    id: 'A04', stage: 'create', title: '封面：板式固定，只生底图', where: 'pub-c-editor · 活动信息 tab「封面图」', surface: 'web', flag: 'P2',
    states: ['默认封面', 'AI 生底图 · 生成中', '出 2 张，选一张', '选中'],
    stateNotes: ['板式是固定的：标题左下、日期一行、主办方名。底图默认是品牌暗底加一团橙光，直接发布也成立。', '按钮只有一个「AI 生底图」，VIP 才有。板式不动，只换底图。', '一次出 2 张，横向摆开。图上不带字，标题还是板式压上去的。', '选中后角标「AI 底图 · VIP」，toast 可撤销。每场 3 次。'],
    notes: [
      ['板式固定', '<b>封面只有一套板式</b>：4:3，标题左下两行以内，下面一行日期 + 主办方名，全部由排版层压上去。<b>不做多套模板，不让用户挑版式。</b>AI 只做一件事：把过长标题断成两行。'],
      ['只生底图', '<b>AI 生成的只有底图</b>，图上不带任何文字。非 VIP 用默认底图（品牌暗底 + 橙光）或自己上传；VIP 多一个「AI 生底图」按钮。'],
      ['生图 prompt 规范（服务端固定，用户不可改）', '<b>必含</b>：主题意象（从标签和一句话介绍抽 1–2 个名词，如「深夜 · 桌面 · 屏幕微光」）；构图留白（左下 40% 留给标题）；品牌色（暗底 #141414 为主，点缀 #ED6A2C 不超过 15% 面积）。<b>禁止</b>：任何文字和字母、人脸、logo、渐变霓虹、赛博风格、AI 感的光斑。<b>尺寸</b>：4:3，1600×1200。<b>次数</b>：VIP 每场活动 3 次，每次出 2 张。'],
      ['为什么限 VIP', '生图成本是文本的几十倍；品牌风险要靠规范 + 人工挑。先给付费用户，看采纳率再放开。'],
      ['层级 · 优先级', '表现层。<code>P2</code> · 默认底图已经能用，生图是锦上添花，而且只给 VIP。']
    ],
    render: function (s, h) {
      var textLayer = '<div style="font:500 26px/32px Sora,\'Noto Sans SC\',sans-serif;letter-spacing:-.02em;color:#F5F3EF">创业者夜聊 Vol.7<br>最近踩的坑</div><div style="margin-top:8px;font:400 12px/16px Sora,sans-serif;color:rgba(245,243,239,.6)">8 月 29 日 周六 19:00 · Vibers Shanghai</div>';
      var bgA = 'radial-gradient(120% 80% at 80% 90%, rgba(237,106,44,.35) 0%, transparent 55%),radial-gradient(60% 50% at 20% 30%, rgba(245,243,239,.08) 0%, transparent 60%),#141414';
      var bgB = 'radial-gradient(90% 70% at 15% 85%, rgba(237,106,44,.28) 0%, transparent 60%),linear-gradient(160deg, #1F1F1E 0%, #141414 70%)';
      var cover, extra = '';
      if (s === 0) cover = '<div class="ce2-cover" style="display:flex;flex-direction:column;justify-content:flex-end;padding:20px;background:radial-gradient(70% 60% at 75% 30%, rgba(237,106,44,.22) 0%, transparent 60%),#141414"><span class="ce2-cover-badge">默认底图</span>' + textLayer + '<button type="button" class="ce2-cover-ai-btn">' + h.SPARK + 'AI 生底图<span class="al-vip" style="margin-left:6px">VIP</span></button></div>' + h.note('板式固定：标题左下、日期、主办方名 · 只换底图 · 也可以自己传一张');
      else if (s === 1) cover = '<div class="ce2-cover" style="display:flex;flex-direction:column;justify-content:flex-end;padding:20px;background:#141414"><span class="ce2-cover-badge">底图生成中</span><div style="position:absolute;inset:0;display:grid;place-items:center"><div class="al-orbline"><span class="dw"></span>按「创业」的意象在生底图 · 约 10 秒</div></div>' + textLayer + '</div>' + h.note('图上不带字 · 标题还是板式压上去的');
      else if (s === 2) {
        cover = '<div class="al-cover-grid" style="grid-template-columns:1fr 1fr;margin-top:0">' + [bgA, bgB].map(function (bg, i) { return '<div class="al-cover-opt" style="background:' + bg + ';padding:16px"><span class="m">' + h.SPARK + '</span><div class="t">创业者夜聊 Vol.7<br>最近踩的坑</div><div class="d">8 月 29 日 周六 · Vibers Shanghai</div></div>'; }).join('') + '</div>';
        extra = h.note('两张底图，板式一样 · 点一张即选 · 还剩 2 次') + '<div class="al-line" style="margin-top:6px"><span class="al-vip">VIP</span>意象来自标签「创业」和一句话介绍 · 不出人脸和 logo<button type="button" class="al-line-link">换意象再生</button></div>';
      } else cover = '<div class="ce2-cover" style="display:flex;flex-direction:column;justify-content:flex-end;padding:20px;background:' + bgA + '"><span class="ce2-cover-badge" style="background:color-mix(in srgb, var(--v-brand-signal) 85%, black)">' + h.SPARK + 'AI 底图 · VIP</span>' + textLayer + '<button type="button" class="ce2-cover-ai-btn">再生成 · 还剩 2 次</button></div>' + h.note('板式没变，只换了底图');
      var body = h.panel('活动信息', '',
        h.field('活动名称', h.input('创业者夜聊 Vol.7 · 最近踩的坑')) +
        h.field('封面图', cover + extra, '<span style="font-size:12px;color:var(--v-text-tertiary)">板式固定 · 4:3 · 点击换底图</span>'));
      return h.webShell({ tab: '活动信息', body: body }) + (s === 3 ? h.toast('已换底图', '撤销') : '');
    }
  });

  // ---------- A05 海报：基于当前信息生成 ----------
  R({
    id: 'A05', stage: 'create', title: '海报：用当前信息生成', where: 'pub-c-editor · 概览发布时刻「分享」旁 · 活动信息 tab 底部', surface: 'web', flag: 'P1',
    states: ['核对信息 · 选择横竖版', '已选竖版 · 准备生成', '已选横版 · 准备生成', '竖版结果 · 预览与导出', '横版结果 · 预览与导出'],
    stateNotes: ['用户必须先选择横版或竖版，再生成。', '竖版 1080×1920；AI 自动选择固定版式、底图与配色。', '横版 1920×1080；AI 自动选择固定版式、底图与配色。', '预览竖版结果，不满意可以重新生成；只印公开地址。', '预览横版结果，不满意可以重新生成；只印公开地址。'],
    notes: [
      ['放哪', '发布时刻卡片「分享」旁的「生成海报」；活动信息 tab 底部也有一个入口。'],
      ['海报上有什么', '<b>主题</b>（活动名称）· <b>一句话介绍</b> · <b>嘉宾 + 一句话头衔</b>（最多 4 位，没确认的标「待确认」，可以不放）· <b>时间</b> · <b>公开地址</b>（不印详细地址）· <b>主办方名 + 头像</b> · <b>报名码</b>（小程序码或链接二维码）。'],
      ['和封面的区别', '封面是活动页顶部的图，不带信息；海报是拿去发的图，信息齐全。海报底图与配色由 AI 根据活动主题决定。'],
      ['AI 做什么', '从固定模板「主题突出 / 嘉宾突出 / 信息清单」中选择适合内容的版式，决定底图与配色；文字和报名码由模板渲染。介绍超 30 字、嘉宾头衔超 12 字时缩短，供用户确认。用户只需选择横版或竖版。'],
      ['层级 · 优先级', '表现层。<code>P1</code>']
    ],
    render: function (s, h) {
      var facts = '<div class="al-facts">' + [
        ['主题', '创业者夜聊 Vol.7 · 最近踩的坑', ''], ['一句话', '创业者聊最近踩的坑，30 人，免费，带着问题来。', '22 字 · 不用压缩'],
        ['嘉宾', '沈一 · 内容设计，前字节 &nbsp;/&nbsp; 韩露 · 独立开发者', '2 位已确认'], ['时间', '8 月 29 日 周六 19:00–21:30', ''],
        ['地点', '上海静安 · 巨鹿路', '只印公开地址'], ['主办方', 'Vibers Shanghai', ''], ['报名码', '发布后生成 · 草稿态先用占位', '']
      ].map(function (f) { return '<div class="al-fact"><span class="k">' + f[0] + '</span><span class="v">' + f[1] + '</span><span class="x">' + f[2] + '</span></div>'; }).join('') + '</div>';
      var landscape = s === 2 || s === 4;
      var card = function (k, on) {
        return '<div class="al-poster-card al-poster-card--' + k + (on ? ' al-poster-card--on' : '') + (landscape ? ' al-poster-card--landscape' : '') + '"><span class="badge">' + h.SPARK + 'AI 排版</span><div class="k" style="margin-top:22px">Vibers Shanghai</div><div class="t">创业者夜聊 Vol.7<br>最近踩的坑</div><div class="s">创业者聊最近踩的坑，30 人，免费，带着问题来。</div><div class="g"><b>沈一</b><span>内容设计 · 前字节</span><b style="margin-top:4px">韩露</b><span>独立开发者</span></div><div class="m">8 月 29 日 周六 19:00<br>上海静安 · 巨鹿路</div><span class="qr"></span></div>';
      };
      var body;
      var orientation = '<div class="al-fchips" role="group" aria-label="海报方向"><button type="button" class="al-btn' + (s === 1 ? ' al-btn--primary' : '') + '" data-go="A05" data-go-state="1" aria-pressed="' + (s === 1) + '">竖版 · 1080 × 1920</button><button type="button" class="al-btn' + (s === 2 ? ' al-btn--primary' : '') + '" data-go="A05" data-go-state="2" aria-pressed="' + (s === 2) + '">横版 · 1920 × 1080</button></div>';
      if (s < 3) body = h.panel('生成海报', '先核对内容，再选择横版或竖版。', facts) + h.panel('海报方向', '版式、底图和配色交给 AI，生成后可以预览。', orientation + h.note('AI 从固定版式中选择：主题突出、嘉宾突出、信息清单。') + '<div class="al-chat-quick"><button type="button" class="al-btn al-btn--primary"' + (s === 0 ? ' disabled' : ' data-go="A05" data-go-state="' + (landscape ? 4 : 3) + '"') + '>生成海报</button>' + (s === 0 ? h.note('请先选择海报方向') : '') + '</div>');
      else body = h.panel('海报预览 · ' + (landscape ? '横版' : '竖版'), 'AI 已为这场活动选择「嘉宾突出」版式，以及暖橙底图和配色。', '<div class="al-poster-result' + (landscape ? ' al-poster-result--landscape' : '') + '">' + card('b', true) + '</div>' + h.note((landscape ? '1920 × 1080' : '1080 × 1920') + ' · 嘉宾突出 · 暖橙渐变底图 · 文字和报名码保持清晰') + '<div class="al-chat-quick"><button type="button" class="al-btn al-btn--primary">下载 PNG</button><button type="button" class="al-btn" data-go="A05" data-go-state="' + (landscape ? 2 : 1) + '">重新生成</button><button type="button" class="al-btn" data-go="A05" data-go-state="0">更换横竖版</button><button type="button" class="al-btn">复制转发语</button></div>' + h.note('活动信息变更后，请重新生成海报。'));
      return h.webShell({ tab: '活动信息', body: body });
    }
  });

  // ---------- A06 复制活动：自动只改该改的 ----------
  R({
    id: 'A06', stage: 'create', title: '复制活动：自动只改该改的', where: '活动卡片「复制」· 点了直接进这一页', surface: 'web', flag: 'P1',
    states: ['沿用上期，改了两处', '带上期反馈'],
    stateNotes: ['点活动卡片的「复制」直接到这里。diff 一行一项，各带撤销。没列出来的全部沿用。', '上期反馈汇总（D01）里反复提到的，作为一行建议带过来。'],
    notes: [
      ['放哪', '<b>活动列表卡片上现有的「复制」。点了就自动进这一页，不用再点任何 AI 按钮。</b>快速创建里不再放「复制上一场」chip。'],
      ['交互', '复制后顶部一块 diff：日期改为下周同一天、标题期数 +1，两项各带撤销。其余字段照抄，不再一一确认。'],
      ['带反馈', '上期有反馈汇总时多一行「上期 3 条反馈提到场地难找，详情里加路线？」，点了在详情里插一段占位。'],
      ['层级 · 优先级', '范围层 + 框架层。<code>P1</code>']
    ],
    render: function (s, h) {
      var diff = '<div class="al-intake al-intake--done">' + h.SPARK + '<span>已复制「<b>创业者夜聊 Vol.7 · 最近踩的坑</b>」</span><button type="button" class="al-line-link" style="margin-left:auto">换一场</button></div>' +
        '<div class="al-diff"><div style="font:500 11px/16px Sora,\'Noto Sans SC\',sans-serif;letter-spacing:.1em;text-transform:uppercase;color:var(--v-text-tertiary)">沿用上期 · 改了 2 处</div>' +
        '<div class="al-diff-row"><span style="color:var(--v-text-tertiary);width:44px">日期</span><span class="old">8 月 29 日</span><b>10 月 3 日 周六</b><span style="color:var(--v-text-tertiary)">下个周六</span><button type="button" class="al-line-link">撤销</button></div>' +
        '<div class="al-diff-row"><span style="color:var(--v-text-tertiary);width:44px">标题</span><span class="old">Vol.7</span><b>Vol.8</b><button type="button" class="al-line-link">撤销</button></div>' +
        '<div class="al-diff-row" style="color:var(--v-text-tertiary)"><span style="width:44px">沿用</span>时间 19:00–21:30 · 巨鹿路 · 30 人 · 需审核 · 免费 · 标签 · 问卷</div>' +
        (s === 1 ? '<div class="al-diff-row" style="border-top:1px solid var(--v-border-subtle);margin-top:6px;padding-top:10px">' + h.SPARK + '<span>上期 <b>3 条</b>反馈提到场地难找，详情里加一段路线？</span><button type="button" class="al-line-link">加一段</button></div>' : '') +
        '</div>';
      return createPage(h, '', { title: '创业者夜聊 Vol.8 · 最近踩的坑', about: '创业者聊最近踩的坑，30 人，免费，带着问题来。', date: '10 月 3 日 周六', time: '19:00–21:30', addr: '上海静安 · 巨鹿路', addrFull: '巨鹿路 758 号 3 楼', cap: '30', canPublish: true, gate: '发布后一切仍可改' }, diff);
    }
  });

  // ---------- A07 发布前冲突检查 + 一键全改 ----------
  R({
    id: 'A07', stage: 'create', title: '发布前冲突检查：使用以下修改', where: 'pub-c-editor · 「发布」按钮下方', surface: 'web', flag: 'P0',
    states: ['没冲突', '三处对不上 · 使用以下修改', '改完'],
    stateNotes: ['没冲突时什么都不显示。发布键不因此置灰。', '每条一个动作，顶部一个「使用以下修改」。只检查信息是否一致，不检查信息是否填全。', '三处划掉，toast 汇总，可撤销。'],
    notes: [
      ['放哪', '「发布」按钮下方，现在这里已经有「还差：名称 / 日期 / 公开地址」。'],
      ['查什么', '只查三类冲突：① 详情里的时间和日期字段对不上；② 详情或介绍里出现门牌号、房间号，而地址设了「仅报名成功可见」；③ 文案提到付费，票价却是免费，或反过来。'],
      ['使用以下修改', '每条改法是确定的（以字段为准改文案），所以可以一次全改。改完 toast 带撤销，撤销回到改之前的全部文案。'],
      ['不查什么', '不查完整度，不催「详情太短」。完整度和优化空间归 B01。'],
      ['层级 · 优先级', '范围层。<code>P0</code>']
    ],
    render: function (s, h) {
      var conflicts = '';
      if (s === 1) conflicts = '<div style="margin-top:14px;display:flex;align-items:center;gap:10px"><span style="font-size:12.5px;color:var(--v-text-secondary)">发现 3 处信息不一致，以下修改以你填写的活动信息为准</span><button type="button" class="al-btn al-btn--primary al-btn--sm" style="margin-left:auto">' + h.SPARK + '使用以下修改</button></div><div class="al-conflicts"><div class="al-conflict"><span>详情里写「19:00 见」，开始时间是 19:30</span><button type="button" class="al-line-link" style="margin-left:auto">改成 19:30</button></div><div class="al-conflict"><span>详情里出现「B 栋 2 楼 Hub 空间」，地址设了仅报名成功可见</span><button type="button" class="al-line-link" style="margin-left:auto">从详情里删掉</button></div><div class="al-conflict"><span>一句话介绍提到「门票」，票价是免费</span><button type="button" class="al-line-link" style="margin-left:auto">改成免费</button></div></div>';
      if (s === 2) conflicts = '<div class="al-conflicts" style="margin-top:14px"><div class="al-conflict al-conflict--fixed">详情里写「19:00 见」，开始时间是 19:30</div><div class="al-conflict al-conflict--fixed">详情里出现「B 栋 2 楼 Hub 空间」</div><div class="al-conflict al-conflict--fixed">一句话介绍提到「门票」</div></div>';
      var details = '<details class="ce2-details-toggle" open style="margin-top:18px"><summary>' + h.ICON.chevron + '活动详情</summary><div class="ce2-details-toggle-body">' + h.textarea(s === 1 ? '19:00 见，在 B 栋 2 楼 Hub 空间。\n\n流程安排\n签到入场，三位创业者各讲 15 分钟，最后圆桌。' : '19:30 见，地址报名通过后可见。\n\n流程安排\n签到入场，三位创业者各讲 15 分钟，最后圆桌。') + '</div></details>';
      return createPage(h, '', { title: TITLE, about: s === 1 ? '聊 AI 产品怎么找到第一批用户，门票含一杯饮品。' : ABOUT, date: '10 月 8 日 周四', time: '19:30–21:30', addr: '深圳南山 · 科兴科学园', addrFull: 'B 栋 2 楼 Hub 空间', details: details, canPublish: true,
        gate: s === 1 ? '<span style="color:var(--v-signal-text)">有 3 处对不上，发布前看一眼</span>' : '发布后一切仍可改', after: conflicts }) + (s === 2 ? h.toast('已改 3 处', '撤销') : '');
    }
  });

  // ---------- A08 起名 ----------
  R({
    id: 'A08', stage: 'create', title: '帮我起名', where: 'pub-c-editor · 活动名称字段', surface: 'web', flag: 'P0',
    states: ['三个候选', '选中一个', '资料不够 · 同一个按钮进对话'],
    stateNotes: ['全站唯一给多个候选的地方：标题 8 个字，扫一眼就比完。', '点一个填入，带「AI」标记，其余消失。', '一句话介绍和详情都空着时，点同一个「帮我起名」直接进 X01 对话页，用几个问题把主题问出来。按钮旁一行灰字说明会发生什么。'],
    notes: [
      ['放哪', '活动名称字段旁「帮我起名」。'],
      ['依据', '一句话介绍、详情、标签、嘉宾、往期同系列的命名方式（Vol.N、第 N 期）。'],
      ['资料不够时', '<b>同一个按钮</b>，不另设「问问 AI」。判定按 X00：现有内容能说明具体主题就给出名称建议；主题不清楚时进 X01 对话页，AI 先说它已经知道的（主办方资料、往期活动），再一次问一个问题，问出主题后确认活动名称和一句话介绍。<b>不够时不出候选</b>。'],
      ['为什么这里例外', 'A02 不给候选，因为一段文案要读；标题短，比对不费力。'],
      ['层级 · 优先级', '表现层。<code>P1</code>']
    ],
    render: function (s, h) {
      var extra = s === 0 ? '<div class="ce2-tag-chips" style="margin-top:10px">' + h.suggest('产品夜聊 Vol.8 · 第一批用户') + h.suggest('找到前 100 个用户') + h.suggest('AI 产品冷启动夜聊') + '</div>' : '';
      var btn = s === 2 ? '<div style="margin-top:6px;display:flex;align-items:center;gap:8px">' + h.aiBtn('帮我起名', { inline: true }) + '<span style="font-size:12px;color:var(--v-text-tertiary)">还没有介绍，点了会先问你几个问题定主题</span></div>' : s === 0 ? '<div style="margin-top:6px">' + h.aiBtn('帮我起名', { inline: true }) + '</div>' : '';
      return createPage(h, '', { title: s === 1 ? '找到前 100 个用户' : '', titleExtra: btn + extra, chips: s === 1 ? { title: 'draft' } : null, about: s === 2 ? '' : ABOUT, date: '10 月 8 日 周四', time: '19:30–21:30', addr: '深圳南山 · 科兴科学园', canPublish: s === 1, gate: s === 1 ? '发布后一切仍可改' : '还差：名称' });
    }
  });

  // ---------- A09 问卷库 ----------
  R({
    id: 'A09', stage: 'create', title: '问卷：常用问题库', where: 'pub-c-editor · 报名 tab「问卷」', surface: 'web', flag: '规则',
    states: ['按这场的设置给 chip'],
    stateNotes: ['规则表就够：需审核给「为什么想来」，分享会给「你最近在做什么」，付费给「饮食禁忌」。不上模型。'],
    notes: [
      ['放哪', '报名 tab 的「问卷」，已有问题下面。'],
      ['做法', '按标签和设置给 2–3 个固定问题 chip，点一个加一个。这是规则表，不用模型。'],
      ['和审核的关系', '问卷问得清楚，B02 / B03 的审核才有东西可看。需审核的活动默认带「为什么想来」。'],
      ['层级 · 优先级', '范围层。<code>规则</code>']
    ],
    render: function (s, h) {
      var body = h.panel('报名设置', '',
        '<div style="margin-top:18px"><div class="ce2-toggle-row"><div><div style="font-size:14px;color:var(--v-text-primary)">报名审核</div><div style="margin-top:2px;font-size:12px;color:var(--v-text-tertiary)">开 · 提交后等你通过</div></div>' + h.switchEl(true) + '</div>' +
        '<div class="ce2-toggle-row"><div><div style="font-size:14px;color:var(--v-text-primary)">人数上限</div><div style="margin-top:2px;font-size:12px;color:var(--v-text-tertiary)">满了自动进候补</div></div><span style="font:500 14px Sora,sans-serif">30</span></div>' +
        '<div class="ce2-toggle-row"><div><div style="font-size:14px;color:var(--v-text-primary)">票价</div></div><span style="font-size:13px;color:var(--v-text-secondary)">免费</span></div></div>' +
        h.field('问卷', '<div class="ce2-q-list"><div class="ce2-q-row"><span class="ce2-q-index">01</span><span class="ce2-q-text">你想聊什么？</span><span class="ce2-q-meta">简答 · 必填</span></div></div>' +
          '<div class="ce2-guest-suggest-label" style="display:flex;align-items:center;gap:8px">常用问题 · 按这场的设置给的 ' + h.ruleTag() + '</div><div class="ce2-tag-chips">' + h.suggest('为什么想来', '需审核') + h.suggest('你最近在做什么', '分享会') + h.suggest('能不能带一个朋友', '线下') + '</div>' +
          '<button type="button" class="ce2-q-add">+ 自己写一个问题</button>', '<span style="font-size:12px;color:var(--v-text-tertiary)">最多 5 个</span>'));
      return h.webShell({ tab: '报名', body: body });
    }
  });

  // ---------- A10 撞车提示（红字） ----------
  R({
    id: 'A10', stage: 'create', title: '同天同城撞车', where: 'pub-c-editor · 日期字段下一行', surface: 'web', flag: '规则',
    states: ['红字一行，不劝改'],
    stateNotes: ['红字提示，点开看是哪两场。不建议改期，不排名。'],
    notes: [
      ['放哪', '日期字段下一行，选完日期才出现。<b>红字</b>，因为这是主办方最该在发布前知道的一件事。'],
      ['做法', '同城、同一天、标签有重合的已发布活动数。是数据库查询，不用模型。'],
      ['规矩', '不劝改期，不说「建议避开」。主办方自己判断。'],
      ['层级 · 优先级', '范围层。<code>规则</code>']
    ],
    render: function (s, h) {
      return createPage(h, '', { title: TITLE, about: ABOUT, date: '10 月 8 日 周四', dateSub: '<span class="al-warn" style="display:inline-flex;align-items:center;gap:6px">同一天深圳还有 <b style="font-weight:500">2 场</b> AI 主题活动 <button type="button" class="al-line-link" style="font-size:12px">看是哪两场</button></span> ' + h.ruleTag(), time: '19:30–21:30', addr: '深圳南山 · 科兴科学园', canPublish: true, gate: '发布后一切仍可改' });
    }
  });
})();

