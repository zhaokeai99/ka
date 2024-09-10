import React from 'react';
import ProCard from '@ant-design/pro-card';
import useAuth from '@/components/Hooks/useAuth';
import NoPermissionPage from '../NoPermissionPage';

const ProCardPlus = (prop: any) => {
  const { children, title, sn } = prop;
  const show = useAuth({ sn });

  return (
    <ProCard
      size="small"
      {...prop}
      title={title ? <span className="pro-card-plus-title">{title}</span> : null}
    >
      {show ? children : <NoPermissionPage />}
    </ProCard>
  );
};

ProCardPlus.isProCard = true;

export default ProCardPlus;
