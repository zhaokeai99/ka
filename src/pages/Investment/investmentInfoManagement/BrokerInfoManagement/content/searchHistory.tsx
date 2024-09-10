import ProCard from '@ant-design/pro-card';
import { Spin, Tag } from 'antd';
import lodash from 'lodash';
import { memo, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import {
  SelmRoadShowOpLogFacadeDeleteRoadShowOpInfo,
  SelmRoadShowOpLogFacadeQueryRoadShowOpUnique,
} from '../service';

interface ModalProps {
  onSearch: (val: string) => void;
  cRef: any;
}

/**
 * 搜索历史（废弃）
 * @param props
 * @constructor
 */
const SearchHistory = (props: ModalProps) => {
  const { cRef } = props;
  const [historyMap, setHistoryMap] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    const params = { sortField: 'logTime', sortOrder: 'desc', pageSize: 10, current: 1 };
    const result = await SelmRoadShowOpLogFacadeQueryRoadShowOpUnique(params);
    if (result.success) {
      setHistoryMap(result.data.data);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const addKeyword = (key: string) => {
    if (key === undefined || key === '') {
      return;
    }
    const i = lodash.findIndex(historyMap, { keyword: key });
    if (i < 0) {
      const obj = {
        keyword: key,
      };
      if (historyMap.length >= 10) {
        historyMap.splice(10, 1);
      }
      const tmp = [obj, ...historyMap];
      setHistoryMap(tmp);
    } else {
      const objs = historyMap.splice(i, 1);
      setHistoryMap([...objs, ...historyMap]);
    }
  };

  //更新
  useImperativeHandle(cRef, () => ({
    // 更新树
    addKeyword: (key: string) => {
      addKeyword(key);
    },
  }));

  // 点击
  const hisClick = (keyword: string) => {
    props.onSearch(keyword);
  };
  //删除
  const hisDelete = async (keyword: number) => {
    const params = { keyword };
    const result = await SelmRoadShowOpLogFacadeDeleteRoadShowOpInfo(params);
    if (result.success) {
      return true;
    }
    return false;
  };

  return (
    <div style={{ padding: '16px 16px 0 16px' }}>
      <ProCard title={'搜索历史'} bordered>
        <Spin spinning={loading}>
          {historyMap.map((item: any) => (
            <Tag
              id={item.keyword}
              key={item.keyword}
              onClick={() => hisClick(item.keyword)}
              closable={true}
              onClose={() => hisDelete(item.keyword)}
              style={{ cursor: 'pointer', marginBottom: 10 }}
            >
              {item.keyword}
            </Tag>
          ))}
        </Spin>
      </ProCard>
    </div>
  );
};

export default memo(SearchHistory);
