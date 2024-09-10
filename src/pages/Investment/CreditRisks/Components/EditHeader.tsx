import { totalCount } from '@/utils/utils';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import useResizeObserver from '@react-hook/resize-observer';
import { TabLayoutContext } from '@/components/thfund-front-component/src';
import { Button, Col, Form, message, Row, Spin, Tooltip, DatePicker } from 'antd';
import { find as _find, reject as _reject } from 'lodash';
import rafSchd from 'raf-schd';
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import './index.less';
// import { map as _map } from 'lodash';
import moment from 'moment';
import ProCard from '@ant-design/pro-card';
import { history as umiHistory } from 'umi';
import { queryCompanySelect } from '../service';
import Search from './Search';

const useSize = (target) => {
  const [size, setSize] = useState<number>(0);

  useLayoutEffect(() => {
    if (target.current) {
      setSize(target.current.getBoundingClientRect());
    }
  }, [target]);

  useResizeObserver(target, (entry) => {
    if (entry?.contentRect?.width) {
      setSize((entry.contentRect.width - 24) as number);
    }
  });
  return size;
};

type EditHeaderParams = {
  data: any[];
  setData: (param: any) => void;
  title: any;
  dateString: any;
  replacePath: string;
  change: (dataString: string) => void;
};

const EditHeader = ({
  data,
  setData,
  title,
  change,
  replacePath,
  dateString,
}: EditHeaderParams) => {
  const ref = useRef();
  const { currentRef } = useContext(TabLayoutContext);
  const [tabData, setTabData]: any = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(dateString);

  const size = useSize(currentRef);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await queryCompanySelect({ compName: '' });
      // const result = await queryBondList({ compIds: _map(data, 'key'), LDate: date });
      setLoading(false);
      if (Array.isArray(result) && result.length) {
        setTabData(result);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelect = ({ key, label }: any, index: number) => {
    setData((d: any) => {
      const result = _find(d, { key: key });
      if (result) {
        message.warn(`${label}已在对比列表，请勿重复添加！`);
        return d;
      }

      return [...d, { index, key: key }];
    });
  };

  const onRemove = (index: number) => {
    setData((d: any) => {
      return _reject(d, { index }) || [];
    });
  };

  useEffect(() => {
    if (data?.length > 5) {
      message.warn('对比数量不能超过5个！');
      return;
    }
    const arr: any[] = [];

    data.forEach(({ index, key }: any) => {
      arr[index] = key;
    });

    history.pushState({}, '', `${replacePath}${arr.join(',')}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const schedule = rafSchd((e) => {
    const top = e.target.scrollTop;
    const { current }: any = ref;
    const { width } = e.target.getBoundingClientRect();
    const { position } = current.style;

    if (top > 12 && position !== 'fixed') {
      current.style.position = 'fixed';
      current.style['z-index'] = 999;
      current.style.top = '85px';
      e.target.style['padding-top'] = '60px';
      current.style.width = `${width - 24}px`;
    } else if (top <= 12) {
      current.style.width = '100%';
      current.style.position = 'static';
      e.target.style['padding-top'] = '0px';
    }
  });

  // 吸顶
  useEffect(() => {
    const onScroll = (e: any) => {
      schedule(e);
    };
    currentRef?.current?.addEventListener('scroll', onScroll, false);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      currentRef?.current?.removeEventListener('scroll', onScroll);
      schedule.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchList(keyword: string): Promise<any[]> {
    const tabdata = await queryCompanySelect({ compName: keyword }).then((result: any[]) => {
      return result.map((r: any) => ({
        key: r.optKey,
        value: r.optKey,
        label: r.optValue,
        ...r,
      }));
    });
    setTabData((prev: any[]) => {
      return prev.concat(...tabdata);
    });
    return tabdata;
  }

  return (
    <div className="editHeader">
      <ProCard
        title="主体对比PK"
        headStyle={{ border: 'none' }}
        ref={ref as any}
        bodyStyle={{ padding: '0' }}
        extra={
          <Form>
            <Form.Item
              style={{ marginBottom: '0' }}
              label="日期"
              required
              rules={[{ required: true }]}
            >
              <DatePicker
                format="YYYY-MM-DD"
                defaultValue={moment(date, 'YYYY-MM-DD')}
                onChange={(_data, dataString) => {
                  setDate(moment(dataString).format('YYYYMMDD'));
                  change(moment(dataString).format('YYYYMMDD'));
                }}
              />
            </Form.Item>
          </Form>
        }
      >
        <Spin tip="加载中" spinning={loading}>
          <Row
            style={{
              height: '60px',
              width: size ? `${size}px` : '100%',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.08)',
            }}
            wrap={false}
          >
            <Col className="creditRisksPk-header-title">{title}</Col>
            {totalCount.map((i) => {
              const { key = '' } = _find(data, { index: i }) || {};
              if (key) {
                return (
                  <Col key={key} className="creditRisksPk-header-column">
                    <CloseCircleOutlined
                      className="creditRisksPk-header-column-icon"
                      onClick={() => onRemove(i)}
                    />

                    <div
                      className="creditRisksPk-header-column-title"
                      onClick={() => {
                        umiHistory.push(`/investment/creditRisks/details/${key}`);
                      }}
                    >
                      <Tooltip title={tabData.find((j: any) => j.optKey === key)?.optValue || '-'}>
                        <a>{tabData.find((j: any) => j.optKey === key)?.optValue || '-'}</a>
                      </Tooltip>
                    </div>
                    <div className="creditRisksPk-header-column-tag">{key}</div>
                  </Col>
                );
              }
              return (
                <Col
                  onClick={() => {
                    if (!date) {
                      message.warn('请先选择日期');
                    }
                  }}
                  key={`pk-${i}`}
                  className="creditRisksPk-header-column"
                >
                  {date ? (
                    <Search
                      fetchList={fetchList}
                      callback={(value: any) => {
                        onSelect(value, i);
                      }}
                    >
                      <Button
                        type="link"
                        style={{ width: '100%', height: '100%' }}
                        icon={<PlusOutlined />}
                      />
                    </Search>
                  ) : (
                    <Button
                      type="link"
                      style={{ width: '100%', height: '100%' }}
                      icon={<PlusOutlined />}
                    />
                  )}
                </Col>
              );
            })}
          </Row>
        </Spin>
      </ProCard>
    </div>
  );
};

export default EditHeader;
