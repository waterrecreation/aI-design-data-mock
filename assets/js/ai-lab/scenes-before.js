/* AI 辅助原型 · 02 活动前 · 优化与审核（B01–B07）· 03 通知与消息（N01–N03）· 全部网页端 */
(function () {
  'use strict';
  var R = window.AILab.register;

  function statsRow(h) {
    return '<div class="ce2-stats-row"><div class="ce2-stat"><div class="ce2-stat-label">已报名</div><div class="ce2-stat-value">27 <span style="font-size:12px;color:var(--v-text-tertiary)">/ 30</span></div><div class="ce2-stat-bar"><div class="ce2-stat-bar-fill" style="width:90%"></div></div></div><div class="ce2-stat"><div class="ce2-stat-label">待审核</div><div class="ce2-stat-value ce2-stat-value--flag">12</div></div><div class="ce2-stat"><div class="ce2-stat-label">剩余位置</div><div class="ce2-stat-value">3</div></div><div class="ce2-stat"><div class="ce2-stat-label">到场</div><div class="ce2-stat-value">—</div></div></div>';
  }
  function quick(h) {
    return '<div class="ce2-quick"><div class="ce2-quick-card"><span class="ce2-quick-icon">' + h.ICON.check + '</span><div><div class="ce2-quick-label">报名审核</div><div class="ce2-quick-sub">12 人等你</div></div><span class="ce2-quick-flag">12</span></div><div class="ce2-quick-card"><span class="ce2-quick-icon">' + h.ICON.bell + '</span><div><div class="ce2-quick-label">通知参与者</div><div class="ce2-quick-sub">写一条</div></div></div><div class="ce2-quick-card"><span class="ce2-quick-icon">' + h.ICON.img + '</span><div><div class="ce2-quick-label">查看活动页</div><div class="ce2-quick-sub">访客视角</div></div></div></div>';
  }
  function hero(h, actions) {
    return '<div class="ce2-pub-hero"><span class="ce2-pub-hero-icon">' + h.ICON.check + '</span><div><div class="ce2-pub-hero-title">已发布 · 8 月 20 日 14:02</div><div class="ce2-pub-hero-sub">发布后一切仍可改 · 改时间或地点时可选通知报名的人</div></div><div class="ce2-pub-link"><span class="ce2-pub-link-text">vibers.club/e/founders-night-7</span><button type="button" class="ce2-pub-link-copy">复制链接</button></div>' + (actions || '<div class="ce2-hero-actions"><button type="button" class="ce2-btn-share-primary">分享</button><button type="button" class="al-btn">生成海报</button><button type="button" class="al-btn al-btn--ghost">告诉老朋友</button></div>') + '</div>';
  }

  // ---------- B01 活动优化检查 ----------
  R({
    id: 'B01', stage: 'before', title: '一键检查：这场还能怎么优化', where: 'pub-c-editor · 概览 tab 发布时刻卡片下方', surface: 'web', flag: 'P0',
    states: ['页头一个按钮', '检查中', '4 处可优化', '没什么要改的'],
    stateNotes: ['页头右侧一个「AI 优化」按钮，不做横幅，页面上不写规则。', '按钮变「检查中」，3 秒。', '结果是一块列表：每条一句话 + 一个动作。能一键补的直接补，要人写的跳到字段。可收起。', '六条都过了就一条 toast，不硬凑建议。'],
    notes: [
      ['放哪', '<b>概览 tab 页头右侧一个按钮</b>，和「预览」「查看活动页」并排。不做横幅，规则不写在页面上，只在这里。结果列表出现在发布时刻卡片下方，可收起。活动信息改过之后按钮会重新亮起。'],
      ['六条基础优化原则（固定，检查只按这个来）', '<b>① 信息完整</b>：详情里有没有流程安排、适合谁来、需要带什么；线下有没有公开地址；线上有没有会议链接。<b>② 门槛匹配</b>：需审核但没问卷；有人数上限但没写满员怎么办；付费但没写退款口径。<b>③ 传播就绪</b>：封面还是默认；一句话介绍缺失或超 30 字；标签少于 2 个。<b>④ 嘉宾</b>：有嘉宾但没确认；没头衔；详情里没提到嘉宾。<b>⑤ 读者视角</b>：活动页没回答的问题，从事实推（线下晚上 → 几点结束；有嘉宾 → 有提问环节吗；需审核 → 能带朋友吗；线上 → 有回放吗）。<b>⑥ 撞车</b>：同城同天同标签的活动数，只提示。'],
      ['输出规矩', '每条一句话说清楚缺什么，一个动作。不打分，不排「重要程度」，最多列 6 条。和 A07 的三类冲突不重复（那是发布前必查的）。'],
      ['能一键做的', '补标签（A03 的建议）、换封面（A04 的排版）、把读者问题写进详情（一行问答）。要人写的（流程、退款口径）跳到字段并聚焦。'],
      ['层级 · 优先级', '结构层。<code>P0</code>']
    ],
    render: function (s, h) {
      // 入口只是页头右侧一个按钮。规则在右侧说明里，页面上不写。
      var btn = s === 1 ? '<span class="al-aibtn al-aibtn--busy" style="height:36px;padding:0 14px;font-size:13px;margin-left:0"><span class="al-dot"></span>检查中</span>' : '<button type="button" class="ce2-btn-outline" style="border-color:color-mix(in srgb, var(--v-brand-signal) 55%, transparent);color:var(--v-signal-text);gap:6px">' + h.SPARK + 'AI 优化</button>';
      var actions = btn + '<button type="button" class="ce2-btn-outline">预览</button><button type="button" class="ce2-btn-outline">查看活动页</button>';
      var block = '';
      if (s === 2) block = '<div class="ce2-next"><div style="display:flex;align-items:center;gap:10px"><span class="ce2-next-label">4 处可优化 · 不打分</span><span style="margin-left:auto;font-size:12px;color:var(--v-text-tertiary)">8 月 20 日 14:05 检查 · <button type="button" class="al-line-link" style="font-size:12px">收起</button></span></div>' +
        [['详情里没写「需要带什么」', '去写', false], ['封面还是默认的', '换底图', true], ['沈一邀请了 3 天还没确认', '再提醒', false], ['线下晚上的活动，活动页没说几点结束', '写进详情', true]].map(function (r) {
          return '<div class="ce2-next-row"><div><div class="ce2-next-step-title">' + r[0] + '</div></div><button type="button" class="ce2-next-btn' + (r[2] ? ' ce2-next-btn--adopt' : '') + '">' + (r[2] ? h.SPARK : '') + r[1] + '</button></div>';
        }).join('') + '</div>';
      var toastHtml = s === 3 ? h.toast('六条都过了，没什么要改的') : '';
      return h.webShell({ tab: '概览', actions: actions, body: '<div class="ce2-ov">' + hero(h) + block + statsRow(h) + quick(h) + '</div>' }) + toastHtml;
    }
  });

  // ---------- 审核台共用 ----------
  function reviewList(h, opts) {
    opts = opts || {};
    var rows = opts.rows || [
      { n: '许', name: '许知夏', t: '2 小时前', p: '我在做一个给独立开发者的定价工具，卡在怎么找到前 50 个付费用户…', tags: ['独立开发', '设计'], sel: true },
      { n: '李', name: '李伟', t: '3 小时前', p: '刚从大厂出来，想听听大家怎么找用户', tags: ['产品'] },
      { n: '周', name: '周明', t: '昨天', p: '（没有填写）', tags: [] }
    ];
    return '<div style="flex:1;min-width:0"><div class="fr-top-title">报名审核</div><div class="fr-top-sub">创业者夜聊 Vol.7 · ' + (opts.sub || '12 人等审核 · 问卷 2 题') + '</div>' +
      '<div class="fr-tabs"><button type="button" class="fr-tab" aria-selected="true">待审核 · ' + (opts.pending || 12) + '</button><button type="button" class="fr-tab">已通过 · ' + (opts.approved || 27) + '</button><button type="button" class="fr-tab">已拒绝 · ' + (opts.declined || 3) + '</button></div>' +
      (opts.above || '') +
      '<div style="padding-top:4px">' + rows.map(function (r) {
        return '<div class="fr-app-row' + (r.sel ? ' fr-app-row--selected' : '') + (r.dim ? ' fr-app-row--dim' : '') + '"><input type="checkbox" class="fr-app-check"' + (r.checked ? ' checked' : '') + '><span class="fr-app-avatar">' + r.n + '</span><div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:10px"><span class="fr-app-name">' + r.name + '</span><span class="fr-app-time" style="margin-left:auto">' + r.t + '</span></div><div class="fr-app-preview">' + r.p + '</div>' + (r.tags.length ? '<div class="fr-app-tags">' + r.tags.map(function (t) { return '<span class="fr-mini-badge">' + t + '</span>'; }).join('') + '</div>' : '') + '</div></div>';
      }).join('') + (opts.after || '') + '</div></div>';
  }
  function drawer(h) {
    return '<div class="fr-drawer"><div style="display:flex;align-items:center;gap:8px;padding-bottom:14px;border-bottom:1px solid var(--v-border-subtle);font-size:12px;color:var(--v-text-tertiary)"><span class="fr-kbd">J</span><span class="fr-kbd">K</span>上下一位 <span style="margin-left:auto">3 / 12</span></div>' +
      '<div style="padding:22px 0 0;flex:1"><div style="display:flex;gap:14px"><span class="fr-detail-avatar">许</span><div><div class="fr-detail-name">许知夏</div><div style="margin-top:3px;font-size:13px;color:var(--v-text-secondary)">@zhixia · 独立开发者 · 上海</div><div style="margin-top:9px;display:flex;gap:6px"><span class="fr-detail-tag">独立开发</span><span class="fr-detail-tag">设计</span><span class="fr-detail-tag">定价</span></div></div></div>' +
      '<div class="al-summary" style="margin-top:20px"><div class="al-summary-head">' + h.SPARK + '资料要点 · AI 整理 · 都是名片里写的</div><div class="al-summary-item"><q>独立开发 2 年，在做定价工具</q><span style="font-size:11px;color:var(--v-text-tertiary)">经历</span></div><div class="al-summary-item"><q>在改定价页，下周上付费</q><span style="font-size:11px;color:var(--v-text-tertiary)">此刻</span></div><div class="al-summary-item"><span>来过你 2 场 · 和嘉宾沈一同标签「定价」</span><span style="font-size:11px;color:var(--v-text-tertiary)">往来</span></div></div>' +
      '<div class="fr-eyebrow" style="margin-top:22px">问卷 · 你想聊什么？</div>' +
      '<div class="al-summary" style="margin-top:8px;padding:10px 12px"><div class="al-summary-item" style="margin-top:0"><span style="font-size:12px;color:var(--v-text-tertiary);flex:none">要点</span><q>给独立开发者的定价工具</q><q>卡在前 50 个付费用户</q></div></div>' +
      '<div class="fr-answer">我在做一个<mark>给独立开发者的定价工具</mark>，上线两个月，免费用户三百多，但<mark>卡在怎么找到前 50 个付费用户</mark>。之前在群里发过几次没什么反应，想听听大家冷启动时候是怎么撬动第一批人的，也可以带 demo 来给大家看看定价页。</div>' +
      '<div class="fr-eyebrow" style="margin-top:18px">问卷 · 为什么想来？</div><div class="fr-answer">上一期听过韩露讲冷启动，想接着问。</div>' +
      '<div class="fr-eyebrow" style="margin-top:22px">订单</div><div style="margin-top:6px"><div class="fr-meta-row"><span class="fr-meta-k">金额</span><span class="fr-meta-v">免费</span></div></div></div>' +
      '<div style="display:flex;align-items:center;gap:12px;padding-top:16px;border-top:1px solid var(--v-border-subtle)"><button type="button" class="fr-action-btn">通过报名 <span class="fr-kbd" style="display:inline-grid;margin-left:6px;border-color:rgba(20,20,20,.25);color:inherit">A</span></button><button type="button" class="fr-action-danger">拒绝 <span class="fr-kbd" style="display:inline-grid;margin-left:6px;color:inherit;border-color:currentColor;opacity:.6">R</span></button></div></div>';
  }

  // ---------- B02 AI 批量审核：规则可填可不填，人一键确定 ----------
  var REV = [
    { g: 'pass', n: '许', name: '许知夏', p: '我在做一个给独立开发者的定价工具，卡在怎么找到前 50 个付费用户…', why: '符合「在做 AI 产品」：回答里「在做定价工具」· 来过你 2 场' },
    { g: 'pass', n: '李', name: '李伟', p: '刚从大厂出来，正在做一个 AI 面试练习工具，想听听大家怎么找用户', why: '符合「在做 AI 产品」：回答里「AI 面试练习工具」' },
    { g: 'pass', n: '陈', name: '陈默', p: '大三，在做校园二手书的小程序，想学冷启动', why: '符合「学生也欢迎」：回答里「大三」' },
    { g: 'unsure', n: '王', name: '王一鸣', p: '想来学习', why: '拿不准：回答太短，看不出在做什么' },
    { g: 'unsure', n: '张', name: '张雨', p: '朋友推荐来的，对创业感兴趣', why: '拿不准：没提到在做的东西' },
    { g: 'no', n: '周', name: '周明', p: '（没有填写）', why: '不符合「回答空的不通过」' },
    { g: 'no', n: '赵', name: '赵一', p: '想认识投资人', why: '不符合主题：回答和「找第一批用户」无关' }
  ];
  function revRow(h, r, done) {
    var color = r.g === 'pass' ? 'var(--v-status-approved-text)' : r.g === 'no' ? 'var(--v-status-rejected-text)' : 'var(--v-signal-text)';
    return '<div class="fr-app-row" style="align-items:center' + (done ? ';opacity:.5' : '') + '"><span class="fr-app-avatar">' + r.n + '</span><div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:10px"><span class="fr-app-name">' + r.name + '</span></div><div class="fr-app-preview">' + r.p + '</div><div style="margin-top:4px;font-size:12px;line-height:18px;color:' + color + '">' + h.SPARK + ' ' + r.why + '</div></div>' + (done ? '' : '<button type="button" class="al-line-link" style="font-size:12px;flex:none">改</button>') + '</div>';
  }
  R({
    id: 'B02', stage: 'before', title: 'AI 批量审核：规则可填可不填，人一键确定', where: 'f-host-review · 待审核列表顶部', surface: 'wide', flag: 'P0',
    states: ['填审核规则（可不填）', 'AI 给出结果，分三组', '一键确定'],
    stateNotes: ['规则用一句话写，不填就按默认规则。存起来，下一场同系列默认沿用。', '每人一行理由，引用回答原文和规则。三组：建议通过 / 拿不准 / 建议不通过。每个人可以改组。', '一键确定：通过和不通过写回，不通过的收到按规则写的说明；拿不准的留在待审核，逐个看（B03）。'],
    notes: [
      ['放哪', 'f-host-review 待审核列表顶部一块。发布到开场之间主办方最花时间的就是审核，这一步把 86 份变成一次确认。'],
      ['规则', '主办方一句话，可不填。例「优先在做 AI 产品的人；学生也欢迎；回答空的不通过」。<b>不填时的默认规则</b>：回答了问卷且不是重复报名 → 建议通过；回答空或 ≤ 4 字 → 拿不准；被这个主办方拒过、或同一人重复报名 → 建议不通过。默认规则里没有「主题相关」这一条，因为没规则就不该替主办方判断主题。'],
      ['AI 给什么', '每人一行：分到哪组 + 一句理由，理由必须引用回答原文或名片事实，并指向规则里的哪一条。不给分数，不排名，组内按报名时间排。'],
      ['人做什么', '扫一眼三组，改几个，然后一键确定。「拿不准」的一组不写回，留着逐个看（B03 的抽屉）。'],
      ['和 PRODUCT.md 的关系', '这一条突破了「AI 不给人打分」。控制方式：规则是主办方写的、理由引用可见的原文、写回前必须人点确定、拿不准的不自动处理。'],
      ['层级 · 优先级', '结构层。<code>P0</code>']
    ],
    render: function (s, h) {
      var rulesBox = s === 0
        ? '<div class="al-intake" style="margin-top:14px;padding:14px 16px"><div class="ce2-field-label-row" style="margin-bottom:8px"><span class="ce2-field-label">审核规则</span><span style="font-size:12px;color:var(--v-text-tertiary)">可不填 · 不填按默认规则 · 会存下来</span></div>' + h.textarea('', '例：优先在做 AI 产品的人；学生也欢迎；回答空的不通过') + '<div style="margin-top:12px;display:flex;align-items:center;gap:10px"><button type="button" class="al-btn al-btn--primary">' + h.SPARK + 'AI 审核 12 人</button><span style="font-size:12px;color:var(--v-text-tertiary)">3 秒 · 结果分三组 · 没有你确定不会写回</span></div></div>'
        : '<div class="al-intake al-intake--done" style="margin-top:14px">' + h.SPARK + '<span>规则：<b>优先在做 AI 产品的人；学生也欢迎；回答空的不通过</b></span><button type="button" class="al-line-link" style="margin-left:auto">改规则</button></div>';
      var groups = '';
      if (s >= 1) {
        var done = s === 2;
        groups = '<div class="al-fchips" style="margin-top:14px">' + h.fchip('建议通过', 7, true) + h.fchip('拿不准', 3, true) + h.fchip('建议不通过', 2, true) + '<span style="font-size:12px;color:var(--v-text-tertiary);align-self:center">每人一行理由 · 点「改」换组</span></div>' +
          '<div class="fr-batch-bar" style="margin-top:12px">' + (done ? '已确定：通过 7 · 不通过 2 已写回 · 拿不准 3 人留在待审核' : '一键确定：通过 7 · 不通过 2 · 拿不准 3 人留着逐个看') + '<span style="margin-left:auto;display:flex;gap:8px">' + (done ? '<button type="button" class="fr-batch-btn" style="background:none;color:var(--v-signal-text)">撤销</button>' : '<button type="button" class="fr-batch-btn fr-batch-btn--primary">一键确定</button><button type="button" class="fr-batch-btn" style="background:none;color:var(--v-signal-text)">先逐个看</button>') + '</span></div>' +
          '<div class="fr-eyebrow" style="margin-top:18px;color:var(--v-status-approved-text)">建议通过 · 7</div>' + REV.filter(function (r) { return r.g === 'pass'; }).map(function (r) { return revRow(h, r, done); }).join('') + '<div style="padding:8px 0 0;font-size:12px;color:var(--v-text-tertiary)">还有 4 人</div>' +
          '<div class="fr-eyebrow" style="margin-top:18px;color:var(--v-signal-text)">拿不准 · 3 · 留在待审核，逐个看</div>' + REV.filter(function (r) { return r.g === 'unsure'; }).map(function (r) { return revRow(h, r, false); }).join('') +
          '<div class="fr-eyebrow" style="margin-top:18px;color:var(--v-status-rejected-text)">建议不通过 · 2 · 说明按规则写好了</div>' + REV.filter(function (r) { return r.g === 'no'; }).map(function (r) { return revRow(h, r, done); }).join('');
      }
      var page = '<div><div class="fr-top-title">报名审核</div><div class="fr-top-sub">创业者夜聊 Vol.7 · ' + (s === 2 ? '3 人等审核' : '12 人等审核') + ' · 问卷 2 题</div>' +
        '<div class="fr-tabs"><button type="button" class="fr-tab" aria-selected="true">待审核 · ' + (s === 2 ? '3' : '12') + '</button><button type="button" class="fr-tab">已通过 · ' + (s === 2 ? '34' : '27') + '</button><button type="button" class="fr-tab">已拒绝 · ' + (s === 2 ? '5' : '3') + '</button></div>' + rulesBox + groups +
        (s === 0 ? '<div style="padding-top:4px">' + [['许', '许知夏', '2 小时前', '我在做一个给独立开发者的定价工具，卡在怎么找到前 50 个付费用户…'], ['李', '李伟', '3 小时前', '刚从大厂出来，正在做一个 AI 面试练习工具'], ['周', '周明', '昨天', '（没有填写）']].map(function (r) { return '<div class="fr-app-row"><span class="fr-app-avatar">' + r[0] + '</span><div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:10px"><span class="fr-app-name">' + r[1] + '</span><span class="fr-app-time" style="margin-left:auto">' + r[2] + '</span></div><div class="fr-app-preview">' + r[3] + '</div></div></div>'; }).join('') + '<div style="padding:12px 0 0;font-size:12px;color:var(--v-text-tertiary)">还有 9 人</div></div>' : '') + '</div>';
      return h.webShell({ tabs: [], actions: '<button type="button" class="ce2-btn-outline">切换活动</button>', body: page }) + (s === 2 ? h.toast('已写回：通过 7 · 不通过 2', '撤销') : '');
    }
  });

  // ---------- B03 拿不准的逐个看：抽屉要点 + 拒绝说明 ----------
  R({
    id: 'B03', stage: 'before', title: '拿不准的逐个看：资料要点 · 问卷要点 · 拒绝说明', where: 'f-host-review · 右侧抽屉', surface: 'wide', flag: 'P0',
    states: ['抽屉：两段要点', '拒绝：说明起草'],
    stateNotes: ['B02 批量审核后剩下「拿不准」的人在这里逐个看。资料要点从名片摘，问卷要点从回答摘，都带引号，原文照常完整展示。', '选一个理由 chip，说明框自动填一句客气话，带「AI」标记，可改可删。发送还是人点。'],
    notes: [
      ['放哪', 'f-host-review 右侧抽屉。B02 处理完大头，这里只剩拿不准的几个。'],
      ['资料要点（报名资料审核）', '从报名者名片的经历、此刻、标签里摘 2–3 条和这场主题有关的，带来源（经历 / 此刻 / 往来）。「来过你 2 场」「和嘉宾同标签」是事实，不是判断。'],
      ['问卷要点（问卷审核）', '每题回答超过 60 字才出要点，从原文摘 1–2 个短语带引号，原文里同步高亮。回答空的直接标「没有填写」。'],
      ['拒绝说明', '三个理由 chip（满员 / 和本场主题不合 / 资料不全）→ 选一个自动填一句说明，带「AI」标记。'],
      ['禁止的', '不出「建议通过」「匹配度」「相似的人」。PRODUCT.md：AI 不给人打分。'],
      ['快捷键不变', 'J / K / A / R 照旧，AI 内容不抢焦点。'],
      ['层级 · 优先级', '框架层。<code>P0</code>']
    ],
    render: function (s, h) {
      var unsure = [
        { n: '许', name: '许知夏', t: '2 小时前', p: '我在做一个给独立开发者的定价工具，卡在怎么找到前 50 个付费用户…', tags: ['独立开发', '设计'], sel: true },
        { n: '王', name: '王一鸣', t: '昨天', p: '想来学习', tags: ['AI'] },
        { n: '张', name: '张雨', t: '2 天前', p: '朋友推荐来的，对创业感兴趣', tags: [] }
      ];
      var page = h.webShell({ tabs: [], actions: '<button type="button" class="ce2-btn-outline">切换活动</button>', body: '<div style="display:flex;gap:24px">' + reviewList(h, { sub: 'AI 批量审核后剩 3 人拿不准 · 逐个看', pending: 3, approved: 34, declined: 5, rows: unsure }) + drawer(h) + '</div>' });
      if (s === 0) return page;
      var modal = '<div style="position:absolute;inset:0;border-radius:18px;background:color-mix(in srgb, var(--v-bg-primary) 55%, transparent)"><div class="al-modal" style="margin-top:120px"><div class="al-modal-title">拒绝许知夏的报名</div><div class="al-modal-sub">对方会收到一条通知，带你写的说明。</div>' +
        '<div class="ce2-field-label-row" style="margin-top:18px"><span class="ce2-field-label">理由</span></div><div class="al-fchips">' + h.fchip('满员') + h.fchip('和本场主题不合') + h.fchip('资料不全', null, true) + '</div>' +
        '<div class="ce2-field-label-row" style="margin-top:18px"><span class="ce2-field-label">说明</span>' + h.srcChip('draft') + '<span style="font-size:12px;color:var(--v-text-tertiary)">按理由写的 · 可改可删</span></div>' + h.textarea('谢谢报名。这场想先看看你在做什么，报名回答里补一句正在做的东西，我们再看一次。') +
        '<div class="al-modal-actions"><button type="button" class="al-btn">取消</button><button type="button" class="al-btn" style="border-color:color-mix(in srgb, var(--v-status-rejected-text) 40%, transparent);color:var(--v-status-rejected-text)">拒绝并发送</button></div></div></div>';
      return '<div style="position:relative">' + page + modal + '</div>';
    }
  });

  // ---------- B04 嘉宾推荐 + 邀请说明 ----------
  R({
    id: 'B04', stage: 'before', title: '嘉宾推荐 · 话题 · 邀请说明', where: 'pub-c-editor · 嘉宾 tab', surface: 'web', flag: 'P1',
    states: ['推荐 3 位，每位带理由和话题', '邀请说明起草'],
    stateNotes: ['按活动主题和介绍，从来过的人、关注的人、站内公开资料里找。理由写明来自哪条资料，话题是 AI 建议的，都可改。', '选了人之后「AI 起草」两句：想请你聊什么、为什么是你。嘉宾在 pub-e-guest-confirm 看到的就是这段。'],
    notes: [
      ['放哪', '嘉宾 tab，「建议 · 之前合作过」下面加一块「按主题推荐」。'],
      ['推荐依据（按优先级）', '<b>① 活动主题和介绍</b>：名称、一句话介绍、详情、标签。<b>② 候选池</b>：来过你活动的人 → 你关注的人 → 站内公开名片 → 授权导入的 LinkedIn 资料（有则用）。<b>③ 匹配的是资料里的事实</b>：经历、此刻、作品、标签。每条理由后面标来源。'],
      ['话题建议', '每位嘉宾给一个「可以聊什么」，从对方资料和这场主题的交集里来。主办方可改，写进邀请说明。'],
      ['规矩', '推荐的是候选，不是排名；最多 3 位；只用对方公开或授权的资料；不用私信内容。被拒过的不再推。'],
      ['层级 · 优先级', '结构层 + 表现层。<code>P1</code>']
    ],
    render: function (s, h) {
      var recs = [['陈', '陈叙', '城市研究者 · 同济', '经历里有「街道算法」研究，来过你 2 场', '算法怎么改写街道和店铺'], ['K', 'Kira', '做机器人交互 · 前 Physical AI', '此刻写着「在做机器人进社区的实验」', '机器人进了街道之后，人怎么和它相处'], ['沈', '沈一', '内容设计 · 前字节', '关注的人 · 作品里有城市 App 的界面研究', '城市 App 里的算法怎么被感知']];
      var recBlock = '<div class="ce2-guest-suggest-label" style="display:flex;align-items:center;gap:8px">' + h.SPARK + '按主题推荐 · 3 位 · 理由都来自对方资料</div>' + recs.map(function (r) {
        return '<div class="ce2-guest-row" style="align-items:flex-start"><span class="ce2-guest-avatar">' + r[0] + '</span><div style="flex:1;min-width:0"><div class="ce2-guest-name-row"><span class="ce2-guest-name">' + r[1] + '</span><span class="ce2-guest-meta" style="margin-top:0">' + r[2] + '</span></div><div class="ce2-guest-meta" style="margin-top:4px">理由：' + r[3] + '</div><div style="margin-top:6px;display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--v-text-primary)"><span style="font-size:11px;color:var(--v-text-tertiary)">可以聊</span>' + r[4] + '<button type="button" class="al-line-link" style="font-size:12px">换一个</button></div></div><div class="ce2-guest-actions"><button type="button" class="ce2-guest-action-btn">邀请</button></div></div>';
      }).join('');
      var body = h.panel('嘉宾', '会单独露出名片的人。', '<div class="ce2-guest-row"><span class="ce2-guest-avatar">韩</span><div><div class="ce2-guest-name-row"><span class="ce2-guest-name">韩露</span><span class="ce2-guest-badge ce2-guest-badge--confirmed">已确认</span></div><div class="ce2-guest-meta">分享嘉宾 · 独立开发者</div></div><div class="ce2-guest-actions"><button type="button" class="ce2-guest-action-btn">分享</button></div></div>' +
        '<div class="ce2-guest-suggest-label">建议 · 之前合作过</div><button type="button" class="ce2-guest-suggest-chip"><span class="ce2-guest-suggest-avatar">沈</span>沈一 · 内容设计</button>' + recBlock);
      var page = h.webShell({ tab: '嘉宾', title: 'AI & Society 第 4 期 · 城市里的机器与人', sub: 'Vibers Shanghai · 8 月 15 日 周六 19:30–22:00', body: body });
      if (s === 0) return page;
      var modal = '<div class="al-modal" style="width:480px"><div class="al-modal-title">邀请陈叙</div><div class="al-modal-sub">对方确认后才在活动页露出。</div>' +
        h.field('角色', '<div class="al-fchips">' + h.fchip('分享嘉宾', null, true) + h.fchip('主持') + '</div>') +
        h.field('一句话头衔', h.input('城市研究者 · 同济'), '<span style="font-size:12px;color:var(--v-text-tertiary)">默认用名片头衔</span>') +
        h.field('说明', h.textarea('想请你来聊「城市里的机器与人」。你在同济做的街道算法研究，正是这期想展开的：算法怎么改写街道和店铺。8 月 15 日周六 19:30，安福路，讲 20 分钟就好。'), h.srcChip('draft') + '<span style="font-size:12px;color:var(--v-text-tertiary)">用推荐理由和话题写的</span>') +
        '<div class="al-modal-actions"><button type="button" class="al-btn">取消</button><button type="button" class="al-btn al-btn--primary">发送邀请</button></div></div>';
      return page.replace('<div class="ce2-main">', '<div class="ce2-main" style="position:relative"><div style="position:absolute;inset:0;z-index:2;padding-top:10px;background:color-mix(in srgb, var(--v-bg-primary) 55%, transparent)">' + modal + '</div>');
    }
  });

  // ---------- B05 详情整理：自动排流程 ----------
  R({
    id: 'B05', stage: 'before', title: '详情「整理」：没排流程就自动排', where: 'pub-c-editor · 活动详情字段', surface: 'web', flag: 'P1',
    states: ['整理前：有嘉宾，没流程', '整理后：流程按嘉宾顺序排'],
    stateNotes: ['详情里没有「流程安排」这一段，嘉宾 tab 有 2 位已确认。', '「整理」补了流程：按嘉宾 tab 的顺序，从开始到结束均分。每行可改，带「AI」标记。'],
    notes: [
      ['放哪', '活动详情字段的「AI 润色 / 整理」，不再单独做「排流程」按钮。'],
      ['规则（固定）', '<b>点「整理」时，如果详情里没有「流程安排」这一段，就自动排一份流程，插在详情第一段。顺序严格按嘉宾 tab 里的顺序，不按名字、不按确认状态、不重排。时间从活动开始到结束均分：开场 30 分钟签到交流，每位嘉宾等长，最后留 30 分钟交流，结束时间等于活动结束。已经有「流程安排」的，只补结构不动顺序。</b>'],
      ['为什么按嘉宾 tab 顺序', '主办方在嘉宾 tab 里拖过顺序，那就是他想要的顺序。AI 不该有自己的意见。'],
      ['层级 · 优先级', '范围层。<code>P1</code>']
    ],
    render: function (s, h) {
      var tl = s === 1 ? '<div class="ce2-field-label" style="margin-bottom:6px;display:flex;align-items:center;gap:8px">流程安排 ' + h.srcChip('draft') + '<span style="font-size:11.5px;color:var(--v-text-tertiary);font-weight:400">按嘉宾 tab 顺序 · 19:30–22:00 均分</span></div><div class="al-timeline" style="margin-top:0">' + [['19:30', '签到入场，自由交流'], ['20:00', '陈叙 · 城市里的机器（嘉宾 tab 第 1 位）'], ['20:45', 'Kira · 机器人交互（嘉宾 tab 第 2 位）'], ['21:30', '自由交流'], ['22:00', '结束']].map(function (r) { return '<div class="al-tl-row"><span class="t">' + r[0] + '</span><span>' + r[1] + '</span><span class="x">改</span></div>'; }).join('') + '</div><div style="margin-top:14px">' : '';
      var body = h.panel('活动信息', '', '<div class="al-line" style="margin-top:14px">嘉宾 tab：1 陈叙 · 2 Kira（都已确认）' + (s === 0 ? ' · 详情里还没有流程安排' : '') + '</div><details class="ce2-details-toggle" open style="margin-top:8px"><summary>' + h.ICON.chevron + '活动详情</summary><div class="ce2-details-toggle-body"><div class="ce2-field-label-row" style="margin-top:4px"><span class="ce2-field-label">正文</span>' + (s === 0 ? h.aiBtn('整理') : h.aiBtn('整理')) + '</div>' +
        tl + h.textarea('这一期我们聊 AI 与城市生活：算法怎么改写街道、店铺和通勤，普通人又能拿回哪些控制权。欢迎带着正在做的东西来。' + (s === 1 ? '\n\n适合谁来\n对城市、算法、机器人感兴趣的人，不限背景。\n\n需要带什么\n一个你在城市里注意到的现象，可以是照片。' : '')) + (s === 1 ? '</div>' : '') + '</div></details>');
      return h.webShell({ tab: '活动信息', title: 'AI & Society 第 4 期 · 城市里的机器与人', sub: 'Vibers Shanghai · 8 月 15 日 周六 19:30–22:00', body: body }) + (s === 1 ? h.toast('已整理 · 补了流程和两段', '撤销') : '');
    }
  });

  // ---------- B06 主持稿（P2） ----------
  R({
    id: 'B06', stage: 'before', title: '主持稿：整稿预览 + 导出', where: 'pub-c-editor · 嘉宾 tab 底部', surface: 'web', flag: 'P2',
    states: ['嘉宾 tab 底部一个入口', '整稿预览 · 导出'],
    stateNotes: ['不再给每位嘉宾单独的介绍词。嘉宾 tab 底部一块：预览、导出。', '一页：开场、每位嘉宾一段介绍、嘉宾之间一句串场、收尾。改了就存，导出 PDF。'],
    notes: [
      ['放哪', '嘉宾 tab 底部一块「主持稿」，两个键：预览、导出。'],
      ['整稿结构', '开场一段（名称、今晚流程、几点结束）→ 嘉宾 1 介绍 → <b>串场一句</b>（承上启下，如「陈叙讲的是街道，Kira 接着讲街道上的机器」）→ 嘉宾 2 介绍 → 串场 → … → 收尾一段（感谢、下一场、去哪继续聊）。'],
      ['依据', '活动信息、流程安排（B05）、嘉宾 tab 的顺序和头衔。嘉宾改了头衔或顺序，这里提示重写。'],
      ['层级 · 优先级', '表现层。<code>P2</code>']
    ],
    render: function (s, h) {
      if (s === 0) {
        var body = h.panel('嘉宾', '会单独露出名片的人。',
          [['陈', '陈叙', '分享嘉宾 · 城市研究者 · 同济'], ['K', 'Kira', '分享嘉宾 · 做机器人交互 · 前 Physical AI']].map(function (g) { return '<div class="ce2-guest-row"><span class="ce2-guest-avatar">' + g[0] + '</span><div><div class="ce2-guest-name-row"><span class="ce2-guest-name">' + g[1] + '</span><span class="ce2-guest-badge ce2-guest-badge--confirmed">已确认</span></div><div class="ce2-guest-meta">' + g[2] + '</div></div><div class="ce2-guest-actions"><button type="button" class="ce2-guest-action-btn">分享</button></div></div>'; }).join('') +
          '<div class="ce2-pub-hero" style="margin-top:22px"><span class="ce2-pub-hero-icon" style="background:color-mix(in srgb, var(--v-brand-signal) 10%, transparent);color:var(--v-signal-text)">' + h.SPARK + '</span><div><div class="ce2-pub-hero-title">主持稿</div><div class="ce2-pub-hero-sub">开场 + 2 位嘉宾介绍 + 串场 + 收尾，一页 · 按嘉宾顺序</div></div><div style="margin-left:auto;display:flex;gap:8px"><button type="button" class="al-btn">预览</button><button type="button" class="al-btn al-btn--primary">导出 PDF</button></div></div>');
        return h.webShell({ tab: '嘉宾', title: 'AI & Society 第 4 期 · 城市里的机器与人', sub: 'Vibers Shanghai · 8 月 15 日 周六 19:30–22:00', body: body });
      }
      var secs = [['开场 · 19:30', '大家好，欢迎来 AI & Society 第 4 期。今晚聊城市里的机器与人：算法怎么改写街道、店铺和通勤。两位嘉宾各讲 20 分钟，21:30 自由交流，22:00 结束。'], ['嘉宾 1 · 20:00', '第一位是陈叙，在同济做城市研究，这两年一直在看算法怎么改写街道和店铺。讲 20 分钟，留 10 分钟提问。欢迎陈叙。'], ['串场', '陈叙讲的是算法怎么改写街道。接下来 Kira 讲的是街道上真正出现的机器。'], ['嘉宾 2 · 20:45', '第二位是 Kira，做机器人交互，之前在 Physical AI。她从机器那一侧讲：机器人进了街道之后，人怎么和它相处。欢迎 Kira。'], ['收尾 · 21:55', '谢谢陈叙和 Kira，谢谢今晚到场的朋友。楼下咖啡馆开到 23 点，想继续聊的下楼。下一期 9 月见。']];
      var doc = '<div style="display:flex;align-items:center;gap:10px"><h3 class="ce2-panel-h3">主持稿</h3>' + h.srcChip('draft') + '<span style="font-size:12px;color:var(--v-text-tertiary)">按嘉宾 tab 顺序 · 改了就存</span></div>' +
        secs.map(function (x) { var isBridge = x[0] === '串场'; return '<div class="al-script"' + (isBridge ? ' style="border-style:dashed;padding:12px 18px"' : '') + '><div class="al-script-h">' + x[0] + '</div><div class="al-script-p"' + (isBridge ? ' style="font-size:13.5px;color:var(--v-text-secondary)"' : '') + '>' + x[1] + '</div></div>'; }).join('') +
        '<div style="margin-top:22px;display:flex;gap:10px;align-items:center"><button type="button" class="al-btn al-btn--primary">导出 PDF</button><button type="button" class="al-btn">复制全文</button><span style="margin-left:auto;font-size:12px;color:var(--v-text-tertiary)">嘉宾改了头衔或顺序，这里会提示重写</span></div>';
      return h.webShell({ tabs: [], title: '主持稿 · AI & Society 第 4 期', sub: '8 月 15 日 周六 19:30 开场', actions: '<button type="button" class="ce2-btn-outline">回到嘉宾</button>', body: doc });
    }
  });

  // ---------- B07 需处理：规则校验 ----------
  R({
    id: 'B07', stage: 'before', title: '需处理：规则校验', where: 'pub-j-host-dashboard · 需处理', surface: 'web', flag: '规则',
    states: ['开场前 1 天'],
    stateNotes: ['全是规则条目，不上模型，不生成待办清单。'],
    notes: [
      ['放哪', '后台「需处理」块。'],
      ['规则条目', '「N 人等审核」「N 位嘉宾还没确认」「已满员，还有 N 人待审核 → 加名额 / 去审核」「开场前 1 天，详细地址还没填」「线上活动，会议链接还没填」。'],
      ['不做', 'AI 生成的「明天的准备」清单去掉。主办方自己知道要准备什么。'],
      ['层级 · 优先级', '范围层。<code>规则</code>']
    ],
    render: function (s, h) {
      var body = '<div class="jd-section-head"><span class="jd-section-title">需处理</span><span class="jd-section-meta">创业者夜聊 Vol.7 · 明天 19:00 开场 ' + h.ruleTag() + '</span></div><div class="jd-todo-card">' +
        '<div class="jd-todo-row"><div><div class="jd-todo-title">12 人等审核</div><div class="jd-todo-sub">最早的 2 天前</div></div><button type="button" class="jd-todo-action">去审核</button></div>' +
        '<div class="jd-todo-row"><div><div class="jd-todo-title">1 位嘉宾还没确认</div><div class="jd-todo-sub">沈一 · 邀请发出 3 天</div></div><button type="button" class="jd-todo-action">再提醒一次</button></div>' +
        '<div class="jd-todo-row"><div><div class="jd-todo-title">已满员，还有 8 人待审核</div><div class="jd-todo-sub">30 / 30 · 通过就进候补</div></div><span style="margin-left:auto;display:flex;gap:8px"><button type="button" class="jd-todo-action" style="margin-left:0">加名额</button><button type="button" class="jd-todo-action" style="margin-left:0">去审核</button></span></div>' +
        '<div class="jd-todo-row"><div><div class="jd-todo-title">详细地址还没填</div><div class="jd-todo-sub">地址设了仅报名成功可见，报名成功的人现在只看到「巨鹿路」</div></div><button type="button" class="jd-todo-action">去填</button></div></div>';
      return h.webShell({ title: 'Vibers Shanghai', sub: 'Host 后台 · 概览', tabs: ['概览', '活动', '报名审核', '成员与权限', '设置'], tab: '概览', actions: '<button type="button" class="ce2-btn-share-primary">＋ 发起活动</button>', body: body });
    }
  });

  // ========== 03 通知与消息 ==========
  var NOTICE = {
    0: { chips: ['补充怎么找到入口', '提醒带什么', '改时间或地点'], on: 0, text: '周六 19:00 见。巨鹿路上找「Vibers」的橙色指示牌进来，上 3 楼。详细地址见活动页。找不到打海报上的电话。' },
    1: { chips: ['延迟开场', '换房间', '结束后去哪', '晚到直接进'], on: 0, text: '开场延迟 15 分钟，19:45 开始。已经到的先在 3 楼吧台喝点东西。' },
    2: { chips: ['感谢 + 回顾', '下一场预告'], on: 0, text: '昨晚 24 位到场，谢谢沈一和韩露的分享。三个坑：定价定得太早、只在群里发、没做 onboarding。下一场 10 月 3 日周六，还是巨鹿路。' },
    3: { chips: ['补充怎么找到入口', '提醒带什么', '改时间或地点'], on: 0, text: '周六 19:00 见。地址是巨鹿路 758 号 3 楼，找「Vibers」的橙色指示牌进来。' }
  };
  R({
    id: 'N01', stage: 'notify', title: '通知起草：按阶段给意图 chip', where: 'pub-c-editor · 通知 tab「写一条」上方 · 各阶段共用', surface: 'web', flag: 'P0',
    states: ['开场前', '进行中', '结束后 · 感谢回顾', '检测到门牌号'],
    stateNotes: ['chip 按阶段变。点一个，用真实字段拼一条草稿填进去。发送键还是人点。', '现场最常见的：延迟、换房间、晚到直接进。改个数字就能发。', '结束后 chip 变成感谢回顾和预告。感谢那条用真实到场数和嘉宾名字写，照片自己传。', '草稿里永远只用公开地址。文本里有门牌号时上方出一行提示，待审核和候补的人也会收到。'],
    notes: [
      ['放哪', '通知 tab「写一条」文本框上方。<b>这是全生命周期同一个控件</b>，chip 内容跟着阶段变。C01 的催到、结束后的感谢都走这里。'],
      ['交互', '开场前：找入口 / 带什么 / 改时间地点；进行中：延迟 / 换房间 / 结束后去哪 / 晚到直接进；结束后：感谢 + 回顾 / 下一场预告。点一个填入草稿，带「AI」标记。文本框上方一行「发给 N 人」防错。'],
      ['起草依据', '活动名称、日期时间、公开地址、嘉宾、到场数、发送历史里上一条（避免重复说）。不用报名者个人资料。'],
      ['地址防错', '草稿只用公开地址，加一句「详细地址见活动页」。检测到门牌号时提示「待审核和候补的 5 人也会收到」，给「改成公开地址」。这是 sep23 第 42 条在前端的兜底。'],
      ['不做', '改期后的变更通知由服务端生成（sep23 第 39 条），AI 不插手；不给每个人个性化，一条通知一个版本。'],
      ['层级 · 优先级', '框架层 + 范围层。<code>P0</code>']
    ],
    render: function (s, h) {
      var n = NOTICE[s];
      var status = s === 1 ? 'now' : s === 2 ? 'ended' : 'live';
      var warn = s === 3 ? '<div class="al-line" style="margin:0 0 9px;color:var(--v-text-secondary)"><span style="width:5px;height:5px;border-radius:50%;background:var(--v-brand-signal);flex:none"></span>这条里有详细地址「巨鹿路 758 号 3 楼」，待审核和候补的 5 人也会收到<button type="button" class="al-line-link" style="margin-left:auto">改成公开地址</button></div>' : '';
      var body = h.panel('通知参与者', '写一条发给报名的人：站内通知送达，活动页同步显示。',
        '<div class="ce2-field"><div class="ce2-field-label-row"><span class="ce2-field-label">写一条</span>' + h.srcChip('draft') + '<span style="font-size:12px;color:var(--v-text-tertiary)">发给 ' + (s === 2 ? '24 位到场的人' : '27 位报名成功的人') + '</span></div>' +
        '<div class="al-fchips" style="margin-bottom:10px"><span style="display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--v-text-tertiary);margin-right:2px">' + h.SPARK + (s === 1 ? '现场' : s === 2 ? '结束后' : '开场前') + '</span>' + n.chips.map(function (c, i) { return h.fchip(c, null, i === n.on); }).join('') + '</div>' + warn +
        h.textarea(n.text) + (s === 2 ? '<div style="margin-top:10px;display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:12px;border:1px dashed var(--v-border-strong);font-size:13px;color:var(--v-text-secondary)">' + h.ICON.img + '拖进照片，最多 9 张<span style="margin-left:auto;font-size:11.5px;color:var(--v-text-tertiary)">照片自己传</span></div>' : '') +
        '<div class="ce2-blast-send-row"><button type="button" class="ce2-blast-send">发送</button><span class="ce2-blast-hint">站内通知送达，活动页同步显示 · 只发这一次</span></div></div>' +
        '<div class="ce2-toggle-row" style="margin-top:22px"><div><div style="font-size:14px;color:var(--v-text-primary)">开场前自动提醒</div><div style="margin-top:2px;font-size:12px;color:var(--v-text-tertiary)">前 1 天和前 1 小时各一条，发给已通过的人，不用你记着</div></div>' + h.switchEl(true) + '</div>' +
        '<div class="ce2-field" style="margin-top:26px"><div class="ce2-field-label-row"><span class="ce2-field-label">发送历史</span><span style="font-size:12px;color:var(--v-text-tertiary)">1 条</span></div><div class="ce2-update-row"><div class="ce2-update-body">场地从三楼 302 换到同层 305，跟着门口指示牌走两步就到。</div><div class="ce2-update-meta">8 月 14 日 18:20 · 发给已通过 27 人</div></div></div>');
      return h.webShell({ tab: '通知', status: status, body: body });
    }
  });

  R({
    id: 'N02', stage: 'notify', title: '告诉老朋友：给筛选，不预选', where: 'pub-c-editor · 概览「告诉老朋友」弹窗', surface: 'web', flag: 'P1',
    states: ['弹窗：一个不勾', '点了一个 chip'],
    stateNotes: ['默认一个人不勾。三个筛选 chip 才是入口。', '点「标签和这场重合」勾了 12 人。同一个人同一场最多收一次。'],
    notes: [
      ['放哪', '概览发布时刻已有「告诉老朋友」（发给来过的人）。也是通知，所以归在这一组。'],
      ['交互', '弹窗顶部三个筛选 chip：「标签和这场重合」「来过 2 次以上」「上次来过同系列」。点 chip 才勾人，默认一个不勾。文案框预填一条邀请，带「AI」标记。'],
      ['不做', '不预选、不排「最可能来的人」。PRODUCT.md 不排序人；预选一勾就是群发骚扰。'],
      ['层级 · 优先级', '框架层。<code>P1</code>']
    ],
    render: function (s, h) {
      var people = [['许', '许知夏', '来过 2 次 · 独立开发'], ['韩', '韩露', '来过 3 次 · 创业'], ['沈', '沈一', '来过 1 次 · 定价'], ['陈', '陈叙', '来过 2 次 · 城市研究']];
      var on = s === 1;
      var modal = '<div class="al-modal" style="width:520px;margin-top:0"><div class="al-modal-title">告诉老朋友</div><div class="al-modal-sub">来过你活动的 48 人 · 站内通知 · 同一个人同一场最多收一次</div>' +
        '<div class="al-fchips" style="margin-top:16px">' + h.fchip('标签和这场重合', 12, on) + h.fchip('来过 2 次以上', 9) + h.fchip('上次来过同系列', 15) + '</div>' +
        '<div style="margin-top:14px;border-radius:14px;border:1px solid var(--v-border-subtle);overflow:hidden">' + people.map(function (p, i) { var chk = on && i !== 2; return '<div class="jd-person" style="opacity:' + (on && !chk ? '.4' : '1') + '"><input type="checkbox" class="fr-app-check" style="margin:0"' + (chk ? ' checked' : '') + '><span class="jd-person-av">' + p[0] + '</span><div><div class="jd-person-name">' + p[1] + '</div><div class="jd-person-sub">' + p[2] + '</div></div></div>'; }).join('') + '<div class="jd-person" style="font-size:12px;color:var(--v-text-tertiary)">' + (on ? '还有 8 人已勾选 · 共 48 人' : '还有 44 人 · 用上面的筛选，或逐个勾') + '</div></div>' +
        '<div class="ce2-field-label-row" style="margin-top:16px"><span class="ce2-field-label">写一句</span>' + h.srcChip('draft') + '</div>' + h.textarea('新一期创业者夜聊 8 月 29 日周六，还是巨鹿路。这期三位创业者讲最近踩的坑，你上次聊的定价问题这期正好展开。') +
        '<div class="al-modal-actions"><span style="margin-right:auto;align-self:center;font-size:12px;color:var(--v-text-tertiary)">' + (on ? '发给 12 人' : '还没选人') + '</span><button type="button" class="al-btn">取消</button><button type="button" class="al-btn al-btn--primary"' + (on ? '' : ' disabled') + '>发送</button></div></div>';
      return h.webShell({ tab: '概览', body: '<div class="ce2-ov">' + hero(h) + '</div>' }).replace('<div class="ce2-main">', '<div class="ce2-main" style="position:relative"><div style="position:absolute;inset:0;z-index:2;padding-top:10px;background:color-mix(in srgb, var(--v-bg-primary) 55%, transparent)">' + modal + '</div>');
    }
  });

  R({
    id: 'N03', stage: 'notify', title: '私信：逐条起草回复，人工发送', where: 'h-messages（主办方视角）· 后台消息', surface: 'wide', flag: 'P1',
    states: ['一条私信 · AI 起草了回复', '发出去了 · 同样的问题回流详情'],
    stateNotes: ['单个处理。左边是私信列表，右边是这一条。AI 按活动信息起草一条回复，标明依据。发送是人点。', '发完之后，同样的问题有 3 人问过，出一行「加到详情？」。答案进了详情，第 4 个人就不用问。'],
    notes: [
      ['放哪', '主办方视角的消息页，一条一条处理。不做自动回复，不做机器人。'],
      ['起草依据', '这场的活动信息（详情、时间、公开地址、票价、审核规则）、发送历史、你之前对同类问题的回复。不用对方的个人资料。'],
      ['规矩', '一次只起草当前这一条；发送永远是人点；没依据的问题（「能不能给我留个位置」）不起草，只提示「这个要你自己答」。'],
      ['回流', '同一问题 3 人以上问过 → 「加到详情？」，插入一行问答。'],
      ['层级 · 优先级', '框架层。<code>P1</code>']
    ],
    render: function (s, h) {
      var list = '<div class="al-dm-list"><div class="fr-top-title" style="font-size:18px">私信</div><div class="fr-top-sub">创业者夜聊 Vol.7 · 3 条没回</div><div style="margin-top:12px">' +
        [['李伟', '有停车吗？', true, s === 0], ['韩露', '能带一个朋友吗', true, false], ['周明', '有停车位吗，开车过去', s === 0, false], ['许知夏', '谢谢通过！', false, false]].map(function (d) { return '<div class="al-dm-row' + (d[3] ? ' al-dm-row--on' : '') + '">' + (d[2] ? '<span class="d"></span>' : '<span style="width:6px;flex:none"></span>') + '<div style="min-width:0"><div class="n">' + d[0] + '</div><div class="p">' + d[1] + '</div></div></div>'; }).join('') + '</div></div>';
      var thread;
      if (s === 0) thread = '<div class="al-dm-thread"><div style="display:flex;align-items:center;gap:10px"><span class="jd-person-av">李</span><div><div class="jd-person-name">李伟</div><div class="jd-person-sub">报名成功 · 产品</div></div></div>' +
        '<div class="al-user-bubble" style="align-self:flex-start;border-radius:6px 16px 16px 16px;margin-top:18px">有停车吗？</div>' +
        '<div class="al-preview" style="margin-top:16px"><div class="al-preview-head">' + h.SPARK + 'AI 起草的回复 · 依据：详情里的场地信息、你上次的回复</div><div class="al-preview-body">有的。科兴科学园地下车库，晚上 6 点后免费，从 B 栋电梯上 2 楼。</div><div class="al-preview-actions"><button type="button" class="al-btn al-btn--primary al-btn--sm">发送</button><button type="button" class="al-btn al-btn--sm">改一改</button><button type="button" class="al-btn al-btn--ghost al-btn--sm">自己写</button></div></div>' +
        '<div class="al-line" style="margin-top:12px">周明也问了停车 · 发完这条可以顺手回他</div></div>';
      else thread = '<div class="al-dm-thread"><div style="display:flex;align-items:center;gap:10px"><span class="jd-person-av">李</span><div><div class="jd-person-name">李伟</div><div class="jd-person-sub">报名成功 · 产品</div></div></div>' +
        '<div class="al-user-bubble" style="align-self:flex-start;border-radius:6px 16px 16px 16px;margin-top:18px">有停车吗？</div>' +
        '<div class="al-user-bubble" style="margin-left:auto;background:color-mix(in srgb, var(--v-brand-signal) 10%, transparent);border-color:color-mix(in srgb, var(--v-brand-signal) 30%, transparent)">有的。科兴科学园地下车库，晚上 6 点后免费，从 B 栋电梯上 2 楼。<div style="margin-top:4px;font-size:11px;color:var(--v-text-tertiary)">你 · 刚刚</div></div>' +
        '<div class="ce2-pub-hero" style="margin-top:18px"><span class="ce2-pub-hero-icon" style="background:color-mix(in srgb, var(--v-brand-signal) 10%, transparent);color:var(--v-signal-text)">' + h.SPARK + '</span><div><div class="ce2-pub-hero-title">3 个人问了「停车」</div><div class="ce2-pub-hero-sub">李伟、周明、韩露 · 加到详情，第 4 个人就不用问</div></div><div style="margin-left:auto;display:flex;gap:8px"><button type="button" class="al-btn al-btn--primary al-btn--sm">加到详情</button><button type="button" class="al-btn al-btn--sm">顺便回周明</button></div></div></div>';
      return h.webShell({ tabs: [], title: '消息', sub: 'Vibers Shanghai · 主办方视角', actions: '', body: '<div class="al-dm">' + list + thread + '</div>' }) + (s === 1 ? h.toast('已发送给李伟') : '');
    }
  });
})();
