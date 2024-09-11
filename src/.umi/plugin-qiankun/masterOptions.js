
      let options = {"masterHistoryType":"hash","base":"/"};
      export const getMasterOptions = () => options;
      export const setMasterOptions = (newOpts) => options = ({ ...options, ...newOpts });
      