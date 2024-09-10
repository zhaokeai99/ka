import { useEffect } from 'react';
import ProCard from '@ant-design/pro-card';
import { queryData } from '@/pages/LowCode/core/service';
import { Popover } from 'antd';
import { QuestionCircleTwoTone } from '@ant-design/icons';

import styles from './compPic.less';

export interface CompAProps {
  title: string;
  description: string;
  picTitle: string;
  pic: string;
  dataUrl: string; // 在组件加载时查询一下，如果有动态参数，需要在查询useEffect里边对动态参数进行依赖，感知变化
  staticParams: object; // 组件参数是在容器层先处理一下，包含静态和动态的配置内容
  dataFilter: string; // 这个需要在调用后，按照标准格式处理数据，如果为空，就不处理，在组件内调用
  // 如果有反向上传接口，需要增加对应接口描述 如: deleteUrl，一般反向接口数据都来自组件生产，没有额外参数需要从容器再携带，
  // 反向接口可能也需要加一个处理函数
}

export default function (props: CompAProps) {
  useEffect(() => {
    queryData({ url: props.dataUrl, params: props.staticParams }).then((res) => {
      if (res && res.success && res.data) {
        console.log('before filter', res.data);
        if (props.dataFilter) {
          const filterFuc = new Function('data', props.dataFilter);
          console.log('after filter', filterFuc(res.data));
        }
      } else {
        console.log('query fail.');
      }
    });
  }, [props.queryParams]); // 这里参数多个，是不是打散监听，如果不打散，外部传递，每次参数变化都要复制一个新的

  return (
    <ProCard
      title={props.title || '无标题'}
      extra={
        <>
          <Popover content={<div>{props.description}</div>}>
            <QuestionCircleTwoTone />
          </Popover>
        </>
      }
      style={{ height: '100%' }}
    >
      {props.picTitle && <img src={props.picTitle} className={styles['image']}></img>}
      {props.pic && <img src={props.pic} className={styles['image']}></img>}
    </ProCard>
  );
}
