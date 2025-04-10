import { NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';
import A04EyebrowProps from 'app/component/atom/a04-eyebrow/A04Eyebrow.types';

export type C105PdfViewerProps = {
  backgroundColor?: NeomThemeBackgroundColors;
  padding?: BlockComponentPadding;
  eyebrow: Pick<A04EyebrowProps, 'text'>;
  id?: string;
  scrollComponent?: boolean;
  paginationLabel: string;
  minimapLabel: string;
  pdfUrl: string;
};
