import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const NoFoundPage: React.FC<any> = ({ canBack = false }) => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="对比起，您所访问的页面不存在."
      extra={
        canBack ? (
          <Button type="primary" onClick={() => history.push('/')}>
            回到弘加首页
          </Button>
        ) : null
      }
    />
  );
};

export default NoFoundPage;
