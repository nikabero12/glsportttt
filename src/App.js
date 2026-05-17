import AdminPanel from './components/AdminPanel.js';
import CategoryTabs from './components/CategoryTabs.js';
import Footer from './components/Footer.js';
import Hero from './components/Hero.js';
import LoadingScreen from './components/LoadingScreen.js';
import Navbar from './components/Navbar.js';
import ProductGrid from './components/ProductGrid.js';
import SearchBar from './components/SearchBar.js';
import StatsBand from './components/StatsBand.js';
import { CATEGORIES } from './data/categories.js';
import { h, Icon } from './lib/h.js';
import { createProduct, editProduct, loadProducts, removeProduct } from './utils/storage.js';

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

export default App;
