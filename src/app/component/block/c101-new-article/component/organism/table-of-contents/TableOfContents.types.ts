export type TableOfContentsProps = {
  label: string;
  items: ReadonlyArray<{
    paragraphId: string;
    label: string;
  }>;
  isMobile: boolean;
  id?: string;
  showTableOfContents: boolean;
};
