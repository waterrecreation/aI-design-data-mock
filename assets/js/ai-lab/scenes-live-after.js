/* AI 辅助原型 · 04 活动中（C01–C02）· 05 活动后 · 反馈与数据（D01–D02）· 06 AI 对话（X00–X02）· 全部网页端 */
(function () {
  'use strict';
  var R = window.AILab.register;

  var LIVE_TABS = ['概览', '活动信息', '报名', '嘉宾', '通知'];
  var ENDED_TABS = ['概览', '活动信息', '报名', '嘉宾', '通知', '反馈', '数据'];
  function liveStats(h, arrived) {
    return '<div class="ce2-stats-row"><div class="ce2-stat"><div class="ce2-stat-label">报名成功</div><div class="ce2-stat-value">27</div></div><div class="ce2-stat"><div class="ce2-stat-label">到场</div><div class="ce2-stat-value ce2-stat-value--flag">' + arrived + ' <span style="font-size:12px;color:var(--v-text-tertiary)">/ 27</span></div><div class="ce2-stat-bar"><div class="ce2-stat-bar-fill" style="width:' + Math.round(arrived / 27 * 100) + '%"></div></div></div><div class="ce2-stat"><div class="ce2-stat-label">开场</div><div class="ce2-stat-value">19:00</div></div><div class="ce2-stat"><div class="ce2-stat-label">现在</div><div class="ce2-stat-value">19:32</div></div></div>';
  }

  // ========== 独立的活动 AI 对话页（Muse 式三栏）：所有活动相关的对话都走这一页 ==========
  function chatShell(h, o) {
    o = o || {};
    var convs = o.convs || [['这场 · 创业者夜聊 Vol.7', [['起名 · 定主题', o.on === 'name'], ['看数据', o.on === 'data'], ['推荐嘉宾和场地', o.on === 'guest'], ['写通知', false]]], ['其他活动', [['AI & Society 第 4 期 · 详情', false], ['慢读会 · 品牌介绍', o.on === 'brand']]]];
    var side = '<aside class="al-cp-side"><div class="al-cp-brand"><span style="display:inline-flex;width:14px;height:17px;color:var(--v-text-primary)"><vb-v style="width:14px;height:17px"></vb-v></span>活动 AI</div><button type="button" class="al-cp-new">+ 新对话</button>' +
      convs.map(function (g) { return '<div class="al-cp-group">' + g[0] + '</div>' + g[1].map(function (c) { return '<button type="button" class="al-cp-item' + (c[1] ? ' al-cp-item--on' : '') + '">' + c[0] + '</button>'; }).join(''); }).join('') + '</aside>';
    var head = '<div class="al-cp-head"><span class="al-cp-about">' + h.ICON.cal.replace('width="16" height="16"', 'width="13" height="13"') + h.esc(o.about || '创业者夜聊 Vol.7 · 草稿') + '</span><span class="al-cp-from">' + h.esc(o.from || '') + '</span><button type="button" class="al-btn al-btn--sm" data-go="' + (o.on === 'brand' ? 'A00' : o.on === 'data' ? 'D02' : 'A01') + '" style="margin-left:auto">' + h.esc(o.back || '返回工作台') + '</button></div>';
    var foot = '<div class="al-cp-foot"><div class="al-chat-input">' + h.esc(o.placeholder || '问这场活动的任何事，或直接说要做什么') + '<button type="button" class="al-btn al-btn--sm" data-go="X01" data-go-state="5">语音</button><button type="button" class="al-btn al-btn--sm" data-go="X01" data-go-state="6">上传海报</button><button type="button" class="send">发送</button></div><div style="margin-top:8px;font-size:11.5px;color:var(--v-text-tertiary)">生成的内容会先展示给你，确认后才用于活动信息。</div></div>';
    var ctx = '<aside class="al-cp-ctx">' + (o.ctx || '') + '</aside>';
    return '<div class="al-chatpage">' + side + '<main class="al-cp-main">' + head + '<div class="al-cp-body">' + (o.body || '') + '</div>' + foot + '</main>' + ctx + '</div>';
  }
  function aiSay(h, html, sub) { return '<div class="al-ask" style="margin-top:0"><span class="al-ask-icon">' + h.SPARK + '</span><div class="al-ask-bubble">' + html + (sub ? '<div class="al-ask-sub">' + sub + '</div>' : '') + '</div></div>'; }
  function userSay(html) { return '<div class="al-user-bubble" style="margin-top:0">' + html + '</div>'; }
  function known(h, items) { return '<div class="al-chat-known">' + h.SPARK + ' <b>已经知道的</b><div style="margin-top:6px">' + items.map(function (i) { return '<div style="margin-top:4px">' + i[0] + '<span class="src">' + i[1] + '</span></div>'; }).join('') + '</div></div>'; }
  function outPanel(h, items, foot) { return '<div class="al-out"><div class="al-out-h">' + (items[0] && items[0][0] === '导出' ? '数据结果' : items.some(function (i) { return !i[2]; }) ? '请确认以下信息' : '还需要了解的信息') + '</div>' + items.map(function (i) { return '<div class="al-out-item"><div class="al-out-k">' + i[0] + '</div><div class="al-out-v' + (i[2] ? ' al-out-v--empty' : '') + '">' + i[1] + '</div></div>'; }).join('') + '<div class="al-out-foot">' + (foot || '') + '</div></div>'; }

  // ========== 04 活动中 ==========
  R({
    id: 'C01', stage: 'live', title: '到场率提示 + 一键催到', where: 'pub-c-editor · 概览进行中「到场」数字旁', surface: 'web', flag: 'P1',
    states: ['一行提示', '跳到通知，已预填'],
    stateNotes: ['开场 30 分钟后到场低于报名成功人数一半才出现。只显示一次，不弹窗，不推送到手机。', '点了跳通知 tab（N01），chip 停在「晚到直接进」，只发给还没签到的人。发送还是人点。'],
    notes: [
      ['放哪', '概览 tab 进行中状态的「到场」数字下方；后台即将举办卡片同一行。'],
      ['交互', '「还有 16 人没到，发一条？」→ 点了跳通知 tab 并预填「已经开始了，入口在 X，晚到直接进」。收件人自动收窄成还没签到的 16 人。'],
      ['打扰度', '页面上的一行字，不主动找人。张小龙：不骚扰主办方，也不替他骚扰参与者。'],
      ['层级 · 优先级', '框架层。<code>P1</code>']
    ],
    render: function (s, h) {
      if (s === 0) {
        var line = '<div class="al-line" style="margin-top:0;padding:12px 16px;border-radius:14px;border:1px solid var(--v-border-subtle);color:var(--v-text-secondary)">' + h.SPARK + '开场半小时，还有 16 人没到<button type="button" class="al-line-link">发一条「晚到直接进」</button><span style="margin-left:auto;font-size:11.5px">只提这一次</span></div>';
        var hero = '<div class="ce2-pub-hero"><span class="ce2-pub-hero-icon" style="background:color-mix(in srgb, var(--v-brand-signal) 12%, transparent);color:var(--v-signal-text)">' + h.ICON.clock + '</span><div><div class="ce2-pub-hero-title">进行中 · 19:00 开场</div><div class="ce2-pub-hero-sub">现在：签到入场 · 下一环节 19:30 沈一（见 C02）</div></div><button type="button" class="ce2-btn-share-primary" style="margin-left:auto">手机扫码签到</button></div>';
        return h.webShell({ tab: '概览', status: 'now', tabs: LIVE_TABS, body: '<div class="ce2-ov">' + hero + liveStats(h, 11) + line + '</div>' });
      }
      var body = h.panel('通知参与者', '写一条发给报名的人：站内通知送达，活动页同步显示。',
        '<div class="ce2-field"><div class="ce2-field-label-row"><span class="ce2-field-label">写一条</span>' + h.srcChip('draft') + '<span style="font-size:12px;color:var(--v-text-tertiary)">发给 16 位还没到的人</span></div>' +
        '<div class="al-fchips" style="margin-bottom:10px"><span style="display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--v-text-tertiary);margin-right:2px">' + h.SPARK + '现场</span>' + h.fchip('延迟开场') + h.fchip('换房间') + h.fchip('结束后去哪') + h.fchip('晚到直接进', null, true) + '</div>' +
        h.textarea('已经开始了，晚到直接进。巨鹿路上找橙色指示牌上 3 楼，详细地址见活动页。') + '<div class="ce2-blast-send-row"><button type="button" class="ce2-blast-send">发送</button><span class="ce2-blast-hint">只发给还没签到的 16 人 · 到了的人不打扰</span></div></div>');
      return h.webShell({ tab: '通知', status: 'now', tabs: LIVE_TABS, body: body });
    }
  });

  R({
    id: 'C02', stage: 'live', title: '现场进度：现在到哪个环节', where: 'pub-c-editor · 进行中的概览 · 参与者活动页同步', surface: 'web', flag: '规则',
    states: ['现在：签到入场', '点了「下一环节」'],
    stateNotes: ['流程来自详情的「流程安排」（B05）。当前环节由管理人员手动确认，不按时间自动跳。参与者活动页顶部同步显示「现在 · 签到入场」。', '点「下一环节」后当前变成沈一，上一环节划掉。实际开始时间记下来，和计划时间并排。'],
    notes: [
      ['放哪', '进行中的概览 tab，到场数下面一块「现场进度」。参与者活动页顶部一行同步显示。'],
      ['规则（不用模型）', '环节列表 = 详情里「流程安排」的每一行。当前环节只由管理人员手动确认：「下一环节」或点任意一行「从这里开始」。不按时间自动跳，因为现场永远不准时。每次确认记实际时间，结束后能看计划 vs 实际。'],
      ['谁能点', '这场的管理人员和签到人员。'],
      ['参与者看到什么', '活动页顶部「现在 · 沈一 · 定价踩的坑 · 19:35 开始」。晚到的人知道错过了什么。不推送，只在页面上。'],
      ['层级 · 优先级', '结构层。<code>规则</code>']
    ],
    render: function (s, h) {
      var rows = [['19:00', '签到入场，自由交流'], ['19:30', '沈一 · 定价踩的坑'], ['19:50', '韩露 · 只在群里发的坑'], ['20:10', '第三位 · 待定'], ['20:30', '圆桌，带着问题来问'], ['21:30', '结束']];
      var now = s === 0 ? 0 : 1;
      var run = '<div class="ce2-pub-hero"><span class="ce2-pub-hero-icon" style="background:color-mix(in srgb, var(--v-brand-signal) 12%, transparent);color:var(--v-signal-text)">' + h.ICON.clock + '</span><div><div class="ce2-pub-hero-title">现场进度 ' + h.ruleTag() + '</div><div class="ce2-pub-hero-sub">流程来自详情 · 当前环节手动确认，不按时间自动跳 · 参与者活动页同步显示</div></div><button type="button" class="ce2-btn-share-primary" style="margin-left:auto">下一环节</button></div>' +
        '<div class="al-run" style="margin-top:0">' + rows.map(function (r, i) {
          var cls = i < now ? ' al-run-row--done' : i === now ? ' al-run-row--now' : '';
          var right = i === now ? '<span class="al-run-now" style="margin-left:auto">现在 · ' + (s === 1 ? '19:35 开始' : '19:02 开始') + '</span>' : i < now ? '<span style="margin-left:auto;font-size:12px">实际 19:02–19:35</span>' : '<button type="button" class="al-line-link" style="margin-left:auto;font-size:12px">从这里开始</button>';
          return '<div class="al-run-row' + cls + '"><span class="t">' + r[0] + '</span><span>' + r[1] + '</span>' + right + '</div>';
        }).join('') + '</div>' +
        '<div class="al-line">参与者活动页顶部现在显示：「现在 · ' + rows[now][1] + '」</div>';
      return h.webShell({ tab: '概览', status: 'now', tabs: LIVE_TABS, body: '<div class="ce2-ov">' + liveStats(h, s === 1 ? 19 : 11) + run + '</div>' });
    }
  });

  // ========== 05 活动后 · 反馈与数据 ==========
  var FB = [
    ['许知夏', '已参与', '2 小时前', '内容很实在，就是入口太难找了，绕了 20 分钟。下次能不能在详情里画个路线。'],
    ['匿名', '已参与', '5 小时前', '找了很久才找到楼。圆桌环节太短，刚聊开就结束了。'],
    ['李伟', '已参与', '昨天', '三位嘉宾讲的坑都踩过，想要嘉宾的联系方式。'],
    ['韩露', '已参与', '昨天', '圆桌只有 20 分钟，太短。下次可以砍一个分享。'],
    ['周明', '报名未参与', '昨天', '临时有事没去成，看了回顾很可惜。'],
    ['匿名', '已参与', '2 天前', '楼下没有指示牌，打了海报上的电话才找到。']
  ];
  function fbList(h, items) {
    return items.map(function (f) { return '<div style="display:flex;gap:12px;padding:14px 0;border-top:1px solid var(--v-border-subtle)"><span class="jd-person-av">' + (f[0] === '匿名' ? '·' : f[0].charAt(0)) + '</span><div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:8px"><span class="jd-person-name">' + f[0] + '</span><span class="fr-mini-badge" style="' + (f[1] === '已参与' ? 'background:var(--v-status-approved-bg);color:var(--v-status-approved-text)' : '') + '">' + f[1] + '</span><span style="margin-left:auto;font-size:12px;color:var(--v-text-tertiary)">' + f[2] + '</span></div><div class="fr-answer" style="font-size:14px;line-height:23px;margin-top:5px">' + f[3] + '</div></div></div>'; }).join('');
  }
  R({
    id: 'D01', stage: 'after', title: '反馈汇总', where: 'pub-c-editor · 「反馈」tab 顶部', surface: 'web', flag: 'P1',
    states: ['少于 5 条', '汇总块'],
    stateNotes: ['少于 5 条不出汇总，直接读原文更快。', '「反复提到的」最多 3 条，每条条数 + 一句原文引用。标「AI 整理」。不算分，不做跳转。'],
    notes: [
      ['放哪', '「反馈」tab 顶部（活动反馈方案：只有文字、无评分、仅主办方可见）。'],
      ['交互', '反馈 ≥ 5 条时出现一个可折叠块「反复提到的」：最多 3 条，每条「场地难找 · 3 条」+ 一句原文引用。只是汇总，下面原文列表照常。想追问「场地难找具体指什么」，进 X02 数据对话。'],
      ['不做', '不算情绪分、不算平均分、不排「最有价值反馈」、不做点条数跳转。反馈方案里明确不打分，汇总也不能变相打分。'],
      ['层级 · 优先级', '结构层。<code>P1</code> · 反馈 ≥ 5 条才有用，多数小场次用不到；用到时省的是读几十段的时间。']
    ],
    render: function (s, h) {
      var head = '<div style="display:flex;align-items:center;gap:12px"><h3 class="ce2-panel-h3">反馈</h3><span style="font-size:13px;color:var(--v-text-tertiary)">' + (s === 0 ? '3 条' : '12 条') + ' · 只有管理人员看得到</span><button type="button" class="al-btn" style="margin-left:auto">导出 CSV</button></div>';
      var summary = s === 1 ? '<div class="al-summary" style="margin-top:18px;padding:14px 16px"><div class="al-summary-head">' + h.SPARK + '反复提到的 · AI 整理<span style="margin-left:auto;font-weight:400;letter-spacing:0;text-transform:none">收起</span></div>' +
        '<div class="al-summary-item"><b>3 条</b><span>场地难找</span><q>入口太难找了，绕了 20 分钟</q></div>' +
        '<div class="al-summary-item"><b>2 条</b><span>圆桌太短</span><q>刚聊开就结束了</q></div>' +
        '<div class="al-summary-item"><b>2 条</b><span>想要嘉宾联系方式</span><q>想要嘉宾的联系方式</q></div></div>' : '';
      var filters = '<div class="al-fchips" style="margin-top:18px">' + h.fchip('全部', s === 0 ? 3 : 12, true) + h.fchip('已参与', s === 0 ? 3 : 9) + h.fchip('报名未参与', s === 0 ? 0 : 2) + h.fchip('未报名', s === 0 ? 0 : 1) + '</div>';
      var items = s === 0 ? FB.slice(2, 5) : FB;
      var note = s === 0 ? '<div style="margin-top:10px;font-size:12px;color:var(--v-text-tertiary)">少于 5 条不出汇总，直接读更快</div>' : '';
      return h.webShell({ tab: '反馈', status: 'ended', tabs: ENDED_TABS, body: head + summary + note + filters + '<div style="margin-top:8px">' + fbList(h, items) + '</div>' });
    }
  });

  // ---------- D02 数据 tab：四块固定 + 「问 AI」进对话 ----------
  R({
    id: 'D02', stage: 'after', title: '数据 tab：四块固定，想问什么进对话', where: 'pub-c-editor · 「数据」tab', surface: 'web', flag: 'P2',
    states: ['数据 tab · 入口', '点了「问 AI」· 进对话页'],
    stateNotes: ['tab 上只有这场的四块固定数据和一个「问 AI」按钮。不做筛选器，不做条件 chip。', '进独立的对话页（X02），会话自动带上这场的数据范围。问法见 X02。'],
    notes: [
      ['放哪', '结束态工作台多一个「数据」tab。四块固定：报名、签到、问卷、反馈。'],
      ['为什么不做筛选器', '主办方要的不是筛选器，是答案。问一句比拼条件快。所以这里只留入口，分析全部在对话页（X02）做。'],
      ['数据范围', '只有这一场：报名记录（来源、时间、状态）、签到记录、问卷回答、反馈、通知发送记录。进对话时作为上下文带过去，右侧看得见。'],
      ['层级 · 优先级', '结构层。<code>P2</code> · 数据页本身已做（E01–E03），这里只加一个「问 AI」入口；多数主办方看四块数字就够。']
    ],
    render: function (s, h) {
      if (s === 1) return chatShell(h, { on: 'data', about: '创业者夜聊 Vol.7 · 已结束', from: '从「数据」tab 进来', body: '<div class="al-cp-empty"><span class="al-orb-mini" style="width:44px;height:44px;border-radius:14px">' + h.SPARK + '</span><h4>问这场的数据</h4><p>报名 38 · 签到 24 · 问卷 27 份 · 反馈 12 条 · 只有这一场</p><div class="al-cp-starts">' + [['做设计的来了几个', '标签 + 签到'], ['哪个时段签到最多', '签到时间分布'], ['没到的人有什么共同点', '只答报名字段上的事实'], ['反馈里「场地难找」具体指什么', '反馈原文']].map(function (q) { return '<div class="al-cp-start">' + q[0] + '<small>' + q[1] + '</small></div>'; }).join('') + '</div></div>',
        ctx: known(h, [['报名 38 · 通过 27 · 拒绝 3 · 候补 8', '报名记录'], ['签到 24 / 27，最早 18:48', '签到记录'], ['问卷 2 题 · 27 份', '问卷'], ['反馈 12 条 · 已参与 9', '反馈']]) + outPanel(h, [['导出', '问出来的名单可以直接导出', true]]), placeholder: '问这场的数据，例「做设计的来了几个」' });
      var blocks = '<div class="ce2-quick" style="grid-template-columns:repeat(4,1fr);margin-top:18px">' + [['报名', '38 报名 · 27 通过 · 3 拒绝'], ['签到', '24 / 27 · 89%'], ['问卷', '2 题 · 27 份'], ['反馈', '12 条 · 见反馈 tab']].map(function (b) { return '<div class="ce2-quick-card" style="flex-direction:column;align-items:flex-start;gap:4px"><div class="ce2-quick-label">' + b[0] + '</div><div class="ce2-quick-sub">' + b[1] + '</div></div>'; }).join('') + '</div>';
      var cta = '<div class="ce2-pub-hero" style="margin-top:18px"><span class="ce2-pub-hero-icon" style="background:color-mix(in srgb, var(--v-brand-signal) 10%, transparent);color:var(--v-signal-text)">' + h.SPARK + '</span><div><div class="ce2-pub-hero-title">想知道什么，直接问</div><div class="ce2-pub-hero-sub">例「做设计的来了几个」「哪个时段签到最多」· 只看这一场的数据</div></div><button type="button" class="al-btn al-btn--primary" style="margin-left:auto">' + h.SPARK + '问 AI</button></div>';
      return h.webShell({ tab: '数据', status: 'ended', tabs: ENDED_TABS, body: '<h3 class="ce2-panel-h3">数据</h3><p class="ce2-panel-sub">只有这一场的数据。四块固定，别的进对话问。</p>' + blocks + cta + '<div style="margin-top:22px;display:flex;gap:10px"><button type="button" class="al-btn">导出报名名单 CSV</button><button type="button" class="al-btn">导出反馈 CSV</button></div>' });
    }
  });

  // ---------- A00 主办方介绍：AI 起草，资料不够进对话 ----------
  R({
    id: 'A00', stage: 'create', title: '主办方介绍：AI 起草，资料不够就追问', where: 'pub-a-host-identity · 「品牌介绍」', surface: 'web', flag: 'P0',
    states: ['字段为空 · 一个按钮', '已起草', '资料不够 · 同一个按钮进对话页'],
    stateNotes: ['只有「AI 起草」一个按钮，不另设「问问 AI」。', '办过活动的主办方：从办过的活动、常用标签、到场总数写 3 句。', '刚创建、还没办过活动的主办方：点同一个「AI 起草」进独立对话页，AI 先列已知的（创建人名片），再问 2 个问题（给谁办、想让人记住什么），答完确认后使用。'],
    notes: [
      ['放哪', '创建前的主办方资料 / 主办方设置「品牌介绍」。可跳过，完善后进入 A01 创建活动。'],
      ['起草依据', '办过的活动（名称、标签、到场数）、主办方一句话头衔、创建人的个人名片（经历、此刻）。'],
      ['资料不够时', '同一个「AI 起草」按钮进独立对话页（X01 同一页）：AI 先说已知道的，再一次问一个问题，最多 3 个，答完整理出的内容 3 句介绍更新相应信息。够不够按 X00：已有相关活动记录，或创建人名片有相关经历。'],
      ['层级 · 优先级', '表现层。<code>P0</code>']
    ],
    render: function (s, h) {
      if (s === 2) {
        return chatShell(h, { on: 'brand', about: '慢读俱乐部 · 主办方设置', from: '从「品牌介绍」的 AI 起草进来 · 还没办过活动', back: '返回主办方介绍', placeholder: '说一句，或点上面的',
          body: known(h, [['主办方「慢读俱乐部」，创建于昨天，还没办过活动', '主办方资料'], ['创建人名片：「喜欢读书，想开始组织线下讨论」', '个人名片'], ['一句话头衔「每月一本，慢慢读」', '主办方资料']]) +
            aiSay(h, '这些读书会主要是办给谁的？', '先了解你的读者 · 点一个，或自己写<div class="al-chat-quick">' + h.fchip('平时没时间读完一本书的人') + h.fchip('想找人一起讨论的读者') + h.fchip('特定类型：城市 / 小说 / 非虚构') + '</div>') +
            userSay('想找人一起讨论的读者，一本书分四周读') +
            aiSay(h, '来过的人，你希望他们记住这个主办方的哪一点？', '再了解你想带来的体验<div class="al-chat-quick">' + h.fchip('每次都读完') + h.fchip('小场，每个人都能说话') + h.fchip('选书有品味') + '</div>'),
          ctx: outPanel(h, [['品牌介绍', '还需要了解你希望读者记住什么', true], ['已确定', '给想一起讨论的读者办 · 一本书分四周']], '<button type="button" class="al-btn al-btn--sm" disabled>确认主办方介绍</button><button type="button" class="al-btn al-btn--ghost al-btn--sm">返回自行填写</button>') });
      }
      var body = h.panel('主办方', '出现在主办方主页顶部。',
        '<div style="margin-top:18px;display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:14px;border:1px solid var(--v-border-subtle);background:var(--v-bg-surface)"><span class="ce2-guest-avatar" style="border-radius:12px">V</span><div><div class="ce2-guest-name">Vibers Shanghai</div><div class="ce2-guest-meta">14 场活动 · 来过 214 人 · 创建于 2025 年 3 月</div></div></div>' +
        h.field('一句话头衔', h.input('上海的创业者和独立开发者线下局')) +
        h.field('品牌介绍', s === 0 ? h.textarea('', '介绍你为谁办活动、希望带来什么') : h.textarea('从 2025 年起在上海办了 14 场线下活动：创业者夜聊、独立开发者 Demo Day、慢读会。来过 214 人，多数在做 AI 产品、独立开发或设计。每场 20 到 80 人，需审核，免费为主。'), s === 0 ? h.aiBtn('AI 起草').replace('<button ', '<button data-go="A00" data-go-state="1" ') : h.srcChip('draft') + '<span style="font-size:12px;color:var(--v-text-tertiary)">从办过的活动写的</span>'));
      return h.webShell({ title: 'Vibers Shanghai', sub: '主办方设置', tabs: ['主办方', '成员与权限', '主页预览'], tab: '主办方', actions: '<button type="button" class="ce2-btn-outline" data-go="A01">保存并创建活动</button><button type="button" class="al-btn al-btn--ghost" data-go="A01">先创建活动</button>', body: body });
    }
  });

  // ========== 01 AI 对话 · 独立页面 ==========
  // ---------- X00 够不够：直接生成，还是先聊 ----------
  var GATES = [["起名、介绍、详情", "看得出这场具体聊什么或做什么", "直接起草；缺时间、地点就写待定", "看不出主题 → 先问「这场想聊什么？」"], ["主办方介绍", "已有相关活动记录或创建人的经历", "从已有资料起草，不编历史与成绩", "资料不足 → 先问「你想为谁办活动？」"], ["润色已有文字", "字段里已经有文字", "直接润色，先预览再确认", "字段为空 → 按起草流程判断"], ["海报", "名称、日期、公开地点已确认；线上活动有线上标记", "先核对，再生成海报", "缺事实 → 回表单补，不让 AI 猜"], ["其他动作", "解析有输入；标签和嘉宾推荐有相关主题；问数据有可用记录", "按各动作范围处理", "没有输入先输入；没有候选或记录就说明缺少什么"]];
  R({
    id: 'X00', stage: 'chat', title: '直接起草还是先聊：看信息与下一步', where: '活动 AI 对话内：决定直接整理还是先问缺少的信息', surface: 'wide', flag: 'P0',
    states: ['怎么判断 · 看信息与下一步', '够了 · 直接生成', '不够 · 先聊，不乱生成'],
    stateNotes: ['先看三种处理方式，再用两组例子理解主题是否清楚；各动作只列已有信息和下一步。', '已有文字明确说出 AI 产品冷启动主题，直接出三个名字；不要求凑够字数。', '只有时间和活动形式，还不知道具体主题；先问主题，日期地点不重复问。'],
    notes: [["核心标准", "看现有信息能否支撑当前动作。写活动文案需要清楚的主题；做海报需要确认的事实。没有一条通用的「缺了就进对话」规则。"], ["什么叫主题清楚", "能用一句话说出这场聊什么或做什么。「聊 AI 产品如何找到第一批用户」清楚；「周六聚会」「Vol.8」只有时间或期数。短但明确也可以，写得长不代表清楚。"], ["缺信息怎么接", "缺主题或主办方定位，问一个具体问题；缺日期、地点等事实，留待定或请用户填。草稿可待定，海报和发布必须核对必要事实。"], ["实现备注", "字数与泛词只用于内部初筛，不能独立决定主题是否清楚。服务端结合当前动作、相关文字与来源判断；不清楚时说明缺什么。"], ["确认边界", "起草、润色后展示结果，确认后才用于活动信息；发布和发送仍由人执行。"], ["层级 · 优先级", "范围层。<code>P0</code>，活动 AI 内部共用；不会拦在入口前。"]],
    render: function (s, h) {
      if (s === 0) {
        var choices = h.panel('先看下一步', '按缺少的信息处理，不需要记字数或公式。',
          '<div class="al-facts"><div class="al-fact"><span class="k">直接起草</span><span class="v">已经知道具体主题，或已有可润色的文字。</span></div><div class="al-fact"><span class="k">先聊一句</span><span class="v">还不知道聊什么、做什么，或主办方想为谁办活动。</span></div><div class="al-fact"><span class="k">补真实信息</span><span class="v">缺日期、地点等事实。文案可写待定，海报与发布前要补齐。</span></div></div>');
        var examples = h.panel('什么算「主题清楚」？', '能说出具体内容就可以；短也可以，长也不一定够。',
          '<div class="al-facts"><div class="al-fact"><span class="k">可以直接写</span><span class="v">「聊 AI 产品怎么找到第一批用户」<br>已知道内容：AI 产品的冷启动。时间地点还未确定也能先写草稿。</span></div><div class="al-fact"><span class="k">先问主题</span><span class="v">「周六聚会」「产品夜聊 Vol.8」<br>只知道时间、形式或期数，还不知道这一场具体聊什么。</span></div></div>');
        var table = h.panel('不同动作，怎么接下一步', '缺主题才追问主题；缺事实回到表单补。', '<div class="al-facts">' + GATES.map(function (g) {
          return '<div class="al-fact"><span class="k">' + g[0] + '</span><span class="v"><strong>已有信息：</strong>' + g[1] + '<br><strong>有了以后：</strong>' + g[2] + '<br><strong>信息不足：</strong>' + g[3] + '</span></div>';
        }).join('') + '</div>');
        return h.webShell({ tabs: [], title: '直接起草，还是先聊？', sub: '看现有信息能否支撑这一步', actions: '', body: choices + examples + table });
      }
      var enough = s === 1;
      var title = '<div class="ce2-create-title ce2-create-title--empty">活动名称</div><div style="margin-top:6px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">' + h.aiBtn('帮我起名', { inline: true }) +
        (enough ? '<span style="font-size:12px;color:var(--v-text-tertiary)">' + h.ICON.check.replace('width="16" height="16"', 'width="12" height="12" style="color:var(--v-status-approved-text);vertical-align:-2px"') + ' 已经知道要聊 AI 产品冷启动 · 直接出候选</span>' : '<span style="font-size:12px;color:var(--v-text-tertiary)">还不知道这场聊什么 · 点了先问你两个问题，不会硬编</span>') + '</div>' +
        (enough ? '<div class="ce2-tag-chips" style="margin-top:10px">' + h.suggest('产品夜聊 Vol.8 · 第一批用户') + h.suggest('找到前 100 个用户') + h.suggest('AI 产品冷启动夜聊') + '</div>' : '');
      var about = enough ? '<div class="ce2-create-about">聊 AI 产品怎么找到第一批用户，带着正在做的东西来。</div>' : '<div class="ce2-create-about ce2-create-about--empty">一句话说清楚这是场什么活动，可以先空着</div>';
      var gate = h.panel('为什么走这一步', '', '<div class="al-facts"><div class="al-fact"><span class="k">已经知道</span><span class="v">' + (enough ? '主题：AI 产品如何找到第一批用户。' : '日期、时间和地点；还没有具体主题。') + '</span></div><div class="al-fact"><span class="k">下一步</span><span class="v">' + (enough ? '直接起三个名字，选一个才写入。' : '先问「这场想聊什么？」；已经填过的事实不重复问。') + '</span></div></div>');
      var body = '<div class="ce2-create"><div class="ce2-create-cover-col"><div class="ce2-cover" style="height:225px;border-radius:20px"><div class="ce2-cover-fallback"><div class="ce2-cover-fallback-glow"></div><div class="ce2-cover-fallback-mark">' + h.ICON.img + '</div></div><span class="ce2-cover-badge">默认封面</span></div>' + gate + '</div>' +
        '<div class="ce2-create-form-col">' + title + about + '<div class="ce2-create-block"><div class="ce2-create-row"><span class="ce2-create-row-icon">' + h.ICON.cal + '</span><div>10 月 8 日 周四</div></div><div class="ce2-create-row"><span class="ce2-create-row-icon">' + h.ICON.clock + '</span><div>19:30–21:30</div></div><div class="ce2-create-row"><span class="ce2-create-row-icon">' + h.ICON.pin + '</span><div>深圳南山 · 科兴科学园</div></div></div>' +
        (enough ? '' : '<div class="al-ask" style="margin-top:22px"><span class="al-ask-icon">' + h.SPARK + '</span><div class="al-ask-bubble">先问一句：这期想聊什么？<div class="al-ask-sub">进独立对话页 · 已知道的会先列出来 · 最多 4 个问题 · 答完确认活动名称和一句话介绍</div><div class="al-chat-quick">' + h.fchip('继续 →') + h.fchip('算了，我自己写') + '</div></div></div>') + '</div></div>';
      return h.webShell({ status: 'draft', title: '新活动', sub: 'Vibers Shanghai · 草稿', tabs: [], actions: '<button type="button" class="ce2-btn-outline">存草稿</button>', body: body });
    }
  });

  // ---------- X01 活动 AI 对话页（独立页面） ----------
  var KNOWN_NAME = [['日期 10 月 8 日周四 19:30，深圳南山，免费', '表单'], ['你办过 7 期产品夜聊，上一期聊「定价」', '往期活动'], ['你的名片「此刻」写着「在给定价工具找前 50 个付费用户」', '个人名片'], ['标签常用「创业」「AI」', '往期活动']];
  R({
    id: 'X01', stage: 'chat', title: '活动 AI：创建与管理都在同一处', where: '独立路由 /host/chat?host=…&from=…（event 可省略） · 从各字段的 AI 按钮进来，也能从工作台直接进', surface: 'wide', flag: 'P0',
    states: ['空会话 · 快捷入口', '从「帮我起名」进来：先列已知，问第 1 个', '信息已整理 · 请确认', '内容定了：推荐嘉宾和场地', '创建活动 · 输入想法或公告', '语音 · 确认识别的文字', '海报 · 查看识别的信息', '修改活动 · 确认具体改动', '通知 · 确认内容与收件人', '还没想法 · 从个人资料找灵感', '资料较少 · 先聊一句', '选中试玩小聚 · 继续完善', '选中经验夜聊 · 继续完善', '选中共创下午 · 继续完善'],
    stateNotes: ['独立页面，三栏：左边按活动分的会话列表，中间对话，右边「已知道的」和「请确认以下信息」。从工作台直接进来是空会话，给这场活动的快捷入口。', '从字段进来时不是空会话：AI 先列它已经知道的（每条带来源），然后一次只问一个问题，问题从名片「此刻」「经历」里来。', '右侧「请确认以下信息」实时更新。答够了出主题、一句话介绍、3 个标题，确认后用于活动草稿，并返回编辑页。', '内容定了之后接着推荐嘉宾（来过的人 / 关注的人 / 站内资料 / LinkedIn）和场地（用过的 / 同类活动常用），每条带理由，勾选加入。'],
    notes: [
      ['独立页面', '<b>一个独立路由</b>，不是弹窗、不是侧栏。所有和活动有关的 AI 对话都在这一页：创建 / 修改活动 / 起名 / 起草 / 语音和海报整理、问数据（X02）、推荐嘉宾和场地、品牌介绍（A00）、写通知。创建前可以没有活动 ID，先带主办方资料与草稿；确认或退出都返回原来的编辑位置。会话按活动分组，切活动就切上下文。'],
      ['三栏', '<b>左</b>：会话列表，按「这场 / 其他活动」分组，+ 新对话。<b>中</b>：对话，顶部显示当前活动 和「从哪进来」。<b>右</b>：「已知道的」（每条带来源）和「请确认以下信息」（哪个字段、建议内容、确认按钮）。'],
      ['进来的方式', '① 从创建页或字段的 AI 按钮直接进入，带 from 参数，会话预填已知和第一个问题；② 从数据 tab 进（D02）；③ 从工作台页头「问 AI」进，空会话。返回键回到来的地方。'],
      ['开场规矩', '第一句先列已知道的，每条带来源（表单 / 主办方资料 / 个人名片 / 往期活动 / 报名数据）。用户不用重复说，也知道 AI 没瞎猜。'],
      ['提问规矩', '一次只问一个问题；信息足够就展示结果，继续管理时可接着聊。每个问题给 2–3 个可点的选项，也能自己写。用户说「就这样」停止追问，展示待确认的信息；确认后用于活动信息。'],
      ['整理出的内容', '主题、一句话介绍、3 个标题候选；内容定了再加：嘉宾候选（≤ 3，带理由和话题）、场地候选（≤ 3）。全部勾选加入，不自动写入。'],
      ['边界', '围绕当前活动与主办方提供帮助。问题超出范围时，说明能帮助什么，例如「我可以帮你完善这场活动，想先改哪部分？」。'],
      ['层级 · 优先级', '结构层。<code>P0</code>']
    ],
    render: function (s, h) {
      if (s === 4 || s >= 9) {
        var ideas = [
          ['产品试玩小聚', '邀请几位潜在用户试玩你的产品，听听真实反馈。', '你在个人资料里提到：正在找第一批用户。'],
          ['冷启动经验夜聊', '找正在做产品的人，交流第一批用户从哪里来。', '你正在做独立产品，也希望认识同行。'],
          ['周末共创下午', '大家带自己的项目来，一起解决一个具体问题。', '你的经历里有独立开发，也提到喜欢和人一起做东西。']
        ];
        var body, ctx;
        if (s === 10) {
          body = aiSay(h, '还没想法也没关系。最近有什么事，你想找人一起聊聊或做做？', '<div class="al-chat-quick"><button type="button" class="al-btn al-btn--sm" data-go="X01" data-go-state="11">想交流正在做的项目</button><button type="button" class="al-btn al-btn--sm">想认识兴趣相近的人</button><button type="button" class="al-btn al-btn--sm">想找人一起做件事</button></div>');
          ctx = known(h, [['你的个人资料还没有填写经历或兴趣', '个人资料']]) + outPanel(h, [['活动方向', '先聊聊你最近关心的事', true]]);
        } else if (s >= 11) {
          var selected = ideas[s - 11];
          body = userSay('我想办一场' + selected[0]) + aiSay(h, selected[1] + '你更想邀请潜在用户，还是一起做产品的同行？', '<div class="al-chat-quick"><button type="button" class="al-btn al-btn--sm">潜在用户</button><button type="button" class="al-btn al-btn--sm">做产品的同行</button><button type="button" class="al-btn al-btn--sm">两种人都想邀请</button></div>');
          ctx = outPanel(h, [['你选的方向', selected[0]], ['活动介绍 · 可继续修改', selected[1]], ['接下来聊', '想邀请谁；时间地点可以稍后再定', true]]);
        } else {
          body = aiSay(h, '还没想好办什么？我看了你填写的个人资料，想到几个可以试试的方向。选一个聊聊，也可以直接说自己的想法。') + ideas.map(function (idea, i) {
            return h.panel(idea[0], idea[1], '<p class="ce2-panel-sub">为什么想到这个：' + idea[2] + '</p><button type="button" class="al-btn al-btn--sm" data-go="X01" data-go-state="' + (11 + i) + '">聊聊这个想法</button>');
          }).join('') + '<div class="al-chat-quick"><button type="button" class="al-btn al-btn--ghost al-btn--sm" data-go="X01" data-go-state="10">换个方向</button><button type="button" class="al-btn al-btn--ghost al-btn--sm" data-go="X01" data-go-state="10">我想自己说</button></div>';
          ctx = known(h, [['经历：独立开发者', '个人资料 · 经历'], ['此刻：正在给自己的产品找第一批用户', '个人资料 · 此刻'], ['兴趣：认识同行，一起做东西', '个人资料 · 兴趣']]) + outPanel(h, [['活动还未创建', '先选一个方向聊聊，确定内容后再创建草稿。', true]]);
        }
        return chatShell(h, {convs:[['新活动', [['一起想个活动', true]]]],about:'新活动 · 找找灵感',from: s === 10 ? '还不了解你的经历与兴趣' : s >= 11 ? '从一个想法开始' : '根据你填写的个人资料提供灵感',back:'返回活动编辑',body:body,ctx:ctx,placeholder:'说说你的想法，也可以粘贴公告或上传海报'});
      }

      if (s >= 4) {
        var examples = [
          ['新活动 · 尚未创建', '从创建页「AI 起草」进入', '说说你想办什么活动，也可以粘贴群公告、用语音描述，或上传海报。我会把活动信息整理给你确认。', '', [['活动名称', '等待你的描述', true], ['时间与地点', '没有确定也可以先聊', true]]],
          ['新活动 · 草稿', '语音描述活动', '你说的是：「下周四晚上七点半，在深圳南山办产品夜聊，聊 AI 产品怎么找到第一批用户。」你可以先修改这段文字，再让我整理活动信息。', '下周四晚上七点半，在深圳南山办产品夜聊，聊 AI 产品怎么找到第一批用户。', [['活动主题', 'AI 产品找到第一批用户'], ['开始时间', '10 月 8 日 19:30'], ['地点', '深圳南山，具体地点待定']]],
          ['新活动 · 草稿', '上传海报：产品夜聊.jpg', '我从海报中找到了以下信息。海报没有写结束时间，请补充或先保留待定。具体门牌号只给报名成功的人看。', '产品夜聊.jpg · 海报已上传', [['活动名称', '产品夜聊 · 第一批用户'], ['日期', '10 月 8 日'], ['开始时间', '19:30'], ['结束时间', '待定', true], ['公开地点', '深圳南山 · 科兴科学园'], ['报名成功后可见', 'B 栋 2 楼 Hub 空间']]],
          ['产品夜聊 · 报名中', '继续管理当前活动', '你想把开始时间改为 20:00。以下会同时更新活动时间和详情中的时间。已有 27 人报名，我也可以帮你起草改期通知，通知需你确认发送。', '把开场改成晚上八点，并通知报名的人。', [['开始时间', '19:30 → 20:00'], ['详情', '将「19:30 开场」改为「20:00 开场」']]],
          ['产品夜聊 · 报名中', '起草活动通知', '通知已整理好，请核对内容和收件人。确认发送后，这 27 位报名成功的参与者会收到通知。', '告诉报名的人开场改到八点。', [['收件人', '27 位报名成功的参与者'], ['通知内容', '本场活动改为 20:00 开始，地点不变。详细地址见活动页。']]]
        ];
        var e=examples[s-4];
        var buttons=s===4 ? '' : '<button type="button" class="al-btn al-btn--primary al-btn--sm" data-go="' + (s===8 ? 'N01' : s===7 || s===5 ? 'X01' : 'A01') + '" data-go-state="' + (s===7 ? '8' : s===8 ? '0' : s===5 ? '2' : '1') + '">' + (s===8 ? '确认发送给这 27 人' : s===7 ? '确认修改，再查看通知' : s===5 ? '使用这段文字整理活动' : '确认使用已确定的信息') + '</button>';
        return chatShell(h,{convs: [[s <= 6 ? '新活动' : '产品夜聊 · 当前活动', [['创建与完善活动', s <= 6], ['修改活动信息', s === 7], ['通知参与者', s === 8]]], ['其他活动', [['创业者夜聊 Vol.7', false]]]],about:e[0],from:e[1],back:'返回活动编辑',body:(e[3]?userSay(e[3]):'')+aiSay(h,e[2]),ctx:outPanel(h,e[4],buttons),placeholder:'描述想法、粘贴群公告，或继续提出修改'});
      }

      if (s === 0) return chatShell(h, { on: '', from: '从工作台页头「问 AI」进来', body: '<div class="al-cp-empty"><span class="al-orb-mini" style="width:44px;height:44px;border-radius:14px">' + h.SPARK + '</span><h4>这场活动，要做什么</h4><p>可以帮你完善活动内容、起草通知，或了解报名与签到情况。</p><div class="al-cp-starts">' + [['创建新活动', '描述想法、粘贴公告或上传海报'], ['写活动详情', '按流程 / 适合谁 / 带什么'], ['推荐嘉宾和场地', '按主题从来过的人里找'], ['看这场的数据', '报名 · 签到 · 问卷 · 反馈'], ['写一条通知', '按阶段给草稿'], ['参与者会问什么', '活动页没回答的']].map(function (q) { return '<div class="al-cp-start">' + q[0] + '<small>' + q[1] + '</small></div>'; }).join('') + '</div></div>',
        ctx: known(h, KNOWN_NAME) + outPanel(h, [['还没有建议内容', '聊完后，这里会展示活动名称、介绍等信息，供你确认。', true]]) });
      var q1 = aiSay(h, '这期想聊的，是不是你自己正在卡的「找第一批付费用户」？', '先了解活动主题 · 点一个，或自己写<div class="al-chat-quick">' + h.fchip('对，就聊这个') + h.fchip('不是，聊别的') + h.fchip('聊冷启动，范围大一点') + '</div>');
      if (s === 1) return chatShell(h, { on: 'name', from: '从「活动名称 · 帮我起名」进来 · 还没有介绍', back: '返回活动编辑', body: known(h, KNOWN_NAME) + q1,
        ctx: outPanel(h, [['活动名称', '还未确定', true], ['一句话介绍', '还未确定', true]], '<button type="button" class="al-btn al-btn--sm" disabled>确认使用</button><button type="button" class="al-btn al-btn--ghost al-btn--sm">返回自行填写</button>') });
      if (s === 2) return chatShell(h, { on: 'name', from: '从「活动名称 · 帮我起名」进来', back: '返回活动编辑', body: known(h, KNOWN_NAME) + q1 + userSay('聊冷启动，范围大一点，不只是付费') +
          aiSay(h, '来的人是带着问题来问，还是带着做好的东西来讲？', '再了解活动形式<div class="al-chat-quick">' + h.fchip('带问题来问') + h.fchip('带东西来讲') + h.fchip('都有，先讲后问') + '</div>') + userSay('都有，先讲后问，三个人讲') +
          aiSay(h, '我们整理好了这场活动的方向：三位创业者分享找到第一批用户的过程，再一起讨论。请确认活动名称和介绍，有需要可以继续修改。', '<div class="al-chat-quick">' + '<button type="button" class="al-btn al-btn--primary al-btn--sm" data-go="A01" data-go-state="1">确认使用这些信息</button>' + h.fchip('继续完善信息') + h.fchip('推荐嘉宾和场地') + '</div>'),
        ctx: outPanel(h, [['主题', 'AI 产品的冷启动 · 先讲后问'], ['一句话介绍 ' + h.srcChip('draft'), '三位创业者讲怎么找到第一批用户，然后圆桌。带着正在做的东西来。'], ['活动名称 · 选一个', '<div style="display:flex;flex-direction:column;gap:6px;margin-top:6px">' + h.suggest('产品夜聊 Vol.8 · 第一批用户') + h.suggest('冷启动夜聊：前 100 个用户') + h.suggest('AI 产品怎么找到第一批人') + '</div>']], '<button type="button" class="al-btn al-btn--primary al-btn--sm" data-go="A01" data-go-state="1">确认使用这些信息</button><button type="button" class="al-btn al-btn--ghost al-btn--sm">修改这些信息</button>') });
      var recs = [['沈', '沈一', '内容设计 · 前字节', '上期聊定价时来过 · 名片「此刻」：在做 B 端产品冷启动', '可以讲：从 0 到 50 个付费用户的两个月'], ['韩', '韩露', '独立开发者', '来过 3 场 · 作品里有一个刚上线的工具', '可以讲：只在群里发的坑'], ['L', 'Lin Zhao', 'Growth · 前 Notion China', 'LinkedIn · 你的一度联系人 · 做过 3 个产品的冷启动', '可以讲：第一批用户从哪来']];
      var venues = [['科兴科学园 Hub 空间', '你上 2 期用过 · 30 人 · 免费', true], ['南山 · 湾区书店二楼', '同类活动常用 · 40 人 · 需预约', false], ['深圳湾 · 创业广场路演厅', '同类活动常用 · 80 人 · 收费', false]];
      return chatShell(h, { on: 'guest', from: '接着上一段 · 内容已定', back: '返回活动编辑', placeholder: '还想找别的方向的嘉宾？说一句',
        body: userSay('推荐嘉宾和场地') + aiSay(h, '按「AI 产品的冷启动」找了 3 位嘉宾候选和 3 个场地。理由都来自对方资料和你的记录，勾了才加入。', '嘉宾候选 · 来过的人 / 关注的人 / 站内资料 / LinkedIn') +
          '<div class="jd-people">' + recs.map(function (r) { return '<div class="jd-person" style="align-items:flex-start"><input type="checkbox" class="fr-app-check" style="margin:8px 0 0"><span class="jd-person-av">' + r[0] + '</span><div style="flex:1;min-width:0"><div class="jd-person-name">' + r[1] + ' <span style="font-weight:400;color:var(--v-text-tertiary)">· ' + r[2] + '</span></div><div class="jd-person-sub">理由：' + r[3] + '</div><div style="margin-top:3px;font-size:12.5px;color:var(--v-text-primary)">' + r[4] + '</div></div></div>'; }).join('') + '</div>' +
          aiSay(h, '场地候选 · 你用过的 / 同类活动常用的') + '<div class="jd-people">' + venues.map(function (v) { return '<div class="jd-person"><input type="checkbox" class="fr-app-check" style="margin:0"' + (v[2] ? ' checked' : '') + '><span class="jd-person-av">' + h.ICON.pin + '</span><div><div class="jd-person-name">' + v[0] + '</div><div class="jd-person-sub">' + v[1] + '</div></div></div>'; }).join('') + '</div>',
        ctx: outPanel(h, [['活动名称', '冷启动夜聊：前 100 个用户'], ['一句话介绍', '三位创业者讲怎么找到第一批用户，然后圆桌。'], ['嘉宾名单', '勾选的人会进「待邀请」', true], ['公开地址', '深圳南山 · 科兴科学园']], '<button type="button" class="al-btn al-btn--primary al-btn--sm" data-go="A01" data-go-state="1">确认使用这些信息</button><button type="button" class="al-btn al-btn--ghost al-btn--sm">修改这些信息</button>') });
    }
  });

  // ---------- X02 数据对话：问一句，答数字 / 名单 / 图 / 事实句 ----------
  function bars(h, data, onIdx) {
    var max = Math.max.apply(null, data.map(function (d) { return d[1]; }));
    return '<div class="al-bars">' + data.map(function (d, i) { return '<div class="al-bar' + (i === onIdx ? ' al-bar--on' : '') + '"><b>' + d[1] + '</b><i style="height:' + Math.round(d[1] / max * 50) + 'px"></i><span>' + d[0] + '</span></div>'; }).join('') + '</div>';
  }
  var DATA_CTX = [['报名 38 · 通过 27 · 拒绝 3 · 候补 8', '报名记录'], ['签到 24 / 27，最早 18:48', '签到记录'], ['问卷 2 题 · 27 份', '问卷'], ['反馈 12 条 · 已参与 9', '反馈']];
  R({
    id: 'X02', stage: 'chat', title: '问数据：同一页对话，答数字、名单、图、事实句', where: '活动 AI 对话页 · 从「数据」tab 或工作台进来', surface: 'wide', flag: 'P2',
    states: ['「做设计的来了几个」', '「哪个时段签到最多」', '「没到的人有什么共同点」'],
    stateNotes: ['答一个数字 + 名单，右侧能导出。不显示筛选条件，只在回答里说清楚算的是什么。', '答一张小图。数据来自签到记录。', '只答报名字段上的事实：审核方式、报名时间、来源。不评价人，人少就说人少。'],
    notes: [
      ['放哪', '就是 X01 那一页，会话上下文换成这场的数据。从「数据」tab 的「问 AI」或工作台进来。'],
      ['数据范围', '<b>只有这一场</b>：报名记录（来源、时间、状态）、签到记录（时间）、问卷回答、反馈、通知发送记录。右侧「已知道的」列出来。不跨活动；跨活动的问题答「这里只看这一场，跨场去后台活动列表」。'],
      ['怎么答', '数字 + 一句话说清算的是什么（「标签有设计且已签到」）+ 名单或图。不出筛选器、不出条件 chip。追问直接接着问（「其中来过 2 次以上的呢」）。'],
      ['规矩', '不给人打分、不排序人、不预测。「没到的人有什么共同点」只答报名字段上的事实，不答「不够积极」这类判断。答不了的说「这场数据里没有」。'],
      ['导出', '问出来的名单右侧可以导出 CSV，进管理记录。'],
      ['层级 · 优先级', '结构层。<code>P2</code> · 办到第 5 场以上、人多了才会想问；前面几场四块数字够用。']
    ],
    render: function (s, h) {
      var q = ['做设计的来了几个', '哪个时段签到最多', '没到的人有什么共同点'][s];
      var ans;
      if (s === 0) ans = aiSay(h, '<b>7 人</b>。算的是标签有「设计」并且已签到的，占到场的 29%。<div class="jd-people">' + [['许', '许知夏', '设计 · 独立开发 · 19:02 到'], ['张', '张雨', '设计 · 19:40 到'], ['沈', '沈一', '设计 · 定价 · 19:12 到']].map(function (p) { return '<div class="jd-person"><span class="jd-person-av">' + p[0] + '</span><div><div class="jd-person-name">' + p[1] + '</div><div class="jd-person-sub">' + p[2] + '</div></div></div>'; }).join('') + '<div class="jd-person" style="font-size:12px;color:var(--v-text-tertiary)">还有 4 人 · 右侧可导出</div></div>', '<div class="al-chat-quick">' + h.fchip('其中来过 2 次以上的呢') + h.fchip('报名了没来的设计师') + '</div>');
      else if (s === 1) ans = aiSay(h, '<b>19:00–19:15</b> 到得最多，9 人。开场后 30 分钟内到了 20 / 24。' + bars(h, [['18:45', 2], ['19:00', 9], ['19:15', 6], ['19:30', 3], ['19:45', 2], ['20:00+', 2]], 1), '按 15 分钟分 · 来自签到记录<div class="al-chat-quick">' + h.fchip('上一期也是这样吗') + h.fchip('19:45 之后到的是谁') + '</div>');
      else ans = aiSay(h, '报名成功但没签到的 3 人，报名字段上的共同点：<div class="al-summary" style="margin-top:10px;padding:10px 12px"><div class="al-summary-item" style="margin-top:0"><span>都是<b style="display:inline">开场前 2 小时内</b>报名的（其他人平均提前 3 天）</span></div><div class="al-summary-item"><span>都<b style="display:inline">没填问卷第二题</b></span></div><div class="al-summary-item"><span>来源：2 人来自分享链接，1 人来自发现页</span></div></div>', '只有 3 人，别当规律 · 不评价人 · 跨场的去后台活动列表<div class="al-chat-quick">' + h.fchip('下一场想提醒这类人，怎么做') + '</div>');
      return chatShell(h, { on: 'data', about: '创业者夜聊 Vol.7 · 已结束', from: '从「数据」tab 进来', back: '返回数据 tab', placeholder: '接着问，或换一个问题',
        body: userSay(q) + ans,
        ctx: known(h, DATA_CTX) + outPanel(h, s === 0 ? [['导出', '这 7 人的名单 CSV'], ['记录', '导出会进管理记录', true]] : s === 1 ? [['导出', '按 15 分钟的签到分布 CSV']] : [['导出', '这 3 人的名单 CSV']], '<button type="button" class="al-btn al-btn--sm">导出 CSV</button>') });
    }
  });
})();
