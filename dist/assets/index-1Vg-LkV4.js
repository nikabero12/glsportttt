true&&(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
}());

const CATEGORIES = [
  'ყველა პროდუქტი',
  'ბუცები',
  'შიპოვკები',
  'ფეხბურთის ფორმები',
  'ბურთები',
  'სავარჯიშო ინვენტარი',
];

const CATEGORY_OPTIONS = CATEGORIES.filter(
  (category) => category !== 'ყველა პროდუქტი',
);

const h = window.React.createElement;

function Icon({ name }) {
  return h('span', { className: 'ui-icon', 'aria-hidden': 'true' }, name);
}

const demoProducts = [
  {
    id: 'demo-phantom-red',
    name: 'Nike Phantom GX Elite Red',
    price: 449,
    category: 'ბუცები',
    image:
      'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=900&q=85',
    createdAt: '2026-01-01T10:00:00.000Z',
  },
  {
    id: 'demo-speed-black',
    name: 'Adidas Speed Turf Black',
    price: 269,
    category: 'შიპოვკები',
    image:
      'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?auto=format&fit=crop&w=900&q=85',
    createdAt: '2026-01-02T10:00:00.000Z',
  },
  {
    id: 'demo-home-kit',
    name: 'GLSPORT Pro Home Kit',
    price: 159,
    category: 'ფეხბურთის ფორმები',
    image:
      'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=900&q=85',
    createdAt: '2026-01-03T10:00:00.000Z',
  },
  {
    id: 'demo-balls',
    name: 'UEFA Training Ball Pack',
    price: 119,
    category: 'ბურთები',
    image:
      'https://images.unsplash.com/photo-1552318965-6e6be7484ada?auto=format&fit=crop&w=900&q=85',
    createdAt: '2026-01-04T10:00:00.000Z',
  },
  {
    id: 'demo-match-ball',
    name: 'GLSPORT Match Ball Pro',
    price: 89,
    category: 'ბურთები',
    image:
      'https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&w=900&q=85',
    createdAt: '2026-01-04T12:00:00.000Z',
  },
  {
    id: 'demo-future-white',
    name: 'Puma Future Match White',
    price: 329,
    category: 'ბუცები',
    image:
      'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=900&q=85',
    createdAt: '2026-01-05T10:00:00.000Z',
  },
  {
    id: 'demo-agility',
    name: 'Agility Cone Set 40',
    price: 79,
    category: 'სავარჯიშო ინვენტარი',
    image:
      'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=900&q=85',
    createdAt: '2026-01-06T10:00:00.000Z',
  },
];

const TOKEN_KEY = 'glsport-admin-token';
const LOCAL_PRODUCTS_KEY = 'glsport-products-fallback';

const API_BASE =
  window.location.port === '5173' ? 'http://127.0.0.1:3001/api' : '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || 'Server request failed');
  }

  return payload;
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function loadProducts() {
  try {
    const products = await request('/products');
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
    return products;
  } catch {
    const storedProducts = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    return storedProducts ? JSON.parse(storedProducts) : demoProducts;
  }
}

async function loginAdmin(username, password) {
  const payload = await request('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  localStorage.setItem(TOKEN_KEY, payload.token);
  return true;
}

function isAdminAuthenticated() {
  return Boolean(getToken());
}

function setAdminAuthenticated(isAuthenticated) {
  {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function createProduct(product) {
  return request('/products', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(product),
  });
}

async function editProduct(productId, product) {
  return request(`/products/${encodeURIComponent(productId)}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(product),
  });
}

async function removeProduct(productId) {
  return request(`/products/${encodeURIComponent(productId)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

const { useEffect: useEffect$1, useState: useState$2 } = window.React;

const emptyForm = {
  name: '',
  price: '',
  category: CATEGORY_OPTIONS[0],
  image: '',
};

function AdminPanel({ products, onAdd, onUpdate, onDelete }) {
  const [isAuthenticated, setIsAuthenticated] = useState$2(false);
  const [loginForm, setLoginForm] = useState$2({ username: '', password: '' });
  const [form, setForm] = useState$2(emptyForm);
  const [editingId, setEditingId] = useState$2(null);
  const [message, setMessage] = useState$2('');
  const [isSaving, setIsSaving] = useState$2(false);

  useEffect$1(() => {
    setIsAuthenticated(isAdminAuthenticated());
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      await loginAdmin(loginForm.username, loginForm.password);
      setIsAuthenticated(true);
      setMessage('ადმინისტრატორის პანელი გახსნილია.');
    } catch {
      setMessage('მომხმარებელი ან პაროლი არასწორია.');
    }
  };

  const handleLogout = () => {
    setAdminAuthenticated();
    setIsAuthenticated(false);
    setEditingId(null);
    setMessage('');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((currentForm) => ({ ...currentForm, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageUrlChange = (event) => {
    setForm((currentForm) => ({ ...currentForm, image: event.target.value.trim() }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name || !form.price || !form.image) {
      setMessage('შეავსე სახელი, ფასი და დაამატე სურათი.');
      return;
    }

    setIsSaving(true);
    setMessage('');

    const productPayload = {
      name: form.name.trim(),
      price: Number(form.price),
      category: form.category,
      image: form.image,
    };

    try {
      if (editingId) {
        await onUpdate(editingId, productPayload);
        setMessage('პროდუქტი server-ზე განახლდა.');
      } else {
        await onAdd(productPayload);
        setMessage('პროდუქტი server-ზე დაემატა.');
      }

      resetForm();
    } catch {
      setMessage('შენახვა ვერ მოხერხდა. შეამოწმე backend server.');
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isAuthenticated) {
    return h(
      'div',
      { className: 'admin-login-card' },
      h(
        'form',
        { onSubmit: handleLogin, className: 'admin-form' },
        h('h2', null, 'ადმინისტრატორის შესვლა'),
        h(
          'label',
          null,
          'მომხმარებელი',
          h('input', {
            type: 'text',
            value: loginForm.username,
            onChange: (event) =>
              setLoginForm((currentForm) => ({
                ...currentForm,
                username: event.target.value,
              })),
            placeholder: 'შეიყვანე მომხმარებელი',
            autoComplete: 'username',
          }),
        ),
        h(
          'label',
          null,
          'პაროლი',
          h('input', {
            type: 'password',
            value: loginForm.password,
            onChange: (event) =>
              setLoginForm((currentForm) => ({
                ...currentForm,
                password: event.target.value,
              })),
            placeholder: 'შეიყვანე პაროლი',
            autoComplete: 'current-password',
          }),
        ),
        h('button', { type: 'submit', className: 'primary-button full-width' }, 'შესვლა'),
        message ? h('p', { className: 'form-message' }, message) : null,
      ),
    );
  }

  return h(
    'div',
    { className: 'admin-dashboard' },
    h(
      'div',
      { className: 'dashboard-toolbar' },
      h(
        'div',
        null,
        h('span', { className: 'eyebrow' }, 'პროდუქტების მართვა'),
        h('h2', null, `${products.length} პროდუქტი`),
      ),
      h('button', { type: 'button', className: 'ghost-button', onClick: handleLogout }, h(Icon, { name: '↩' }), 'გასვლა'),
    ),
    h(
      'div',
      { className: 'dashboard-layout' },
      h(
        'form',
        { className: 'product-editor', onSubmit: handleSubmit },
        h('h3', null, editingId ? 'პროდუქტის რედაქტირება' : 'ახალი პროდუქტი'),
        h(
          'label',
          { className: 'image-upload' },
          h(Icon, { name: '⇧' }),
          h('span', null, form.image ? 'სურათი არჩეულია' : 'პროდუქტის სურათის ატვირთვა'),
          h('input', { type: 'file', accept: 'image/*', onChange: handleImageUpload }),
        ),
        h(
          'label',
          null,
          'სურათის URL',
          h('input', {
            type: 'url',
            value: form.image.startsWith('data:') ? '' : form.image,
            onChange: handleImageUrlChange,
            placeholder: 'https://example.com/product.jpg',
          }),
        ),
        form.image ? h('img', { className: 'image-preview', src: form.image, alt: 'პროდუქტის პრევიუ' }) : null,
        h(
          'label',
          null,
          'დასახელება',
          h('input', {
            type: 'text',
            value: form.name,
            onChange: (event) => setForm({ ...form, name: event.target.value }),
            placeholder: 'მაგ: Nike Phantom Elite',
          }),
        ),
        h(
          'label',
          null,
          'ფასი',
          h('input', {
            type: 'number',
            min: '0',
            value: form.price,
            onChange: (event) => setForm({ ...form, price: event.target.value }),
            placeholder: '₾',
          }),
        ),
        h(
          'label',
          null,
          'კატეგორია',
          h(
            'select',
            {
              value: form.category,
              onChange: (event) => setForm({ ...form, category: event.target.value }),
            },
            ...CATEGORY_OPTIONS.map((category) => h('option', { key: category, value: category }, category)),
          ),
        ),
        h(
          'div',
          { className: 'editor-actions' },
          h(
            'button',
            { type: 'submit', className: 'primary-button', disabled: isSaving },
            editingId ? h(Icon, { name: '✓' }) : h(Icon, { name: '+' }),
            isSaving ? 'ინახება...' : editingId ? 'შენახვა' : 'დამატება',
          ),
          editingId
            ? h('button', { type: 'button', className: 'ghost-button', onClick: resetForm }, 'გაუქმება')
            : null,
        ),
        message ? h('p', { className: 'form-message' }, message) : null,
      ),
      h(
        'div',
        { className: 'admin-products' },
        ...products.map((product) =>
          h(
            'article',
            { className: 'admin-product-row', key: product.id },
            h('img', { src: product.image, alt: product.name }),
            h('div', null, h('h4', null, product.name), h('p', null, `${product.category} · ${product.price} ₾`)),
            h(
              'div',
              { className: 'row-actions' },
              h('button', { type: 'button', 'aria-label': 'რედაქტირება', onClick: () => startEditing(product) }, h(Icon, { name: '✎' })),
              h('button', { type: 'button', 'aria-label': 'წაშლა', onClick: () => onDelete(product.id) }, h(Icon, { name: '×' })),
            ),
          ),
        ),
      ),
    ),
  );
}

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

function LoadingScreen() {
  return h(
    'div',
    { className: 'loading-screen' },
    h('div', { className: 'loader-ball' }),
    h('strong', null, 'GLSPORT'),
    h('span', null, 'იტვირთება...'),
  );
}

const { useState: useState$1 } = window.React;

function Navbar({ currentPage, onNavigate, categories = [], onCategorySelect }) {
  const [isOpen, setIsOpen] = useState$1(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState$1(false);

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

function SearchBar({ value, onChange }) {
  return h(
    'label',
    { className: 'search-bar' },
    h(Icon, { name: '⌕' }),
    h('input', {
      type: 'search',
      value,
      onChange: (event) => onChange(event.target.value),
      placeholder: 'მოძებნე პროდუქტი ან კატეგორია...',
      'aria-label': 'პროდუქტის ძებნა',
    }),
  );
}

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

const { useEffect, useMemo, useState } = window.React;

const normalize = (value) => value.toLocaleLowerCase('ka-GE').trim();

function App() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function hydrateProducts() {
      const loadedProducts = await loadProducts();
      if (isMounted) {
        setProducts(loadedProducts);
        window.setTimeout(() => setIsLoading(false), 450);
      }
    }

    hydrateProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const term = normalize(searchTerm);

    return products.filter((product) => {
      const matchesCategory =
        activeCategory === CATEGORIES[0] || product.category === activeCategory;
      const matchesSearch =
        !term ||
        normalize(product.name).includes(term) ||
        normalize(product.category).includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, products, searchTerm]);

  const openCatalogCategory = (category) => {
    setCurrentPage('home');
    setActiveCategory(category);
    window.setTimeout(() => {
      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  };

  const addProduct = async (product) => {
    const savedProduct = await createProduct(product);
    setProducts((currentProducts) => [savedProduct, ...currentProducts]);
  };

  const updateProduct = async (productId, nextProduct) => {
    const savedProduct = await editProduct(productId, nextProduct);
    setProducts((currentProducts) =>
      currentProducts.map((product) => (product.id === productId ? savedProduct : product)),
    );
  };

  const deleteProduct = async (productId) => {
    await removeProduct(productId);
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== productId),
    );
  };

  if (isLoading) {
    return h(LoadingScreen);
  }

  const homePage = h(
    window.React.Fragment,
    null,
    h(Hero, { onExplore: () => setActiveCategory(CATEGORIES[0]) }),
    h(StatsBand),
    h(
      'section',
      { className: 'catalog-section', id: 'catalog' },
      h(
        'div',
        { className: 'section-heading' },
        h('span', { className: 'eyebrow' }, 'პროდუქციის კატალოგი'),
        h('h2', null, 'ფეხბურთის სრული ეკიპირება ერთ სივრცეში'),
        h(
          'p',
          null,
          'მოძებნე ბუცები, შიპოვკები, ფორმები, ბურთები და სავარჯიშო ინვენტარი სწრაფად, სუფთად და პროფესიონალურად.',
        ),
      ),
      h(
        'div',
        { className: 'catalog-tools' },
        h(SearchBar, { value: searchTerm, onChange: setSearchTerm }),
        h(CategoryTabs, {
          categories: CATEGORIES,
          activeCategory,
          onSelect: setActiveCategory,
        }),
      ),
      h(ProductGrid, { products: filteredProducts }),
    ),
  );

  const adminPage = h(
    'section',
    { className: 'admin-page' },
    h(
      'div',
      { className: 'admin-intro' },
      h(
        'div',
        null,
        h('span', { className: 'eyebrow' }, 'დაცული სივრცე'),
        h('h1', null, 'GLSPORT Admin Panel'),
        h(
          'p',
          null,
          'პროდუქციის დამატება, რედაქტირება და წაშლა ხელმისაწვდომია მხოლოდ ადმინისტრატორის ანგარიშით.',
        ),
      ),
      h(Icon, { name: '🛡' }),
    ),
    h(AdminPanel, {
      products,
      onAdd: addProduct,
      onUpdate: updateProduct,
      onDelete: deleteProduct,
    }),
  );

  return h(
    'div',
    { className: 'app-shell' },
    h(Navbar, {
      currentPage,
      onNavigate: setCurrentPage,
      categories: CATEGORIES,
      onCategorySelect: openCatalogCategory,
    }),
    h('main', { className: 'page-transition' }, currentPage === 'home' ? homePage : adminPage),
    h(Footer),
  );
}

window.ReactDOM.createRoot(document.getElementById('root')).render(window.React.createElement(App));
