import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import type { TableListMpHoldChg } from '../service';
import { EditChgHold, MpRsHoldChgFacadeRevokeAdjustment, MpRsHoldChgQuery } from '../service';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Pagination,
  Row,
  Table,
} from 'antd';
import type { PortfolioInfo } from '../../service';
import { MTK_CODE_DIC, STK_TYPE_DIC } from '../../service';
import MpHoldChgAddModal from './MpHoldChgAddForm';
import '../index.less';
import { Link, useModel } from 'umi';
import { dealNumThousandsAndFloat } from '@/utils/utils';
import UploadButton from './MpHoldChgExcelImport';

interface ModalProps {
  portfolioInfo: PortfolioInfo;
  dicMap: { domain: []; benchmark: [] };
  tradeDate: string;
  prevTradeDate: string;
  isOkEdit: boolean;
}

const MpHoldItemTable = (props: ModalProps) => {
  const { portfolioInfo, tradeDate, prevTradeDate, isOkEdit } = props;

  const { initialState } = useModel('@@initialState'); // 用户信息

  const [form] = Form.useForm();
  const [showAdd, setShowAdd] = useState<any>(false);
  const [loading, setLoading] = useState<any>(false);
  const [tableData, setTableData] = useState<any>([]);
  const [saveData, setSaveData] = useState<any>([]);
  const [pageInfo, setPageInfo] = useState<any>({ current: 1, pageSize: 10, total: 0 });
  const [pageTableData, setPageTableData] = useState<any>([]);

  const getTableData = async (pageParm: any) => {
    setLoading(true);
    const result = await MpRsHoldChgQuery({
      tradeDate,
      mpCode: portfolioInfo?.mpCode,
      domain: portfolioInfo?.domain,
    });

    if (result?.length) {
      const newList = result.map((item: any) => ({
        ...item,
        isEdit: false,
      }));
      setPageInfo({ ...pageParm, total: newList?.length });
      setTableData(newList);
      setPageTableData(
        newList?.slice(
          pageParm.pageSize * (pageParm.current - 1),
          pageParm.pageSize * pageParm.current,
        ) || [],
      );
    } else {
      setTableData(result);
      setPageTableData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (portfolioInfo && tradeDate) {
      setSaveData([]); // 切换组合时清空提交数据
      const param = { current: 1, pageSize: 10 };
      getTableData(param);
    }
  }, [tradeDate, portfolioInfo?.id]);

  /**
   * 归一化计算
   * 计算公式 非修改成分：权重 = (1-成分修改后权重总和) * (修改前权重 / 非修改成分修改前权重总和）
   * @param dataArray
   * @param value
   */
  const normalizationCalculation = (dataArray: any) => {
    let editWeightSum: number = 0; // 非修改成分修改前权重总和
    let nonEditWeightSum: number = 0; // 非修改成分修改后权重总和
    // const beforeWeight: number = parseFloat(value); // 修改前权重

    dataArray.map((item: any) => {
      const isEdit = item.isEdit || false || item.chgWay === 'A';
      if (isEdit) {
        editWeightSum += parseFloat(item.targetWeight);
      } else {
        nonEditWeightSum += parseFloat(item.iniWeight);
      }
    });
    if (editWeightSum > 1) {
      message.warning('修改的权重已经超过100%，请调整！');
      return;
    }
    const list = dataArray.map((item: any) => {
      const isEdit = item.isEdit || false || item.chgWay === 'A';
      if (!isEdit) {
        item.targetWeight = (1 - editWeightSum) * (item.iniWeight / nonEditWeightSum);
      }
      return item;
    });
    setTableData(list);
  };

  // 封装提交按钮数据
  const saveDataObject = (param: {}) => {
    const arr: any[] = [...saveData];
    arr.push(param);
    setSaveData(arr);
  };

  const addSave = useCallback(async () => {
    const value = await form.validateFields();
    const [scode, sname, mktcode] = value.stkCode.split('/');
    const param = {
      stkCode: scode,
      stkName: sname,
      mtkCode: mktcode,
      tradeDate: tradeDate,
      targetWeight: value?.targetWeight / 100,
      targetPrice: value?.targetPrice,
      comm: value?.comm,
      isEdit: true,
    };
    const param2 = {
      securityCode: scode,
      targetWeight: value?.targetWeight / 100,
      comm: value?.comm || '',
    };

    const arrayList: any[] = [...tableData];
    let found = false;

    arrayList.find((item) => {
      if (item?.stkCode === scode) {
        message.warning('已存在此证券,不能重复!');
        found = true;
      }
    });

    if (!found) {
      arrayList.push(param);
      saveDataObject(param2);
    }
    // 调用归一化计算
    normalizationCalculation(arrayList);
    setPageInfo({ ...pageInfo, total: arrayList?.length });
    setPageTableData(
      arrayList?.slice(
        pageInfo.pageSize * (pageInfo.current - 1),
        pageInfo.pageSize * pageInfo.current,
      ),
    );
    setShowAdd(false);
  }, [tableData, pageTableData]);

  const submit = async () => {
    if (saveData?.length) {
      const param = {
        domain: portfolioInfo?.domain,
        tradeDate: tradeDate,
        userId: initialState?.userName,
        mpCode: portfolioInfo?.mpCode,
        stocks: saveData,
      };
      const result = await EditChgHold(param);
      if (result.success) {
        setSaveData([]);
        getTableData({ current: 1, pageSize: 10 });
        message.success('提交成功!');
      } else {
        message.error('提交失败!');
      }
    }
  };

  const goBack = () => {
    if (portfolioInfo) {
      setSaveData([]);
      getTableData({ current: 1, pageSize: 10 });
    }
  };

  // 被选中的表格行的样式
  const rowClassNames = (record: any) => {
    return record?.chgWay === 'A' ? 'clickRowStyl' : '';
  };

  const tableOnChange = useCallback(
    async (record: any, value: any) => {
      let arrayList: any[] = [];

      const list = tableData.map((item: any) => {
        if (item?.stkCode === record?.stkCode) {
          item.isEdit = true;
          item.targetWeight = value / 100;
        }
        return item;
      });
      // 归一化计算
      normalizationCalculation(list);

      if (saveData?.length) {
        arrayList = [...saveData];
        let found = false;

        arrayList.find((item) => {
          if (item?.securityCode === record?.stkCode) {
            item.targetWeight = value / 100;
            found = true;
          }
        });

        if (!found) {
          arrayList.push({
            securityCode: record?.stkCode,
            targetWeight: value / 100,
            comm: record?.comm || '',
          });
        }
      } else {
        arrayList.push({
          securityCode: record?.stkCode,
          targetWeight: value / 100,
          comm: record?.comm || '',
        });
      }
      setSaveData(arrayList);
    },
    [tableData],
  );
  const tableCommOnChange = useCallback(
    async (record: any, value: string) => {
      let arrayCommList: any[] = [];

      const lists = tableData.map((item: any) => {
        if (item?.stkCode === record?.stkCode) {
          item.comm = value || '';
        }
        return item;
      });
      setTableData(lists);

      if (saveData?.length) {
        arrayCommList = [...saveData];
        let isFind = false;

        arrayCommList.find((item: any) => {
          if (item?.securityCode === record?.stkCode) {
            item.comm = value || '';
            isFind = true;
          }
        });
        if (!isFind) {
          arrayCommList.push({
            securityCode: record?.stkCode,
            targetWeight: record?.targetWeight,
            comm: value || '',
          });
        }
      } else {
        arrayCommList.push({
          securityCode: record?.stkCode,
          targetWeight: record?.targetWeight,
          comm: value || '',
        });
      }
      setSaveData(arrayCommList);
    },
    [tableData],
  );

  const pageChange = (tablePagParm: any) => {
    const { current, pageSize } = tablePagParm;
    const start = pageSize * (current - 1);
    const end = pageSize * current;
    setPageTableData(tableData?.slice(start, end));
    setPageInfo({ ...pageInfo, current: current, pageSize: pageSize });
  };

  const revokeAdjustment = async () => {
    const revokeParm = {
      tradeDate: tradeDate,
      domain: portfolioInfo?.domain,
      mpCode: portfolioInfo?.mpCode,
      userId: initialState?.userNo,
    };
    const result = await MpRsHoldChgFacadeRevokeAdjustment(revokeParm);
    const { success, data, erroMsg } = result;
    if (success && data) {
      goBack();
    } else {
      message.error(erroMsg);
    }
  };

  const columns: any = useMemo(() => {
    return [
      {
        title: '交易日期',
        dataIndex: 'tradeDate',
        align: 'center',
      },
      {
        title: '证券类型',
        dataIndex: 'stkType',
        align: 'center',
        render: (text: string, record: any) => {
          if (record?.stkType) {
            return STK_TYPE_DIC[record?.stkType];
          }
          return '-';
        },
      },
      {
        title: '证券代码',
        dataIndex: 'stkCode',
        align: 'center',
      },
      {
        title: '证券名称',
        dataIndex: 'stkName',
        ellipsis: true,
        align: 'center',
      },
      {
        title: '证券市场',
        dataIndex: 'mtkCode',
        align: 'center',
        render: (text: string, record: any) => {
          if (record?.mtkCode) {
            return MTK_CODE_DIC[record?.mtkCode];
          }
          return '-';
        },
      },
      {
        title: '上次调整权重',
        dataIndex: 'lastWeight',
        align: 'center',
        render: (text: string, record: any) => {
          // @ts-ignore
          if (record?.lastWeight !== null && record?.lastWeight !== undefined) {
            return (record?.lastWeight * 100)?.toFixed(2) + '%';
          }
          return '-';
        },
      },
      {
        title: '当前权重',
        dataIndex: 'iniWeight',
        className: 'text-right head-center',
        render: (text: string, record: any) => {
          // @ts-ignore
          if (record?.iniWeight !== null && record?.iniWeight !== undefined) {
            return (record?.iniWeight * 100)?.toFixed(2) + '%';
          }
          return '-';
        },
      },
      {
        title: '目标权重',
        dataIndex: 'targetWeight',
        className: 'text-center head-center',
        width: 140,
        render: (_: string, record: any) => (
          <InputNumber
            className={record?.isEdit ? 'inputNumber_One' : 'inputNumber_Two'}
            addonAfter="%"
            // @ts-ignore
            value={(record?.targetWeight * 100).toFixed(4)}
            title={(record?.targetWeight * 100).toFixed(4)}
            // @ts-ignore
            min={'0'}
            max={'100'}
            formatter={(value) => `${value}`}
            onBlur={(value) => {
              tableOnChange(record, value?.target?.value);
            }}
            onStep={(value) => {
              tableOnChange(record, value);
            }}
            onPressEnter={(value) => {
              // @ts-ignore
              tableOnChange(record, value?.target?.value);
            }}
          />
        ),
      },
      {
        title: '当前汇率',
        dataIndex: 'exRate',
        className: 'text-right head-center',
        render: (text: string, record: any) => {
          if (record?.exRate) {
            return record?.exRate;
          }
          return '-';
        },
      },
      {
        title: '交易价格',
        dataIndex: 'targetPrice',
        className: 'text-right head-center',
        render: (text: string, record: any) => {
          // @ts-ignore
          const val = record?.targetPrice;
          if (val === undefined || val === null) {
            return '-';
          }
          return dealNumThousandsAndFloat(val, 2);
        },
      },
      {
        title: '调整理由',
        ellipsis: true,
        dataIndex: 'comm',
        className: 'text-left head-center',
        render: (text: string, record: any) => (
          <Input
            disabled={record?.chgWay !== 'A' && !record?.isEdit}
            value={record?.comm}
            defaultValue={record?.comm}
            title={record?.comm}
            onChange={(value: any) => {
              tableCommOnChange(record, value?.target?.value);
            }}
            onPressEnter={(value: any) => {
              tableCommOnChange(record, value?.target?.value);
            }}
          />
        ),
      },
    ];
  }, [tableData, pageTableData]);
  const checkJumpUrl = (mpInfo: any) => {
    const { mpCode, mpName, domain } = mpInfo;
    const baseUrl = `/investment/portfolio/mpHoldChgSearch/${mpCode}/${mpName}/${domain}`;
    return baseUrl;
  };
  return (
    <>
      {prevTradeDate === tradeDate && isOkEdit ? (
        <Row style={{ marginBottom: '12px' }}>
          <Col span={12}>
            <Button onClick={() => (portfolioInfo ? setShowAdd(true) : setShowAdd(false))}>
              新增
            </Button>
            <UploadButton portfolioInfo={portfolioInfo} tradeDate={tradeDate} refresh={goBack} />
          </Col>
          <Col span={12}>
            <div style={{ float: 'right' }}>
              <Button onClick={goBack} style={{ marginLeft: 5 }}>
                还原
              </Button>
              <Button style={{ marginLeft: 5 }} onClick={revokeAdjustment}>
                撤销调整
              </Button>
              <Button type="primary" onClick={submit} style={{ marginLeft: 5 }}>
                提交
              </Button>
            </div>
          </Col>
        </Row>
      ) : (
        ''
      )}
      <div className={tableData?.length ? '' : 'notHover'}>
        <Table<TableListMpHoldChg>
          rowKey={`${+new Date() + Math.random()}`}
          size={'small'}
          columns={columns}
          dataSource={pageTableData}
          scroll={{ x: 'max-content' }}
          loading={loading}
          rowClassName={rowClassNames}
          pagination={false}
        />
        <Row style={{ marginTop: '10px' }}>
          <Col flex="100px">{<Link to={checkJumpUrl(portfolioInfo)}>查看历史数据</Link>}</Col>
          <Col flex="auto">
            {tableData?.length ? (
              <Pagination
                style={{ float: 'right' }}
                size={'small'}
                onChange={(page, pageSize) => pageChange({ current: page, pageSize: pageSize })}
                {...pageInfo}
                defaultPageSize={pageInfo.pageSize}
                showSizeChanger={true}
                showQuickJumper={true}
                pageSizeOptions={['5', '10', '20', '50']}
                showTotal={(total, range) => `第 ${range[0]} 到 ${range[1]} 条 | 共 ${total} 条`}
              />
            ) : (
              ''
            )}
          </Col>
        </Row>
      </div>
      <Modal
        title="新增"
        visible={showAdd}
        onOk={addSave}
        onCancel={() => setShowAdd(false)}
        destroyOnClose
      >
        <MpHoldChgAddModal form={form} portfolioInfo={portfolioInfo} />
      </Modal>
    </>
  );
};

export default memo(MpHoldItemTable);
