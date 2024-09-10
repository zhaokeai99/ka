import { memo, useEffect, useState } from 'react';
import { Descriptions, Empty } from 'antd';
import ProCard from '@ant-design/pro-card';
import { queryProductTreeFundIdLabels } from '../../service';

const { Item } = Descriptions;

function Tags({ fundId }: { fundId: string }) {
  const [contentItems, setContentItems] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await queryProductTreeFundIdLabels({ fundId });
      setContentItems(result);
    })();
  }, []);

  if (Array.isArray(contentItems) && contentItems.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <ProCard>
      <Descriptions column={4}>
        {contentItems?.map((item: any, index: number) => (
          <Item key={index} label={item.labelName}>
            {item.isSelect === 1 && '是'}
            {item.isSelect === 0 && '否'}
            {item.isSelect === 2 && '-'}
          </Item>
        ))}
      </Descriptions>
    </ProCard>
  );
}

export default memo(Tags);
