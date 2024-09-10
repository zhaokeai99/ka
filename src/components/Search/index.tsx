import DebounceSelect from '@/components/DebounceSelect';
import { SearchOutlined } from '@ant-design/icons';
import { Popover, Space } from 'antd';
import { get as _get } from 'lodash';
import { memo, useState } from 'react';
import { history } from 'umi';

function Search({
  searchInfo,
  openUrl,
  labelName,
  keyName,
  callback,
  label = '',
  children,
  newKey,
  searcher,
  searchParams = {},
}: {
  openUrl?: string;
  labelName: string;
  keyName: string;
  label?: string;
  searchInfo: ({ keyword }: { keyword: string }) => any;
  searchParams: any;
  callback?: (params: any) => void;
  children?: any;
  newKey?: string;
  searcher?: { searcherType: string };
}) {
  const [searchStr] = useState(null);
  const [visible, setVisible] = useState(false);

  async function fetchList(keyword: string): Promise<any[]> {
    let params = { keyword };
    if (_get(searcher, 'searcherType', '')) {
      const paramsObj = {};
      paramsObj[newKey] = keyword;
      params = {
        ...searcher,
        ...paramsObj,
      };
    } else if (newKey) {
      const paramsObj = {};
      paramsObj[newKey] = keyword;
      params = {
        ...paramsObj,
      };
    }

    return searchInfo({ ...params, ...searchParams }).then((result: any) =>
      result?.map((r: any) => ({
        key: r[keyName],
        value: r[keyName],
        label: r[labelName],
      })),
    );
  }

  const handleVisibleChange = (v: boolean) => {
    setVisible(v);
  };

  return (
    <Popover
      placement="bottom"
      onVisibleChange={handleVisibleChange}
      visible={visible}
      content={
        <Space size={2}>
          {label}
          <DebounceSelect
            value={searchStr}
            onChange={(newValue) => {
              setVisible(false);
              if (openUrl) {
                history.push(`${openUrl}${newValue.value}`);
              } else {
                callback(newValue);
              }
            }}
            showSearch
            placeholder="请输入关键字搜索"
            fetchOptions={fetchList}
            style={{ width: '300px' }}
          />
        </Space>
      }
      title={null}
      trigger="click"
    >
      {children || <SearchOutlined style={{ marginRight: '10px', color: '#1890ff' }} />}
    </Popover>
  );
}

export default memo(Search);
