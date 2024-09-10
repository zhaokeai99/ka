import React from 'react';
import styles from './index.less';

export interface TagProps {
  color?: string;
  backgroundColor?: string;
}

const Tag: React.FC<TagProps> = (props) => {
  const { children, color, backgroundColor } = props;

  return (
    <span style={{ color, backgroundColor }} className={styles['tag-style']}>
      {children}
    </span>
  );
};

export default Tag;
