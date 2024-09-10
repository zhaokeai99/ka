import { Empty } from 'antd';

const DataContent = (prop: any) => {
  const { children, noDataDesc, dataVisit } = prop;
  return (
    <div>
      {dataVisit ? (
        children
      ) : (
        <Empty
          description={noDataDesc}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{
            color: 'rgba(0, 0, 0, 0.85)',
            backgroundColor: '#FFF',
            margin: '12px 0',
            height: '120px',
            padding: '24px',
          }}
        ></Empty>
      )}
    </div>
  );
};

export default DataContent;
