export const hasComponentEnteredViewport = (element: HTMLElement) => {
  const boundingClientRect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  if (boundingClientRect.top < windowHeight) {
    return true;
  }
};

export const isElementVisibleInContainer = (container: HTMLElement, element: HTMLElement) => {
  const {
    bottom: elementBottom,
    height: elementHeight,
    top: elementTop,
  } = element.getBoundingClientRect();
  const { top: containerTop, bottom: containerBottom } = container.getBoundingClientRect();

  const isElementInView =
    elementTop <= containerTop
      ? containerTop - elementTop <= elementHeight
      : elementBottom - containerBottom <= elementHeight;

  return isElementInView;
};
