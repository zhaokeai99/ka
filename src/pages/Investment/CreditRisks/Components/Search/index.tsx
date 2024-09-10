import { memo, useState, useMemo, useRef } from 'react';
import { history } from 'umi';
import { Popover, Select, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';

function Search(props: any) {
  const { debounceTimeout = 800, fetchList, callback, children, openUrl } = props;
  const [searchStr] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchList(value).then((newOptions: any) => {
        if (fetchId !== fetchRef.current) return;

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchList, debounceTimeout]);

  const handleVisibleChange = (v: boolean) => {
    setVisible(v);
  };

  return (
    <Popover
      placement="bottom"
      onVisibleChange={handleVisibleChange}
      visible={visible}
      content={
        <Select
          value={searchStr}
          labelInValue
          filterOption={false}
          onFocus={() => debounceFetcher('')}
          onSearch={debounceFetcher}
          showSearch
          notFoundContent={fetching ? <Spin size="small" /> : null}
          placeholder="请输入关键字搜索"
          style={{ width: '300px' }}
          options={options}
          onChange={(newValue: any) => {
            setVisible(false);
            if (openUrl) {
              history.push(`${openUrl}${newValue.value}`);
            } else {
              callback(newValue);
            }
          }}
        />
      }
      title={null}
      trigger="click"
    >
      {children || <SearchOutlined style={{ marginRight: '10px', color: '#1890ff' }} />}
    </Popover>
  );
}

export default memo(Search);
