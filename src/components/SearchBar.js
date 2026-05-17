import { h, Icon } from '../lib/h.js';

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

export default SearchBar;
