import { h } from '../lib/h.js';

function Footer() {
  return h(
    'footer',
    { className: 'site-footer' },
    h(
      'div',
      { className: 'footer-brand' },
      h('img', {
        className: 'footer-logo',
        src: '/assets/glsport-logo.png',
        alt: 'GLSPORT logo',
      }),
      h(
        'div',
        null,
        h('strong', null, 'GLSPORT'),
        h('p', null, 'პრემიუმ ფეხბურთის კატალოგი ბუცებისთვის, ბურთებისთვის, ფორმებისა და ინვენტარისთვის.'),
      ),
    ),
    h(
      'div',
      { className: 'social-links', 'aria-label': 'სოციალური ქსელები' },
      h(
        'a',
        {
          href: 'https://www.facebook.com/GLSportGeorgia?locale=ka_GE',
          target: '_blank',
          rel: 'noreferrer',
        },
        'Facebook',
      ),
      h(
        'a',
        {
          href: 'https://www.instagram.com/glsport.geo/',
          target: '_blank',
          rel: 'noreferrer',
        },
        'Instagram',
      ),
      h(
        'a',
        {
          href: 'https://www.tiktok.com/@glsport.geo',
          target: '_blank',
          rel: 'noreferrer',
        },
        'TikTok',
      ),
    ),
  );
}

export default Footer;
