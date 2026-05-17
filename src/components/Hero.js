import { h, Icon } from '../lib/h.js';

function Hero({ onExplore }) {
  const scrollToCatalog = () => {
    onExplore();
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  return h(
    'section',
    { className: 'hero-section' },
    h('div', { className: 'hero-media', 'aria-hidden': 'true' }, h('div', { className: 'hero-image' })),
    h(
      'div',
      { className: 'hero-content' },
      h('span', { className: 'hero-badge' }, h(Icon, { name: '✦' }), 'პრემიუმ ფეხბურთის ეკიპირება'),
      h('h1', null, 'GLSPORT'),
      h(
        'p',
        null,
        'თანამედროვე, სწრაფი და დახვეწილი კატალოგი ფეხბურთის ბუცებისთვის, შიპოვკებისთვის, ფორმებისთვის, ბურთებისთვის და სავარჯიშო ინვენტარისთვის.',
      ),
      h(
        'div',
        { className: 'hero-actions' },
        h(
          'button',
          { type: 'button', className: 'primary-button', onClick: scrollToCatalog },
          'პროდუქციის ნახვა',
          h(Icon, { name: '↓' }),
        ),
      ),
    ),
  );
}

export default Hero;
