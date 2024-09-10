import {
  Button,
  Col,
  DatePicker,
  Descriptions,
  Form,
  message,
  Modal,
  Popover,
  Row,
  Spin,
  Tag,
} from 'antd';
import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  BM_TYPE_DIC,
  MpRsAnaIndexValueFacadeQuery,
  MpRsNvFacadeQueryByPage,
  MpRsPortfolioFacadeAdd,
  MpRsPortfolioFacadeEdit,
  MpRsPortfolioFacadeGet,
} from '../service';
import AddForm from './add';
import EditForm from './edit';
import moment from 'moment';
import lodash from 'lodash';
import { dealNumThousandsAndFloat } from '@/utils/utils';
import { useModel } from '@@/plugin-model/useModel';
import ProCard from '@ant-design/pro-card';
import { EditOutlined } from '@ant-design/icons';
import ColorSpan from '@/components/ColorSpan';

interface ModalProps {
  portfolioId: number;
  onRefresh: () => void;
  refreshGetPortfolioInfo: (portfolioId: any) => void;
  onTradeDateChange: (d: string) => void;
  tradeDate: string;
  maxDate: string;
  prevTradeDate: string;
  isNewDate: boolean;
  newHoldItemDataInfo: any;
  dicMap: { domain: []; benchmark: [] };
  onRefreshEdit: (isEdit: boolean) => void;
  tradeDateChangeCheckIsNewData: (b: boolean) => void;
}

const handleInfo = (result: any, infoList: any, value: any, yearResult: any) => {
  infoList.forEach((v: any) => {
    if (v.valueDec !== undefined) {
      result[v.idxCode] = (v.valueDec * 100).toFixed(4);
    }
  });
  if (value?.totalNav !== undefined) {
    result.totalNav = dealNumThousandsAndFloat((value.totalNav / 10000).toFixed(4), 4);
  }
  if (value?.marketValue !== undefined) {
    result.marketValue = dealNumThousandsAndFloat((value.marketValue / 10000).toFixed(4), 4);
  }
  if (value?.dayProfitRatio !== undefined) {
    result.dayProfitRatio = (value.dayProfitRatio * 100).toFixed(4);
  }
  if (value?.accuProfitRatio !== undefined) {
    result.accuProfitRatio = (value.accuProfitRatio * 100).toFixed(4);
  }
  if (yearResult?.length > 0) {
    result.YearExcessReturns = (yearResult[0].valueDec * 100).toFixed(4);
  }

  return result;
};

const PortfolioComponent = (props: ModalProps) => {
  const {
    dicMap,
    onRefresh,
    refreshGetPortfolioInfo,
    onRefreshEdit,
    onTradeDateChange,
    tradeDate,
    portfolioId,
    tradeDateChangeCheckIsNewData,
    newHoldItemDataInfo,
  } = props;

  const { initialState } = useModel('@@initialState');
  const [portfolioData, setPortfolioData] = useState<any>({});
  const [showAdd, setShowAdd] = useState<any>(false);
  const [showEdit, setShowEdit] = useState<any>(false);
  const [tableLoading, setTableLoading] = useState<any>(false);
  const [isEdit, setIsEdit] = useState<any>(false);
  const [version, setVersion] = useState<number>(0);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const getDomainName = (v: string) => {
    const obj = lodash.find(dicMap.domain, { value: v });
    if (obj === undefined) {
      return '';
    }
    // @ts-ignore
    return obj.label;
  };

  const query = async (id: number) => {
    setTableLoading(true);
    const params = { id: id };
    //组合信息
    const result = await MpRsPortfolioFacadeGet(params);

    if (result?.userId !== undefined && result.userId === initialState?.userNo) {
      setIsEdit(true);
      onRefreshEdit(true);
    } else {
      setIsEdit(false);
      onRefreshEdit(false);
    }
    //因子
    const pmInfo = {
      domain: result.domain,
      mpCode: result.mpCode,
      tradeDate: tradeDate,
      circle: 'D',
    };
    const infoResult = await MpRsAnaIndexValueFacadeQuery(pmInfo);
    //累计超额
    const yearInfo = {
      domain: result.domain,
      mpCode: result.mpCode,
      tradeDate: tradeDate,
      circle: 'C',
      idxCode: 'ExcessReturns',
    };
    const yearResult = await MpRsAnaIndexValueFacadeQuery(yearInfo);
    //资产
    const value = await MpRsNvFacadeQueryByPage(pmInfo);
    let nvValue = {};
    if (value.data !== undefined) {
      nvValue = value.data[0];
    }
    const rltData = handleInfo(result, infoResult, nvValue, yearResult);
    const bm = lodash.find(dicMap.benchmark, { value: rltData?.bmCode, domain: rltData?.domain });
    if (bm !== undefined) {
      // @ts-ignore
      rltData.bmName = bm?.label;
      // @ts-ignore
      rltData.bmComment = bm?.comment;
      // @ts-ignore
      rltData.bmType = bm?.bmType;
    }
    setPortfolioData(rltData);
    setTableLoading(false);
  };

  useEffect(() => {
    // 加截数据
    if (portfolioId !== undefined) {
      query(portfolioId);
    }
  }, [portfolioId, tradeDate, dicMap]);

  // 新增保存
  const addSave = useCallback(async () => {
    const values = await addForm?.validateFields();
    if (values.beginDate !== undefined) {
      values.beginDate = moment(values.beginDate).format('YYYYMMDD');
    }
    if (values.endDate !== undefined) {
      values.endDate = moment(values.endDate).format('YYYYMMDD');
    }
    if (values.startMoney !== undefined) {
      values.startMoney = values.startMoney * 10000;
    }
    if (values.investPool !== undefined) {
      values.investPool = values?.investPool?.join(',');
    }
    values.status = '1';
    const { success } = await MpRsPortfolioFacadeAdd(values);
    if (success) {
      message.success('保存成功');
      setShowAdd(false);
      onRefresh();
      return;
    }
  }, [addForm]);

  const editShow = () => {
    setVersion(lodash.random(1, 999999));
    setShowEdit(true);
  };
  // 修改保存
  const editSave = useCallback(async () => {
    const values = await editForm?.validateFields();

    if (values.beginDate !== undefined && values.beginDate != null) {
      values.beginDate = moment(values.beginDate).format('YYYYMMDD');
    }
    if (values.endDate !== undefined && values.endDate != null) {
      values.endDate = moment(values.endDate).format('YYYYMMDD');
    }
    if (values.startMoney !== undefined) {
      values.startMoney = values.startMoney * 10000;
    }
    if (values.investPool !== undefined) {
      values.investPool = values?.investPool?.join(',');
    }
    const { success } = await MpRsPortfolioFacadeEdit(values);
    if (success) {
      message.success('保存成功');
      setShowEdit(false);
      onRefresh();
      refreshGetPortfolioInfo(props.portfolioId);
      query(props.portfolioId);
      return;
    }
  }, [editForm, props.portfolioId]);

  const tradeDateChange = (v: any) => {
    if (v === undefined || v === '') {
      return;
    }
    const date = v.format('YYYYMMDD');
    if (
      newHoldItemDataInfo?.isNewDate &&
      JSON.stringify(newHoldItemDataInfo?.tradeDate) === JSON.stringify(date)
    ) {
      tradeDateChangeCheckIsNewData(true);
    } else {
      tradeDateChangeCheckIsNewData(false);
    }
    onTradeDateChange(date);
  };

  const disabledDate = (current: any) => {
    return current && current >= moment(props.maxDate, 'YYYYMMDD').endOf('day');
  };

  return (
    <>
      <ProCard
        bordered
        style={{ marginBottom: 10 }}
        title={
          <div style={{ display: 'flex' }}>
            <span style={{ fontSize: '20px', fontWeight: 500 }}>
              <Spin spinning={tableLoading}>
                {portfolioData?.mpName ? portfolioData?.mpName : '-'}
              </Spin>
            </span>
            &nbsp;&nbsp;
            <span>
              {isEdit && (
                <Button
                  type="text"
                  onClick={() => editShow()}
                  title="组合修改"
                  icon={<EditOutlined />}
                />
              )}
            </span>
          </div>
        }
        extra={
          <>
            <span>
              {tradeDate && (
                <>
                  {newHoldItemDataInfo?.positionDate === tradeDate && (
                    <span style={{ marginRight: '10px', fontWeight: 500 }}>组合最新持仓日期</span>
                  )}
                  <DatePicker
                    disabledDate={disabledDate}
                    onChange={tradeDateChange}
                    allowClear={false}
                    value={moment(tradeDate, 'YYYYMMDD')}
                  />
                </>
              )}
            </span>
          </>
        }
      >
        <Row style={{ marginTop: '20px' }}>
          <Col>
            <Spin tip="Loading..." spinning={tableLoading}>
              <Descriptions column={4}>
                <Descriptions.Item label="组合代码">{portfolioData?.mpCode}</Descriptions.Item>
                <Descriptions.Item label="所属业务域">
                  {getDomainName(portfolioData?.domain)}
                </Descriptions.Item>
                <Descriptions.Item label="参考基准">
                  <Popover
                    title={
                      <span>
                        {portfolioData.bmName}&nbsp;&nbsp;<Tag>{portfolioData.bmCode}</Tag>
                      </span>
                    }
                    content={portfolioData.bmComment ? portfolioData.bmComment : '暂无说明'}
                  >
                    <a>{portfolioData.bmName}</a>
                  </Popover>
                </Descriptions.Item>
                <Descriptions.Item label="基准类型">
                  {BM_TYPE_DIC[portfolioData?.bmType]}
                </Descriptions.Item>
                <Descriptions.Item label="总市值(万)">
                  {portfolioData?.marketValue}
                </Descriptions.Item>
                <Descriptions.Item label="净资产(万)">{portfolioData?.totalNav}</Descriptions.Item>
                <Descriptions.Item label="日收益率">
                  {portfolioData?.dayProfitRatio ? (
                    <ColorSpan value={portfolioData?.dayProfitRatio} suffix={'%'} />
                  ) : null}
                </Descriptions.Item>
                <Descriptions.Item label="累计收益率">
                  {portfolioData?.accuProfitRatio ? (
                    <ColorSpan value={portfolioData?.accuProfitRatio} suffix={'%'} />
                  ) : null}
                </Descriptions.Item>
                <Descriptions.Item label="基准收益率">
                  {portfolioData?.BenchmarkNetGrowthRatio ? (
                    <ColorSpan value={portfolioData?.BenchmarkNetGrowthRatio} suffix={'%'} />
                  ) : null}
                </Descriptions.Item>
                <Descriptions.Item label="日超额">
                  {portfolioData?.ExcessReturns ? (
                    <ColorSpan value={portfolioData?.ExcessReturns} suffix={'%'} />
                  ) : null}
                </Descriptions.Item>
                <Descriptions.Item label="累计超额">
                  {portfolioData?.YearExcessReturns ? (
                    <ColorSpan value={portfolioData?.YearExcessReturns} suffix={'%'} />
                  ) : null}
                </Descriptions.Item>
                <Descriptions.Item label="创建时间">
                  {portfolioData?.beginDate === undefined
                    ? ''
                    : moment(portfolioData?.beginDate, 'YYYYMMDD').format('YYYY-MM-DD')}
                </Descriptions.Item>
              </Descriptions>
            </Spin>
          </Col>
        </Row>
      </ProCard>
      <Modal
        title="新增组合"
        visible={showAdd}
        onOk={addSave}
        onCancel={() => setShowAdd(false)}
        width="800px"
        destroyOnClose={true}
      >
        <AddForm form={addForm} dicMap={dicMap} />
      </Modal>
      <Modal
        title="修改组合"
        visible={showEdit}
        onOk={editSave}
        onCancel={() => setShowEdit(false)}
        width="800px"
        destroyOnClose={true}
      >
        <EditForm
          form={editForm}
          key={version}
          formValue={portfolioData}
          dicMap={dicMap}
          newHoldItemDataInfo={newHoldItemDataInfo}
        />
      </Modal>
    </>
  );
};
export default memo(PortfolioComponent);
