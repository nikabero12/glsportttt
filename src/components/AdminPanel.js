import { CATEGORY_OPTIONS } from '../data/categories.js';
import { h, Icon } from '../lib/h.js';
import { isAdminAuthenticated, loginAdmin, setAdminAuthenticated } from '../utils/storage.js';

const { useEffect, useState } = window.React;

const emptyForm = {
  name: '',
  price: '',
  category: CATEGORY_OPTIONS[0],
  image: '',
};

function AdminPanel({ products, onAdd, onUpdate, onDelete }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
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
    setAdminAuthenticated(false);
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

export default AdminPanel;
