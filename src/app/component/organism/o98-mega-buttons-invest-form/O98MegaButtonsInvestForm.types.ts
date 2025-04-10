import { A26FieldsetLegendProps } from 'app/component/atom/a26-fieldset-legend/A26FieldsetLegend.types';
import { M02ButtonProps } from 'app/component/molecule/m02-button/M02Button.types';
import { M31DropdownFieldProps } from 'app/component/molecule/m31-dropdown-field/M31DropdownField.types';
import { M53TileCtaProps } from 'app/component/molecule/m53-tile-cta/M53TileCta.types';
import { O99DynamicGridProps } from '../o99-dynamic-grid/O99DynamicGrid.types';

export type O98MegaButtonsInvestFormProps = {
  id?: string;
  scrollComponent?: boolean;
  buttons: Array<MegaButtonComponent>;
  drilldownControls: Array<DrilldownControl>;
};

type MegaButtonComponent = M53;

type M53 = { componentName: MegaButtonComponentNames.M53; data: M53TileCtaProps };

export enum MegaButtonComponentNames {
  M53 = 'm53-tile-cta',
}

type DrilldownControlComponent = M31 | O99;

type DrilldownControl = {
  forButtonWithId: string;
  header: A26FieldsetLegendProps;
  mobile: { control: DrilldownControlComponent; submitButton: M02ButtonProps };
  desktop: { control: DrilldownControlComponent };
};

type M31 = {
  componentName: DrilldownControlsComponentNames.M31;
  data: M31DropdownFieldProps;
};

type O99 = {
  componentName: DrilldownControlsComponentNames.O99;
  data: O99DynamicGridProps;
};

export enum DrilldownControlsComponentNames {
  M31 = 'm31-dropdown-field',
  O99 = 'o99-dynamic-grid',
}
