import { List, Space, Typography } from 'antd';
import React, { memo } from 'react';
import DwType1Form from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/form/form1';
import DwType3Form from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/form/form3';
import DwType49_57Form from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/form/form49_57';
import DwType49_6Form from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/form/form49_6';
import DwType49_5Form from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/form/form49_5';
import DwType49_19Form from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/form/form49_19';
import styles from '../index.less';
import moment from 'moment';
import Icon from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/form/icons';

const { Text } = Typography;

interface ModalProps {
  onHistoryViewShow?: (val: any) => void;
  rowno?: number;
  dataList?: any[];
  fullScreen?: boolean;
}

/**
 * 更多查看
 * @param props
 * @constructor
 */
const MornListForm = (props: ModalProps) => {
  const { dataList, onHistoryViewShow, fullScreen } = props;

  const getForm = (d: any) => {
    if (d.dwType === 1) {
      return <DwType1Form key={d.id} itemData={d} />;
    } else if (d.dwType === 3) {
      return <DwType3Form key={d.id} itemData={d} />;
    } else if (d.dwType === 49 && d.subType === 57) {
      return <DwType49_57Form key={d.id} itemData={d} />;
    } else if (d.dwType === 49 && d.subType === 6) {
      return <DwType49_6Form key={d.id} itemData={d} />;
    } else if (d.dwType === 49 && (d.subType === 5 || d.subType === 36)) {
      return <DwType49_5Form key={d.id} itemData={d} />;
    } else if (d.dwType === 49 && d.subType === 19) {
      return <DwType49_19Form key={d.id} itemData={d} />;
    } else {
      return (
        <>
          <Text className={styles['content']} key={d.id}>
            {d.reportContent ? d.reportContent : ''}
          </Text>{' '}
        </>
      );
    }
  };

  //查看历史
  const historyViewShow = (d: any) => {
    onHistoryViewShow?.(d);
  };

  const getBottom = (item: any) => {
    const btns = [];
    if (!fullScreen) {
      btns.push(
        <a onClick={() => historyViewShow(item)}>
          <div className={'item-bottom-button-icon'}>
            <span className={'item-icon-span'}>{Icon.IconHistory}</span>
          </div>
        </a>,
      );
    }
    if (item?.attachment && (item.subType === undefined || item.subType !== 6)) {
      btns.push(
        <div>
          <a href={item.attachment} target={'_blank'} rel="noreferrer">
            <div className={'item-bottom-button-icon'}>
              <span className={'item-icon-span'}>{Icon.IconJump}</span>
            </div>
          </a>
        </div>,
      );
    }
    if (btns.length > 0) {
      return (
        <div className={'item-bottom-button'}>
          <Space size={'middle'}>{btns}</Space>
        </div>
      );
    }
    return undefined;
  };

  const getUserName = (str: string) => {
    if (str) {
      if (str.length > 2) {
        return str;
      }
      return str[0] + '　' + str[1];
    }
    return '';
  };
  return (
    <>
      <div className={'research-item-more-list research_trends_time_line'}>
        <List
          itemLayout="vertical"
          dataSource={dataList}
          className={styles['research-trends-content-more']}
          renderItem={(item) => {
            return (
              <List.Item>
                <div style={{ display: 'flex', verticalAlign: 'top' }}>
                  <div style={{ width: 165, display: 'inline-block' }}>
                    <div style={{ fontSize: 14, color: 'rgba(0,0,0,0.45)' }}>
                      <span>{moment(item.receiveTime).format('YY-MM-DD HH:mm')}</span>
                      &nbsp;&nbsp;
                      <span>{getUserName(item.userAccountName)}</span>
                    </div>
                  </div>
                  <div
                    style={{ display: 'inline-block', width: 'calc( 100% - 205px - 20px - 40px)' }}
                  >
                    {getForm(item)}
                  </div>
                  <div style={{ display: 'inline-block', width: '100px', marginLeft: '10px' }}>
                    {getBottom(item)}
                  </div>
                </div>
              </List.Item>
            );
          }}
        />
      </div>
    </>
  );
};
export default memo(MornListForm);
