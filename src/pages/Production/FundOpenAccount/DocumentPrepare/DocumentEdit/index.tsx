import React, { memo, useState, useEffect, useContext, useCallback } from 'react';
// import SchemaFormPlus from '../SchemaFormPlus';
import { SchemaFormPlus } from '@/components/thfund-front-component/src';
import {
  queryTemplateFormData,
  querySeatTemplateFormData,
  saveTemplateFormData,
  saveSeatTemplateFormData,
} from '../service';
import Context from '../context';
import { message } from 'antd';

type ModulProps = {
  showEdit: boolean;
  onClose: (val?: string) => void;
  editId: string;
  isSeat: boolean | undefined;
};

const DocumentEdit = (props: ModulProps) => {
  const [columnsData, setColumnsData] = useState<any>([]);
  const fundId = useContext(Context);
  const { showEdit, onClose, editId, isSeat } = props;
  const queryFormData = isSeat ? querySeatTemplateFormData : queryTemplateFormData;
  const saveFormData = isSeat ? saveSeatTemplateFormData : saveTemplateFormData;

  useEffect(() => {
    (async () => {
      if (!editId) {
        return;
      }
      const res = await queryFormData({ id: editId, fundId });
      setColumnsData(res);
    })();
  }, [editId, fundId]);

  const onFinish = useCallback(
    async (values) => {
      const { success, data } = await saveFormData({ submitData: values, id: editId });
      if (success && data) {
        message.success('保存成功');
        onClose('reload');
        return true;
      }
      message.warning('保存失败');
      return;
    },
    [editId],
  );

  return (
    <SchemaFormPlus
      layoutType={'ModalForm'}
      columnsData={columnsData}
      visible={showEdit}
      onClose={onClose}
      onFinish={onFinish}
      confimText="保存"
    />
  );
};

export default memo(DocumentEdit);
