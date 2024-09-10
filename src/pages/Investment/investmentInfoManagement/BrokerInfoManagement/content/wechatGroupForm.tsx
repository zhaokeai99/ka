import ProCard from '@ant-design/pro-card';
import { List, Spin } from 'antd';
import { memo, useCallback, useEffect, useState } from 'react';
import { SelmWechatGroupQueryWechatGroup } from '../service';

/**
 * 微信群（废弃）
 * @constructor
 */
const WechatGroupForm = () => {
  const [dataMap, setDataMap] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    const result = await SelmWechatGroupQueryWechatGroup();
    if (result.success) {
      setDataMap(result.data);
      setLoading(false);
      return;
    }
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{ padding: '16px 16px 0 16px' }}>
      <ProCard title={'微信群收录'} bordered>
        <Spin spinning={loading}>
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={dataMap}
            renderItem={(item) => <div>{item.groupName}</div>}
          />
        </Spin>
      </ProCard>
    </div>
  );
};

export default memo(WechatGroupForm);
