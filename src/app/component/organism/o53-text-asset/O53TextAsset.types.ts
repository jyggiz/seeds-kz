import M18ParagraphProps from '../../molecule/m18-paragraph/M18Paragraph.types';
import M16FigureProps from '../../molecule/m16-figure/M16Figure.types';
import { A19VideoProps } from '../../atom/a19-video/A19Video.types';
import M17ListProps from '../../molecule/m17-list/M17List.types';

export type O53TextAssetProps = {
  assetFirst?: boolean;
  assetPull?: boolean;
  id?: string;
  scrollComponent?: boolean;
  type: 'paragraph' | 'list';
  text: {
    align?: {
      block: 'start' | 'center' | 'end';
      inline: 'start' | 'center' | 'end';
    };
    content: M18ParagraphProps | M17ListProps;
  };
  asset: {
    content: M16FigureProps | A19VideoProps;
  };
};
