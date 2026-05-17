import { h } from '../lib/h.js';
import ProductCard from './ProductCard.js';

function ProductGrid({ products }) {
  if (products.length === 0) {
    return h(
      'div',
      { className: 'empty-state' },
      h('h3', null, 'პროდუქტი ვერ მოიძებნა'),
      h('p', null, 'სცადე სხვა კატეგორია ან საძიებო სიტყვა.'),
    );
  }

  return h(
    'div',
    { className: 'product-grid' },
    ...products.map((product) => h(ProductCard, { key: product.id, product })),
  );
}

export default ProductGrid;
