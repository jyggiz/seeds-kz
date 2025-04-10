export function toggleBodyScrollState(state: 'enabled' | 'disabled') {
  const body = document.querySelector('body');
  if (!body) {
    return;
  }
  if (state === 'disabled') {
    body.style.overflowY = 'hidden';
  }
  if (state === 'enabled') {
    body.style.overflowY = 'auto';
  }
}
