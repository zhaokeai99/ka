import Search from '@/components/Search';
import { totalCount } from '@/utils/utils';
import { CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import useResizeObserver from '@react-hook/resize-observer';
import { TabLayoutContext } from '@/components/thfund-front-component/src';
import { Button, Col, message, Row, Spin, Tooltip } from 'antd';
import { find as _find, map as _map, reject as _reject } from 'lodash';
import rafSchd from 'raf-schd';
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
// import { history } from 'umi';
import './index.less';

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
  title: string;
  fetchInfo: (param: { codes: string[] }) => void;
  searchInfo: ({ keyword }: { keyword: string }) => any;
  replacePath: string;
  detailPath?: string;
  searcherType?: string;
  keyName?: string;
  newKey?: string;
  labelName?: string;
};

const EditHeader = ({
  data,
  setData,
  title,
  fetchInfo,
  searchInfo,
  replacePath,
  detailPath,
  searcherType = 'FUND',
  newKey,
  keyName,
  labelName = 'name',
}: EditHeaderParams) => {
  const ref = useRef();
  const { currentRef } = useContext(TabLayoutContext);
  const [tabData, setTabData]: any = useState([]);
  const [loading, setLoading] = useState(false);

  const size = useSize(currentRef);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await fetchInfo({ codes: _map(data, 'code') });
      setLoading(false);
      if (Array.isArray(result) && result.length) {
        setTabData(result);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onSelect = ({ value }: any, index: number) => {
    setData((d: any) => {
      const result = _find(d, { code: value });
      if (result) {
        message.warn(`${value}已在对比列表，请勿重复添加！`);
        return d;
      }

      return [...d, { index, code: value }];
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

    data.forEach(({ index, code }: any) => {
      arr[index] = code;
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
      current.style.width = `${width - (/Mac/.test(navigator.userAgent) ? 24 : 41)}px`;
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

  return (
    <Spin tip="加载中" spinning={loading}>
      <Row
        style={{
          height: '60px',
          width: size ? `${size}px` : '100%',
          // width: `calc(100vw - 208px - ${/Mac/.test(navigator.userAgent) ? '24px' : '42px'})`,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.08)',
        }}
        wrap={false}
        ref={ref as any}
      >
        <Col className="pk-header-title">{title}</Col>
        {totalCount.map((i) => {
          const { code = '' } = _find(data, { index: i }) || {};
          if (code) {
            return (
              <Col key={code} className="pk-header-column">
                <CloseCircleOutlined
                  className="pk-header-column-icon"
                  onClick={() => onRemove(i)}
                />

                <div className="pk-header-column-title">
                  <Tooltip title={tabData.find((j: any) => j.code === code)?.shortName || '-'}>
                    {detailPath ? (
                      <a rel="noopener noreferrer" href={`${detailPath}${code}`}>
                        {tabData.find((j: any) => j.code === code)?.shortName || '-'}
                      </a>
                    ) : (
                      tabData.find((j: any) => j.code === code)?.shortName || '-'
                    )}
                  </Tooltip>
                </div>
                <div className="pk-header-column-tag">{code}</div>
              </Col>
            );
          }
          return (
            <Col key={`pk-${i}`} className="pk-header-column">
              <Search
                labelName={labelName}
                keyName={keyName || 'code'}
                newKey={newKey || 'keyword'}
                searchInfo={searchInfo}
                searchParams={{ searcherType }}
                callback={(value) => onSelect(value, i)}
              >
                <Button
                  type="link"
                  style={{ width: '100%', height: '100%' }}
                  icon={<PlusOutlined />}
                />
              </Search>
            </Col>
          );
        })}
      </Row>
    </Spin>
  );
};

export default EditHeader;
