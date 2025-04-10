import AbstractComponent from 'app/component/AbstractComponent';
import { S01NavigationProps } from '../../block/s01-navigation/S01Navigation.types';
import S01Template from '../../block/s01-navigation/s01-navigation.hbs?include';
import { getAppComponent } from 'app/util/getElementComponent';
import { cleanElement, initComponents, requestEmptyInitSlot } from 'muban-core';
import { addComponentInstancesToScrollManager } from 'app/addComponentInstancesToScrollManager';
import get from 'app/util/fetch/getRequest';

const setupMockDataEndpoint = () => import('./mockDataEndpoint');
const getFallbackDataRu = () => import('./navDataFallback.json');
const getFallbackDataKz = () => import('./navDataFallback-kz.json');

export const NAV_IS_READY = 'navIsReady';

export const navTemplates = {
  S01Template: 's01-navigation',
} as const;

type Template = (data?: Record<string, any>) => string;

type NavTemplateKeys = keyof typeof navTemplates;

export type NavTemplateNames = (typeof navTemplates)[NavTemplateKeys];

const template: Record<NavTemplateNames, Template> = {
  [navTemplates.S01Template]: S01Template,
};

type TemplatePropTypes = {
  [navTemplates.S01Template]: S01NavigationProps;
};

export type NavIsReadyEvent = CustomEvent<NavTemplateNames>;

export default class O97NavigationPlaceholder extends AbstractComponent {
  public static readonly displayName: string = 'o97-navigation-placeholder';

  constructor(el: HTMLElement) {
    super(el);

    requestEmptyInitSlot(async () => {
      await this.constructNav();
    }).catch((err: Error) => console.log(err));
  }

  private get navigationTemplate() {
    const navTemplateName = this.element.dataset.navigationTemplate;

    if (!navTemplateName) {
      throw new Error('Cannot find name of navigation template');
    }

    return navTemplateName as keyof typeof template;
  }

  private async getNavData() {
    try {
      const navFallbackData = document.documentElement.lang === 'ru'
        ? await getFallbackDataRu()
        : await getFallbackDataKz()
      return navFallbackData;
    } catch (error) {
    }
  }

  private async constructNav() {
    const navTemplate = template[this.navigationTemplate];

    const navData = (await this.getNavData()) as TemplatePropTypes[typeof this.navigationTemplate];

    const navHTML = navTemplate(navData);

    cleanElement(this.element);

    const navElement = this.constructNavElement(navHTML);

    this.element.parentNode?.replaceChild(navElement, this.element);

    await this.initNavComponent(navElement);

    const navIsReadyEvent: NavIsReadyEvent = new CustomEvent(NAV_IS_READY, {
      detail: this.navigationTemplate,
    });

    const app = await getAppComponent();

    app?.element.dispatchEvent(navIsReadyEvent);
  }

  private constructNavElement(navHTML: string) {
    const temp = document.createElement('div');

    temp.innerHTML = navHTML;

    const navElement = temp.firstElementChild as HTMLElement;

    if (!navElement) {
      throw new Error('Cannot get nav element');
    }

    return navElement;
  }

  private async initNavComponent(navElement: HTMLElement) {
    await initComponents(navElement);

    addComponentInstancesToScrollManager();
  }
}
