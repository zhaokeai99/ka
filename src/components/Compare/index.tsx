import { memo, useState, useEffect } from 'react';
import { history } from 'umi';
import { Popover, Button, message, Badge } from 'antd';
import { DiffOutlined } from '@ant-design/icons';
import _map from 'lodash/map';
import DebounceSelect from '@/components/DebounceSelect';
import { SizeType } from 'antd/lib/config-provider/SizeContext';

function Compare({
  searchInfo,
  openUrl,
  labelName,
  keyName,
  request,
  type = 'primary',
  size = 'middle',
  callback,
}: {
  openUrl: string;
  labelName: string;
  keyName: string;
  request?: any;
  searchInfo: ({ keyword }: { keyword: string }) => any;
  callback?: any;
  type?: 'primary' | 'default' | 'link' | 'text' | 'ghost' | 'dashed' | undefined;
  size?: SizeType;
}) {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      if (request) {
        const result = await request();
        if (Array.isArray(result)) {
          setValue(
            result.map((r: any) => ({
              key: r[keyName],
              value: r[keyName],
              label: r[labelName],
            })),
          );
        }
      }
    })();
  }, [request]);

  async function fetchList(keyword: string): Promise<any[]> {
    return searchInfo({ keyword }).then((result: any) =>
      result.map((r: any) => ({
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
      placement="bottomLeft"
      onVisibleChange={handleVisibleChange}
      visible={visible}
      content={
        <div>
          <DebounceSelect
            value={value}
            onChange={(newValue) => {
              if (newValue.length > 5) {
                message.warn('最多5条基金进行对比！');
                return;
              }
              setValue(newValue);
              if (callback) {
                callback(newValue);
              }
            }}
            showSearch
            placeholder="请输入关键字搜索"
            fetchOptions={fetchList}
            style={{ width: '250px' }}
            mode="multiple"
            size={size}
          />
          <Button
            size={size}
            type="primary"
            disabled={value.length > 5 || value.length < 2}
            onClick={() => {
              if (value.length > 5 || value.length < 2) {
                message.warn('对比的数据不能少于2条或多于5条！');
              }
              setVisible(false);
              const keysStr = _map(value, 'value').join(',');
              history.push(`${openUrl}${keysStr}`);
            }}
          >
            去对比
          </Button>
        </div>
      }
      title={null}
      trigger="click"
    >
      <Badge count={value.length} size="small">
        <Button type={type} icon={<DiffOutlined />} size={size}>
          指数对比
        </Button>
      </Badge>
    </Popover>
  );
}

export default memo(Compare);
