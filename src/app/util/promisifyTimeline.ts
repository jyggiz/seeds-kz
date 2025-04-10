import { TimelineMax } from 'gsap';

const promisifyTimeline = (timeline: TimelineMax) =>
  new Promise((resolve) => {
    timeline.eventCallback('onComplete', () => {
      resolve(timeline);
    });
  });

export default promisifyTimeline;
