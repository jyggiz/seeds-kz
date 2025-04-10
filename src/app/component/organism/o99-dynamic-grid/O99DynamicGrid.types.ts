export type O99DynamicGridProps = {
  id?: string;
  scrollComponent?: boolean;
  columns: {
    columnsXS?: number;
    columnsS?: number;
    columnsM?: number;
    columnsL?: number;
    columnsXL?: number;
  };
  gap?: string;
  autoRows?: string;
  items: Array<{
    componentName: ComponentName;
    data: ComponentData;
  }>;
};

type ComponentName = string;
type ComponentData = unknown;
