import { M34ComponentBackgroundProps } from 'app/component/molecule/m34-component-background/M34ComponentBackground.types';
import { O73SubmitStepProps } from 'app/component/organism/o73-submit-step/O73SubmitStep.types';
import { FormStepProps } from './component/organism/form-step/FormStep.types';
import { RecaptchaInfo } from '../../../util/RecaptchaUtils';
import M04ComponentHeaderProps from 'app/component/molecule/m04-component-header/M04ComponentHeader.types';

export type C59MultiStepFormProps = {
  apiUrl: string;
  dir: 'ltr' | 'rtl';
  form_id: string;
  conditionalStep: ConditionalStep;
  id?: string;
  steps: Array<FormStepProps & { header: M04ComponentHeaderProps }>;
  recaptcha: RecaptchaInfo;
  scrollComponent?: boolean;
  titleInEnglish: string;
  submitView: O73SubmitStepProps;
  background: M34ComponentBackgroundProps;
};

export type ConditionalStep = {
  valueToMatch: string;
  stepNumber: number;
};
