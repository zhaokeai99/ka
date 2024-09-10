import { dealNumThousandsAndFloat, tableEmptyCellRender } from '@/utils/utils';
import { Empty, Table } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { queryHoldFundPageList, queryNewFundPageList } from '../service';

const fundTypeMap = {
  tab2: '准备中',
  tab3: '已报待批',
  tab4: '已批待募',
  tab5: '募集',
};

const TabTable = (props: any) => {
  const [columns] = useState(tableEmptyCellRender(props?.columns || []));
  const [newFundTabData, setNewFundTabData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageSize: 5,
    current: 1,
    showQuickJumper: true,
    total: 0,
    showSizeChanger: false,
  });

  const { code, fundState } = props;

  const fetchData = useCallback(async (params) => {
    setLoading(true);
    if (Object.keys(fundTypeMap).includes(props.fundKey)) {
      (async () => {
        const result = await queryNewFundPageList({
          fundCompCode: code,
          wind1Types: fundState,
          offsetId: '',
          fundCompStatus: fundTypeMap[props.fundKey],
          ...params,
        });
        const { dataList = [], pageNum = 5, total = 0 } = result || {};
        setNewFundTabData(dataList);

        setPagination({
          ...pagination,
          current: pageNum,
          total,
        });
      })();
    } else {
      (async () => {
        const result = await queryHoldFundPageList({
          fundCompCode: code,
          wind1Types: fundState,
          offsetId: '',
          ...params,
        });
        const { dataList = [], pageNum = 5, total = 0 } = result || {};
        const newDataList = dataList.map(
          (item: { escrowRate: string; manageRate: string | number }) => {
            const escrowRate = `${dealNumThousandsAndFloat(item.escrowRate, 2)}%`;
            const manageRate = `${dealNumThousandsAndFloat(item.manageRate, 2)}%`;
            return {
              ...item,
              escrowRate,
              manageRate,
            };
          },
        );
        setNewFundTabData(newDataList);
        setPagination({
          ...pagination,
          current: pageNum,
          total,
        });
      })();
    }
    setLoading(false);
  }, []);
  const handleTableChange = (p: any) => {
    fetchData({
      pageNo: p.current,
      pageSize: p.pageSize,
    });
  };

  useEffect(() => {
    fetchData({
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
    });
  }, []);

  if (!Array.isArray(newFundTabData) || !newFundTabData.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }
  return (
    <Table
      columns={columns}
      scroll={{ x: 'max-content' }}
      size="small"
      pagination={pagination}
      dataSource={newFundTabData}
      onChange={handleTableChange}
      loading={loading}
    />
  );
};

export default TabTable;
