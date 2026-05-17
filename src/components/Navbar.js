import { h, Icon } from '../lib/h.js';

const { useState } = window.React;

function Navbar({ currentPage, onNavigate, categories = [], onCategorySelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const navigate = (page) => {
    onNavigate(page);
    setIsOpen(false);
    setIsCatalogOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectCategory = (category) => {
    onCategorySelect(category);
    setIsOpen(false);
    setIsCatalogOpen(false);
  };

  return h(
    'header',
    { className: 'site-header' },
    h(
      'nav',
      { className: 'navbar', 'aria-label': 'მთავარი ნავიგაცია' },
      h(
        'button',
        { className: 'brand', onClick: () => navigate('home'), type: 'button' },
        h('img', {
          className: 'brand-logo',
          src: '/assets/glsport-logo.png',
          alt: 'GLSPORT logo',
        }),
        h('span', null, h('strong', null, 'GLSPORT'), h('small', null, 'Football Store')),
      ),
      h(
        'button',
        {
          className: 'menu-toggle',
          type: 'button',
          'aria-label': 'მენიუს გახსნა',
          onClick: () => setIsOpen((value) => !value),
        },
        h(Icon, { name: isOpen ? '×' : '☰' }),
      ),
      h(
        'div',
        { className: `nav-links ${isOpen ? 'is-open' : ''}` },
        h(
          'div',
          { className: `nav-item catalog-menu ${isCatalogOpen ? 'is-open' : ''}` },
          h(
            'button',
            {
              type: 'button',
              className: currentPage === 'home' ? 'active catalog-trigger' : 'catalog-trigger',
              onClick: () => setIsCatalogOpen((value) => !value),
              'aria-expanded': isCatalogOpen ? 'true' : 'false',
            },
            'კატალოგი',
            h(Icon, { name: isCatalogOpen ? '⌃' : '⌄' }),
          ),
          h(
            'div',
            { className: 'catalog-dropdown' },
            ...categories.map((category) =>
              h(
                'button',
                {
                  type: 'button',
                  key: category,
                  onClick: () => selectCategory(category),
                },
                category,
              ),
            ),
          ),
        ),
        h(
          'button',
          {
            type: 'button',
            className: currentPage === 'admin' ? 'active admin-link' : 'admin-link',
            onClick: () => navigate('admin'),
          },
          h(Icon, { name: '⌕' }),
          'Admin',
        ),
      ),
    ),
  );
}

export default Navbar;
