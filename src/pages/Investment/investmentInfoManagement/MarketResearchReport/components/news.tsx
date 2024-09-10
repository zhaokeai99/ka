import { memo, useEffect, useState } from 'react';
import './../index.css';
import { EsIndexDataInfoFacadeQueryEsDataByPage } from '@/pages/Investment/investmentInfoManagement/MarketResearchReport/service';
import { Typography, Timeline, Space, Tag, Row, Col } from 'antd';
import moment from 'moment';

export interface NewsProps {
  onClick: (objId: string) => void;
}

const { Title, Text } = Typography;

const IndexInfo = (props: NewsProps) => {
  const { onClick } = props;
  const [timeTitle, setTimeTitle] = useState<any>('');
  const [dataList, setDataList] = useState<any[]>([]);
  moment().locale('zh-cn');

  const loadDic = async () => {
    const params = {
      from: 0,
      size: 10,
      sort: { name: 'writeTime', order: 'desc' },
      index: 'index_sirm_research_report',
      matchAll: '1',
      include: ['objId', 'title', 'industryName', 'brokerName', 'writeTime', 'stkName', 'timeStr'],
    };
    const { data } = await EsIndexDataInfoFacadeQueryEsDataByPage(params);
    //处理数据
    let timeTmp = '';
    const tmpData: any[] = [];
    if (data === undefined) {
      return;
    }
    data.forEach((record: any) => {
      const writeDate = moment(record.writeTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
      if (timeTmp === '') {
        timeTmp = writeDate;
      }
      if (timeTmp === writeDate) {
        const d = {
          objId: record.objId,
          title: record.title,
          industryName: record.industryName,
          brokerName: record.brokerName,
          stkName: record.stkName,
          timeStr: moment(record.writeTime, 'YYYY-MM-DD HH:mm:ss').format('HH:mm'),
        };
        tmpData.push(d);
      }
    });
    const timeTitleMoment = moment(timeTmp, 'YYYY-MM-DD');
    setTimeTitle(
      <Space>
        {timeTitleMoment.format('LL')}
        {timeTitleMoment.format('dddd')}
      </Space>,
    );
    setDataList(tmpData);
  };

  useEffect(() => {
    loadDic();
  }, []);

  const titleClick = (record: any) => {
    onClick(record.objId);
  };

  return (
    <div style={{ minHeight: 400 }}>
      <Row>
        <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={2}></Col>
        <Col span={12}>
          <Title level={4}>最新研报</Title>
        </Col>
      </Row>
      <Row>
        <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={2}></Col>
        <Col span={12}>
          <Title level={5}>{timeTitle}</Title>
        </Col>
      </Row>

      <Timeline mode={'left'} className={'new-list'}>
        {dataList.map((d) => {
          return (
            <Timeline.Item label={d.timeStr}>
              <Space direction={'vertical'}>
                <Text onClick={() => titleClick(d)} style={{ cursor: 'pointer' }}>
                  {d.title}
                </Text>
                <div>
                  <Space>
                    <Tag className={'tag-style'}>{d.brokerName}</Tag>
                    <Tag className={'tag-style'}>{d.stkName}</Tag>
                  </Space>
                </div>
              </Space>
            </Timeline.Item>
          );
        })}
      </Timeline>
    </div>
  );
};
export default memo(IndexInfo);
