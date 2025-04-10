import AbstractComponent from 'app/component/AbstractComponent';
import { FormImpressionTrackingUtil } from '../../../../../../util/FormImpressionTrackingUtil';
import C59MultiStepForm from '../../../C59MultiStepForm.lazy';
import { getIntent } from 'app/util/form/getIntent';

export default class FormStep extends AbstractComponent {
  public static readonly displayName: string = 'form-step';

  private readonly c59MultiStepForm = this.element.closest<HTMLElement>(
    `[data-component="${C59MultiStepForm.displayName}"]`,
  );
  private formImpressionTracking: FormImpressionTrackingUtil;

  constructor(element: HTMLElement) {
    super(element);

    this.formImpressionTracking = new FormImpressionTrackingUtil(
      element,
      {
        formName: this.c59MultiStepForm?.dataset.titleInEnglish || '',
        intent: getIntent(),
        step: this.element.dataset.step ? parseInt(this.element.dataset.step) + 1 : undefined,
      },
      {
        threshold: 0.1,
      },
    );
  }

  async adopted() {
    this.formImpressionTracking.connect();
  }

  async dispose() {
    super.dispose();
    this.formImpressionTracking.disconnect();
  }

  public updateHeight(minContainerHeight: number): void {
    if (this.element.clientHeight >= minContainerHeight) {
      return;
    }

    this.element.style.height = `${minContainerHeight}px`;
  }
}
