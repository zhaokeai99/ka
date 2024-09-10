import React, { memo } from 'react';

interface ModalProps {
  formValue: any;
}

const CatInfo = (props: ModalProps) => {
  const { formValue } = props;

  return (
    <>
      <pre>{formValue}</pre>
    </>
  );
};
export default memo(CatInfo);
