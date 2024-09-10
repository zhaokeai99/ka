import { useState } from 'react';
import { Radio } from 'antd';
import styles from './index.less';

export default function (props) {
  const [type, SetType] = useState(props?.types);

  const typeChange = (e: any, name: string) => {
    const typeObj = {
      ...type,
      [name]: e.target.value,
    };

    SetType(typeObj);

    if (props?.onChange) {
      props.onChange(typeObj);
    }
  };

  return (
    <div className={styles['container']}>
      <Radio.Group
        value={type?.timeFrequency}
        size="small"
        buttonStyle="solid"
        onChange={(e: any) => typeChange(e, 'timeFrequency')}
      >
        <Radio.Button value="day">日频</Radio.Button>
        <Radio.Button value="week">周频</Radio.Button>
        <Radio.Button value="month">月频</Radio.Button>
        <Radio.Button value="quarter">季频</Radio.Button>
      </Radio.Group>
      <Radio.Group
        style={{ marginLeft: '20px' }}
        value={type?.scaleType}
        size="small"
        buttonStyle="solid"
        onChange={(e: any) => typeChange(e, 'scaleType')}
      >
        <Radio.Button value="funds">资金规模</Radio.Button>
        <Radio.Button value="customer">客户规模</Radio.Button>
      </Radio.Group>
      <Radio.Group
        style={{ marginLeft: '20px' }}
        value={type?.timeFrame}
        size="small"
        buttonStyle="solid"
        onChange={(e: any) => typeChange(e, 'timeFrame')}
      >
        <Radio.Button value="month">近一月</Radio.Button>
        <Radio.Button value="quarter">近一季度</Radio.Button>
        <Radio.Button value="halfYear">近半年</Radio.Button>
        <Radio.Button value="oneYear">近一年</Radio.Button>
        <Radio.Button value="sinceYear">今年以来</Radio.Button>
      </Radio.Group>
    </div>
  );
}
