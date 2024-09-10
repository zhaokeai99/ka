import React, { useEffect, useState } from 'react';
import { Badge, Empty, Image, Pagination } from 'antd';
import './index.less';
import { negativeColor, positiveColor } from '@/themes';
import ProCard from '@ant-design/pro-card';
import { DoubleRightOutlined } from '@ant-design/icons';
// import Title from '../title.png';
import { history } from 'umi';
import { queryFMPageList } from '../service';
import { dealNumThousandsAndFloat } from '@/utils/utils';
import SearchForm from './SearchForm';

const fundManagerImg = (name: string) => {
  if (name.length > 2) {
    return name.slice(name.length - 2);
  } else {
    return name;
  }
};

const FundManager = ({ code }: any) => {
  const initialParams = {
    fundCompName: '',
  };
  const [listData, setListData] = useState<any>([]);
  const [totals, setTotals] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSizes, setPageSizes] = useState(4);
  const [sarchPara, setSearchPara] = useState(initialParams);

  // 查看基金公司基础信息
  const fetchListData = async () => {
    const result = await queryFMPageList({
      fundCompCode: code,
      offsetId: '',
      pageNo: currentPage,
      pageSize: pageSizes,
      ...sarchPara,
    });
    const { dataList, total, pageNum, pageSize } = result;
    setTotals(total);
    setCurrentPage(pageNum);
    setPageSizes(pageSize);
    setListData(dataList);
  };
  useEffect(() => {
    fetchListData();
  }, [currentPage, totals, pageSizes, sarchPara]);

  return (
    <ProCard direction="row" wrap layout="center">
      <ProCard colSpan={24}>
        <SearchForm
          onFinish={(values: any) => {
            setSearchPara(values);
            fetchListData();
          }}
          onReset={() => {
            setSearchPara(initialParams);
            fetchListData();
          }}
        />
      </ProCard>
      {!Array.isArray(listData) || listData.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <ProCard bodyStyle={{ padding: 0 }} wrap>
          {listData.map((item: any, index: any) => {
            return (
              <ProCard key={index} colSpan="50%">
                <Badge.Ribbon color="red" text={`在管规模:${item.fundAMTDesc || '-'}`}>
                  <ProCard bordered>
                    <div className="fund_manage_list_title">
                      <div className="list_title_image">
                        {item.avatar ? (
                          <Image width={90} height={130} src={item.avatar} preview={false} />
                        ) : (
                          <div className="avatar">
                            {fundManagerImg(item.fundManagerName || '-')}
                          </div>
                        )}
                      </div>

                      <div className="list_title_introduce">
                        <p className="list_title">
                          <span className="ranking">NO.{item.rankNo || '-'}</span>
                          <span>{item.fundManagerName || '-'} </span>
                        </p>
                        <div className="fund_term">
                          <div>
                            本公司任期：
                            <p>
                              {item.workStart || '-'}-{item.workEnd || '-'}
                            </p>
                          </div>
                          <div>
                            任期回报：
                            <p
                              style={{
                                color:
                                  item.totalIncome > 0
                                    ? positiveColor
                                    : item.totalIncome === 0
                                    ? '#000'
                                    : negativeColor,
                              }}
                            >
                              {item.totalIncome > 0
                                ? `+${dealNumThousandsAndFloat(item.totalIncome, 2)}`
                                : dealNumThousandsAndFloat(item.totalIncome, 2)}
                              %
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="list_content">
                      <p>
                        <b>获奖情况：</b>
                        <span>{item.awards || '-'}</span>
                      </p>
                      <p>
                        <b>个人简历：</b>
                        <span className="fundManagerResume">{item.fundManagerResume || '-'}</span>
                      </p>
                    </div>
                    <div
                      className="more"
                      onClick={() => {
                        history.push(`/production/fundManager/${item.fundManagerCode}`);
                      }}
                    >
                      更多
                      <DoubleRightOutlined />
                    </div>
                  </ProCard>
                </Badge.Ribbon>
              </ProCard>
            );
          })}
          <ProCard colSpan="100%" style={{ textAlign: 'right' }}>
            <Pagination
              size="small"
              total={totals}
              current={currentPage}
              pageSize={pageSizes}
              showSizeChanger={false}
              showQuickJumper
              onChange={(curr) => {
                setCurrentPage(curr);
              }}
            />
          </ProCard>
        </ProCard>
      )}
    </ProCard>
  );
};

export default FundManager;
