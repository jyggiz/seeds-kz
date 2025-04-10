import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import O61TimerTransitionController from './O61TimerTransitionController';
import CountdownTimer, { CountdownEvent } from '../../../util/CountdownTimer';

export default class O61Timer extends AbstractTransitionComponent {
  public static readonly displayName: string = 'o61-timer';

  public readonly transitionController: O61TimerTransitionController;

  public readonly countdownTimer: CountdownTimer;

  private countdown = this.getElement('[data-countdown]');
  private days = this.getElement('[data-days]');
  private hours = this.getElement('[data-hours]');
  private minutes = this.getElement('[data-minutes]');
  private seconds = this.getElement('[data-seconds]');

  private readonly daysToHours: boolean = false;

  constructor(el: HTMLElement) {
    super(el);

    this.transitionController = new O61TimerTransitionController(this);

    if (this.countdown == null) throw new Error('countdown is not found');
    if (!this.days) this.daysToHours = true;

    const estimatedDate: string = this.countdown.dataset.countdown || '';
    this.countdownTimer = new CountdownTimer(estimatedDate, this.daysToHours);

    this.addDisposableEventListener(
      this.countdownTimer,
      CountdownEvent.UPDATE,
      this.getCountdownTimer.bind(this),
    );
  }

  private getCountdownTimer(): void {
    const [days, hours, minutes, seconds] = Object.values(this.countdownTimer.options).map(
      (value) => (value < 10 ? `0${value}` : value.toString()),
    );

    if (this.days) this.days.innerText = days;
    if (this.hours) this.hours.innerText = hours;
    if (this.minutes) this.minutes.innerText = minutes;
    if (this.seconds) this.seconds.innerText = seconds;
  }

  public dispose() {
    this.countdownTimer.dispose();
    super.dispose();
  }
}
