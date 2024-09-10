import { Col, Row } from 'antd';
import lodash from 'lodash';
import { memo, useEffect, useRef, useState } from 'react';
import EditForm from './components/editForm';
import ListForm from './components/listForm';
import { EsDataSyncTaskFacadeGetEsDic } from './service';
import useAuth from '@/components/Hooks/useAuth';

export interface DicProps {
  dataBaseType: any;
  indexAnalyzer: any;
}

const IndexInfo = () => {
  const isSystemAdmin = useAuth({ sn: 'investment_system_admin' });
  const [version, setVersion] = useState<number>(0);
  const [dicMap, setDicMap] = useState<DicProps>({
    dataBaseType: [],
    indexAnalyzer: [],
  });
  const EditFormRef = useRef();
  const ListFormRef = useRef();

  const loadDic = async () => {
    const data = await EsDataSyncTaskFacadeGetEsDic();
    if (data.success) {
      setDicMap(data.data);
      setVersion(lodash.random(0, 999999, false));
    }
  };

  useEffect(() => {
    loadDic();
  }, []);
  //列表选择
  const listCheck = (id: number, currStatus: number) => {
    // @ts-ignore
    EditFormRef?.current?.setTaskId(id, currStatus);
  };
  //新增任务
  const taskAdd = () => {
    // @ts-ignore
    EditFormRef?.current?.taskAdd();
  };
  //保存成功
  const formSuccess = () => {
    // @ts-ignore
    ListFormRef?.current?.refresh();
  };

  if (!isSystemAdmin)
    return (
      <>
        <div style={{ textAlign: 'center', background: '#fff', margin: '20px' }}>
          此页面为后台管理功能，当前用户没有系统管理权限！
        </div>
      </>
    );

  return (
    <>
      <Row style={{ padding: 12 }}>
        <Col span={8} style={{ paddingRight: 4 }}>
          <ListForm onCheck={listCheck} cRef={ListFormRef} onAdd={taskAdd} />
        </Col>
        <Col span={16} style={{ paddingLeft: 4 }}>
          <EditForm version={version} dicMap={dicMap} cRef={EditFormRef} onSuccess={formSuccess} />
        </Col>
      </Row>
    </>
  );
};
export default memo(IndexInfo);
