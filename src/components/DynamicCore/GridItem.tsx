import { createElement } from 'react';

export default function ({ gridProps }: any) {
  const { comp, compName } = gridProps;

  return (
    <>
      <span>{compName}</span>
      <span>
        {comp &&
          createElement(comp, {
            ...gridProps,
          })}
      </span>
    </>
  );
}
