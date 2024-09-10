import React, { useRef } from 'react';
import { Divider } from 'antd';
import { useLoading } from '@/components/thfund-front-component/src';
// import useLoading from '@/components/Hooks/useLoading';

export default function CubeGroup({ title, children }: any) {
  const ref = useRef(null);
  const loading = useLoading(ref);

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
        ref={ref}
      >
        <div style={{ width: '60px' }}>{title}</div>
        {loading ? null : <div className="heatmap-container">{children}</div>}
      </div>
      <Divider style={{ margin: '12px 0' }} />
    </>
  );
}
