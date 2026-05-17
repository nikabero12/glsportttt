import { h } from '../lib/h.js';

function ProductCard({ product }) {
  return h(
    'article',
    { className: 'product-card' },
    h(
      'div',
      { className: 'product-image-wrap' },
      h('img', { src: product.image, alt: product.name, loading: 'lazy' }),
      h('span', null, product.category),
    ),
    h('div', { className: 'product-info' }, h('h3', null, product.name), h('p', null, `${product.price} ₾`)),
  );
}

export default ProductCard;
