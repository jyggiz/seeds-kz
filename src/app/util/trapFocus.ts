import S01Navigation from '../component/block/s01-navigation/S01Navigation';

type FocusableElement =
  | HTMLButtonElement
  | HTMLAnchorElement
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement
  | HTMLElement
  | HTMLAudioElement
  | HTMLVideoElement
  | HTMLAreaElement
  | HTMLIFrameElement
  | HTMLObjectElement
  | HTMLEmbedElement;

export type trappedFocusType = ReturnType<typeof trapFocus> | undefined;

function ignoreUserInput(value: boolean) {
  const mainTemplate = document.querySelector('[data-component=app-root] main');
  const navigationTemplate = document.querySelector(
    `[data-component="${S01Navigation.displayName}"]`,
  );

  mainTemplate?.toggleAttribute('inert', value);
  navigationTemplate?.toggleAttribute('inert', value);
}

export function trapFocus(
  element: HTMLElement,
  prevFocusableElement = document.activeElement as FocusableElement,
) {
  ignoreUserInput(true);

  const firstFocusableElement = element.querySelector(
    '[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"], audio[controls], video[controls], [contenteditable], iframe, object, embed, summary)',
  ) as FocusableElement;
  firstFocusableElement.focus();

  return {
    removeFocus: () => {
      ignoreUserInput(false);
      prevFocusableElement?.focus();
    },
  };
}
