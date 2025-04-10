export function scrollToAsync(options: ScrollToOptions) {
  return new Promise<void>((resolve) => {
    const onScroll = function () {
      let scrolled = '';
      let toBeScrolled = '';
      if (options.top) {
        scrolled = window.pageYOffset.toFixed();
        toBeScrolled = options.top.toFixed();
      }
      if (options.left) {
        scrolled = window.pageXOffset.toFixed();
        toBeScrolled = options.left.toFixed();
      }
      if (scrolled === toBeScrolled) {
        window.removeEventListener('scroll', onScroll);
        resolve();
      }
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    window.scrollTo(options);
  });
}
