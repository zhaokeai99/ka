import React, { useCallback, useEffect, useState } from 'react';
import {
  CHARTS_OPTIONS_TYPE_DIC,
  MpAnaMddDetailInfoQuery,
  MpRsAnaIndexValueFacadeQuery,
  MpRsAnaIndexValueFacadeQueryChgWayATradeDate,
  MpRsAnaIndexValueFacadeQueryDetail,
  MpRsHoldChgFacadeGetCircleDate,
  MpRsHoldChgFacadeQueryMpRsRealanalysis,
  PortfolioInfo,
  ReturnContributionQuery,
} from '@/pages/Investment/Simulation/PortfolioManagement/service';
import { Button, DatePicker, Form, Input, Radio } from 'antd';
import moment from 'moment';
import lodash from 'lodash';
import type { ReportData } from '../service';
import { SearchOutlined } from '@ant-design/icons';

interface ModalProps {
  portfolioInfo: PortfolioInfo;
  dicMap: { domain: []; benchmark: [] };
  tradeDate: string;
  onRefresh: (data: ReportData) => void;
  onLoading: (loading: boolean) => void;
}

const indexDefType = {
  NetGrowthRatio: '2',
  BenchmarkNetGrowthRatio: '2',
  ExcessReturns: '2',
  AnnualizedReturns: '2',
  TurnoverRatio: '1',
  Sharpe: '0',
  Sortino: '0',
  InformationRatio: '0',
  Alpha: '1',
  Beta: '0',
  MaxDrawdown: '1',
  ExcessWinRatio: '1',
};

// 走势图
const incomeHandleData = (list: any[], portfolioInfo: any) => {
  const rltList: any[] = [];
  const dicMap = {
    AccuNetGrowthRatio: portfolioInfo?.mpName,
    BenchmarkAccuNetGrowthRatio: portfolioInfo?.bmName + '(' + portfolioInfo?.bmCode + ')',
  };

  list.forEach((d) => {
    const rlt = {
      tradeDate: d.dataDate,
      valueDec: d.dd * 100,
      idxCode: d.idxCode,
      idxName: dicMap[d.idxCode] ? dicMap[d.idxCode] : d.idxName,
    };
    rltList.push(rlt);
  });
  return lodash.orderBy(rltList, ['tradeDate'], ['asc']);
};
// 走势图明细
const incomeHandleDetail = (list: any[]) => {
  const data = {};

  if (list === undefined || list === [] || list?.length === 0) {
    return data;
  }
  list.forEach((value) => {
    if (value.valueDec === undefined || value.valueDec === null) {
      data[value.idxCode] = undefined;
    } else {
      if (indexDefType[value.idxCode] === '2') {
        data[value.idxCode] = (value.valueDec * 100).toFixed(4);
      } else if (indexDefType[value.idxCode] === '1') {
        data[value.idxCode] = (value.valueDec * 100).toFixed(4) + '%';
      } else {
        data[value.idxCode] = value.valueDec.toFixed(4);
      }
    }
  });
  return data;
};
// 实时查询数据转换
const realanalysisHandleData = (
  data: any,
  tradeDate: string,
  chgWayATradeDate: any,
  portfolioInfo: any,
) => {
  const result: ReportData = {
    incomeData: { lineData: [], ColumnData: [] },
    incomeDetail: {},
    maxData: {},
    returnData: [],
  };
  //收益走势图
  if (data?.yieldtrend) {
    const resultList: any = { lineData: [], ColumnData: [] };
    data?.yieldtrend?.AccuNetGrowthRatio?.forEach((item: any) => {
      const rltMp = {
        tradeDate: item.TRADE_DATE,
        valueDec: item.DD * 100,
        idxName: portfolioInfo?.mpName,
        idxCode: 'AccuNetGrowthRatio',
      };
      resultList.lineData.push(rltMp);
    });
    data?.yieldtrend?.BenchmarkAccuNetGrowthRatio?.forEach((item: any) => {
      const rltBp = {
        tradeDate: item.TRADE_DATE,
        valueDec: item.DD * 100,
        idxName: portfolioInfo?.bmName + '(' + portfolioInfo?.bmCode + ')',
        idxCode: 'BenchmarkAccuNetGrowthRatio',
      };
      resultList.lineData.push(rltBp);
    });

    chgWayATradeDate?.forEach((item: any) => {
      resultList?.lineData?.forEach((cur: any) => {
        if (item === cur.tradeDate && cur.idxCode === 'AccuNetGrowthRatio') {
          resultList.lineData.push({ ...cur, idxName: '调整时点' });
        }
      });
    });
    data?.yieldtrend?.ExcessAccuNetGrowthRatio?.forEach((item: any) => {
      const rltEx = {
        tradeDate: item.TRADE_DATE,
        valueDec: item.DD * 100,
        value2: item.DD * 100,
        idxName: '累计超额收益率',
        idxCode: 'ExcessAccuNetGrowthRatio',
      };
      resultList.ColumnData.push(rltEx);
    });

    result.incomeData = resultList;
  }
  //收益走势图右侧
  if (data?.realindex) {
    const rlt: any = {};
    for (const i in data.realindex) {
      if (data.realindex[i] !== undefined && data.realindex[i] !== null) {
        if (indexDefType[i] === '2') {
          rlt[i] = (data.realindex[i] * 100).toFixed(4);
        } else if (indexDefType[i] === '1') {
          rlt[i] = (data.realindex[i] * 100).toFixed(4) + '%';
        } else {
          rlt[i] = data.realindex[i].toFixed(4);
        }
      }
    }
    result.incomeDetail = rlt;
  }
  //最大回撤分析
  if (data?.maxdrawdown) {
    const { mdd_info, mdd_detail } = data.maxdrawdown;

    const mpNv: any[] = [];
    const dDnv: any[] = [];
    const retrace: any =
      { ...mdd_info, dataDate: mdd_info?.mdd_end, dd: mdd_info?.MaxDrawdown } || {};

    mdd_detail?.forEach((item: any) => {
      const rltMp = {
        tradeDate: item.TRADE_DATE,
        rowValue: item.NET_NAV,
        rowName: '组合净值',
      };
      const rltDd = {
        tradeDate: item.TRADE_DATE,
        maxDrawdown: item.DD * -1,
        maxDrawdownName: '净值回撤',
      };
      mpNv.push(rltMp);
      dDnv.push(rltDd);
    });
    result.maxData = { mpNv, dDnv, retrace };
  }
  //收益贡献
  if (data?.returncontribution) {
    const resultList: any[] = [];
    data.returncontribution.forEach((item: any) => {
      const rlt = {
        tradeDate: tradeDate,
        valueDec: item.ReturnContribution,
        stkName: item.STK_NAME,
        stkCode: item.STK_CODE,
      };
      resultList.push(rlt);
    });
    result.returnData = resultList;
  }
  return result;
};

const ChartsComponent = (props: ModalProps) => {
  const { dicMap, portfolioInfo, tradeDate, onRefresh, onLoading } = props;
  const [checkValue, setCheckValue] = useState<string | undefined>('W');
  const [form] = Form.useForm();

  const { RangePicker } = DatePicker;
  const FormItem = Form.Item;

  let dataVersion: number = 0;

  //开始设计数据
  const startDataFetch = (v: number) => {
    dataVersion = v;
  };
  //数据验证
  const versionCheck = (v: number) => {
    if (dataVersion === v) {
      return true;
    }
    return false;
  };

  const getBmName = (info: any) => {
    if (info === undefined) {
      return '';
    }
    if (info?.bmName !== undefined && info?.bmName !== '') {
      return info?.bmName;
    }
    const obj = lodash.find(dicMap.benchmark, { value: info.bmCode, domain: info.domain });
    if (obj === undefined) {
      return '';
    }
    // @ts-ignore
    return obj.label;
  };

  const getMoment = () => {
    return moment(tradeDate, 'YYYYMMDD');
  };

  //　走势图　右侧数据
  const queryIncomeRightData = async (p: any) => {
    const params = {
      circle: p.circle,
      tradeDate: p.endTradeDate,
      domain: portfolioInfo.domain,
      mpCode: portfolioInfo.mpCode,
    };
    const result = await MpRsAnaIndexValueFacadeQuery(params);
    const rltData = incomeHandleDetail(result);
    return rltData;
  };

  // 走势图
  const queryIncomeData = async (p: any) => {
    const params = {
      domain: portfolioInfo.domain,
      indexCodes: ['AccuNetGrowthRatio', 'BenchmarkAccuNetGrowthRatio', 'ExcessAccuNetGrowthRatio'],
      mpCode: portfolioInfo.mpCode,
      tradeDate: p.endTradeDate,
      ...p,
    };

    const resultObj: any = { lineData: [], ColumnData: [] };
    const result = await MpRsAnaIndexValueFacadeQueryDetail(params);
    portfolioInfo.bmName = getBmName(portfolioInfo);
    const rltData = incomeHandleData(result, portfolioInfo);
    rltData?.forEach((val, index) => {
      if (val.idxCode === 'ExcessAccuNetGrowthRatio') {
        resultObj.ColumnData.push({ ...val, idxName: '累计超额收益率', value2: val.valueDec });
        rltData.splice(index, 1);
      }
    });
    resultObj.lineData = rltData;

    const queryXTrdateDateParam = {
      mpCode: portfolioInfo.mpCode,
      domain: portfolioInfo.domain,
      endDate: p.endTradeDate,
    };
    const chgWayATradeDate = await MpRsAnaIndexValueFacadeQueryChgWayATradeDate(
      queryXTrdateDateParam,
    );
    chgWayATradeDate?.forEach((item: any) => {
      rltData?.forEach((cur) => {
        if (item === cur.tradeDate && cur.idxCode === 'AccuNetGrowthRatio') {
          resultObj.lineData.push({ ...cur, idxName: '调整时点' });
        }
      });
    });
    return resultObj;
  };

  // 最大回撤图表
  const queryMaxData = async (p: any) => {
    const params = {
      mpCodes: [portfolioInfo.mpCode],
      domain: portfolioInfo.domain,
      indexCodes: ['MaxDrawDown'],
      tradeDate: p.endTradeDate,
      circle: p.circle,
    };
    const { dDnv, mpNv, retrace } = await MpAnaMddDetailInfoQuery(params);
    dDnv?.map((item: any) => {
      item.maxDrawdown = (item?.maxDrawdown || 0) * -1;
    });
    const result = { dDnv, mpNv, retrace };
    return result;
  };

  // 收益贡献
  const queryReturnData = async (p: any) => {
    const params = {
      mpCode: [portfolioInfo.mpCode],
      domain: portfolioInfo.domain,
      idxCode: ['ReturnContribution'],
      circle: [p.circle],
      endDate: p.endTradeDate,
    };
    const result = await ReturnContributionQuery(params);
    return result.data;
  };

  // 实时查询
  const queryReportData = useCallback(
    async (p) => {
      let rtnData: ReportData = {
        incomeData: { lineData: [], ColumnData: [] },
        incomeDetail: {},
        maxData: {},
        returnData: [],
      };
      if (portfolioInfo === undefined) {
        onRefresh(rtnData);
        return;
      }

      onLoading(true);
      const currVersion = lodash.random(0, 99999999, false);
      startDataFetch(currVersion);
      const params = {
        domain: portfolioInfo.domain,
        mpCode: portfolioInfo.mpCode,
        ...p,
      };

      const result = await MpRsHoldChgFacadeQueryMpRsRealanalysis(params);

      const queryXTrdateDateParam = {
        mpCode: portfolioInfo.mpCode,
        domain: portfolioInfo.domain,
        endDate: p.endDate,
      };
      const pointData = await MpRsAnaIndexValueFacadeQueryChgWayATradeDate(queryXTrdateDateParam);

      portfolioInfo.bmName = getBmName(portfolioInfo);
      rtnData = realanalysisHandleData(result, p.endDate, pointData, portfolioInfo);
      if (!versionCheck(currVersion)) {
        return;
      }
      onRefresh(rtnData);
      onLoading(false);
    },
    [portfolioInfo, tradeDate],
  );

  // 快捷查询
  const dataTypeSearch = useCallback(
    async (value: any) => {
      const rtnData: ReportData = {
        incomeData: { lineData: [], ColumnData: [] },
        incomeDetail: {},
        maxData: {},
        returnData: [],
      };
      if (portfolioInfo === undefined) {
        onRefresh(rtnData);
        return;
      }
      onLoading(true);
      const currVersion = lodash.random(0, 99999999, false);
      startDataFetch(currVersion);
      const endDate: string = getMoment().format('YYYYMMDD');
      let startDate: string | undefined;
      let circle: string = 'C';
      //获取日期
      if (value !== 'C') {
        const circleParams = { circle: value, tradeDate: endDate };
        const rltCircle = await MpRsHoldChgFacadeGetCircleDate(circleParams);
        if (!rltCircle.success) {
          //失败时，判断是否清空数据
          if (!versionCheck(currVersion)) {
            onRefresh(rtnData);
          }
          onLoading(false);
          return;
        }
        startDate = rltCircle.data.startDate;
        circle = rltCircle.data.circle;

        form.setFieldsValue({
          sDate: [
            moment(rltCircle.data.startDate, 'YYYYMMDD'),
            moment(rltCircle.data.endDate, 'YYYYMMDD'),
          ],
        });
      } else {
        form.setFieldsValue({
          sDate: [moment(portfolioInfo?.beginDate, 'YYYYMMDD').subtract(1, 'days'), getMoment()],
        });
      }
      const params = { beginTradeDate: startDate, endTradeDate: endDate, circle };

      const resultData = await Promise.all([
        queryIncomeData(params),
        queryIncomeRightData(params),
        queryMaxData(params),
        queryReturnData(params),
      ]);
      if (!versionCheck(currVersion)) {
        return;
      }
      rtnData.incomeData = resultData[0];
      rtnData.incomeDetail = resultData[1];
      rtnData.maxData = resultData[2];
      rtnData.returnData = resultData[3];

      onRefresh(rtnData);
      onLoading(false);
    },
    [portfolioInfo, tradeDate],
  );

  // 类型查询
  const dataTypeChange = (e: any) => {
    const value = e.target.value;
    setCheckValue(value);
    dataTypeSearch(value);
  };

  // 查询
  const search = async () => {
    setCheckValue(undefined);
    const values = await form?.validateFields();
    const params = {
      startDate: moment(values.sDate[0]).format('YYYYMMDD'),
      endDate: moment(values.sDate[1]).format('YYYYMMDD'),
    };
    queryReportData(params);
  };

  // 日期
  useEffect(() => {
    const start = getMoment().subtract(7, 'days');
    const end = getMoment();
    const sDate = [start, end];
    form.setFieldsValue({ sDate });

    if (!(portfolioInfo === undefined || portfolioInfo.domain === undefined)) {
      if (checkValue === undefined) {
        const params = {
          startDate: start.format('YYYYMMDD'),
          endDate: end.format('YYYYMMDD'),
        };
        queryReportData(params);
      } else {
        dataTypeSearch(checkValue);
      }
    }
  }, [tradeDate]);

  //数据
  useEffect(() => {
    if (!(portfolioInfo === undefined || portfolioInfo.domain === undefined)) {
      if (checkValue === undefined) {
        form?.validateFields().then((values) => {
          const params = {
            startDate: moment(values.sDate[0]).format('YYYYMMDD'),
            endDate: moment(values.sDate[1]).format('YYYYMMDD'),
          };
          queryReportData(params);
        });
      } else {
        dataTypeSearch(checkValue);
      }
    }
  }, [portfolioInfo?.id]);

  return (
    <Form
      form={form}
      layout={'inline'}
      style={{ display: 'flex', justifyContent: 'space-between' }}
    >
      {tradeDate && (
        <div style={{ display: 'flex' }}>
          <Input.Group compact>
            <FormItem name="sDate" rules={[{ required: true }]}>
              <RangePicker
                allowClear={false}
                className={checkValue ? 'range-picker-invalid-style' : 'range-picker-valid-style'}
              />
            </FormItem>
            <Button onClick={search} icon={<SearchOutlined />} />
          </Input.Group>
        </div>
      )}
      <FormItem style={{ marginRight: 0 }}>
        <Radio.Group
          value={checkValue}
          options={CHARTS_OPTIONS_TYPE_DIC}
          onChange={dataTypeChange}
          optionType="button"
          buttonStyle="solid"
        />
      </FormItem>
    </Form>
  );
};
export default ChartsComponent;
