export type FormControlsProps = {
  id?: string;
  scrollComponent?: boolean;
  buttons: {
    previous?: boolean;
    next?: boolean;
    submit?: boolean;
  };
};
