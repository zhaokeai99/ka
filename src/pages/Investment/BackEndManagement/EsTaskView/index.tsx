import React, { memo } from 'react';
import ProCard from '@ant-design/pro-card';
import UpContent from './UpContent';
import DownContent from './DownContent';
import TaskForm from './task';
import DatasourceForm from './../DataSourceManagement';
import { cardGutter, contentPadding } from '@/themes';
import useAuth from '@/components/Hooks/useAuth';

// 投资->后台管理->Es任务管理
const EsTaskManagement = () => {
  const isSystemAdmin = useAuth({ sn: 'investment_system_admin' });

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
      <ProCard
        style={{ padding: contentPadding }}
        direction="column"
        ghost
        gutter={[0, cardGutter]}
        size="small"
        tabs={{
          type: 'card',
        }}
      >
        <ProCard.TabPane key="tab3" tab="任务日志">
          <DownContent />
        </ProCard.TabPane>
        <ProCard.TabPane key="tab2" tab="任务管理">
          <TaskForm />
        </ProCard.TabPane>
        <ProCard.TabPane key="tab1" tab="索引管理">
          <UpContent />
        </ProCard.TabPane>
        <ProCard.TabPane key="tab4" tab="数据源管理">
          <DatasourceForm />
        </ProCard.TabPane>
      </ProCard>
    </>
  );
};

export default memo(EsTaskManagement);
