import { List, Space, Tag, Typography } from 'antd';
import React, { memo } from 'react';
import DwType1Form from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/form/form1';
import DwType3Form from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/form/form3';
import DwType49_57Form from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/form/form49_57';
import DwType49_6Form from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/form/form49_6';
import DwType49_5Form from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/form/form49_5';
import DwType49_19Form from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/form/form49_19';
import moment from 'moment';
import BottomForm from './bottomForm';

interface ModalProps {
  itemData: any; //数据
  onHistoryViewShow?: (data: any) => void; //查询历史记录
  listParams?: any; //查询条件
  rowno?: number; //行号，用于标签颜色
  showHistory: boolean;
  currId?: number;
}

const { Text } = Typography;

const ListItemForm = (props: ModalProps) => {
  const { itemData, onHistoryViewShow, listParams, rowno, showHistory, currId } = props;

  //标签
  const bottomActions = (d: any) => {
    const arr: any = [];
    let tags: any = [];

    if (d?.logicType === 1) {
      tags.push(<Tag className={'tag-style tag-style-color2'}>长逻辑</Tag>);
    }

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
        if (
          label.labelContent2 &&
          label.labelContent1 !== 'noClass' &&
          label.labelType === 1 &&
          label.labelContent2 !== ''
        ) {
          indObj = <Tag className={'tag-style tag-style-color1'}>{label.labelContent2}</Tag>;
          break;
        }
      }
      if (indObj === undefined) {
        const label = d.labelModelList[0];
        if (label.labelContent2) {
          indObj = <Tag className={'tag-style tag-style-color1'}>{label.labelContent2}</Tag>;
        }
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
        if (label.labelContent2 && label.labelContent2 !== '' && label.labelType === 3) {
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

  //信息item
  const getForm = (d: any) => {
    if (d.dwType === 1) {
      return <DwType1Form key={d.id} itemData={d} abbr={true} />;
    } else if (d.dwType === 3) {
      return <DwType3Form key={d.id} itemData={d} />;
    } else if (d.dwType === 49 && d.subType === 57) {
      return <DwType49_57Form key={d.id} itemData={d} abbr={true} />;
    } else if (d.dwType === 49 && d.subType === 6) {
      return <DwType49_6Form key={d.id} itemData={d} />;
    } else if (d.dwType === 49 && (d.subType === 5 || d.subType === 36)) {
      return <DwType49_5Form key={d.id} itemData={d} abbr={true} />;
    } else if (d.dwType === 49 && d.subType === 19) {
      return <DwType49_19Form key={d.id} itemData={d} />;
    } else {
      return (
        <>
          <Text key={d.id}>{d.reportContent ? d.reportContent : ''}</Text>{' '}
        </>
      );
    }
  };

  return (
    <>
      <List.Item
        className={
          (itemData.classType ? itemData.classType + ' ' : '') +
          (currId && currId === itemData.id ? 'research_trends_time_line_current' : '')
        }
      >
        <List.Item.Meta
          title={
            <>
              <span className={'research_trends_time_line_title'}>{itemData.userAccountName}</span>
              <span className={'research_trends_time_line_subtitle'}>
                {moment(itemData.receiveTime).format('YYYY-MM-DD HH:mm:ss')}
              </span>
            </>
          }
          description={bottomActions(itemData)}
        />
        {getForm(itemData)}
        <BottomForm
          key={Math.random()}
          showHistory={showHistory}
          itemData={itemData}
          onHistoryViewShow={onHistoryViewShow}
          listParams={listParams}
          viewUrl={itemData.attachment}
          rowno={rowno}
        />
      </List.Item>
    </>
  );
};

export default memo(ListItemForm);
