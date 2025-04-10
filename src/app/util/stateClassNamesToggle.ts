// TODO: Use this util in all components juggling StateClassnames

type UpdateClassForItemsProps = {
  removeFrom: readonly HTMLElement[];
  addToOne?: HTMLElement | null;
  className: string;
};

export const updateClassForItems = ({
  removeFrom,
  addToOne,
  className,
}: UpdateClassForItemsProps) => {
  removeFrom.forEach((item) => item.classList.remove(className));

  if (addToOne) {
    addToOne.classList.add(className);
  }
};
