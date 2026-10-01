/* AI 辅助原型 · 07 数据（E01–E03）· 主办方级「数据」页 + 单场「数据」分区 + AI 分析
   这三屏是 Vibers-web 里已经实现的页面（src/pages/HostManage/Insights.tsx、ActivityInsightsSection.tsx）的静态复刻，
   数字取自 mock/roster.mts 2026-10-01 的一份快照；口径见 后端修改需求sep23.md 第 49–51 条。 */
(function () {
  'use strict';
  var R = window.AILab.register;

  /* ───────── 样式：只用 token，四档墨色是正文色的透明度 ───────── */
  var css = '' +
    '.dx{display:flex;flex-direction:column;gap:32px;font-family:var(--v-font-mixed)}' +
    '.dx-head{display:flex;align-items:center;justify-content:space-between;gap:16px}' +
    '.dx-title{font:500 22px/30px var(--v-font-mixed);letter-spacing:-.01em;color:var(--v-text-primary)}' +
    '.dx-select{display:inline-flex;align-items:center;gap:8px;height:32px;padding:0 10px;border-radius:10px;border:1px solid var(--v-border-default);font:400 12.5px/1 var(--v-font-mixed);color:var(--v-text-primary)}' +
    '.dx-select svg{color:var(--v-text-tertiary)}' +
    '.dx-stamp{margin:-20px 0 0;font:400 12px/18px var(--v-font-mixed);color:var(--v-text-tertiary);font-variant-numeric:tabular-nums}' +
    '.dx-hl{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border-radius:14px;background:color-mix(in srgb, var(--v-text-primary) 3%, transparent)}' +
    '.dx-line{display:flex;align-items:flex-start;gap:10px;margin:0;font:400 13px/20px var(--v-font-mixed);color:var(--v-text-primary);font-variant-numeric:tabular-nums}' +
    '.dx-line i{flex:none;width:6px;height:6px;margin-top:7px;border-radius:50%;background:color-mix(in srgb, var(--v-text-primary) 40%, transparent)}' +
    '.dx-line--muted{color:var(--v-text-tertiary)}' +
    '.dx-tiles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-radius:18px;overflow:hidden;background:color-mix(in srgb, var(--v-text-primary) 3%, transparent);box-shadow:inset 0 1px 0 color-mix(in srgb, var(--v-text-primary) 6%, transparent)}' +
    '.dx-tiles--3{grid-template-columns:repeat(3,minmax(0,1fr))}' +
    '.dx-tile{min-width:0;padding:18px 20px 16px;border-right:1px solid var(--v-border-subtle)}.dx-tile:last-child{border-right:0}' +
    '.dx-tile-l{font:400 12px/18px var(--v-font-mixed);color:var(--v-text-tertiary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.dx-tile-v{margin-top:6px;font:500 22px/30px Sora,sans-serif;font-variant-numeric:tabular-nums;color:var(--v-text-primary)}' +
    '.dx-tile-u{margin-left:4px;font:400 13px/1 var(--v-font-mixed);color:var(--v-text-secondary)}' +
    '.dx-tile-n{margin-top:4px;font:400 12px/18px var(--v-font-mixed);color:var(--v-text-tertiary);font-variant-numeric:tabular-nums}' +
    '.dx-block{display:flex;flex-direction:column;gap:12px}' +
    '.dx-bh{display:flex;align-items:baseline;gap:12px}' +
    '.dx-bt{font:500 14px/20px var(--v-font-mixed);color:var(--v-text-secondary)}' +
    '.dx-bm{font:400 12px/18px var(--v-font-mixed);color:var(--v-text-tertiary);font-variant-numeric:tabular-nums}' +
    '.dx-br{margin-left:auto}' +
    '.dx-t1{background:color-mix(in srgb, var(--v-text-primary) 64%, transparent)}.dx-t2{background:color-mix(in srgb, var(--v-text-primary) 44%, transparent)}.dx-t3{background:color-mix(in srgb, var(--v-text-primary) 26%, transparent)}.dx-t4{background:color-mix(in srgb, var(--v-text-primary) 14%, transparent)}' +
    '.dx-legend{display:inline-flex;align-items:center;flex-wrap:wrap;gap:12px;font:400 12px/18px var(--v-font-mixed);color:var(--v-text-tertiary);font-variant-numeric:tabular-nums}' +
    '.dx-legend span{display:inline-flex;align-items:center;gap:6px}.dx-legend i{display:inline-block;width:12px;height:6px;border-radius:3px}' +
    '.dx-cols{display:flex;flex-direction:column;gap:6px}' +
    '.dx-cols-plot{display:flex;align-items:flex-end;gap:6px;height:120px;padding-top:18px;box-sizing:content-box;border-bottom:1px solid var(--v-border-subtle)}' +
    '.dx-cols-slot{flex:1 1 0;min-width:0;height:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:4px}' +
    '.dx-cols-v{font:400 12px/18px var(--v-font-mixed);color:var(--v-text-secondary);white-space:nowrap;font-variant-numeric:tabular-nums}' +
    '.dx-cols-stack{display:flex;flex-direction:column-reverse;gap:2px;width:min(100%,24px)}' +
    '.dx-cols-stack i{display:block;flex:0 0 auto;min-height:2px}.dx-cols-stack i:last-child{border-radius:4px 4px 0 0}' +
    '.dx-cols-axis{display:flex;gap:6px}.dx-cols-axis span{flex:1 1 0;min-width:0;text-align:center;font:400 12px/18px var(--v-font-mixed);color:var(--v-text-tertiary);white-space:nowrap}' +
    '.dx-hb{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}' +
    '.dx-hb li{display:grid;grid-template-columns:200px minmax(0,1fr) 56px;align-items:center;gap:12px;font:400 13px/20px var(--v-font-mixed);color:var(--v-text-primary)}' +
    '.dx-hb--q li{grid-template-columns:132px minmax(0,1fr) 96px}' +
    '.dx-hb-l{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.dx-hb-t{position:relative;height:6px;display:flex}.dx-hb-t b{display:block;height:100%;border-radius:3px;min-width:2px}' +
    '.dx-hb-m{position:absolute;top:-3px;bottom:-3px;width:2px;margin-left:-1px;border-radius:1px;background:var(--v-text-primary)}' +
    '.dx-hb-v{text-align:right;font-variant-numeric:tabular-nums;color:var(--v-text-secondary);white-space:nowrap}' +
    '.dx-stack{display:flex;flex-direction:column;gap:8px}.dx-stack-bar{display:flex;gap:2px;height:8px}.dx-stack-bar i{display:block;min-width:3px;border-radius:4px}' +
    '.dx-sub{display:flex;flex-direction:column;gap:8px;margin-top:8px}.dx-sub-t{font:400 12px/18px var(--v-font-mixed);color:var(--v-text-tertiary)}' +
    '.dx-tbl{width:100%;border-collapse:collapse}.dx-tbl th,.dx-tbl td{padding:8px 10px;text-align:right;border-bottom:1px solid var(--v-border-subtle);font:400 13px/20px var(--v-font-mixed);color:var(--v-text-primary);font-variant-numeric:tabular-nums}' +
    '.dx-tbl th{padding-top:0;font:500 12px/18px var(--v-font-mixed);color:var(--v-text-tertiary);white-space:nowrap}.dx-tbl th:first-child,.dx-tbl td:first-child{text-align:left;padding-left:0}.dx-tbl th:last-child,.dx-tbl td:last-child{padding-right:0}.dx-tbl tbody tr:last-child td{border-bottom:0}' +
    '.dx-tbl .dx-thin td{color:var(--v-text-tertiary)}.dx-tbl .dx-diff{color:var(--v-text-secondary)}' +
    '.dx-ev{width:calc(100% + 20px);margin:0 -10px;border-collapse:collapse;table-layout:fixed}' +
    '.dx-ev th,.dx-ev td{padding:12px 10px;text-align:right;vertical-align:middle;border-bottom:1px solid var(--v-border-subtle);font-variant-numeric:tabular-nums}' +
    '.dx-ev th{padding-top:0;font:500 12px/18px var(--v-font-mixed);color:var(--v-text-tertiary);white-space:nowrap}.dx-ev th:first-child,.dx-ev td:first-child{text-align:left}.dx-ev tbody tr:last-child td{border-bottom:0}' +
    '.dx-ev col.n{width:84px}' +
    '.dx-ev tr{cursor:pointer}.dx-ev tr:hover td{background:color-mix(in srgb, var(--v-text-primary) 4%, transparent)}.dx-ev td:first-child{border-radius:10px 0 0 10px}.dx-ev td:last-child{border-radius:0 10px 10px 0}' +
    '.dx-ev-a{display:flex;align-items:center;gap:12px;min-width:0}' +
    '.dx-ev-c{flex:none;width:44px;height:33px;border-radius:10px;display:grid;place-items:center;font:500 13px/1 Sora,sans-serif;color:var(--v-text-secondary);background:color-mix(in srgb, var(--v-text-primary) 8%, transparent)}' +
    '.dx-ev-t{font:400 15px/24px var(--v-font-mixed);color:var(--v-text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dx-ev-d{font:400 12px/18px var(--v-font-mixed);color:var(--v-text-tertiary);white-space:nowrap}' +
    '.dx-num{font:400 15px/24px var(--v-font-mixed);color:var(--v-text-primary);white-space:nowrap}.dx-num--low{color:var(--v-text-tertiary)}.dx-num small{margin-left:4px;font-size:12px;color:var(--v-text-tertiary)}' +
    '.dx-fun{display:grid;grid-template-columns:minmax(0,1fr) 220px;gap:24px;align-items:start}' +
    '.dx-fun-steps{display:flex;flex-direction:column;gap:10px}.dx-fun-step{display:grid;grid-template-columns:64px minmax(0,1fr) 72px;align-items:center;gap:12px;font:400 13px/20px var(--v-font-mixed);color:var(--v-text-primary)}' +
    '.dx-fun-t{height:12px;display:flex}.dx-fun-t i{display:block;height:100%;min-width:3px;border-radius:0 4px 4px 0}.dx-fun-v{font-variant-numeric:tabular-nums;white-space:nowrap}.dx-fun-v small{margin-left:4px;font-size:12px;color:var(--v-text-tertiary)}' +
    '.dx-fun-br{list-style:none;margin:0;padding:0 0 0 16px;border-left:1px solid var(--v-border-subtle);display:flex;flex-direction:column;gap:8px}.dx-fun-br li{display:flex;justify-content:space-between;gap:10px;font:400 13px/20px var(--v-font-mixed);color:var(--v-text-primary)}.dx-fun-br b{font-weight:400;font-variant-numeric:tabular-nums;white-space:nowrap}' +
    '.dx-lc{position:relative}.dx-lc svg{display:block;overflow:visible;width:100%}' +
    '.dx-lc-base{stroke:var(--v-border-subtle);stroke-width:1}.dx-lc-area{fill:color-mix(in srgb, var(--v-text-primary) 8%, transparent)}.dx-lc-path{fill:none;stroke:color-mix(in srgb, var(--v-text-primary) 64%, transparent);stroke-width:2;stroke-linejoin:round;stroke-linecap:round}.dx-lc-dot{fill:color-mix(in srgb, var(--v-text-primary) 64%, transparent);stroke:var(--v-bg-primary);stroke-width:2}.dx-lc-mark{stroke:color-mix(in srgb, var(--v-text-primary) 28%, transparent);stroke-width:1}' +
    '.dx-lc-labels{position:absolute;inset:0;pointer-events:none}.dx-lc-ml{position:absolute;top:0;transform:translateX(-50%);font:400 12px/18px var(--v-font-mixed);color:var(--v-text-tertiary);white-space:nowrap}' +
    '.dx-lc-axis{display:flex;justify-content:space-between;margin-top:4px;font:400 12px/18px var(--v-font-mixed);color:var(--v-text-tertiary)}' +
    '.dx-q{display:flex;flex-direction:column;gap:8px}.dx-q+.dx-q{margin-top:12px}.dx-q-t{display:flex;align-items:center;gap:8px;font:400 15px/24px var(--v-font-mixed);color:var(--v-text-primary)}.dx-q-m{font:400 12px/18px var(--v-font-mixed);color:var(--v-text-tertiary)}' +
    '.dx-link{color:var(--v-signal-text);cursor:pointer}' +
    '.dx-ai{margin:0;padding:0 0 0 22px;display:flex;flex-direction:column;gap:10px;font:400 15px/24px var(--v-font-mixed);color:var(--v-text-primary);font-variant-numeric:tabular-nums}.dx-ai li::marker{color:var(--v-text-tertiary)}' +
    '.dx-ai-foot{display:flex;align-items:center;gap:12px;font:400 12px/18px var(--v-font-mixed);color:var(--v-text-tertiary)}' +
    '.dx-ai-empty{display:flex;align-items:center;gap:12px}' +
    '.dx-btn{display:inline-flex;align-items:center;height:32px;padding:0 13px;border-radius:10px;border:1px solid var(--v-border-strong);background:none;color:var(--v-text-primary);font:500 12.5px/1 var(--v-font-mixed);cursor:pointer}' +
    '.dx-method{padding-top:16px;border-top:1px solid var(--v-border-subtle);font:400 13px/20px var(--v-font-mixed);color:var(--v-text-tertiary)}' +
    '.dx-chips{display:flex;flex-wrap:wrap;gap:8px}.dx-chip{display:inline-flex;align-items:center;gap:6px;min-height:30px;padding:0 11px;border-radius:10px;border:1px solid var(--v-border-default);font:400 13px/20px var(--v-font-mixed);color:var(--v-text-primary)}.dx-chip b{font-weight:400;font-variant-numeric:tabular-nums;color:var(--v-text-tertiary)}' +
    '.dx-aud{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:24px;align-items:start}.dx-aud-col{display:flex;flex-direction:column;gap:10px;min-width:0}.dx-aud-l{font:400 12px/18px var(--v-font-mixed);color:var(--v-text-tertiary)}.dx-aud .dx-hb li{grid-template-columns:96px minmax(0,1fr) 72px}' +
    '.dx-ws{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.dx-ws-t{font:500 22px/30px var(--v-font-mixed);letter-spacing:-.01em;color:var(--v-text-primary)}.dx-ws-s{margin-top:2px;font:400 12px/18px var(--v-font-mixed);color:var(--v-text-tertiary)}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ───────── 数据快照（mock/roster.mts · 2026-10-01，主办方 h1 · 过去 90 天） ───────── */
  var HOST = {
    range: '7 月 2 日 – 9 月 30 日',
    totals: { ended: 8, people: 151, registered_online: 178, attended_online: 151, rated_count: 51, rating_sum: 200, again_true: 36, again_false: 11, feedback_count: 59 },
    prev: { ended: 1, people: 41, rated_count: 9, rating_sum: 37.5 },
    community: { people: 151, tier_1: 101, tier_2_3: 32, tier_4_plus: 18, prev: { people: 41, tier_1: 30 } },
    connections: { new_pairs: 1667, repeat_pairs: 85, followed_pairs: 108, pending_events: 1, prev: { new_pairs: 792, repeat_pairs: 28, followed_pairs: 50 } },
    feedback: { count: 59, tags: { host: 12, chat: 15, safe: 9, people: 16, clock: 13, match: 19, newfriend: 23, place: 18, gain: 14 }, platform: { count: 80, tags: { host: 18, chat: 21, safe: 13, people: 22, clock: 20, match: 25, newfriend: 28, place: 24, gain: 21 } } },
    highlights: [
      '活动后一周互相关注的组合 108 对，比上个 90 天多 116%',
      '第一次来的人里 90 天内又来的占 33%，比上个 90 天低 17 个点'
    ],
    events: [
      { title: '开源项目之夜', day: '9 月 27 日 · 周日', d: '9/27', size: 'm', review: false, reg: 21, att: 17, first: 13, follow: null, pending: true, fb: 10, rated: 9, sum: 36.5, again: [4, 4] },
      { title: '设计师交流', day: '9 月 20 日 · 周日', d: '9/20', size: 's', review: true, reg: 15, att: 10, first: 7, follow: 3, fb: 5, rated: 5, sum: 19, again: [3, 1] },
      { title: '独立开发者茶话会 · 九月场', day: '9 月 13 日 · 周日', d: '9/13', size: 'm', review: false, reg: 29, att: 24, first: 15, follow: 19, fb: 11, rated: 9, sum: 37.5, again: [9, 1] },
      { title: 'Prompt 工作坊', day: '9 月 6 日 · 周日', d: '9/6', size: 'm', review: true, reg: 24, att: 20, first: 9, follow: 15, fb: 8, rated: 7, sum: 24, again: [3, 2] },
      { title: '产品经理读书会 · 第二期', day: '8 月 30 日 · 周日', d: '8/30', size: 's', review: false, reg: 12, att: 11, first: 5, follow: 2, fb: 5, rated: 5, sum: 18.5, again: [3, 2] },
      { title: '春季聚会', day: '8 月 16 日 · 周日', d: '8/16', size: 'l', review: false, reg: 43, att: 42, first: 32, follow: 59, fb: 10, rated: 6, sum: 26.5, again: [8, 0] },
      { title: '开源项目之夜 · 八月场', day: '8 月 1 日 · 周六', d: '8/1', size: 'm', review: true, reg: 23, att: 18, first: 13, follow: 8, fb: 7, rated: 7, sum: 26.5, again: [4, 0] },
      { title: '设计师交流 · 七月场', day: '7 月 17 日 · 周五', d: '7/17', size: 's', review: false, reg: 11, att: 9, first: 7, follow: 2, fb: 3, rated: 3, sum: 11.5, again: [2, 1] }
    ]
  };
  var A19 = {
    title: '独立开发者茶话会 · 九月场', sub: '哈哈 · 9 月 13 日 周日 14:00–17:00 · 已结束',
    funnel: { all: 37, approved: 29, attended: 24, rejected: 2, ended: 3, cancelled: 3, noshow: 5, waitlisted: 5, promoted: 3, promoted_in: 2 },
    connections: { new_pairs: 260, repeat_pairs: 16, followed_pairs: 19, attended: 24 },
    crowd: { people: 24, first: 15, some: 5, regular: 4, unknown_rate: 0.913 },
    feedback: { checked: 24, count: 11, rated: 9, sum: 37.5, again: [9, 1], tags: { host: 2, chat: 1, safe: 0, people: 4, clock: 3, match: 3, newfriend: 7, place: 1, gain: 4 } },
    platform: HOST.feedback.platform,
    baseline: { events: 9, attend: 83, first: 69, per10: 9.2, rating: 4.0, again: 80 },
    ai: [
      ['「场地不错」被选 9%，平台均值 30%。下次换个场地，或者在活动信息里把场地情况写清楚。', '去改'],
      ['报名成功的人里 5 人没来（17%）。开场前一天的自动提醒开着就好；上限 30 可以按到场率多放几个名额。', '去改'],
      ['「聊得投机」被选 9%，平台均值 26%。把人数控制在 20 人以内，或者分小组。', '去改'],
      ['「氛围放松」被选 0%，平台均值 16%。换个安静一点的场地。', '去改'],
      ['3 人等到结束都没审核。下次开「待审核提醒」，或者这类场次改成免审核。', '去改']
    ]
  };
  var A3 = {
    title: '投资人面对面', sub: '哈哈 · 10 月 5 日 周一 19:30–21:30 · 开始前',
    daily: [1, 1, 5, 8, 9, 10, 11, 16, 20, 24, 25, 26, 28, 30, 32, 35, 38, 43, 49, 55, 65, 65],
    marks: [10, 11, 13, 16, 18, 19, 21],
    progress: { registered: 58, remaining: 2, capacity: 60, pending: 4, pending_over: 4, new_7d: 35, days_open: 20, days_left: 4 },
    crowd: { people: 58, first: 44, some: 9, regular: 5, unknown_rate: 0.931 },
    questions: [
      { title: '你现在处在哪个阶段', answered: 65, options: [['还是想法', 22], ['已有产品', 22], ['已经融过资', 21]] },
      { title: '最想问投资人的一个问题', text: true, filled: 65 }
    ]
  };
  var TAGS = [['host', '组织者用心'], ['chat', '聊得投机'], ['safe', '氛围放松'], ['people', '参与者合拍'], ['clock', '准时开始'], ['match', '和描述一致'], ['newfriend', '认识新朋友'], ['place', '场地不错'], ['gain', '很有收获']];

  /* ───────── 小件 ───────── */
  function pct(a, b) { return b ? Math.round(a / b * 100) : null; }
  function rating(sum, n) { return n >= 3 ? (sum / n).toFixed(1) : '—'; }
  function fmt(n) { return Number(n).toLocaleString('zh-CN'); }
  function tile(l, v, u, n) { return '<div class="dx-tile"><div class="dx-tile-l">' + l + '</div><div class="dx-tile-v">' + v + (u ? '<span class="dx-tile-u">' + u + '</span>' : '') + '</div>' + (n ? '<div class="dx-tile-n">' + n + '</div>' : '') + '</div>'; }
  function tiles(items, three) { return '<div class="dx-tiles' + (three ? ' dx-tiles--3' : '') + '">' + items.join('') + '</div>'; }
  function block(title, meta, body, right) { return '<section class="dx-block"><div class="dx-bh"><span class="dx-bt">' + title + '</span>' + (meta ? '<span class="dx-bm">' + meta + '</span>' : '') + (right ? '<span class="dx-br">' + right + '</span>' : '') + '</div>' + body + '</section>'; }
  function line(text, muted) { return '<p class="dx-line' + (muted ? ' dx-line--muted' : '') + '"><i></i><span>' + text + '</span></p>'; }
  function legend(items) { return '<span class="dx-legend">' + items.map(function (i) { return '<span><i class="dx-t' + i[1] + '"></i>' + i[0] + '</span>'; }).join('') + '</span>'; }
  function select(label) { return '<span class="dx-select">' + label + '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg></span>'; }
  function hbars(rows, opt) {
    opt = opt || {};
    var max = Math.max(1, Math.max.apply(null, rows.map(function (r) { return Math.max(r.v, r.m || 0); })));
    return '<ul class="dx-hb' + (opt.cls ? ' ' + opt.cls : '') + '">' + rows.map(function (r) {
      return '<li><span class="dx-hb-l">' + r.l + '</span><span class="dx-hb-t"><b class="dx-t' + (opt.tone || 2) + '" style="width:' + (r.v / max * 100) + '%"></b>' + (r.m != null ? '<i class="dx-hb-m" style="left:' + (r.m / max * 100) + '%"></i>' : '') + '</span><span class="dx-hb-v">' + r.t + '</span></li>';
    }).join('') + '</ul>';
  }
  function stack(segs) {
    var total = segs.reduce(function (s, x) { return s + x[1]; }, 0);
    return '<div class="dx-stack"><div class="dx-stack-bar">' + segs.filter(function (s) { return s[1] > 0; }).map(function (s) { return '<i class="dx-t' + s[2] + '" style="flex-basis:' + (s[1] / total * 100) + '%"></i>'; }).join('') + '</div>' + legend(segs.map(function (s) { return [s[0] + ' ' + s[1], s[2]]; })) + '</div>';
  }
  function cols(data) {
    var totals = data.map(function (d) { return d.back + d.first; });
    var max = Math.max.apply(null, totals), mi = totals.indexOf(max);
    return '<div class="dx-cols"><div class="dx-cols-plot">' + data.map(function (d, i) {
      var t = totals[i];
      return '<div class="dx-cols-slot">' + (i === mi || i === data.length - 1 ? '<span class="dx-cols-v">' + t + ' 人</span>' : '') + '<span class="dx-cols-stack" style="height:' + (t / max * 100) + '%"><i class="dx-t1" style="flex-basis:' + (d.back / t * 100) + '%"></i><i class="dx-t3" style="flex-basis:' + (d.first / t * 100) + '%"></i></span></div>';
    }).join('') + '</div><div class="dx-cols-axis">' + data.map(function (d) { return '<span>' + d.d + '</span>'; }).join('') + '</div>' + legend([['来过', 1], ['第一次来', 3]]) + '</div>';
  }
  function lineChart(values, marks, first, last) {
    var W = 700, H = 120, px = 8, pt = 18, pb = 8, pw = W - px * 2, ph = H - pt - pb, max = Math.max.apply(null, values), step = pw / (values.length - 1);
    var x = function (i) { return (px + i * step).toFixed(1); }, y = function (v) { return (pt + ph - v / max * ph).toFixed(1); };
    var path = values.map(function (v, i) { return (i ? 'L' : 'M') + x(i) + ' ' + y(v); }).join(' ');
    var area = path + ' L' + x(values.length - 1) + ' ' + (pt + ph) + ' L' + x(0) + ' ' + (pt + ph) + ' Z';
    var lastX = -999, labels = '';
    var ml = marks.map(function (m) { var xm = px + m * step; var show = xm - lastX >= 72; if (show) lastX = xm; return '<line class="dx-lc-mark" x1="' + xm + '" x2="' + xm + '" y1="' + (pt - 6) + '" y2="' + (pt + ph) + '"></line>' + (show ? '<!--l' + xm + '-->' : ''); }).join('');
    lastX = -999;
    marks.forEach(function (m) { var xm = px + m * step; if (xm - lastX >= 72) { lastX = xm; labels += '<span class="dx-lc-ml" style="left:' + (xm / W * 100) + '%">发布通知</span>'; } });
    return '<div class="dx-lc"><svg viewBox="0 0 ' + W + ' ' + H + '" height="' + H + '"><line class="dx-lc-base" x1="' + px + '" x2="' + (W - px) + '" y1="' + (pt + ph) + '" y2="' + (pt + ph) + '"></line>' + ml + '<path class="dx-lc-area" d="' + area + '"></path><path class="dx-lc-path" d="' + path + '"></path><circle class="dx-lc-dot" cx="' + x(values.length - 1) + '" cy="' + y(values[values.length - 1]) + '" r="4"></circle></svg><div class="dx-lc-labels">' + labels + '</div><div class="dx-lc-axis"><span>' + first + '</span><span>' + last + '</span></div></div>';
  }
  // AI 分析块：按钮在标题行右上角（和别处的 AI 入口一样），生成前只有一行说明，生成后是编号列表
  function aiBlock(h, points, done, withLinks) {
    var body = done
      ? '<ol class="dx-ai">' + points.map(function (p) { return '<li>' + p[0] + (withLinks && p[1] ? ' <span class="dx-link">' + p[1] + '</span>' : '') + '</li>'; }).join('') + '</ol>'
      : line('只看活动设置和汇总数，不看任何人', true);
    return block('AI 分析', done ? 'AI 生成，可能有误 · 10 月 1 日' : (withLinks ? '根据这场的设置和数据，给下一场的建议' : '根据这段时间的数据，给接下来的建议'), body, h.aiBtn(done ? '重新生成' : '生成分析'));
  }
  /* 来的人：按名片归类（职业 / 标签 / 城市），只有类别和人数。快照同 mock 的 audience 字段 */
  var HOST_AUD = { people: 151, titles: [['学生', 22], ['创业者', 21], ['市场', 20], ['投资人', 19], ['运营', 19], ['产品经理', 17], ['设计师', 17], ['工程师', 16]], tags: [['游戏', 22], ['摄影', 21], ['品牌', 20], ['写作', 20], ['创业', 19], ['产品设计', 19], ['设计系统', 18], ['数据', 17], ['社区运营', 16], ['开源', 16], ['硬件', 15], ['AI', 15]], cities: [['上海', 33], ['杭州', 30], ['深圳', 30], ['苏州', 30], ['北京', 28]] };
  var A19_AUD = { people: 24, titles: [['创业者', 4], ['学生', 4], ['运营', 3], ['投资人', 3], ['市场', 3], ['产品经理', 3], ['工程师', 2], ['设计师', 2]], tags: [['游戏', 7], ['内容创作', 4], ['开源', 4], ['产品设计', 4], ['创业', 4], ['AI', 4], ['社区运营', 4], ['数据', 3], ['教育', 3], ['硬件', 3], ['前端', 2]], cities: [['深圳', 5], ['苏州', 5], ['上海', 5], ['杭州', 5], ['北京', 4]] };
  var A3_AUD = { people: 58, titles: [['产品经理', 9], ['工程师', 8], ['创业者', 8], ['设计师', 7], ['运营', 7], ['学生', 7], ['投资人', 6], ['市场', 6]], tags: [['创业', 14], ['AI', 12], ['产品设计', 10], ['投资', 9], ['独立开发', 8], ['数据', 7], ['开源', 6], ['硬件', 5], ['社区运营', 5], ['内容创作', 4], ['前端', 3], ['写作', 3]], cities: [['上海', 31], ['杭州', 11], ['深圳', 8], ['北京', 5], ['苏州', 3]] };
  function audience(a, pctCities) {
    var cities = a.cities.map(function (c) { return c[0] + ' ' + (pctCities ? pct(c[1], a.people) + '%' : c[1]); }).join(' / ');
    var body = '<div class="dx-aud"><div class="dx-aud-col"><span class="dx-aud-l">职业</span>' + hbars(a.titles.map(function (t) { return { l: t[0], v: t[1], t: t[1] + ' 人' }; })) + '</div>' +
      '<div class="dx-aud-col"><span class="dx-aud-l">标签</span><div class="dx-chips">' + a.tags.map(function (t) { return '<span class="dx-chip">' + t[0] + '<b>' + t[1] + ' 人</b></span>'; }).join('') + '</div></div></div>';
    return { meta: a.people + ' 人有名片信息 · ' + cities, body: body };
  }
  var HOST_AI = [
    ['16–40 人的场每 10 个到场者互相关注 6.8 对，15 人以内 2.3 对。想让人认识，人数上限按 30 左右设。'],
    ['第一次来的人里 90 天内又来的只有 33%。每场结束后一周内把下一场发出来，新人还记得你的时候最容易再来。'],
    ['到场的人 67% 是第一次来，老面孔少。可以试一场只对来过的人开放的小场，把关系接住。'],
    ['「场地不错」被选的比例比平台均值低 10 个点。场地是这段时间最常被忽略的一项，换一个或者在活动信息里写清。']
  ];

  /* ───────── E01 主办方数据页 ───────── */
  function hostPage(h, aiDone) {
    var t = HOST.totals, p = HOST.prev, c = HOST.community, k = HOST.connections, f = HOST.feedback;
    // 分组对比：按到场人数 15 以内 / 16–40 / 41+
    var groups = { s: { l: '15 人以内' }, m: { l: '16–40 人' }, l: { l: '41 人以上' } };
    Object.keys(groups).forEach(function (g) { groups[g].ev = HOST.events.filter(function (e) { return e.size === g; }); });
    function metric(g, key) {
      var ev = g.ev, att = ev.reduce(function (s, e) { return s + e.att; }, 0);
      if (ev.length < 3 || att < 30) return '—';
      if (key === 'rate') return pct(att, ev.reduce(function (s, e) { return s + e.reg; }, 0)) + '%';
      if (key === 'first') return pct(ev.reduce(function (s, e) { return s + e.first; }, 0), att) + '%';
      if (key === 'per10') { var q = ev.filter(function (e) { return e.follow != null; }); var a2 = q.reduce(function (s, e) { return s + e.att; }, 0); return a2 ? (q.reduce(function (s, e) { return s + e.follow; }, 0) / a2 * 10).toFixed(1) + ' 对' : '—'; }
      var at = ev.reduce(function (s, e) { return s + e.again[0]; }, 0), af = ev.reduce(function (s, e) { return s + e.again[1]; }, 0);
      return at + af >= 10 ? pct(at, at + af) + '%' : '—';
    }
    var cmp = '<table class="dx-tbl"><thead><tr><th>按人数</th><th>场</th><th>到场率</th><th>第一次来的占比</th><th>每 10 个到场者活动后互相关注</th><th>说会再来</th></tr></thead><tbody>' + ['s', 'm', 'l'].map(function (g) {
      var G = groups[g], thin = G.ev.length < 3;
      return '<tr' + (thin ? ' class="dx-thin"' : '') + '><td>' + G.l + '</td><td>' + G.ev.length + '</td><td>' + metric(G, 'rate') + '</td><td>' + metric(G, 'first') + '</td><td>' + metric(G, 'per10') + '</td><td>' + metric(G, 'again') + '</td></tr>';
    }).join('') + '</tbody></table>';
    var hl = ['16–40 人的每 10 个到场者活动后互相关注 ' + metric(groups.m, 'per10') + '，15 人以内 ' + metric(groups.s, 'per10') + '（' + groups.m.ev.length + ' 场 vs ' + groups.s.ev.length + ' 场）'].concat(HOST.highlights);
    var avgRate = pct(t.attended_online, t.registered_online), avgRating = t.rating_sum / t.rated_count;
    var ev = '<table class="dx-ev"><colgroup><col><col class="n"><col class="n"><col class="n"><col class="n"></colgroup><thead><tr><th>活动</th><th>到场</th><th>第一次来</th><th>互相关注</th><th>评分</th></tr></thead><tbody>' + HOST.events.map(function (e) {
      var r = e.reg >= 10 ? pct(e.att, e.reg) : null, rt = e.rated >= 3 ? e.sum / e.rated : null;
      return '<tr><td><span class="dx-ev-a"><span class="dx-ev-c">' + e.title.slice(0, 1) + '</span><span><div class="dx-ev-t">' + e.title + '</div><div class="dx-ev-d">' + e.day + '</div></span></span></td>' +
        '<td class="dx-num' + (r != null && r < avgRate ? ' dx-num--low' : '') + '">' + e.att + (r != null ? '<small>' + r + '%</small>' : '') + '</td><td class="dx-num">' + e.first + '</td><td class="dx-num">' + (e.follow != null ? e.follow : '<small>7 天后</small>') + '</td><td class="dx-num' + (rt != null && rt < avgRating ? ' dx-num--low' : '') + '">' + (rt != null ? rt.toFixed(1) : '—') + '<small>(' + e.fb + ')</small></td></tr>';
    }).join('') + '</tbody></table>';
    var tagRows = TAGS.map(function (tg) { return { l: tg[1], v: pct(f.tags[tg[0]], f.count), m: pct(f.platform.tags[tg[0]], f.platform.count), t: pct(f.tags[tg[0]], f.count) + '%' }; }).sort(function (a, b) { return b.v - a.v; });
    return '<div class="dx">' +
      '<div class="dx-head"><span class="dx-title">数据</span>' + select('过去 90 天') + '</div>' +
      '<p class="dx-stamp">' + HOST.range + '</p>' +
      '<div class="dx-hl">' + hl.map(function (s) { return line(s); }).join('') + '</div>' +
      tiles([tile('活动', t.ended, '场', '上个 90 天 ' + p.ended + ' 场'), tile('到场', t.people, '人', '上个 90 天 ' + p.people + ' 人'), tile('回头客', (100 - pct(c.tier_1, c.people)) + '%', '', '上个 90 天 ' + (100 - pct(c.prev.tier_1, c.prev.people)) + '%'), tile('评分', avgRating.toFixed(1), '', '上个 90 天 ' + (p.rating_sum / p.rated_count).toFixed(1))]) +
      block('到场', '按场', cols(HOST.events.slice().reverse().map(function (e) { return { d: e.d, back: e.att - e.first, first: e.first }; }))) +
      (function () { var au = audience(HOST_AUD, true); return block('来的人', au.meta, au.body); })() +
      block('人和人', '只算对数，不看是谁', tiles([tile('第一次同场', fmt(k.new_pairs), '对', '上个 90 天 ' + fmt(k.prev.new_pairs) + ' 对'), tile('活动后互相关注', k.followed_pairs, '对', k.pending_events + ' 场还没满 7 天 · 上个 90 天 ' + k.prev.followed_pairs + ' 对'), tile('再次见面', k.repeat_pairs, '对', '上个 90 天 ' + k.prev.repeat_pairs + ' 对')], true)) +
      block('哪种场更好', '', cmp, select('按人数')) +
      block('评价', '平均 ' + avgRating.toFixed(1) + ' · ' + t.rated_count + ' 人打分 · ' + pct(t.again_true, t.again_true + t.again_false) + '% 会再来', hbars(tagRows), '<span class="dx-bm">竖线是平台均值</span>') +
      block('每场', '', ev) +
      aiBlock(h, HOST_AI, aiDone, false) + '</div>';
  }

  /* ───────── E02 单场 · 结束后 ───────── */
  var TABS = ['概览', '嘉宾与支持', '本场人员', '报名设置', '报名审核', '通知', '数据', '反馈'];
  function shell(h, title, sub, body) {
    return h.webShell({ title: title, sub: sub, status: 'ended', tabs: TABS, tab: '数据', actions: '<button type="button" class="ce2-btn-outline">分享</button><button type="button" class="ce2-btn-outline">下架</button>', body: body });
  }
  function endedPage(h, aiDone) {
    var f = A19.funnel, k = A19.connections, c = A19.crowd, fb = A19.feedback, b = A19.baseline;
    var rate = pct(f.attended, f.approved), per10 = (k.followed_pairs / k.attended * 10).toFixed(1), rt = (fb.sum / fb.rated).toFixed(1), again = pct(fb.again[0], fb.again[0] + fb.again[1]), first = pct(c.first, c.people);
    var pairs = c.people * (c.people - 1) / 2, unknown = Math.round(pairs * c.unknown_rate);
    var funnel = '<div class="dx-fun"><div class="dx-fun-steps">' + [['报名', f.all, 3, null], ['报名成功', f.approved, 2, null], ['到场', f.attended, 1, rate + '%']].map(function (s) {
      return '<div class="dx-fun-step"><span>' + s[0] + '</span><span class="dx-fun-t"><i class="dx-t' + s[2] + '" style="width:' + (s[1] / f.all * 100) + '%"></i></span><span class="dx-fun-v">' + s[1] + (s[3] ? '<small>' + s[3] + '</small>' : '') + '</span></div>';
    }).join('') + '</div><ul class="dx-fun-br">' + [['未通过', f.rejected], ['到结束没审', f.ended], ['自己取消', f.cancelled], ['报名成功没来', f.noshow]].map(function (x) { return '<li><span>' + x[0] + '</span><b>' + x[1] + ' 人</b></li>'; }).join('') + '</ul></div>' +
      line('候补 ' + f.waitlisted + ' 人，转正 ' + f.promoted + ' 人，到场 ' + f.promoted_in + ' 人', true);
    var tagRows = TAGS.map(function (tg) { return { l: tg[1], v: pct(fb.tags[tg[0]], fb.count), m: pct(A19.platform.tags[tg[0]], A19.platform.count), t: pct(fb.tags[tg[0]], fb.count) + '%' }; }).sort(function (a, b2) { return b2.v - a.v; });
    var diff = function (a, b2, unit, dec) { var d = a - b2; if (Math.abs(d) < (dec ? 0.1 : 1)) return '持平'; return (d > 0 ? '+' : '−') + (dec ? Math.abs(d).toFixed(1) : Math.abs(Math.round(d))) + unit; };
    var cmp = '<table class="dx-tbl"><thead><tr><th></th><th>这场</th><th>你平时</th><th>差</th></tr></thead><tbody>' +
      '<tr><td>到场率</td><td>' + rate + '%</td><td>' + b.attend + '%</td><td class="dx-diff">' + diff(rate, b.attend, ' 个点') + '</td></tr>' +
      '<tr><td>第一次来</td><td>' + first + '%</td><td>' + b.first + '%</td><td class="dx-diff">' + diff(first, b.first, ' 个点') + '</td></tr>' +
      '<tr><td>每 10 人互相关注</td><td>' + per10 + ' 对</td><td>' + b.per10.toFixed(1) + ' 对</td><td class="dx-diff">' + diff(Number(per10), b.per10, ' 对', true) + '</td></tr>' +
      '<tr><td>评分</td><td>' + rt + '</td><td>' + b.rating.toFixed(1) + '</td><td class="dx-diff">' + diff(Number(rt), b.rating, '', true) + '</td></tr>' +
      '<tr><td>说会再来</td><td>' + again + '%</td><td>' + b.again + '%</td><td class="dx-diff">' + diff(again, b.again, ' 个点') + '</td></tr></tbody></table>';
    var body = '<div class="dx">' +
      '<p class="dx-stamp" style="margin-top:0">已结束</p>' +
      tiles([tile('报名成功', f.approved, '人', '报名 ' + f.all + ' 人'), tile('到场', f.attended, '人', '到场率 ' + rate + '%'), tile('活动后互相关注', k.followed_pairs, '对', fmt(k.new_pairs) + ' 对第一次同场'), tile('评分', rt, '', fb.count + ' 条反馈')]) +
      block('从报名到到场', '', funnel) +
      block('来的是谁', '到场 ' + c.people + ' 人', stack([['第一次来', c.first, 3], ['来过 1–2 场', c.some, 2], ['来过 3 场以上', c.regular, 1]]) + '<div class="dx-sub"><div class="dx-sub-t">彼此之间</div>' + stack([['见过', pairs - unknown, 1], ['没见过', unknown, 3]]) + '</div>' + (function () { var au = audience(A19_AUD); return '<div class="dx-sub"><div class="dx-sub-t">' + au.meta + '</div>' + au.body + '</div>'; })()) +
      block('评价', '平均 ' + rt + ' · ' + fb.checked + ' 人签到，' + fb.count + ' 人写了 · ' + again + '% 会再来', hbars(tagRows), '<span class="dx-bm">竖线是平台均值</span>') +
      block('和你平时比', '你平时 = 近一年其他 ' + b.events + ' 场', cmp) +
      aiBlock(h, A19.ai, aiDone, true) + '</div>';
    return shell(h, A19.title, A19.sub, body);
  }

  /* ───────── E03 单场 · 开始前 ───────── */
  function beforePage(h) {
    var p = A3.progress, c = A3.crowd;
    var pairs = c.people * (c.people - 1) / 2, unknown = Math.round(pairs * c.unknown_rate);
    var body = '<div class="dx">' +
      '<p class="dx-stamp" style="margin-top:0">开始前</p>' +
      block('报名', '已开放 ' + p.days_open + ' 天 · 截止还有 ' + p.days_left + ' 天 · 最近 7 天 +' + p.new_7d, lineChart(A3.daily, A3.marks, '9/10', '10/1') +
        tiles([tile('报名成功', p.registered, '人', ''), tile('剩余名额', p.remaining, '', '上限 ' + p.capacity), tile('待审核', p.pending, '人', p.pending_over + ' 人超过 1 天 · <span class="dx-link">去审核</span>')], true)) +
      block('谁来了', '报名成功 ' + c.people + ' 人', stack([['第一次来', c.first, 3], ['来过 1–2 场', c.some, 2], ['来过 3 场以上', c.regular, 1]]) + '<div class="dx-sub"><div class="dx-sub-t">彼此之间</div>' + stack([['见过', pairs - unknown, 1], ['没见过', unknown, 3]]) + '</div>' + (function () { var au = audience(A3_AUD); return '<div class="dx-sub"><div class="dx-sub-t">' + au.meta + '</div>' + au.body + '</div>'; })()) +
      block('报名回答', '报名的人', A3.questions.map(function (q) {
        if (q.text) return line('「' + q.title + '」' + q.filled + ' 人填了，在名单里看', true);
        return '<div class="dx-q"><div class="dx-q-t">' + q.title + '<span class="dx-q-m">' + q.answered + ' 人答了</span></div>' + hbars(q.options.map(function (o) { return { l: o[0], v: o[1], t: o[1] + ' 人 · ' + pct(o[1], q.answered) + '%' }; }), { cls: 'dx-hb--q' }) + '</div>';
      }).join('')) + '</div>';
    return h.webShell({ title: A3.title, sub: A3.sub, status: 'live', tabs: TABS, tab: '数据', actions: '<button type="button" class="ce2-btn-outline">分享</button><button type="button" class="ce2-btn-outline">下架</button>', body: body });
  }

  /* ───────── 注册 ───────── */
  R({
    id: 'E01', stage: 'data', title: '主办方「数据」页', where: 'Vibers-web · 侧栏「数据」· /host/:slug/manage/insights（已实现，mock 数据）', surface: 'wide', flag: '已做',
    states: ['过去 90 天', '生成 AI 分析后'],
    stateNotes: ['右上角切 过去 30 天 / 90 天 / 一年 / 全部；每个数下面写上一段的数（Luma 的「上周 0」）。最下面「AI 分析」块的按钮在标题行右上角。', '点「生成分析」后，AI 按这段时间的汇总数（分组对比、90 天回头、互关变化、标签 vs 平台、下一场间隔）给 3–5 条给接下来的建议。'],
    notes: [
      ['顺序', '要点（最多三句，规则生成、带数）→ 四个数 → 到场（每场一根柱子，深色来过、浅色第一次来）→ 来的人（按名片归类：职业横条、标签芯片、城市；只有类别和人数）→ 人和人（三个对数）→ 哪种场更好（一张小表，按人数 / 审核 / 周末 / 名单可见切）→ 评价（标签横条，竖线是平台均值）→ 每场 → AI 分析。'],
      ['口径', '只算已结束的场；排除本场人员；现场补录不算到场率。「第一次来」按这个人在这个主办方之前有没有到场过。关注和同场只有对数，看不到是谁。人数不到门槛显示「—」。'],
      ['不做', '页面浏览量（没埋点）、收入（费用没开）、任何按人的榜、和别的主办方比、AI 总结反馈、通知效果归因。'],
      ['接口', '<code>GET /hosts/:id/insights?range=</code>，后端修改需求sep23.md 第 49 条。'],
      ['层级 · 优先级', '范围层 + 结构层。已实现，等后端。']
    ],
    render: function (s, h) { return hostPage(h, s === 1); }
  });

  R({
    id: 'E02', stage: 'data', title: '单场「数据」分区 · 结束后 + AI 分析', where: 'Vibers-web · 活动工作台 → 数据（?section=data）· 已实现，mock 数据', surface: 'web', flag: '已做',
    states: ['数据', '生成 AI 分析后'],
    stateNotes: ['先是直接的数和图：四个数 → 漏斗 → 来的是谁（来过几场、彼此见没见过、按名片归类的职业 / 标签 / 城市）→ 评价 → 报名回答；分析放最后：和你平时比（一张表）、AI 分析（一颗按钮）。', '点「生成分析」后，AI 按这场的设置和汇总数给 3–5 条给下一场的建议，每条可跳到对应分区改。标明 AI 生成，可重新生成。'],
    notes: [
      ['AI 分析给模型什么', '这场的设置（人数上限、需不需审核、候补、补录、名单可见、时间、线上线下、嘉宾 / 主持、报名问题题目）+ 汇总数（漏斗、来的是谁、彼此之间、标签比例与平台均值、你平时）。<b>不给名单、不给任何人的名字、回答内容、反馈正文。</b>'],
      ['红线', '不评价任何人、不建议群发、不把推测说成事实、不编造数据、只给可以在后台改的动作。一条 60 字以内，一条一个改法。'],
      ['为什么用 AI 不用规则提示', '规则只能写「下次请个主持」这种一刀切的话；AI 能把这场的设置和几组数放在一起说，比如「场地不错被选 9%，平台 30%，加上氛围放松 0%——换场地」。'],
      ['参照系', '标签横条上的竖线 = 平台均值（全平台近一年）；「和你平时比」= 自己近一年其他场。'],
      ['接口', '<code>GET / POST /hosts/:id/activities/:aid/insights/analysis</code>，第 51 条；缓存，每天最多 5 次，写管理记录。'],
      ['层级 · 优先级', '范围层 + 表现层。<code>P1</code>，等后端接模型。']
    ],
    render: function (s, h) { return endedPage(h, s === 1); }
  });

  R({
    id: 'E03', stage: 'data', title: '单场「数据」分区 · 开始前', where: 'Vibers-web · 活动工作台 → 数据 · 已实现，mock 数据', surface: 'web', flag: '已做',
    states: ['开始前'],
    stateNotes: ['报名累计折线，发过通知的日子打记号；三个数里带动作（去审核 / 调上限 / 分享活动）。'],
    notes: [
      ['顺序', '报名（折线 + 报名成功 / 剩余名额 / 待审核或候补）→ 谁来了（来过几场、彼此见没见过、按名片归类的职业 / 标签 / 城市）→ 报名回答（单选 / 多选的选项分布，问答题只计数）。'],
      ['动作在数里', '待审核超过 1 天 → 「去审核」；名额满了且候补 ≥3 → 「调上限」；截止 3 天内名额用了不到一半 → 「分享活动」。不做单独的提示句。'],
      ['接口', '同 E02 的 <code>GET …/insights</code>，开始前只回 progress / crowd / questions。']
    ],
    render: function (s, h) { return beforePage(h); }
  });
})();
