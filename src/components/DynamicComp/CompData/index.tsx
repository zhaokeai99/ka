import { useEffect } from 'react';
import { queryData } from '@/pages/LowCode/core/service';
import { Popover } from 'antd';
import { QuestionCircleTwoTone } from '@ant-design/icons';

import styles from './compData.less';
import { useState } from 'react';

export interface CompAProps {
  summary: string;
  description: string;
  rateTitle: string;
  dataUrl: string; // 在组件加载时查询一下，如果有动态参数，需要在查询useEffect里边对动态参数进行依赖，感知变化
  staticParams: object; // 组件参数是在容器层先处理一下，包含静态和动态的配置内容
  dataFilter: string; // 这个需要在调用后，按照标准格式处理数据，如果为空，就不处理，在组件内调用
  // 如果有反向上传接口，需要增加对应接口描述 如: deleteUrl，一般反向接口数据都来自组件生产，没有额外参数需要从容器再携带，
  // 反向接口可能也需要加一个处理函数
}

export default function (props: CompAProps) {
  const [data, setData] = useState({});
  useEffect(() => {
    queryData({ url: props.dataUrl, params: props.staticParams }).then((res) => {
      if (res && res.success && res.data) {
        console.log('before filter', res.data);
        let newdata = res.data;
        if (props.dataFilter) {
          const filterFuc = new Function('data', props.dataFilter);
          newdata = filterFuc(res.data);
          console.log('after filter', newdata);
        }
        setData(newdata);
      } else {
        console.log('query fail.');
      }
    });
  }, [props.queryParams]); // 这里参数多个，是不是打散监听，如果不打散，外部传递，每次参数变化都要复制一个新的

  return (
    <div className={styles['container']}>
      <div className={styles['header-container']}>
        <div className={styles['title']}>{`${props.summary || '--'}(${data.time})`}</div>
        <Popover content={<div>{props.description}</div>}>
          <QuestionCircleTwoTone className={styles['desc']} />
        </Popover>
      </div>
      <div className={styles['value']}>{data.value}</div>
      <div className={styles['foot-container']}>
        <div className={styles['title']}>{`${props.rateTitle || '--'}`}</div>
        <img
          className={styles['icon']}
          src={
            data.upDown
              ? 'https://thfund-yuque-assets.thfund.com.cn/assets/yuque/0/2021/png/22234871/1636530458088-assets/web-upload/33c4028f-c130-48c5-b605-af5d2552e2e3.png'
              : 'https://thfund-yuque-assets.thfund.com.cn/assets/yuque/0/2021/png/22234871/1636530458088-assets/web-upload/33c4028f-c130-48c5-b605-af5d2552e2e3.png'
          }
        />
        <div className={styles['desc']}>{`${data.rate || '--'}`}</div>
      </div>
    </div>
  );
}
