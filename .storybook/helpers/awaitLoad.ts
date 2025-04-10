const checkIfLoaded = (loader) => {
  return new Promise((resolve, reject) => {
    const result = loader();
    if (result) {
      resolve(result);
    } else {
      reject();
    }
  });
};

const awaitLoad = (loader) => {
  return new Promise(async (resolve, reject) => {
    const load = () => {
      checkIfLoaded(loader)
        .then((result) => resolve(result))
        .catch(() => setTimeout(() => load(), 0));
    };
    load();
  });
};

const elementLoader = (elementName: string) => () => {
  const element = document.querySelector(`[data-component="${elementName}"]`);
  return element;
};

export { elementLoader, awaitLoad };
