import { h } from '../lib/h.js';

function LoadingScreen() {
  return h(
    'div',
    { className: 'loading-screen' },
    h('div', { className: 'loader-ball' }),
    h('strong', null, 'GLSPORT'),
    h('span', null, 'იტვირთება...'),
  );
}

export default LoadingScreen;
