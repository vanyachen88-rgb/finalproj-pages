// 導覽與切換互動；一般內容改 content.js。
const { stages, tables, insights } = window.PORTFOLIO_DATA;

/* ---------- 小工具 ---------- */
function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

// 方向鍵 / Home / End 切換分頁（無障礙）
function wireTabs(container, selector, onSelect) {
  container.addEventListener('keydown', event => {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const tabs = [...container.querySelectorAll(selector)];
    const current = tabs.indexOf(document.activeElement);
    const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown';
    const next = event.key === 'Home' ? 0
      : event.key === 'End' ? tabs.length - 1
      : (current + (forward ? 1 : -1) + tabs.length) % tabs.length;
    tabs[next].focus();
    onSelect(next);
  });
}

/* ---------- 01 專題流程 ---------- */
function setStage(index) {
  const data = stages[index];
  const panel = document.getElementById('stage-detail');
  document.querySelectorAll('.stage-tab').forEach((tab, i) => {
    tab.setAttribute('aria-selected', String(i === index));
    tab.tabIndex = i === index ? 0 : -1;
  });
  panel.replaceChildren();
  panel.setAttribute('aria-labelledby', `stage-${index}`);
  panel.append(el('span', 'detail-code', data.code), el('h3', '', data.title), el('p', '', data.description));
  const tags = el('div', 'detail-tags');
  data.tags.forEach(t => tags.append(el('span', '', t)));
  panel.append(tags);
}

function setTable(index) {
  const data = tables[index];
  const panel = document.getElementById('table-detail');
  document.querySelectorAll('.table-item').forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  panel.replaceChildren();
  panel.append(
    el('span', 'small-label', 'TABLE / ' + String(index + 1).padStart(2, '0')),
    el('h3', '', data.name),
    el('span', 'row-count', `${data.rows} 筆模擬資料`)
  );
  const fields = el('div', 'fields');
  data.fields.forEach(f => fields.append(el('span', '', f)));
  panel.append(fields, el('p', 'relations', data.relation));
}

const stageTabs = document.getElementById('stage-tabs');
stages.forEach((data, i) => {
  const button = el('button', 'stage-tab');
  button.type = 'button';
  button.id = `stage-${i}`;
  button.setAttribute('role', 'tab');
  button.setAttribute('aria-controls', 'stage-detail');
  button.append(el('span', 'num', data.number), el('strong', '', data.title), el('span', 'arrow', '↗'));
  button.addEventListener('click', () => setStage(i));
  stageTabs.append(button);
});
wireTabs(stageTabs, '.stage-tab', setStage);
setStage(0);

const tableList = document.getElementById('table-list');
tables.forEach((data, i) => {
  const button = el('button', 'table-item');
  button.type = 'button';
  button.append(el('strong', '', data.name), el('small', '', `${data.rows} rows`));
  button.addEventListener('click', () => setTable(i));
  tableList.append(button);
});
setTable(0);

/* ---------- 02 數據洞察：圖表元件（純 DOM，不需任何套件） ---------- */
// 橫向長條圖：rows = [標籤, 數值, 顯示文字, 標記(good|bad|'')]
function barsBlock(block) {
  const wrap = el('div', 'bars');
  const max = Math.max(...block.rows.map(r => r[1]), 1);
  block.rows.forEach(([label, value, display, flag]) => {
    const row = el('div', 'bar-row' + (flag ? ' ' + flag : ''));
    const track = el('span', 'bar-track');
    const fill = document.createElement('i');
    fill.style.width = (value / max * 100).toFixed(1) + '%';
    track.append(fill);
    row.append(el('span', 'bar-label', label), track, el('span', 'bar-value', display));
    wrap.append(row);
  });
  return wrap;
}

// 雙長條比較：rows = [標籤, 數值A, 數值B]
function pairsBlock(block) {
  const wrap = el('div', 'pair-wrap');
  const legend = el('div', 'legend');
  legend.append(el('span', 'a', block.legend[0]), el('span', 'b', block.legend[1]));
  const max = Math.max(...block.rows.flatMap(r => [r[1], r[2]]), 1);
  const list = el('div', 'pair-list');
  block.rows.forEach(([label, a, b]) => {
    const row = el('div', 'pair-row');
    row.append(el('span', 'pair-label', label));
    [[a, 'a'], [b, 'b']].forEach(([value, key]) => {
      const line = el('div', 'pair-line ' + key);
      const track = el('span', 'bar-track');
      const fill = document.createElement('i');
      fill.style.width = (value / max * 100).toFixed(1) + '%';
      track.append(fill);
      line.append(track, el('span', 'bar-value', value.toFixed(1) + '%'));
      row.append(line);
    });
    list.append(row);
  });
  wrap.append(legend, list);
  return wrap;
}

// 直條圖（季度趨勢）：rows = [季, 數值, 顯示文字, 標記, 年份]
function columnsBlock(block) {
  const wrap = el('div', 'col-chart');
  const n = block.rows.length;
  wrap.style.setProperty('--n', n);
  const max = Math.max(...block.rows.map(r => r[1]), 1);
  const cols = el('div', 'cols');
  const axis = el('div', 'col-axis');
  const years = el('div', 'col-years');
  const byYear = new Map();
  block.rows.forEach(([label, value, display, flag, group]) => {
    const col = el('div', 'col' + (flag ? ' ' + flag : ''));
    col.title = `${group} ${label}：${display}`;
    const bar = el('span', 'col-bar');
    bar.style.height = (value / max * 82).toFixed(1) + '%';
    col.append(el('span', 'col-value', display), bar);
    cols.append(col);
    axis.append(el('span', '', label));
    if (!byYear.has(group)) byYear.set(group, []);
    byYear.get(group).push(display);
  });
  byYear.forEach((vals, year) => {
    const y = el('span', '', year);
    y.style.gridColumn = `span ${vals.length}`;
    years.append(y);
  });
  // 窄螢幕不顯示長條上的數字，改用文字列表呈現
  const list = el('ul', 'col-list');
  byYear.forEach((vals, year) => {
    const li = el('li');
    li.append(el('strong', '', year), document.createTextNode(' ' + vals.map((v, i) => `Q${i + 1} ${v}`).join('　')));
    list.append(li);
  });
  wrap.setAttribute('role', 'img');
  wrap.setAttribute('aria-label', block.title + '：' + block.rows.map(r => `${r[4]} ${r[0]} ${r[2]}`).join('、'));
  wrap.append(cols, axis, years, list);
  return wrap;
}

// 表格：窄螢幕會自動轉成卡片（用 data-label 顯示欄位名稱）
function tableBlock(block) {
  const wrap = el('div', 'table-wrap');
  const table = el('table', 'data-table');
  const headRow = el('tr');
  block.columns.forEach(name => { const th = el('th', '', name); th.scope = 'col'; headRow.append(th); });
  const thead = el('thead'); thead.append(headRow);
  const tbody = el('tbody');
  block.rows.forEach(row => {
    const flag = row[block.columns.length];
    const tr = el('tr');
    block.columns.forEach((name, i) => {
      const td = el('td', i === block.columns.length - 1 ? flag : '', row[i]);
      td.setAttribute('data-label', name);
      tr.append(td);
    });
    tbody.append(tr);
  });
  table.append(thead, tbody);
  wrap.append(table);
  return wrap;
}

// 資料品質清單：rows = [嚴重度, 標題, 說明, 建議]
function checksBlock(block) {
  const list = el('div', 'check-list');
  block.rows.forEach(([severity, title, detail, fix]) => {
    const item = el('article', 'check');
    const body = el('div', 'check-body');
    body.append(el('h5', '', title), el('p', '', detail), el('p', 'fix', fix));
    item.append(el('span', 'sev ' + (severity === '高' ? 'high' : 'mid'), severity === '高' ? '優先處理' : '需留意'), body);
    list.append(item);
  });
  return list;
}

// 預測路線圖卡片：rows = [主題, 方法, 用途, 注意事項]
function cardsBlock(block) {
  const grid = el('div', 'fc-grid');
  block.rows.forEach(([title, method, use, caution]) => {
    const card = el('article', 'fc');
    const dl = el('dl');
    [['方法', method], ['用途', use], ['注意', caution]].forEach(([term, desc]) => dl.append(el('dt', '', term), el('dd', '', desc)));
    card.append(el('h5', '', title), dl);
    grid.append(card);
  });
  return grid;
}

const renderers = { bars: barsBlock, pairs: pairsBlock, columns: columnsBlock, table: tableBlock, checks: checksBlock, cards: cardsBlock };

function listCard(title, items, dark) {
  const card = el('div', 'list-card' + (dark ? ' dark' : ''));
  const ul = el('ul');
  items.forEach(text => ul.append(el('li', '', text)));
  card.append(el('h4', '', title), ul);
  return card;
}

/* ---------- 02 數據洞察：分頁 ---------- */
const insightTabs = document.getElementById('insight-tabs');
const insightPanel = document.getElementById('insight-panel');

function setInsight(index, options = {}) {
  const data = insights[index];
  insightTabs.querySelectorAll('.view-tab').forEach((tab, i) => {
    tab.setAttribute('aria-selected', String(i === index));
    tab.tabIndex = i === index ? 0 : -1;
    if (i === index && options.reveal) tab.scrollIntoView({ block: 'nearest', inline: 'center' });
  });
  insightPanel.replaceChildren();
  insightPanel.setAttribute('aria-labelledby', `insight-tab-${index}`);

  const head = el('div', 'insight-head');
  head.append(el('span', 'panel-label', data.label + ' / INSIGHT'), el('h3', '', data.headline), el('p', '', data.summary));

  const stats = el('div', 'stat-row');
  data.stats.forEach(([number, label], i) => {
    const tile = el('div', 'number-tile');
    tile.append(el('span', '', 'KEY 0' + (i + 1)), el('strong', '', number), el('small', '', label));
    stats.append(tile);
  });

  const blocks = el('div', 'insight-blocks');
  data.blocks.forEach(block => {
    const box = el('div', 'block' + (block.wide ? ' wide' : ''));
    box.append(el('h4', '', block.title), renderers[block.type](block));
    if (block.note) box.append(el('p', 'block-note', block.note));
    blocks.append(box);
  });

  const bottom = el('div', 'insight-bottom');
  bottom.append(listCard('重點發現', data.findings, false), listCard('建議行動', data.actions, true));

  insightPanel.append(head, stats, blocks, bottom);
  if (options.updateHash) history.replaceState(null, '', '#insights-' + data.id);
}

insights.forEach((data, i) => {
  const button = el('button', 'view-tab', data.name);
  button.type = 'button';
  button.id = `insight-tab-${i}`;
  button.setAttribute('role', 'tab');
  button.setAttribute('aria-controls', 'insight-panel');
  button.addEventListener('click', () => setInsight(i, { updateHash: true, reveal: true }));
  insightTabs.append(button);
});
wireTabs(insightTabs, '.view-tab', i => setInsight(i, { updateHash: true, reveal: true }));

// 支援 #insights-marketing 這類連結，方便把單一洞察分享到社群
function openInsightFromHash(scroll) {
  if (!location.hash.startsWith('#insights-')) return false;
  const index = insights.findIndex(item => item.id === location.hash.slice('#insights-'.length));
  if (index < 0) return false;
  setInsight(index, { reveal: true });
  if (scroll) document.querySelector('.insight-workspace').scrollIntoView({ behavior: 'smooth', block: 'start' });
  return true;
}
window.addEventListener('hashchange', () => openInsightFromHash(true));
if (!openInsightFromHash(false)) setInsight(0);
else requestAnimationFrame(() => document.querySelector('.insight-workspace').scrollIntoView({ block: 'start' }));

/* ---------- 手機選單 ---------- */
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.getElementById('site-nav');
function closeNav() {
  siteNav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', '開啟選單');
}
navToggle.addEventListener('click', () => {
  const open = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
});
siteNav.addEventListener('click', event => { if (event.target.closest('a')) closeNav(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && siteNav.classList.contains('open')) { closeNav(); navToggle.focus(); }
});
window.matchMedia('(min-width: 701px)').addEventListener('change', closeNav);

document.getElementById('year').textContent = new Date().getFullYear();
