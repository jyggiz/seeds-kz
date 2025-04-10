export default function setViewportCustomProperties(): void {
  document.documentElement.style.setProperty(
    '--vh',
    `${(window.top ? window.top.innerHeight : window.innerHeight) * 0.01}px`,
  );
}
