import AbstractTransitionComponent from 'app/component/AbstractTransitionComponent';
import { setAsInitialised } from 'app/util/setAsInitialised';
import C48FormsTransitionController from './C48FormsTransitionController';
import { isIpad, isIphoneOrIpod, isSafari } from '../../../util/browserUtils';
import './c48-forms.scss';

export default class C48Forms extends AbstractTransitionComponent {
  public static readonly displayName: string = 'c48-forms';

  // public readonly transitionController: C48FormsTransitionController;

  constructor(el: HTMLElement) {
    super(el);

    // this.transitionController = new C48FormsTransitionController(this);
  }

  public adopted() {
    setAsInitialised(this.element);

    // There is an issue with in Safari browser and in iOS devices
    // It doesn't scroll down to the component with corresponding ID through URL fragment
    // That is why we needed to use JS to achieve this behavior
    if (isSafari() || isIphoneOrIpod() || isIpad()) {
      const id = window.location.hash.replace('#', '');
      const idAttribute = this.element.getAttribute('id');

      if (id === idAttribute) {
        this.element.scrollIntoView();
      }
    }
  }
}
