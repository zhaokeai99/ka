import { memo, useEffect, useState } from 'react';
import { Descriptions, Empty } from 'antd';
import ProCard from '@ant-design/pro-card';
import { getPanoramaContractInfo } from '../../service';

const { Item } = Descriptions;

function Basic({ fundId }: { fundId: string }) {
  const [contentItems, setContentItems] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await getPanoramaContractInfo({
        fundId,
      });

      const { content } = result || {};
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
            <div
              title={item.value || '-'}
              style={{
                display: '-webkit-box',
                overflow: 'hidden',
                whiteSpace: 'normal',
                textOverflow: 'ellipsis',
                wordWrap: 'break-word',
                webkitLineClamp: '3',
                webkitBoxOrient: 'vertical',
              }}
            >
              {item.value || '-'}
            </div>
          </Item>
        ))}
      </Descriptions>
    </ProCard>
  );
}

export default memo(Basic);
