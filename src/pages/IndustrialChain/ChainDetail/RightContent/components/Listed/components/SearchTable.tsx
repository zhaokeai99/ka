import { Radio, Spin, Table } from 'antd';
import { SearchTableProps } from '../service';

const SearchTable = (props: SearchTableProps) => {
  return (
    <div style={{ marginTop: props?.marginTop }}>
      <h4 style={{ display: 'inline-block' }}>{props?.title}</h4>
      <Radio.Group
        defaultValue={props?.radioList?.length ? props?.radioList[0].value : ''}
        buttonStyle="solid"
        size="small"
        style={{ marginBottom: 12, float: 'right' }}
        onChange={(value: any) => props.onChange(value.target.value)}
      >
        {(props?.radioList || []).map(({ value, label }: any) => (
          <Radio.Button key={value} value={value}>
            {label}
          </Radio.Button>
        ))}
      </Radio.Group>
      <Spin spinning={props?.loading}>
        <Table
          rowKey="name"
          size="small"
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
