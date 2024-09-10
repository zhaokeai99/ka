import { Spin } from 'antd';
import React, { useImperativeHandle, useRef, useState } from 'react';
import TableDataView from './form/tableInfo';
import ChartView from './form/chartView';

type PropsType = {
  clientHeight: number;
  chartsData: any[];
  tableList: any[];
  chartsIndexData: any[];
  dataType: string;
  loading?: boolean;
  cRef: any;
};
/**
 * 数据展示
 * @param props
 * @constructor
 */
const DataView = (props: PropsType) => {
  const { dataType, clientHeight, chartsIndexData, chartsData, tableList, loading, cRef } = props;
  const [chartStyle, setChartStyle] = useState<any>({ unit: true });
  const ChartFormRef = useRef();
  const chartsHeight = clientHeight - 32;

  //指定查询
  useImperativeHandle(cRef, () => ({
    exportExcel: () => {
      let outString: string = '日期';
      const columnNames: any = [];
      chartsIndexData.map((n: any) => {
        columnNames.push(n.indexCode);
        outString += ',' + n.indexName;
      });
      outString += '\n';
      tableList.map((d: any) => {
        outString += d['date'] + '\t';
        columnNames.map((c: any) => {
          outString += ',' + d[c] + '\t';
        });
        outString += '\n';
      });
      const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(outString);
      const link = document.createElement('a');
      link.href = uri;
      link.download = `数据表格.csv`;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    },
    exportPic: () => {
      // @ts-ignore
      ChartFormRef?.current?.exportPic();
    },
    chartStyleChange: (style: any) => {
      setChartStyle(style);
    },
  }));

  return (
    <>
      <Spin spinning={loading}>
        <div style={{ marginTop: 10 }}>
          {dataType === 'data' ? (
            <TableDataView
              clientHeight={chartsHeight}
              dataList={chartsIndexData}
              tableData={tableList}
            />
          ) : (
            <ChartView
              clientHeight={chartsHeight}
              tableData={chartsData}
              chartType={dataType}
              cRef={ChartFormRef}
              chartStyle={chartStyle}
            />
          )}
        </div>
      </Spin>
    </>
  );
};

export default DataView;
