import { extractNumber } from './util/extractNumber';

const resortBlockPages = (indexRoot: HTMLElement | null) => {
  if (!indexRoot) {
    return;
  }

  const blockHeader = document.querySelector('[data-category="Block"]');
  const blockPagesContainer = blockHeader?.nextElementSibling;
  const blockPagesCollection = blockPagesContainer?.children;

  if (blockPagesCollection) {
    const blockPages = Array.from(blockPagesCollection) as HTMLElement[];

    blockPages.forEach((element) => {
      element.dataset.id = element.querySelector('span.id')?.textContent || '0';
    });

    const blockPagesSorted = blockPages.slice().sort((a, b) => {
      const numberIdA = a.dataset.id && extractNumber(a.dataset.id);
      const numberIdB = b.dataset.id && extractNumber(b.dataset.id);

      if (numberIdA && numberIdB) {
        return numberIdA - numberIdB;
      }
      return 0;
    });

    if (blockPagesContainer) {
      blockPagesContainer.innerHTML = '';
      blockPagesContainer.append(...blockPagesSorted);
    }
  }
};

export default resortBlockPages;
