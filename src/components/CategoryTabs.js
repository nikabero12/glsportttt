import { h } from '../lib/h.js';

function CategoryTabs({ categories, activeCategory, onSelect }) {
  return h(
    'div',
    { className: 'category-tabs', 'aria-label': 'კატეგორიები' },
    ...categories.map((category) =>
      h(
        'button',
        {
          type: 'button',
          key: category,
          className: activeCategory === category ? 'active' : '',
          onClick: () => onSelect(category),
        },
        category,
      ),
    ),
  );
}

export default CategoryTabs;
