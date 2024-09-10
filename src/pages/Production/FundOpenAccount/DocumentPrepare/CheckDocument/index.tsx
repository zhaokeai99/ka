import React, { memo, useState, useEffect, useContext } from 'react';
// import SchemaFormPlus from '../SchemaFormPlus';
import { SchemaFormPlus } from '@/components/thfund-front-component/src';
import {
  reviewTemplateFormData,
  reviewSeatTemplateFormData,
  queryReviewData,
  querySeatReviewData,
} from '../service';
import Context from '../context';
import { message, Modal, Spin } from 'antd';
import styles from './index.less';

type ModulProps = {
  showCheck: boolean;
  onClose: (val?: string) => void;
  editId: string;
  isSeat: boolean | undefined;
};

const CheckDocument = (props: ModulProps) => {
  const [originData, setOriginData] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  const [hasDiff, setHasDiff] = useState(false); // 是否有不一致的值
  const [loading, setLoading] = useState(false);

  const fundId = useContext(Context);
  const { showCheck, onClose, editId, isSeat } = props;
  const queryData = isSeat ? querySeatReviewData : queryReviewData;
  const reviewFormData = isSeat ? reviewSeatTemplateFormData : reviewTemplateFormData;

  let diffFlag = false;

  // 对比 修改高亮
  const difference = (current: any, base: any) => {
    const result = current.map((item: any) => {
      if (item.valueType == 'group') {
        const currentGroup = base.find((baseItem: any) => item.groupKey === baseItem.groupKey);
        const columns = difference(item.columns, currentGroup.columns); // 递归
        return {
          ...item,
          columns,
        };
      }
      const currentObj = base.find((baseItem: any) => item.fieldKey === baseItem.fieldKey);
      if (currentObj && item.defaultValue !== currentObj.defaultValue) {
        diffFlag = true; // 有不一致的值
        return {
          ...item,
          highLight: true, // 高亮
        };
      }
      return {
        ...item,
        highLight: false, // 取消高亮
      };
    });
    setHasDiff(diffFlag);
    return result;
  };

  useEffect(() => {
    (async () => {
      if (!editId || !showCheck) {
        return;
      }
      setLoading(true);
      const reviewData = await queryData({ id: editId });
      setLoading(false);
      if (!reviewData) {
        return;
      }
      const dataList = reviewData.dataList;
      const reviewList = reviewData.reviewList;
      const newArr = difference(dataList, reviewList); // 编辑数据 源数据
      setOriginData(reviewList);
      setData(newArr);
    })();
  }, [editId, fundId, showCheck]);

  const reviewFinishFun = async (status: number) => {
    // status 2 不通过 3 通过
    const res = await reviewFormData({ id: editId, status });
    if (!res) {
      message.warning('操作失败');
      return;
    }
    message.success('操作成功');
    onClose('reload');
  };

  // 通过
  const handleOk = () => {
    reviewFinishFun(3);
  };

  // 不通过
  const handleCancel = () => {
    reviewFinishFun(2);
  };

  const onCancel = () => {
    onClose();
  };

  // 修改源数据
  const changeOriginDataFun = (originDataVal: any, values: any) => {
    const curKey = Object.keys(values)[0]; // 当前变化key
    const newOriginData = originDataVal.map((item: any) => {
      if (item.valueType == 'group') {
        // 分组
        const columns = changeOriginDataFun(item.columns, values); // 递归
        return {
          ...item,
          columns,
        };
      }
      if (item.fieldKey === curKey) {
        return {
          ...item,
          defaultValue: values[curKey],
        };
      }
      return item;
    });
    return newOriginData;
  };

  // 值变化时 修改逻辑
  const valuesChange = (values: any) => {
    const newOriginData = changeOriginDataFun(originData, values); // 修改源数据
    setOriginData(newOriginData); // 修改源数据 最新编辑数据
    const newArr = difference(data, newOriginData);
    setData(newArr); // 修改编辑数据 高亮状态
  };

  return (
    <Modal
      title="复核"
      open={showCheck}
      width="70%"
      onOk={handleOk}
      okText={'复核通过'}
      onCancel={onCancel}
      centered
      cancelText={'不通过'}
      cancelButtonProps={{
        onClick: handleCancel,
      }}
      okButtonProps={{
        disabled: hasDiff,
      }}
    >
      <Spin spinning={loading}>
        <div className={styles.wrapper}>
          <div className={styles.leftContent}>
            <SchemaFormPlus
              layoutType={'Form'}
              columnsData={originData}
              valuesChange={valuesChange}
            />
          </div>
          <div className={styles.lines}></div>
          <div className={styles.rightContent}>
            <SchemaFormPlus layoutType={'Form'} columnsData={data} />
          </div>
        </div>
      </Spin>
    </Modal>
  );
};

export default memo(CheckDocument);
