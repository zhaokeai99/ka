import { Select, Spin, Table } from 'antd';
import { useEffect, useState } from 'react';
import { SearchTableProps } from '../service';

const { Option } = Select;

const SearchTable = (props: SearchTableProps) => {
  const [selValue, setSelValue] = useState<string>('');

  useEffect(() => {
    setSelValue(props?.list?.length ? props?.list[0].value : '');
  }, [props?.list]);

  return (
    <div style={{ marginTop: props?.marginTop }}>
      <h4 style={{ display: 'inline-block' }}> </h4>
      <Select
        size="small"
        value={selValue}
        style={{
          marginBottom: 12,
          float: 'right',
          width: 150,
          marginTop: -12,
        }}
        onChange={(value: string) => {
          setSelValue(value);

          props.onChange(value);
        }}
      >
        {(props?.list || []).map(({ value, label }: any) => (
          <Option key={value} value={value}>
            {label}
          </Option>
        ))}
      </Select>

      <Spin spinning={props?.loading}>
        <Table
          size="small"
          rowKey="companyName"
          columns={props?.columns}
          dataSource={props?.data}
          pagination={false}
          scroll={props?.data?.length > 10 ? { y: 300 } : { y: undefined }}
        />
      </Spin>
    </div>
  );
};

export default SearchTable;
