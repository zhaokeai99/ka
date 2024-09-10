import React, { useState } from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import { Empty, Radio } from 'antd';
import Icon from '@ant-design/icons';
import { history } from 'umi';
import styles from './index.less';

type PropsType = {
  data: any[];
  radioData: any[];
  radioOnChange: (item: string) => void;
  listOnChange: (item: string) => void;
};

const DetailList = (props: PropsType) => {
  const [curType, setCurType] = useState(0);

  const goModelData = (name: string) => {
    history.push(`/industrialChain/modelData/${name}因子`);
  };

  const imgUrl = () => (
    <img
      width="14px"
      src="https://cdnprod.tianhongjijin.com.cn/thfile/模型说明1655195544235.png"
      alt="模型说明"
    />
  );

  const DataIcon = (prop: any) => (
    <div title="查看模型说明">
      <Icon
        onClick={() => {
          goModelData(prop?.name);
        }}
        component={imgUrl}
        {...prop}
      />
    </div>
  );

  return (
    <ProCardPlus className={styles['container']} colSpan={16}>
      {props?.radioData?.length > 0 && (
        <Radio.Group
          defaultValue={props.radioData[0].value}
          buttonStyle="solid"
          size="small"
          optionType="button"
          options={props.radioData}
          onChange={(val: any) => {
            setCurType(0);
            props.radioOnChange(val.target.value);
          }}
          style={{ display: 'flex', justifyContent: 'flex-end' }}
        />
      )}
      {props?.data?.length <= 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <div className={styles['list-container']}>
          {props?.data?.map((i: any, k: number) => (
            <div key={k} className={styles['info-container']}>
              <div className={styles['title']}>
                <div className={styles['point']} />
                <a
                  className={curType === k ? styles['checked'] : styles['unchecked']}
                  onClick={() => {
                    setCurType(k);
                    props.listOnChange(i);
                  }}
                >
                  {i.subfeature || i.featureName}因子: {i.subfeatureScore}分
                </a>
                <DataIcon className={styles['data-icon']} name={i.subfeature || i.featureName} />
              </div>
              <div className={styles['content']}>{i.subdescription}</div>
            </div>
          ))}
        </div>
      )}
    </ProCardPlus>
  );
};

DetailList.isProCard = true;

export default DetailList;
