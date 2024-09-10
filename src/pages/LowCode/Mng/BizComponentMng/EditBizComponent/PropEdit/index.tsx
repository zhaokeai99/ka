import React, { useState } from 'react';
import PropItem from './PropItem';
import { Button } from 'antd';

export interface PropEditProps {
  updateSchema: (key: any, value: any) => any;
  currentDescription: any[];
  editData: any;
}

const PropEdit: React.FC<PropEditProps> = ({
  updateSchema = () => {},
  currentDescription = [],
  editData = {},
}) => {
  const [showMore, setShowMore] = useState(false);
  console.log('renderItems ', currentDescription);
  console.log('renderItems editData ', editData);
  return (
    currentDescription &&
    currentDescription.map((item: any) => {
      if (!item.defaultShow && !showMore) {
        return null;
      }
      if (item.inputType === 'more_desc_high_level') {
        return (
          <Button
            style={{ width: '100%', textAlign: 'right' }}
            type="link"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? '收起<<<' : '更多>>>'}
          </Button>
        );
      }
      return (
        <PropItem
          // itemkey={item.key}
          label={item.label}
          inputType={item.inputType}
          callBack={(value) => {
            updateSchema(item.key, value);
          }}
          defaultValue={editData && editData[item.key]}
          placeholder={item.placeholder}
        ></PropItem>
      );
    })
  );
};

export default PropEdit;
