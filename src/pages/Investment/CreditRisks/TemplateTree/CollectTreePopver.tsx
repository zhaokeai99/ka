import React, { useMemo, memo } from 'react';
import { Popover } from 'antd';
import styles from './index.less';

type ProverProps = {
  title: any;
  onDel: () => void;
  onInfo: (e: any) => void;
};

const ProverContent = (props: ProverProps) => {
  const { title, onDel, onInfo } = props;
  const content = useMemo(() => {
    return (
      <ul className={styles['prover-content']}>
        <li
          onClick={(e) => {
            e?.stopPropagation();
            onInfo(e);
          }}
        >
          查看
        </li>
        <li
          onClick={(e) => {
            e?.stopPropagation();
            onDel();
          }}
        >
          删除
        </li>
      </ul>
    );
  }, [onDel, onInfo]);
  return (
    <Popover
      placement="bottom"
      overlayClassName={styles['popover-wrap']}
      content={content}
      title={null}
      trigger="contextMenu"
    >
      {title}
    </Popover>
  );
};

export default memo(ProverContent);
