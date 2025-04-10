import { loadScript } from './loadScript';

export type RecaptchaInfo = {
  sitekey: string;
  statement?: string;
};

export class RecaptchaUtils {
  sitekey: string;
  constructor(sitekey: string) {
    this.sitekey = sitekey;
  }

  //required to trigger before executing recaptcha
  loadRecaptchaScript() {
    return loadScript({
      id: 'recaptcha',
      source: `https://www.google.com/recaptcha/api.js?render=${this.sitekey}`,
    });
  }

  executeRecaptcha(action?: string): Promise<string> {
    return new Promise((resolve) => {
      grecaptcha.ready(() => {
        grecaptcha.execute(this.sitekey, { action: action || 'submit' }).then((token) => {
          resolve(token);
        });
      });
    });
  }
}
