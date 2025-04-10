import { M02ButtonProps } from 'app/component/molecule/m02-button/M02Button.types';
import M04ComponentHeaderProps from 'app/component/molecule/m04-component-header/M04ComponentHeader.types';
import M12SocialProps from 'app/component/molecule/m12-social/M12Social.types';
import { M34ComponentBackgroundProps } from 'app/component/molecule/m34-component-background/M34ComponentBackground.types';

export type O73SubmitStepProps = {
  id?: string;
  scrollComponent?: boolean;
  background: M34ComponentBackgroundProps;
  success: M04ComponentHeaderProps;
  failure: M04ComponentHeaderProps;
  social: M12SocialProps & {
    cta: string;
  };
  buttons: {
    done: Pick<M02ButtonProps, 'label' | 'target' | 'href'>;
    retry: Pick<M02ButtonProps, 'label'>;
  };
};
