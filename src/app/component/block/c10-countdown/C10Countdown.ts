import AbstractTransitionBlock from 'app/component/block/AbstractTransitionBlock';
import C10CountdownTransitionController from './C10CountdownTransitionController';

import CountdownTimer, { CountdownEvent } from '../../../util/CountdownTimer';
import model from '../../../data/model';

export default class C10Countdown extends AbstractTransitionBlock {
  public static readonly displayName: string = 'c10-countdown';

  public readonly transitionController: C10CountdownTransitionController;

  public readonly countdownTimer: CountdownTimer;

  private readonly publicPath = this.element.dataset.publicPath || '/';

  private countdown = this.getElement('[data-countdown]');
  private days = this.getElement('[data-days]');
  private hours = this.getElement('[data-hours]');
  private minutes = this.getElement('[data-minutes]');
  private seconds = this.getElement('[data-seconds]');

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new C10CountdownTransitionController(this);

    if (this.countdown == null) {
      throw new Error('countdown is not found');
    }
    const estimatedDate: string = this.countdown.dataset.countdown || '';
    this.countdownTimer = new CountdownTimer(estimatedDate);

    this.addDisposableEventListener(
      this.countdownTimer,
      CountdownEvent.UPDATE,
      this.getCountdownTimer.bind(this),
    );

    this.addDisposableEventListener(
      this.countdownTimer,
      CountdownEvent.COMPLETE,
      this.handleCountdownComplete.bind(this),
    );
  }

  private handleCountdownComplete(): void {
    const { pathname } = window.location;
    const fileName = pathname.split(this.publicPath).pop() || '';

    // The default locale is 'en'
    let locale = '';

    // Strip out the locale of the current file name
    if (fileName.includes('-')) {
      locale = fileName.split('.')?.shift()?.split('index-').pop() ?? '';
    }

    // Only add a separator if we have a locale
    const separator = locale ? '-' : '';

    // Redirect to the new page
    window.location.href = `${window.location.origin}${this.publicPath}${atob(
      model.target,
    )}${separator}${locale}.html`;
  }

  getCountdownTimer() {
    if (this.days == null) {
      throw new Error('days is not found');
    }
    if (this.hours == null) {
      throw new Error('hours is not found');
    }
    if (this.minutes == null) {
      throw new Error('minutes is not found');
    }
    if (this.seconds == null) {
      throw new Error('secondes is not found');
    }

    const [days, hours, minutes, seconds] = Object.values(this.countdownTimer.options).map(
      (value) => (value < 10 ? `0${value}` : value.toString()),
    );

    this.days.innerText = days;
    this.hours.innerText = hours;
    this.minutes.innerText = minutes;
    this.seconds.innerText = seconds;
  }

  public dispose() {
    this.countdownTimer.dispose();
    super.dispose();
  }
}
