/* AI 辅助原型 · 04 活动中（C01–C02）· 05 活动后 · 反馈与数据（D01–D03）· 06 AI 对话（X00–X02）· 全部网页端 */
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
    var head = '<div class="al-cp-head"><span class="al-cp-about">' + h.ICON.cal.replace('width="16" height="16"', 'width="13" height="13"') + h.esc(o.about || '创业者夜聊 Vol.7 · 草稿') + '</span><span class="al-cp-from">' + h.esc(o.from || '') + '</span><button type="button" class="al-btn al-btn--sm" style="margin-left:auto">' + h.esc(o.back || '返回工作台') + '</button></div>';
    var foot = '<div class="al-cp-foot"><div class="al-chat-input">' + h.esc(o.placeholder || '问这场活动的任何事，或直接说要做什么') + '<button type="button" class="send">发送</button></div><div style="margin-top:8px;font-size:11.5px;color:var(--v-text-tertiary)">只回答和这场活动、你的主办方有关的事 · 产出要你点「回填」才写进表单</div></div>';
    var ctx = '<aside class="al-cp-ctx">' + (o.ctx || '') + '</aside>';
    return '<div class="al-chatpage">' + side + '<main class="al-cp-main">' + head + '<div class="al-cp-body">' + (o.body || '') + '</div>' + foot + '</main>' + ctx + '</div>';
  }
  function aiSay(h, html, sub) { return '<div class="al-ask" style="margin-top:0"><span class="al-ask-icon">' + h.SPARK + '</span><div class="al-ask-bubble">' + html + (sub ? '<div class="al-ask-sub">' + sub + '</div>' : '') + '</div></div>'; }
  function userSay(html) { return '<div class="al-user-bubble" style="margin-top:0">' + html + '</div>'; }
  function known(h, items) { return '<div class="al-chat-known">' + h.SPARK + ' <b>已经知道的</b><div style="margin-top:6px">' + items.map(function (i) { return '<div style="margin-top:4px">' + i[0] + '<span class="src">' + i[1] + '</span></div>'; }).join('') + '</div></div>'; }
  function outPanel(h, items, foot) { return '<div class="al-out"><div class="al-out-h">会回填到</div>' + items.map(function (i) { return '<div class="al-out-item"><div class="al-out-k">' + i[0] + '</div><div class="al-out-v' + (i[2] ? ' al-out-v--empty' : '') + '">' + i[1] + '</div></div>'; }).join('') + '<div class="al-out-foot">' + (foot || '') + '</div></div>'; }

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
    id: 'D01', stage: 'after', title: '反馈汇总', where: 'pub-c-editor · 「反馈」tab 顶部', surface: 'web', flag: 'P0',
    states: ['少于 5 条', '汇总块'],
    stateNotes: ['少于 5 条不出汇总，直接读原文更快。', '「反复提到的」最多 3 条，每条条数 + 一句原文引用。标「AI 整理」。不算分，不做跳转。'],
    notes: [
      ['放哪', '「反馈」tab 顶部（活动反馈方案：只有文字、无评分、仅主办方可见）。'],
      ['交互', '反馈 ≥ 5 条时出现一个可折叠块「反复提到的」：最多 3 条，每条「场地难找 · 3 条」+ 一句原文引用。只是汇总，下面原文列表照常。想追问「场地难找具体指什么」，进 X02 数据对话。'],
      ['不做', '不算情绪分、不算平均分、不排「最有价值反馈」、不做点条数跳转。反馈方案里明确不打分，汇总也不能变相打分。'],
      ['层级 · 优先级', '结构层。<code>P0</code>']
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
    id: 'D02', stage: 'after', title: '数据 tab：四块固定，想问什么进对话', where: 'pub-c-editor · 「数据」tab', surface: 'web', flag: 'P1',
    states: ['数据 tab · 入口', '点了「问 AI」· 进对话页'],
    stateNotes: ['tab 上只有这场的四块固定数据和一个「问 AI」按钮。不做筛选器，不做条件 chip。', '进独立的对话页（X02），会话自动带上这场的数据范围。问法见 X02。'],
    notes: [
      ['放哪', '结束态工作台多一个「数据」tab。四块固定：报名、签到、问卷、反馈。'],
      ['为什么不做筛选器', '主办方要的不是筛选器，是答案。问一句比拼条件快。所以这里只留入口，分析全部在对话页（X02）做。'],
      ['数据范围', '只有这一场：报名记录（来源、时间、状态）、签到记录、问卷回答、反馈、通知发送记录。进对话时作为上下文带过去，右侧看得见。'],
      ['层级 · 优先级', '结构层。<code>P1</code>']
    ],
    render: function (s, h) {
      if (s === 1) return chatShell(h, { on: 'data', about: '创业者夜聊 Vol.7 · 已结束', from: '从「数据」tab 进来', body: '<div class="al-cp-empty"><span class="al-orb-mini" style="width:44px;height:44px;border-radius:14px">' + h.SPARK + '</span><h4>问这场的数据</h4><p>报名 38 · 签到 24 · 问卷 27 份 · 反馈 12 条 · 只有这一场</p><div class="al-cp-starts">' + [['做设计的来了几个', '标签 + 签到'], ['哪个时段签到最多', '签到时间分布'], ['没到的人有什么共同点', '只答报名字段上的事实'], ['反馈里「场地难找」具体指什么', '反馈原文']].map(function (q) { return '<div class="al-cp-start">' + q[0] + '<small>' + q[1] + '</small></div>'; }).join('') + '</div></div>',
        ctx: known(h, [['报名 38 · 通过 27 · 拒绝 3 · 候补 8', '报名记录'], ['签到 24 / 27，最早 18:48', '签到记录'], ['问卷 2 题 · 27 份', '问卷'], ['反馈 12 条 · 已参与 9', '反馈']]) + outPanel(h, [['导出', '问出来的名单可以直接导出', true]]), placeholder: '问这场的数据，例「做设计的来了几个」' });
      var blocks = '<div class="ce2-quick" style="grid-template-columns:repeat(4,1fr);margin-top:18px">' + [['报名', '38 报名 · 27 通过 · 3 拒绝'], ['签到', '24 / 27 · 89%'], ['问卷', '2 题 · 27 份'], ['反馈', '12 条 · 见反馈 tab']].map(function (b) { return '<div class="ce2-quick-card" style="flex-direction:column;align-items:flex-start;gap:4px"><div class="ce2-quick-label">' + b[0] + '</div><div class="ce2-quick-sub">' + b[1] + '</div></div>'; }).join('') + '</div>';
      var cta = '<div class="ce2-pub-hero" style="margin-top:18px"><span class="ce2-pub-hero-icon" style="background:color-mix(in srgb, var(--v-brand-signal) 10%, transparent);color:var(--v-signal-text)">' + h.SPARK + '</span><div><div class="ce2-pub-hero-title">想知道什么，直接问</div><div class="ce2-pub-hero-sub">例「做设计的来了几个」「哪个时段签到最多」· 只看这一场的数据</div></div><button type="button" class="al-btn al-btn--primary" style="margin-left:auto">' + h.SPARK + '问 AI</button></div>';
      return h.webShell({ tab: '数据', status: 'ended', tabs: ENDED_TABS, body: '<h3 class="ce2-panel-h3">数据</h3><p class="ce2-panel-sub">只有这一场的数据。四块固定，别的进对话问。</p>' + blocks + cta + '<div style="margin-top:22px;display:flex;gap:10px"><button type="button" class="al-btn">导出报名名单 CSV</button><button type="button" class="al-btn">导出反馈 CSV</button></div>' });
    }
  });

  // ---------- D03 主办方介绍：AI 起草，资料不够进对话 ----------
  R({
    id: 'D03', stage: 'after', title: '主办方介绍：AI 起草，资料不够就追问', where: 'pub-a-host-identity · 「品牌介绍」', surface: 'web', flag: 'P2',
    states: ['字段为空 · 一个按钮', '已起草', '资料不够 · 同一个按钮进对话页'],
    stateNotes: ['只有「AI 起草」一个按钮，不另设「问问 AI」。', '办过活动的主办方：从办过的活动、常用标签、到场总数写 3 句。', '刚创建、还没办过活动的主办方：点同一个「AI 起草」进独立对话页，AI 先列已知的（创建人名片），再问 2 个问题（给谁办、想让人记住什么），答完回填。'],
    notes: [
      ['放哪', 'pub-a-host-identity / pub-k 的「品牌介绍」字段。'],
      ['起草依据', '办过的活动（名称、标签、到场数）、主办方一句话头衔、创建人的个人名片（经历、此刻）。'],
      ['资料不够时', '同一个「AI 起草」按钮进独立对话页（X01 同一页）：AI 先说已知道的，再一次问一个问题，最多 3 个，答完产出 3 句介绍回填字段。够不够按 X00：≥ 1 场活动，或创建人名片有经历。'],
      ['层级 · 优先级', '表现层。<code>P2</code>']
    ],
    render: function (s, h) {
      if (s === 2) {
        return chatShell(h, { on: 'brand', about: '慢读俱乐部 · 主办方设置', from: '从「品牌介绍」的 AI 起草进来 · 还没办过活动', back: '返回设置', placeholder: '说一句，或点上面的',
          body: known(h, [['主办方「慢读俱乐部」，创建于昨天，还没办过活动', '主办方资料'], ['创建人名片：「前编辑，2024 年起组织线下读书会」', '个人名片'], ['一句话头衔「每月一本，慢慢读」', '主办方资料']]) +
            aiSay(h, '这些读书会主要是办给谁的？', '问题 1 / 3 · 点一个，或自己写<div class="al-chat-quick">' + h.fchip('平时没时间读完一本书的人') + h.fchip('想找人一起讨论的读者') + h.fchip('特定类型：城市 / 小说 / 非虚构') + '</div>') +
            userSay('想找人一起讨论的读者，一本书分四周读') +
            aiSay(h, '来过的人，你希望他们记住这个主办方的哪一点？', '问题 2 / 3<div class="al-chat-quick">' + h.fchip('每次都读完') + h.fchip('小场，每个人都能说话') + h.fchip('选书有品味') + '</div>'),
          ctx: outPanel(h, [['品牌介绍', '再答 1 题就能写', true], ['已确定', '给想一起讨论的读者办 · 一本书分四周']], '<button type="button" class="al-btn al-btn--sm" disabled>回填并返回</button><button type="button" class="al-btn al-btn--ghost al-btn--sm">不问了，直接写</button>') });
      }
      var body = h.panel('主办方', '出现在主办方主页顶部。',
        '<div style="margin-top:18px;display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:14px;border:1px solid var(--v-border-subtle);background:var(--v-bg-surface)"><span class="ce2-guest-avatar" style="border-radius:12px">V</span><div><div class="ce2-guest-name">Vibers Shanghai</div><div class="ce2-guest-meta">14 场活动 · 来过 214 人 · 创建于 2025 年 3 月</div></div></div>' +
        h.field('一句话头衔', h.input('上海的创业者和独立开发者线下局')) +
        h.field('品牌介绍', s === 0 ? h.textarea('', '写给参加过你活动的人') : h.textarea('从 2025 年起在上海办了 14 场线下活动：创业者夜聊、独立开发者 Demo Day、慢读会。来过 214 人，多数在做 AI 产品、独立开发或设计。每场 20 到 80 人，需审核，免费为主。'), s === 0 ? h.aiBtn('AI 起草') : h.srcChip('draft') + '<span style="font-size:12px;color:var(--v-text-tertiary)">从办过的活动写的</span>'));
      return h.webShell({ title: 'Vibers Shanghai', sub: '主办方设置', tabs: ['主办方', '成员与权限', '主页预览'], tab: '主办方', actions: '<button type="button" class="ce2-btn-outline">保存</button>', body: body });
    }
  });

  // ========== 06 AI 对话 · 独立页面 ==========
  // ---------- X00 够不够：直接生成，还是先聊 ----------
  var GATES = [
    ['帮我起名', '一句话介绍 ≥ 10 字，或详情 ≥ 30 字，或（标签 ≥ 1 且嘉宾 ≥ 1）', '名称本身不算，要起的就是它', '进对话，问主题', 'A08'],
    ['一句话介绍 · AI 起草', '名称有主题词（去掉「Vol.8 / 第 N 期 / 活动 / 聚会」后还剩 ≥ 4 字），或详情 ≥ 30 字', '日期、地点、嘉宾、标签', '进对话，问主题', 'A02'],
    ['活动详情 · AI 起草', '主题信号（名称或一句话介绍）+ 日期', '地点、嘉宾、标签、票价、审核。缺的写「（地点待定）」，不编', '进对话，问主题', 'A02'],
    ['AI 润色', '字段里有内容', '—', '不进对话，永远直接润色', 'A02'],
    ['品牌介绍 · AI 起草', '≥ 1 场已发布活动，或创建人名片有 ≥ 1 条经历', '常用标签、到场总数', '进对话，问给谁办、想让人记住什么', 'D03'],
    ['嘉宾推荐', '主题信号 + 标签 ≥ 1', '往期嘉宾、来过的人', '进对话，先定主题', 'B04 · X01'],
    ['海报生成', '名称 + 日期 + 公开地址（线上则会议标记）', '嘉宾、一句话介绍', '不进对话。核对页把缺的标红，让用户填', 'A05'],
    ['标签建议', '名称有主题词，或一句话介绍 ≥ 10 字', '往期标签、同类活动', '不进对话，也不出建议', 'A03'],
    ['起草条解析', '有任何输入', '—', '没解析出主题时，结果行给「去聊两句」', 'A01'],
    ['问数据', '活动已发布', '—', '直接进对话（X02），数据不够就说「这场数据里没有」', 'D02 · X02']
  ];
  R({
    id: 'X00', stage: 'chat', title: '够不够：直接生成，还是先聊', where: '所有「AI 起草 / 帮我起名」按钮点下去的第一步 · 服务端判定', surface: 'wide', flag: 'P0',
    states: ['判定标准表', '够了 · 直接生成', '不够 · 先聊，不乱生成'],
    stateNotes: ['每个 AI 动作一条硬门槛。缺就进对话，不硬生成。门槛是确定的规则，不是模型的感觉。', '例：活动名称空，但一句话介绍有 22 字 → 「帮我起名」直接出三个候选。', '例：名称和介绍都空 → 点同一个「帮我起名」，按钮下方一行说明为什么，然后进对话页。'],
    notes: [
      ['原则', '<b>信息够就直接生成，不够就不生成。</b>不够时跳到独立对话页，先把主题聊定，再回来生成。判断只看两件事：<b>主题定了没</b>、<b>事实字段齐不齐</b>。不看字数多少，不看写得好不好。'],
      ['主题信号（大多数门槛的核心）', '满足任一即算有主题：① 名称去掉序号和泛词（Vol.8、第 N 期、活动、聚会、局、夜聊）后还剩 ≥ 4 个字；② 一句话介绍 ≥ 10 字；③ 详情 ≥ 30 字；④ 复制自往期活动（沿用上期主题）。反例：「周六聚会」「Vol.8」「新活动」都不算。'],
      ['事实字段不拦生成', '日期、地点、票价、审核、人数缺了不进对话，因为它们要么有默认值，要么是事实。生成时缺的写占位「（时间待定）」，<b>绝不编一个出来</b>。'],
      ['怎么判', '第一层规则（长度 + 泛词表），毫秒级；第二层一次很小的模型调用，只回答「这段文字看得出活动主题吗」和「缺什么：主题 / 给谁 / 形式」。两层都过才直接生成。缺什么决定对话页第一个问题问什么。'],
      ['对用户怎么说', '进对话前按钮下方一行灰字说明，例「还不知道这场聊什么，先问你两个问题」。不弹窗，不报错。'],
      ['层级 · 优先级', '范围层。<code>P0</code>，所有 AI 起草类动作共用。']
    ],
    render: function (s, h) {
      if (s === 0) {
        var table = '<div class="al-facts" style="margin-top:18px"><div class="al-fact" style="background:var(--v-bg-surface)"><span class="k" style="width:150px;font-weight:500;color:var(--v-text-secondary)">动作</span><span class="v" style="flex:2;font-size:12px;color:var(--v-text-tertiary)">硬门槛 · 缺了就进对话</span><span class="v" style="flex:1.4;font-size:12px;color:var(--v-text-tertiary)">加分项 · 缺了也生成，写占位</span><span class="v" style="flex:1.3;font-size:12px;color:var(--v-text-tertiary)">不够时</span><span class="x">场景</span></div>' +
          GATES.map(function (g) { return '<div class="al-fact" style="align-items:flex-start;padding:12px 14px"><span class="k" style="width:150px;font-size:13px;color:var(--v-text-primary);font-weight:500">' + g[0] + '</span><span class="v" style="flex:2;line-height:19px">' + g[1] + '</span><span class="v" style="flex:1.4;line-height:19px;color:var(--v-text-secondary)">' + g[2] + '</span><span class="v" style="flex:1.3;line-height:19px;color:var(--v-text-secondary)">' + g[3] + '</span><span class="x">' + g[4] + '</span></div>'; }).join('') + '</div>' +
          '<div class="al-summary" style="margin-top:16px;padding:14px 16px"><div class="al-summary-head">主题信号 · 满足任一即算有</div><div class="al-summary-item"><b>①</b><span>名称去掉序号和泛词后还剩 ≥ 4 个字</span></div><div class="al-summary-item"><b>②</b><span>一句话介绍 ≥ 10 字</span></div><div class="al-summary-item"><b>③</b><span>详情 ≥ 30 字</span></div><div class="al-summary-item"><b>④</b><span>复制自往期活动</span></div><div style="margin-top:10px;font-size:12px;color:var(--v-text-tertiary)">泛词表：活动、聚会、局、夜聊、分享会、Vol.N、第 N 期、新活动 · 反例「周六聚会」「Vol.8」都不算有主题</div></div>';
        return h.webShell({ tabs: [], title: '够不够 · 判定标准', sub: '服务端固定规则 · 所有 AI 起草类动作共用', actions: '', body: '<h3 class="ce2-panel-h3">直接生成，还是先聊</h3><p class="ce2-panel-sub">每个动作一条硬门槛。够了直接生成；不够进对话页，聊定主题再生成。事实字段缺了不拦，写占位不编。</p>' + table });
      }
      var enough = s === 1;
      var title = '<div class="ce2-create-title ce2-create-title--empty">活动名称</div><div style="margin-top:6px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">' + h.aiBtn('帮我起名', { inline: true }) +
        (enough ? '<span style="font-size:12px;color:var(--v-text-tertiary)">' + h.ICON.check.replace('width="16" height="16"', 'width="12" height="12" style="color:var(--v-status-approved-text);vertical-align:-2px"') + ' 一句话介绍有 22 字，够了 · 直接出候选</span>' : '<span style="font-size:12px;color:var(--v-text-tertiary)">还不知道这场聊什么 · 点了先问你两个问题，不会硬编</span>') + '</div>' +
        (enough ? '<div class="ce2-tag-chips" style="margin-top:10px">' + h.suggest('产品夜聊 Vol.8 · 第一批用户') + h.suggest('找到前 100 个用户') + h.suggest('AI 产品冷启动夜聊') + '</div>' : '');
      var about = enough ? '<div class="ce2-create-about">聊 AI 产品怎么找到第一批用户，带着正在做的东西来。</div>' : '<div class="ce2-create-about ce2-create-about--empty">一句话说清楚这是场什么活动，可以先空着</div>';
      var gate = '<div class="al-summary" style="margin-top:20px;padding:12px 14px"><div class="al-summary-head">判定 · 帮我起名</div>' +
        '<div class="al-summary-item"><b style="color:' + (enough ? 'var(--v-status-approved-text)' : 'var(--v-status-rejected-text)') + '">' + (enough ? '过' : '缺') + '</b><span>一句话介绍 ≥ 10 字 · ' + (enough ? '22 字' : '空') + '</span></div>' +
        '<div class="al-summary-item"><b style="color:var(--v-status-rejected-text)">缺</b><span>详情 ≥ 30 字 · 空</span></div>' +
        '<div class="al-summary-item"><b style="color:var(--v-status-rejected-text)">缺</b><span>标签 ≥ 1 且嘉宾 ≥ 1 · 都空</span></div>' +
        '<div style="margin-top:10px;font-size:12px;color:var(--v-text-tertiary)">' + (enough ? '任一满足即可 → 直接生成三个候选' : '一个都不满足 → 进对话页，第一个问题问「主题」') + '</div></div>';
      var body = '<div class="ce2-create"><div class="ce2-create-cover-col"><div class="ce2-cover" style="height:225px;border-radius:20px"><div class="ce2-cover-fallback"><div class="ce2-cover-fallback-glow"></div><div class="ce2-cover-fallback-mark">' + h.ICON.img + '</div></div><span class="ce2-cover-badge">默认封面</span></div>' + gate + '</div>' +
        '<div class="ce2-create-form-col">' + title + about + '<div class="ce2-create-block"><div class="ce2-create-row"><span class="ce2-create-row-icon">' + h.ICON.cal + '</span><div>10 月 8 日 周四</div></div><div class="ce2-create-row"><span class="ce2-create-row-icon">' + h.ICON.clock + '</span><div>19:30–21:30</div></div><div class="ce2-create-row"><span class="ce2-create-row-icon">' + h.ICON.pin + '</span><div>深圳南山 · 科兴科学园</div></div></div>' +
        (enough ? '' : '<div class="al-ask" style="margin-top:22px"><span class="al-ask-icon">' + h.SPARK + '</span><div class="al-ask-bubble">先问一句：这期想聊什么？<div class="al-ask-sub">进独立对话页 · 已知道的会先列出来 · 最多 4 个问题 · 答完回填名称和一句话介绍</div><div class="al-chat-quick">' + h.fchip('继续 →') + h.fchip('算了，我自己写') + '</div></div></div>') + '</div></div>';
      return h.webShell({ status: 'draft', title: '新活动', sub: 'Vibers Shanghai · 草稿', tabs: [], actions: '<button type="button" class="ce2-btn-outline">存草稿</button>', body: body });
    }
  });

  // ---------- X01 活动 AI 对话页（独立页面） ----------
  var KNOWN_NAME = [['日期 10 月 8 日周四 19:30，深圳南山，免费', '表单'], ['你办过 7 期产品夜聊，上一期聊「定价」', '往期活动'], ['你的名片「此刻」写着「在给定价工具找前 50 个付费用户」', '个人名片'], ['标签常用「创业」「AI」', '往期活动']];
  R({
    id: 'X01', stage: 'chat', title: '活动 AI 对话页：独立页面，所有对话都在这', where: '独立路由 /host/chat?event=…&from=… · 从各字段的 AI 按钮进来，也能从工作台直接进', surface: 'wide', flag: 'P0',
    states: ['空会话 · 快捷入口', '从「帮我起名」进来：先列已知，问第 1 个', '答了两轮：产出回填', '内容定了：推荐嘉宾和场地'],
    stateNotes: ['独立页面，三栏：左边按活动分的会话列表，中间对话，右边「已知道的」和「会回填到」。从工作台直接进来是空会话，给这场活动的快捷入口。', '从字段进来时不是空会话：AI 先列它已经知道的（每条带来源），然后一次只问一个问题，问题从名片「此刻」「经历」里来。', '右侧「会回填到」实时更新。答够了出主题、一句话介绍、3 个标题，一键回填到表单再返回。', '内容定了之后接着推荐嘉宾（来过的人 / 关注的人 / 站内资料 / LinkedIn）和场地（用过的 / 同类活动常用），每条带理由，勾选加入。'],
    notes: [
      ['独立页面', '<b>一个独立路由</b>，不是弹窗、不是侧栏。所有和活动有关的 AI 对话都在这一页：起名 / 起草（信息不够时）、问数据（X02）、推荐嘉宾和场地、品牌介绍（D03）、写通知。会话按活动分组，切活动就切上下文。'],
      ['三栏', '<b>左</b>：会话列表，按「这场 / 其他活动」分组，+ 新对话。<b>中</b>：对话，顶部一个「关于：哪场活动」chip 和「从哪进来」。<b>右</b>：「已知道的」（每条带来源）和「会回填到」（哪个字段、当前产出、回填按钮）。'],
      ['进来的方式', '① 从字段的 AI 按钮进（X00 判定不够时），带 from 参数，会话预填已知和第一个问题；② 从数据 tab 进（D02）；③ 从工作台页头「问 AI」进，空会话。返回键回到来的地方。'],
      ['开场规矩', '第一句先列已知道的，每条带来源（表单 / 主办方资料 / 个人名片 / 往期活动 / 报名数据）。用户不用重复说，也知道 AI 没瞎猜。'],
      ['提问规矩', '一次只问一个问题，最多 4 个。每个问题给 2–3 个可点的选项，也能自己写。用户说「就这样」立刻回填并返回。'],
      ['产出', '主题、一句话介绍、3 个标题候选；内容定了再加：嘉宾候选（≤ 3，带理由和话题）、场地候选（≤ 3）。全部勾选加入，不自动写入。'],
      ['边界', '只回答和这场活动、这个主办方有关的事。问别的答「这里只聊活动的事」。不闲聊。'],
      ['层级 · 优先级', '结构层。<code>P0</code>']
    ],
    render: function (s, h) {
      if (s === 0) return chatShell(h, { on: '', from: '从工作台页头「问 AI」进来', body: '<div class="al-cp-empty"><span class="al-orb-mini" style="width:44px;height:44px;border-radius:14px">' + h.SPARK + '</span><h4>这场活动，要做什么</h4><p>只聊创业者夜聊 Vol.7 和 Vibers Shanghai 的事</p><div class="al-cp-starts">' + [['给这场起名', '先问主题，再出候选'], ['写活动详情', '按流程 / 适合谁 / 带什么'], ['推荐嘉宾和场地', '按主题从来过的人里找'], ['看这场的数据', '报名 · 签到 · 问卷 · 反馈'], ['写一条通知', '按阶段给草稿'], ['参与者会问什么', '活动页没回答的']].map(function (q) { return '<div class="al-cp-start">' + q[0] + '<small>' + q[1] + '</small></div>'; }).join('') + '</div></div>',
        ctx: known(h, KNOWN_NAME) + outPanel(h, [['还没有产出', '开始聊之后这里会显示会回填到哪个字段', true]]) });
      var q1 = aiSay(h, '这期想聊的，是不是你自己正在卡的「找第一批付费用户」？', '问题 1 / 最多 4 · 点一个，或自己写<div class="al-chat-quick">' + h.fchip('对，就聊这个') + h.fchip('不是，聊别的') + h.fchip('聊冷启动，范围大一点') + '</div>');
      if (s === 1) return chatShell(h, { on: 'name', from: '从「活动名称 · 帮我起名」进来 · 还没有介绍', back: '返回表单', body: known(h, KNOWN_NAME) + q1,
        ctx: outPanel(h, [['活动名称', '还没定', true], ['一句话介绍', '还没定', true]], '<button type="button" class="al-btn al-btn--sm" disabled>回填并返回</button><button type="button" class="al-btn al-btn--ghost al-btn--sm">不问了，直接写</button>') });
      if (s === 2) return chatShell(h, { on: 'name', from: '从「活动名称 · 帮我起名」进来', back: '返回表单', body: known(h, KNOWN_NAME) + q1 + userSay('聊冷启动，范围大一点，不只是付费') +
          aiSay(h, '来的人是带着问题来问，还是带着做好的东西来讲？', '问题 2 / 最多 4<div class="al-chat-quick">' + h.fchip('带问题来问') + h.fchip('带东西来讲') + h.fchip('都有，先讲后问') + '</div>') + userSay('都有，先讲后问，三个人讲') +
          aiSay(h, '够了。主题：AI 产品的冷启动，三位创业者讲各自找到第一批用户的过程，再圆桌。右边是回填内容，改了再回填也行。', '<div class="al-chat-quick">' + h.fchip('就这样，回填') + h.fchip('再问我一个') + h.fchip('推荐嘉宾和场地') + '</div>'),
        ctx: outPanel(h, [['主题', 'AI 产品的冷启动 · 先讲后问'], ['一句话介绍 ' + h.srcChip('draft'), '三位创业者讲怎么找到第一批用户，然后圆桌。带着正在做的东西来。'], ['活动名称 · 选一个', '<div style="display:flex;flex-direction:column;gap:6px;margin-top:6px">' + h.suggest('产品夜聊 Vol.8 · 第一批用户') + h.suggest('冷启动夜聊：前 100 个用户') + h.suggest('AI 产品怎么找到第一批人') + '</div>']], '<button type="button" class="al-btn al-btn--primary al-btn--sm">回填并返回</button><button type="button" class="al-btn al-btn--ghost al-btn--sm">再改改</button>') });
      var recs = [['沈', '沈一', '内容设计 · 前字节', '上期聊定价时来过 · 名片「此刻」：在做 B 端产品冷启动', '可以讲：从 0 到 50 个付费用户的两个月'], ['韩', '韩露', '独立开发者', '来过 3 场 · 作品里有一个刚上线的工具', '可以讲：只在群里发的坑'], ['L', 'Lin Zhao', 'Growth · 前 Notion China', 'LinkedIn · 你的一度联系人 · 做过 3 个产品的冷启动', '可以讲：第一批用户从哪来']];
      var venues = [['科兴科学园 Hub 空间', '你上 2 期用过 · 30 人 · 免费', true], ['南山 · 湾区书店二楼', '同类活动常用 · 40 人 · 需预约', false], ['深圳湾 · 创业广场路演厅', '同类活动常用 · 80 人 · 收费', false]];
      return chatShell(h, { on: 'guest', from: '接着上一段 · 内容已定', back: '返回表单', placeholder: '还想找别的方向的嘉宾？说一句',
        body: userSay('推荐嘉宾和场地') + aiSay(h, '按「AI 产品的冷启动」找了 3 位嘉宾候选和 3 个场地。理由都来自对方资料和你的记录，勾了才加入。', '嘉宾候选 · 来过的人 / 关注的人 / 站内资料 / LinkedIn') +
          '<div class="jd-people">' + recs.map(function (r) { return '<div class="jd-person" style="align-items:flex-start"><input type="checkbox" class="fr-app-check" style="margin:8px 0 0"><span class="jd-person-av">' + r[0] + '</span><div style="flex:1;min-width:0"><div class="jd-person-name">' + r[1] + ' <span style="font-weight:400;color:var(--v-text-tertiary)">· ' + r[2] + '</span></div><div class="jd-person-sub">理由：' + r[3] + '</div><div style="margin-top:3px;font-size:12.5px;color:var(--v-text-primary)">' + r[4] + '</div></div></div>'; }).join('') + '</div>' +
          aiSay(h, '场地候选 · 你用过的 / 同类活动常用的') + '<div class="jd-people">' + venues.map(function (v) { return '<div class="jd-person"><input type="checkbox" class="fr-app-check" style="margin:0"' + (v[2] ? ' checked' : '') + '><span class="jd-person-av">' + h.ICON.pin + '</span><div><div class="jd-person-name">' + v[0] + '</div><div class="jd-person-sub">' + v[1] + '</div></div></div>'; }).join('') + '</div>',
        ctx: outPanel(h, [['活动名称', '冷启动夜聊：前 100 个用户'], ['一句话介绍', '三位创业者讲怎么找到第一批用户，然后圆桌。'], ['嘉宾 tab', '勾选的人会进「待邀请」', true], ['公开地址', '深圳南山 · 科兴科学园']], '<button type="button" class="al-btn al-btn--primary al-btn--sm">回填并返回</button><button type="button" class="al-btn al-btn--ghost al-btn--sm">再改改</button>') });
    }
  });

  // ---------- X02 数据对话：问一句，答数字 / 名单 / 图 / 事实句 ----------
  function bars(h, data, onIdx) {
    var max = Math.max.apply(null, data.map(function (d) { return d[1]; }));
    return '<div class="al-bars">' + data.map(function (d, i) { return '<div class="al-bar' + (i === onIdx ? ' al-bar--on' : '') + '"><b>' + d[1] + '</b><i style="height:' + Math.round(d[1] / max * 50) + 'px"></i><span>' + d[0] + '</span></div>'; }).join('') + '</div>';
  }
  var DATA_CTX = [['报名 38 · 通过 27 · 拒绝 3 · 候补 8', '报名记录'], ['签到 24 / 27，最早 18:48', '签到记录'], ['问卷 2 题 · 27 份', '问卷'], ['反馈 12 条 · 已参与 9', '反馈']];
  R({
    id: 'X02', stage: 'chat', title: '问数据：同一页对话，答数字、名单、图、事实句', where: '活动 AI 对话页 · 从「数据」tab 或工作台进来', surface: 'wide', flag: 'P1',
    states: ['「做设计的来了几个」', '「哪个时段签到最多」', '「没到的人有什么共同点」'],
    stateNotes: ['答一个数字 + 名单，右侧能导出。不显示筛选条件，只在回答里说清楚算的是什么。', '答一张小图。数据来自签到记录。', '只答报名字段上的事实：审核方式、报名时间、来源。不评价人，人少就说人少。'],
    notes: [
      ['放哪', '就是 X01 那一页，会话上下文换成这场的数据。从「数据」tab 的「问 AI」或工作台进来。'],
      ['数据范围', '<b>只有这一场</b>：报名记录（来源、时间、状态）、签到记录（时间）、问卷回答、反馈、通知发送记录。右侧「已知道的」列出来。不跨活动；跨活动的问题答「这里只看这一场，跨场去后台活动列表」。'],
      ['怎么答', '数字 + 一句话说清算的是什么（「标签有设计且已签到」）+ 名单或图。不出筛选器、不出条件 chip。追问直接接着问（「其中来过 2 次以上的呢」）。'],
      ['规矩', '不给人打分、不排序人、不预测。「没到的人有什么共同点」只答报名字段上的事实，不答「不够积极」这类判断。答不了的说「这场数据里没有」。'],
      ['导出', '问出来的名单右侧可以导出 CSV，进管理记录。'],
      ['层级 · 优先级', '结构层。<code>P1</code>']
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
