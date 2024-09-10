import { memo, useEffect, useState } from 'react';
import { Descriptions, Empty } from 'antd';
import ProCard from '@ant-design/pro-card';
import { getPanoramaDateInfo } from '../../service';

const { Item } = Descriptions;

function DateInfo({ fundId }: { fundId: string }) {
  const [contentItems, setContentItems] = useState([]);

  useEffect(() => {
    (async () => {
      const { content = [] } = await getPanoramaDateInfo({ fundId });
      setContentItems(content);
    })();
  }, []);

  if (Array.isArray(contentItems) && contentItems.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <ProCard>
      <Descriptions column={4}>
        {contentItems?.map((item: any, index: number) => (
          <Item key={index} label={item.label}>
            {item.value || '-'}
          </Item>
        ))}
      </Descriptions>
    </ProCard>
  );
}

export default memo(DateInfo);
