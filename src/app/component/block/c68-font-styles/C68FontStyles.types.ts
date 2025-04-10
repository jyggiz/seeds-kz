import M14ToggleButtonProps from 'app/component/molecule/m14-toggle-button/M14ToggleButton.types';

export type C68FontStylesProps = {
  id?: string;
  scrollComponent?: boolean;
  accordionHeading: {
    heading: string;
  };
  accordionFontExamples: Array<{
    fontStyleType?: string;
    fontStyle: string;
    button: M14ToggleButtonProps;
    firstColumnItems: {
      title: string;
      line: string;
    };
    secondColumnItems: {
      title: string;
      line: string;
    };
  }>;
  tableHead: {
    style: string;
    font: string;
    weight: string;
    size: string;
    case: string;
    spacing: string;
    lineHeight: string;
  };
  fontExamples: Array<{
    fontStyleType?: string;
    fontName: string;
    fontWeight: string;
    fontSize: string;
    fontCase: string;
    fontSpacing: string;
    fontLineHeight: string;
  }>;
};
