import { ContentWithEmoji } from '@/pages/Investment/components/WechatEmoji';
import { Button, Col, Modal, Row, Spin, message } from 'antd';
import lodash from 'lodash';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import BrokerDataInfo from './content/brokerDataInfo';
import CalendarMeeting from './content/calendarMeeting';
import CalendarMeetingDetail from './content/calendarMeetingDetail';
import SearchForm from './content/searchForm';
import MyAttention from './content/myAttention';
import {
  SelmRoadShowInfoFacadeGetRoadShowDic,
  SelmRoadShowInfoFacadeGetSelmRoadShowInfo,
  IrFollowFacadeQueryIrFollowList,
  SelmRoadShowOpLogFacadeAddRoadShowOpInfo,
  SelmRoadShowOpLogFacadeCountRoadShowOpInfoByUsername,
} from './service';
import NoPermissionPage from '@/components/NoPermissionPage';

export interface DicProps {
  classes: any;
  company: any;
  industry: any;
  seller: any;
  wechatGroup: any;
}

const BrokerInfo = () => {
  const [version, setVersion] = useState<number>(0);
  const [meetingDetailData, setMeetingDetailData] = useState<any>(undefined);
  const [meetingShow, setMeetingShow] = useState<boolean>(false);
  const [keywords, setKeywords] = useState<string>('');
  const [attentionList, setAttentionList] = useState<any>([]);
  const [attLoading, setAttLoading] = useState<boolean>(false);
  const [meetLoading, setMeetLoading] = useState<boolean>(false);
  const [dicMap, setDicMap] = useState<DicProps>({
    classes: [],
    company: [],
    industry: [],
    seller: [],
    wechatGroup: [],
  });
  const [passCommitment, setPassCommitment] = useState<boolean>(true);
  const [commitmentShow, setCommitmentShow] = useState<boolean>(false);
  const [commitmentLoading, setCommitmentLoading] = useState<boolean>(false);
  const [noPass, setNoPass] = useState<boolean>(true);

  const wechatDataRef = useRef();
  const searchRef = useRef();
  const calMeetingRef = useRef();

  //加载字典
  const loadDic = useCallback(async () => {
    const data = await SelmRoadShowInfoFacadeGetRoadShowDic();
    if (data.success) {
      setDicMap(data.data);
      setVersion(lodash.random(0, 999999, false));
    }
  }, []);

  //个人关注
  const loadAttention = useCallback(async (loadSearch: boolean = false) => {
    setAttLoading(true);
    const data = await IrFollowFacadeQueryIrFollowList();

    let dataRows = 0;
    if (data.success) {
      setAttentionList(data.data);
      dataRows = data.data.length;
    }
    setAttLoading(false);
    if (loadSearch) {
      const params: any = {};
      if (dataRows > 0) {
        params.industry = '个人关注';
      }
      // @ts-ignore
      searchRef?.current?.formSetValue(params);
      // @ts-ignore
      wechatDataRef?.current?.onSearch(params);
    }
  }, []);

  //承诺书
  const loadCommitment = async () => {
    const params = { status: 0, type: 3 };
    const result = await SelmRoadShowOpLogFacadeCountRoadShowOpInfoByUsername(params);
    if (result > 0) {
      setCommitmentShow(false);
      setPassCommitment(false);
    } else {
      setCommitmentShow(true);
    }
  };

  const onCommitmentAgree = async () => {
    const params = { status: 0, type: 3, keyword: 'agree' };
    setCommitmentLoading(true);
    const result = await SelmRoadShowOpLogFacadeAddRoadShowOpInfo(params);
    setCommitmentLoading(false);
    if (result > 0) {
      setCommitmentShow(false);
      setPassCommitment(false);
    } else {
      message.error('操作失败。');
    }
  };

  const onCommitmentNoAgree = () => {
    setNoPass(false);
    setCommitmentShow(false);
    setPassCommitment(false);
  };

  //加载
  useEffect(() => {
    loadDic();
    loadCommitment();
    loadAttention(true);
    // @ts-ignore
    calMeetingRef?.current?.onSearch();
  }, []);

  //搜索历史
  const searchKeyword = useCallback((keyword: string) => {
    setKeywords(keyword);
  }, []);

  //搜索
  const SearchHandle = useCallback((values: any) => {
    // @ts-ignore
    wechatDataRef?.current?.onSearch(values);
    // @ts-ignore
    setKeywords('');
  }, []);

  //查询记录
  const getMeetingDetailData = useCallback(async (id: number) => {
    if (id === undefined) {
      return;
    }
    setMeetLoading(true);
    const params = { id: id };
    const result = await SelmRoadShowInfoFacadeGetSelmRoadShowInfo(params);
    const { success, data } = result;
    if (success) {
      setMeetingDetailData(data);
      setMeetingShow(true);
    }
    setMeetLoading(false);
  }, []);

  const showMeetingDetail = (id: number) => {
    getMeetingDetailData(id);
  };

  //关注更新
  const attRefresh = () => {
    loadAttention();
  };

  const onMeetingClose = useCallback(() => {
    setMeetingShow(false);
  }, []);

  const meetingDetailTitle = (data: any) => {
    if (data?.showUrl) {
      return (
        <a
          className={'broker-title-a-style'}
          href={data?.showUrl}
          rel={'noreferrer'}
          target="_blank"
        >
          <ContentWithEmoji
            source="wechat-emoji.png"
            emojiScale={0.3}
            content={meetingDetailData?.showTitle}
          />
        </a>
      );
    }
    return (
      <ContentWithEmoji
        source="wechat-emoji.png"
        emojiScale={0.3}
        content={meetingDetailData?.showTitle}
      />
    );
  };

  return (
    <>
      <Spin spinning={passCommitment}>
        {noPass ? (
          <Row>
            <Col xs={24} sm={24} md={16} lg={16} xl={17} xxl={19}>
              <Row>
                <Col span={24}>
                  <SearchForm
                    cRef={searchRef}
                    dicMap={dicMap}
                    version={version}
                    onSearch={SearchHandle}
                    keywords={keywords}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <BrokerDataInfo cRef={wechatDataRef} attData={attentionList} />
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={7} xxl={5}>
              <Row>
                <Col span={24}>
                  <MyAttention
                    onSearch={searchKeyword}
                    dicMap={dicMap}
                    attData={attentionList}
                    onClose={attRefresh}
                    loading={attLoading}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <CalendarMeeting
                    cRef={calMeetingRef}
                    onShow={showMeetingDetail}
                    loading={meetLoading}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        ) : (
          <NoPermissionPage />
        )}
      </Spin>

      <Modal
        title={<div style={{ textAlign: 'center', fontWeight: 600 }}>合规承诺</div>}
        visible={commitmentShow}
        width={600}
        destroyOnClose={true}
        closable={false}
        confirmLoading={commitmentLoading}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Button
              key="agree"
              type={'primary'}
              onClick={onCommitmentAgree}
              style={{ width: '120px', marginRight: 20 }}
            >
              同意并继续
            </Button>
            <Button key="agree" onClick={onCommitmentNoAgree} style={{ width: '120px' }}>
              不同意
            </Button>
          </div>
        }
      >
        <div>
          <p style={{ fontWeight: 500, textIndent: '2em', lineHeight: '24px', fontSize: '14px' }}>
            本平台相关信息仅限内部使用，包括但不限于研究报告/点评、相关数据等，未经事先同意，不得以任何方式复印、传送或出版等。本人承诺不泄露、不利用内幕信息或重大未公开信息进行研究报告/点评的撰写及从事投资研究等相关活动，不向任何利益相关方透露研究信息，以防止损害基金份额持有人利益。
          </p>
        </div>
      </Modal>
      <Modal
        className={'meeting-details'}
        title={meetingDetailTitle(meetingDetailData)}
        visible={meetingShow}
        onOk={onMeetingClose}
        onCancel={onMeetingClose}
        width="80%"
        destroyOnClose={true}
        footer={[
          <Button key="back" onClick={onMeetingClose}>
            关闭
          </Button>,
        ]}
      >
        <CalendarMeetingDetail data={meetingDetailData} />
      </Modal>
    </>
  );
};

export default memo(BrokerInfo);
