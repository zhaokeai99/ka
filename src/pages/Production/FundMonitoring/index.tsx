import React, { useState, useCallback, useEffect } from 'react';
import { Radio, Select, Row, Col, Modal, Empty } from 'antd';
import ProCard from '@ant-design/pro-card';
import RectangularTree from './RectangularTree';
import LineChartExample from './LineChartExample';
import {
  queryEtfIndexInfoCondition,
  queryEtfSortSys,
  queryEtfTypeList,
  queryEtfIndexInfoList,
  queryLineChartList,
} from './service';
import LeftList from './LeftList';
import { history } from 'umi';
import './index.less';

const FundMonitoring: React.FC = () => {
  const [sortSys, setSortSys] = useState([{ id: '', name: '' }]); // 行业
  const [sysId, setSysId] = useState(165); // 选中的id
  const [period, setPeriod] = useState('0'); //选择时间范围
  const [etfname, setEtfname] = useState('1'); //ETF类型
  const [isShow, setIsShow] = useState(false); //展示折线图
  const [min, setMin] = useState(-4); //最小
  const [max, setMax] = useState(4); //最大
  const [show, setShow] = useState(false);

  const [QueryEtfIndexInfoCondition, setQueryEtfIndexInfoCondition] = useState([]); //ETF份额规模只数列表
  const [EtfIndexInfoList, setEtfIndexInfoList] = useState<{ name: any; children: any }[]>([]); //ETF查询列表
  const [QueryLineChartList, setQueryLineChartList] = useState([]); //查看折线图
  const [QueryEtfTypeList, setQueryEtfTypeList] = useState<any[]>([]); //ETF类型

  // 折线图筛选条件
  const [getLine, setLine] = useState('');

  // 获取ETF类型
  const getQueryEtfTypeList = useCallback(async () => {
    const result = await queryEtfTypeList();
    setQueryEtfTypeList(result);
  }, []);

  const getNum = useCallback((small: number, large: number, treeMapShow) => {
    setMin(small);
    setMax(large);
    setShow(treeMapShow);
  }, []);

  // 获取指数行业分类
  const getFetchIndexSortSys = useCallback(async () => {
    const data = await queryEtfSortSys({ securitiesType: 'FUND' });
    if (data && data.length) {
      setSysId(data[0].id);
      setSortSys(data);
    }
  }, []);

  const proportionColor = useCallback(
    (num: number) => {
      if (num < 0 && num > -1) {
        return num.toFixed(2);
      } else if (num > 0 && num < 1) {
        return num.toFixed(2);
      }
      return parseInt(String(num));
    },
    [min, max],
  );

  useEffect(() => {
    // ETF份额规模只数
    (async () => {
      const result = await queryEtfIndexInfoCondition({
        etfType: etfname,
        periodType: period,
        securitiesTypeId: sysId,
      });
      setQueryEtfIndexInfoCondition(result);
    })();
    // 查询ETF场内资金监控
    (async () => {
      const result = await queryEtfIndexInfoList({
        periodType: period,
        securitiesTypeId: sysId,
        etfType: etfname,
      });
      setEtfIndexInfoList(result);
    })();
  }, [sysId, period, etfname]);

  // 查看折线图
  useEffect(() => {
    (async () => {
      if (getLine) {
        const result = await queryLineChartList({
          fundCode: getLine,
        });
        setQueryLineChartList(result);
      }
    })();
  }, [getLine]);

  useEffect(() => {
    getQueryEtfTypeList();
    getFetchIndexSortSys();
  }, []);

  // 矩形树图单双击事件
  const treeMapClick = useCallback((mapInstance: any): void => {
    let timer: any = null;

    mapInstance.on('click', (item: any) => {
      if (item?.data?.children) {
        return;
      }
      clearTimeout(timer);
      timer = setTimeout(function () {
        setIsShow(true);
        setLine(item?.data?.fundCode);
      }, 300);
    });

    mapInstance.on('dblclick', (item: any) => {
      if (item?.data?.children) {
        return;
      }
      clearTimeout(timer);
      if (item?.data?.fundId) {
        history.push(`/production/index/detail/${item.data.fundId}`);
      }
    });
  }, []);

  return (
    <ProCard ghost gutter={[8, 8]} style={{ padding: '12px' }} direction="column" size="small">
      <ProCard ghost gutter={[8, 8]} direction="column" size="small">
        <ProCard ghost direction="column">
          <ProCard style={{ padding: '10px 0' }} bordered>
            <Row
              gutter={[8, 8]}
              align="middle"
              style={{ display: 'flex', paddingTop: '10px', justifyContent: 'space-between' }}
            >
              {/* ETF类型 */}
              <Col style={{ display: 'flex', alignItems: 'center' }}>
                <label>ETF类型：</label>
                <Radio.Group
                  value={etfname}
                  buttonStyle="solid"
                  size="small"
                  onChange={(e: any) => setEtfname(e?.target?.value)}
                >
                  {QueryEtfTypeList.map((item: { key: string; value: string }) => {
                    return (
                      <Radio.Button key={item.value} value={item.value}>
                        {item.key}
                      </Radio.Button>
                    );
                  })}
                </Radio.Group>
              </Col>

              {/* 指数行业分类 */}
              <Col style={{ display: 'flex', alignItems: 'center' }}>
                <label style={{ marginLeft: '20px' }}>指数行业分类： </label>
                <Select
                  key={sortSys[0]?.id}
                  options={sortSys}
                  size="small"
                  defaultValue={sortSys[0]?.id}
                  style={{ width: '200px' }}
                  fieldNames={{
                    label: 'name',
                    value: 'id',
                  }}
                  onChange={(id) => {
                    setSysId(Number(id));
                  }}
                />
              </Col>
              {/* 周期 */}
              <Col style={{ display: 'flex', alignItems: 'center' }}>
                <label style={{ marginLeft: '20px' }}>周期： </label>
                <Radio.Group
                  value={period}
                  size="small"
                  buttonStyle="solid"
                  onChange={(e: any) => setPeriod(e?.target?.value)}
                >
                  <Radio.Button value="4">近一日</Radio.Button>
                  <Radio.Button value="3">近一周</Radio.Button>
                  <Radio.Button value="2">近一月</Radio.Button>
                  <Radio.Button value="1">今年以来</Radio.Button>
                  <Radio.Button value="0">近一年</Radio.Button>
                </Radio.Group>
              </Col>
            </Row>
          </ProCard>
          <ProCard>
            <div style={{ width: '200px' }}>
              <LeftList QueryEtfIndexInfoCondition={QueryEtfIndexInfoCondition} />
            </div>
            <ProCard
              ghost
              colSpan="calc(100% - 200px)"
              style={{ height: 'calc(100vh - 210px)', minHeight: '500px' }}
            >
              {!EtfIndexInfoList.length || show ? (
                <Empty
                  style={{
                    width: '100%',
                    height: '100%',
                    padding: '0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <div className="rectangular_Tree">
                  <RectangularTree
                    getNum={getNum}
                    eventClick={treeMapClick}
                    ETFdata={EtfIndexInfoList}
                  />
                  <div className="legend">
                    {min > 0 ? (
                      <>
                        <div> 0% </div>
                        <div> 0% </div>
                        <div> 0% </div>
                      </>
                    ) : (
                      <>
                        <div> {proportionColor(min)}% </div>
                        <div> {proportionColor(min / 2)}% </div>
                        <div> {proportionColor((min / 4) * 3)}% </div>
                      </>
                    )}

                    <div> 0% </div>
                    {max > 0 ? (
                      <>
                        <div> {proportionColor((max / 4) * 3)}% </div>
                        <div> {proportionColor(max / 2)}% </div>
                        <div> {proportionColor(max)}% </div>
                      </>
                    ) : (
                      <>
                        <div> 0% </div>
                        <div> 0% </div>
                        <div> 0% </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </ProCard>
          </ProCard>
        </ProCard>
      </ProCard>
      <Modal
        title="规模&份额变化趋势"
        visible={isShow}
        onOk={() => {
          setIsShow(false);
          setQueryLineChartList([]);
          setLine(''); // 解决重复点击一个出现白屏问题
        }}
        width="1000px"
        onCancel={() => {
          setIsShow(false);
          setQueryLineChartList([]);
          setLine(''); // 解决重复点击一个出现白屏问题
        }}
        cancelText
        destroyOnClose
        className="modal"
      >
        <LineChartExample LineData={QueryLineChartList} />
      </Modal>
    </ProCard>
  );
};
export default FundMonitoring;
