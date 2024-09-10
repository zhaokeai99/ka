import { List, Space, Tag, Typography } from 'antd';
import React, { memo } from 'react';
import DwType1Form from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/form/form1';
import DwType3Form from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/form/form3';
import DwType49_57Form from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/form/form49_57';
import DwType49_6Form from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/form/form49_6';
import DwType49_5Form from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/form/form49_5';
import DwType49_19Form from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/form/form49_19';
import styles from '../index.less';
import moment from 'moment';
import BottomForm from './bottomForm';

const { Text } = Typography;

interface ModalProps {
  onHistoryViewShow?: (val: any) => void;
  rowno?: number;
  dataList?: any[];
}

/**
 * 更多查看
 * @param props
 * @constructor
 */
const MornListForm = (props: ModalProps) => {
  const { dataList, onHistoryViewShow, rowno } = props;

  //标签处理
  const bottomActions = (d: any) => {
    const arr: any = [];

    let tags: any = [];

    if (d?.msgType !== undefined && d.msgType !== null && d.msgType !== '') {
      tags.push(<Tag className={'tag-style tag-style-color1'}>{d.msgType}</Tag>);
    }
    if (d?.reportType !== undefined && d.reportType !== null && d.reportType !== '') {
      tags.push(<Tag className={'tag-style tag-style-color1'}>{d.reportType}</Tag>);
    }

    //行业
    if (
      d?.labelModelList !== undefined &&
      d.labelModelList !== null &&
      d.labelModelList !== '' &&
      d.labelModelList.length > 0
    ) {
      let indObj = undefined;
      for (let i = 0; i < d.labelModelList.length; i++) {
        const label = d.labelModelList[i];
        if (label.labelContent1 !== 'noClass' && label.labelType === 1) {
          indObj = <Tag className={'tag-style tag-style-color1'}>{label.labelContent2}</Tag>;
          break;
        }
      }
      if (indObj === undefined) {
        const label = d.labelModelList[0];
        indObj = <Tag className={'tag-style tag-style-color1'}>{label.labelContent2}</Tag>;
      }
      tags.push(indObj);
    }
    //买入卖出
    if (d?.recommend !== undefined) {
      if (d?.recommend === 1) {
        tags.push(<Tag className={'tag-style tag-style-color2'}>{'买入'}</Tag>);
      } else if (d?.recommend === 2) {
        tags.push(<Tag className={'tag-style tag-style-color3'}>{'卖出'}</Tag>);
      }
    }
    //证券
    if (
      d?.labelModelList !== undefined &&
      d?.labelModelList !== null &&
      d?.labelModelList.length > 0
    ) {
      d?.labelModelList.map((label: any) => {
        if (label.labelType === 3) {
          tags.push(<Tag className={'tag-style tag-style-color1'}>{label.labelContent2}</Tag>);
        }
      });
    }
    if (tags.length > 7) {
      tags = tags.slice(0, 7);
    }

    arr.push(<Space size={'small'}>{tags}</Space>);
    return arr;
  };

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
                <List.Item.Meta
                  title={
                    <>
                      <span className={'research_trends_time_line_title'}>
                        {item.userAccountName}
                      </span>
                      <span className={'research_trends_time_line_subtitle'}>
                        {moment(item.receiveTime).format('YYYY-MM-DD HH:mm:ss')}
                      </span>
                    </>
                  }
                  description={bottomActions(item)}
                />
                {getForm(item)}
                <BottomForm
                  key={Math.random()}
                  showHistory={true}
                  itemData={item}
                  onHistoryViewShow={onHistoryViewShow}
                  listParams={undefined}
                  viewUrl={item.attachment}
                  rowno={rowno}
                />
              </List.Item>
            );
          }}
        />
      </div>
    </>
  );
};
export default memo(MornListForm);
