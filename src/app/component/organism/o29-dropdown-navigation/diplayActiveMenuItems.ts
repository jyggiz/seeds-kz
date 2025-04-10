import { TweenMax, TimelineMax } from 'gsap';
import eases from 'app/animation/eases';

export const displayActiveMenuItems = (
  list: ReadonlyArray<HTMLElement>,
  active: number,
  lastActive: number | null,
  getActiveListItemContent: (element: HTMLElement) => HTMLElement | null,
  animationDelay = 0,
) => {
  const activeListItem = list[active];
  const lastActiveListItem = lastActive !== null && list[lastActive];
  const activeListItemContent = getActiveListItemContent(activeListItem);

  TweenMax.to(activeListItem, 0.4, {
    autoAlpha: 1,
    display: 'block',
    ease: eases.VinnieInOut,
  });

  if (lastActiveListItem) {
    TweenMax.to(lastActiveListItem, 0.4, {
      autoAlpha: 0,
      display: 'none',
      ease: eases.VinnieInOut,
    });
  }

  if (activeListItemContent) {
    const activeListElementItemsArray = Array.from(activeListItemContent.children);
    const activeListParentElement = activeListItemContent.parentElement;
    const timeline = new TimelineMax();
    if (activeListParentElement) {
      timeline.set(activeListParentElement, {
        overflow: 'hidden',
      });
      timeline.staggerFromTo(
        activeListElementItemsArray,
        0.4,
        {
          y: 150,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          ease: eases.VinnieInOut,
          stagger: {
            amount: activeListElementItemsArray.length > 5 ? 0.3 : 0.1,
          },
          delay: animationDelay,
          onComplete: () => {
            timeline.set(activeListParentElement, {
              overflow: 'auto',
            });
          },
        },
        0,
      );
    }
  }
};
