import { createElement } from 'react';
import { CloseCircleTwoTone } from '@ant-design/icons';
import { primaryColor } from '@/themes/index';
// import styles from './gridItem.less';

// 这里也可以通过React的Suspense + Lazy替代
export default function ({ gridProps, deleteCallBack }: any) {
  const { comp, /*compName,*/ isEdit } = gridProps;

  return (
    <>
      {/* <span>{compName}</span> */}
      {/* <span className={styles['delete-icon']}> */}
      {isEdit && (
        <CloseCircleTwoTone
          onClick={() => deleteCallBack && deleteCallBack()}
          twoToneColor={primaryColor}
          style={{ fontSize: 24, position: 'absolute', right: 2, top: 2, zIndex: 20 }}
        />
      )}
      {/* </span> */}
      <span>
        {comp &&
          createElement(comp, {
            ...gridProps,
          })}
      </span>
    </>
  );
}
