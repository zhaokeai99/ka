import { Select } from 'antd';

const { Option } = Select;

// type:0正常;1全部;2请选择
function toOptions(list: any[], value: string, name: string, type: number = 0) {
  const result = [];
  if (type === 1) {
    result.push(
      <Option key={-1} value={-1}>
        {'全部'}
      </Option>,
    );
  } else if (type === 2) {
    result.push(
      <Option key={-1} value={-1}>
        {'请选择'}
      </Option>,
    );
  }
  if (list !== undefined) {
    for (let i = 0; i < list.length; i += 1) {
      const record = list[i];
      result.push(
        <Option key={record[value]} value={record[value]} title={record[name]}>
          {record[name]}
        </Option>,
      );
    }
  }
  return result;
}

function toOptionsDic(list: any[], type: number = 0) {
  const result = [];
  if (type === 1) {
    result.push(
      <Option key={-1} value={-1}>
        {'全部'}
      </Option>,
    );
  } else if (type === 2) {
    result.push(
      <Option key={-1} value={-1}>
        {'请选择'}
      </Option>,
    );
  }
  if (list !== undefined) {
    for (let i = 0; i < list.length; i += 1) {
      const record = list[i];
      result.push(
        <Option key={record.value} value={record.value}>
          {record.label}
        </Option>,
      );
    }
  }
  return result;
}

const toFilters = (arr: any[], oText: string, oValue: string, tText: string, tValue: string) => {
  const result = [];
  for (let i = 0; i < arr.length; i += 1) {
    const obj = {};
    obj[tText] = arr[i][oText];
    obj[tValue] = arr[i][oValue];
    result.push(obj);
  }
  return result;
};

export default {
  toOptions,
  toOptionsDic,
  toFilters,
};
