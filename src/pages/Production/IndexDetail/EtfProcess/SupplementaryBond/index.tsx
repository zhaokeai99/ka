import React, { useState, memo, useCallback, useEffect } from 'react';
import { Steps, Result, Row, Col, DatePicker, Button } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import {
  querySupplyBondFlow,
  querySupplyBondFile,
  querySupplyBondArrive,
  querySupplyBondExecute,
} from './service';
import moment from 'moment';
import BondTable from './components/BondTable';
const { Step } = Steps;
// 补券流程
interface propsType {
  fundId: string;
}
const SupplementaryBond = (props: propsType) => {
  const [current, setCurrent] = useState<number>(0);
  const [steptState, setSteptState] = useState<number>(0);
  const [steptList, setSteptList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [businessDate, setBusinessDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const handleReloadTable = useCallback(
    async (curr: any, flowId: any, time: any) => {
      if (!!flowId || flowId === 0) {
        setLoading(true);
        if (curr === 0) {
          const result: any = await querySupplyBondFile({
            fundCode: props.fundId,
            flowId,
            businessDate: time,
          });
          if (result.success) {
            setDataSource(result.data || []);
          }
        }
        if (curr === 1) {
          const result: any = await querySupplyBondArrive({
            fundCode: props.fundId,
            flowId,
            businessDate: time,
          });
          if (result.success) {
            setDataSource(result.data || []);
          }
        }
        if (curr === 2) {
          const result: any = await querySupplyBondExecute({
            fundCode: props.fundId,
            flowId,
            businessDate: time,
          });
          if (result.success) {
            setDataSource(result.data || []);
          }
        }
        setLoading(false);
      }
    },
    [props.fundId],
  );
  const handleStepOnChange = useCallback(
    (curr: any) => {
      setCurrent(curr);
      if (curr <= steptState) {
        setDataSource([]);
        handleReloadTable(curr, steptList[curr]?.flowId || '', businessDate);
      }
    },
    [businessDate, steptState],
  );
  const getQuerySupplyBondFlow = useCallback(
    async (time) => {
      const { data = [] } = await querySupplyBondFlow({
        fundCode: props.fundId,
        businessDate: time,
      });
      let curr = 0;
      for (let i = 0; i < data?.length; i++) {
        if (data[i].flowStatus === 'PASS') {
          curr = curr + 1;
        }
      }
      setSteptState(curr);
      setCurrent(curr === 4 ? 3 : curr);
      setSteptList(data || []);
      handleReloadTable(curr, data[curr]?.flowId || '', time);
    },
    [props],
  );

  useEffect(() => {
    const time = moment().format('YYYY-MM-DD');
    getQuerySupplyBondFlow(time);
  }, []);

  return (
    <>
      <Row>
        <Col style={{ padding: '24px' }} span={24}>
          <span style={{ margin: '0 5px' }}>业务日期 :</span>
          <DatePicker
            style={{ width: 350 }}
            value={moment(businessDate)}
            onChange={(_: any, dateString: any) => {
              setBusinessDate(dateString);
            }}
            allowClear={false}
          />
          <div style={{ float: 'right' }}>
            <Button
              style={{ marginRight: '10px' }}
              onClick={() => {
                const time = moment().format('YYYY-MM-DD');
                setBusinessDate(time);
                getQuerySupplyBondFlow(time);
              }}
            >
              重置
            </Button>
            <Button
              loading={loading}
              onClick={() => {
                getQuerySupplyBondFlow(businessDate);
              }}
              type="primary"
            >
              查询
            </Button>
          </div>
        </Col>
        <Col style={{ padding: '20px 12px' }} span={24}>
          <Steps current={steptState} onChange={handleStepOnChange} size="small">
            {steptList.map((item: any, index: number) => {
              return (
                <Step
                  onClick={() => {
                    if (steptState === index) {
                      handleStepOnChange(index);
                    }
                  }}
                  key={item.flowId}
                  disabled={steptState >= index ? false : true}
                  title={item.flowName}
                  description={
                    item.completeDate ? moment(item.completeDate).format('YYYY-MM-DD') : null
                  }
                  icon={current === index && index !== steptState && <CheckCircleFilled />}
                />
              );
            })}
          </Steps>
        </Col>
        {current !== 3 && (
          <Col span={24} style={{ padding: '0 12px 20px' }}>
            <h2 style={{ fontSize: 18, fontWeight: 'bold' }}>
              {steptList[current]?.flowName || ''}
            </h2>
          </Col>
        )}
        <Col span={24} style={{ padding: '0 12px' }}>
          {current !== 3 && (
            <BondTable current={current} loading={loading} dataSource={dataSource} />
          )}
          {current === 3 && (
            <Result
              status="success"
              title="流程已全部完成!"
              subTitle={steptList[steptList.length - 1]?.completeDate || null}
            />
          )}
        </Col>
      </Row>
    </>
  );
};
export default memo(SupplementaryBond);
