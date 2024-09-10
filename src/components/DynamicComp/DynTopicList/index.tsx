// 产品 - 基金详情 - 话题UI组件
import { useState, useEffect } from 'react';
import { Link } from 'umi';
import { Empty, Divider, Spin } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import ProCardPlus from '@/components/ProCardPlus';
import services from './service';

export default function DynTopicList(props: any) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { dataUrl, title, staticParams } = props || {};
  const { moreUrl } = staticParams || {};

  useEffect(() => {
    (async () => {
      if (services?.[dataUrl]) {
        setLoading(true);
        const result = await services[dataUrl]();
        setData(result);
        setLoading(false);
      }
    })();
  }, []);

  return (
    <ProCardPlus
      title={title}
      style={{ height: '390px' }}
      layout="center"
      loading={loading && <Spin spining />}
      extra={moreUrl && <Link to={moreUrl}>更多</Link>}
    >
      {data.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '320px',
            overflowX: 'hidden',
            overflowY: 'auto',
            width: '100%',
          }}
        >
          {data &&
            data.map((item: any, index: number) => (
              <div key={`${item.head}-${index}`}>
                <h4>
                  {item.linkUrl ? (
                    <a href={item.linkUrl} target="_blank" rel="noopener noreferrer">
                      {item.head}
                      <ExportOutlined style={{ marginLeft: '5px' }} />
                    </a>
                  ) : (
                    item.head
                  )}
                </h4>
                <p>{item.body}</p>
                <h6>{item.foot}</h6>
                <Divider />
              </div>
            ))}
        </div>
      )}
    </ProCardPlus>
  );
}
