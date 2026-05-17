export const h = window.React.createElement;

export function Icon({ name }) {
  return h('span', { className: 'ui-icon', 'aria-hidden': 'true' }, name);
}
