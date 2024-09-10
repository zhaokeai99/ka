import { memo, useEffect, useState } from 'react';
import { Space, Card, Descriptions, Empty } from 'antd';
import { getPanoramaFeeInfo } from '../../service';

const { Item } = Descriptions;

function Fee({ fundId }: { fundId: string }) {
  const [feeItems, setFeeItems] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await getPanoramaFeeInfo({ fundId });
      setFeeItems(result);
    })();
  }, []);

  if (Array.isArray(feeItems) && feeItems.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <Space size="small" wrap align="start">
      {Array.isArray(feeItems) &&
        feeItems.map(({ content = [] }) => {
          if (content.length > 0) {
            return (
              <Card
                size="small"
                title={content[0]['value']}
                style={{ width: '25vw' }}
                headStyle={{ backgroundColor: '#87CEE8' }}
              >
                <Descriptions column={1}>
                  {content.slice(1, content.length).map((item: any, i: number) => {
                    if (Array.isArray(item.value)) {
                      return (
                        <>
                          {item.value.map((v: any, _i: number) => (
                            <Item key={`fee_card_range_${_i}`} label={v.label}>
                              {v.value || '-'}
                            </Item>
                          ))}
                        </>
                      );
                    }

                    return (
                      <Item key={`fee_card_${i}`} label={item.label}>
                        {item.value || '-'}
                      </Item>
                    );
                  })}
                </Descriptions>
              </Card>
            );
          }

          return null;
        })}
    </Space>
  );
}

export default memo(Fee);
