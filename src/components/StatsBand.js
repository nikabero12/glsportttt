import { h } from '../lib/h.js';

const stats = [
  { value: '6', label: 'კატეგორია' },
  { value: '24/7', label: 'მართვადი კატალოგი' },
  { value: '100%', label: 'მობილურზე მორგებული' },
];

function StatsBand() {
  return h(
    'section',
    { className: 'stats-band', 'aria-label': 'GLSPORT მონაცემები' },
    ...stats.map((stat) =>
      h('div', { className: 'stat-item', key: stat.label }, h('strong', null, stat.value), h('span', null, stat.label)),
    ),
  );
}

export default StatsBand;
