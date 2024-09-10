import React, { memo, useEffect, useRef, useState } from 'react';
import { List, Avatar, Space } from 'antd';
import {
  // HeartOutlined,
  //  HeartFilled,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import './index.less';
import { fuzzySearch, queryTopMarks } from '../service';
import Search from '@/components/Search';
import { get as _get } from 'lodash';
interface ManageListProps {
  listData: any[];
  code: string;
}
const fundManagerImg = (name: string) => {
  if (name?.length > 2) {
    return name.slice(name.length - 2);
  } else {
    return name;
  }
};
const ManageList = (props: ManageListProps) => {
  const { listData = [], code } = props;
  const listConten = useRef(null);
  const [needMore, setNeedMore] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
  const [topLabel, setTopLabel] = useState([]);

  const topMarks = async () => {
    const result = await queryTopMarks({ code: code, markType: 'MANAGER' });
    setTopLabel(result);
  };

  useEffect(() => {
    const height = parseInt(getComputedStyle(listConten.current).height);
    const lineHeight = parseInt(getComputedStyle(listConten.current).lineHeight);
    if (height > lineHeight * 7) {
      setShowDescription(true);
      setNeedMore(1);
    } else {
      setNeedMore(3);
    }
    topMarks();
  }, []);

  const needMoreClick = (boo: React.SetStateAction<number>) => {
    setShowDescription(!showDescription);
    setNeedMore(boo);
  };

  return (
    <List
      itemLayout="vertical"
      size="large"
      pagination={false}
      dataSource={listData}
      renderItem={(item) => (
        <List.Item key={item.code}>
          <List.Item.Meta
            avatar={
              item.headLogoUrl ? (
                <Avatar size={140} src={item.headLogoUrl} />
              ) : (
                <div className="nameImage">{fundManagerImg(item?.name)}</div>
              )
            }
            title={
              <div>
                <span className="list-title">{_get(item, 'name', '-')}</span>
                <Search
                  searchInfo={fuzzySearch}
                  openUrl="/Production/FundManager/"
                  labelName="name"
                  newKey="keyword"
                  searcher={{ searcherType: 'FUND_MANAGER' }}
                  keyName="code"
                />
              </div>
            }
            description={
              <>
                <Space size={8}>
                  {topLabel.length
                    ? topLabel.map((cur) => <span className="label_Tags">{cur}</span>)
                    : null}
                </Space>
                <div
                  ref={listConten}
                  className={showDescription ? 'list-item-content' : 'list-item-content-all'}
                >
                  {_get(item, 'fundManagerResume', '-')}
                  {/* {item.fundManagerResume} */}
                </div>
                <span
                  className="need_more"
                  onClick={() => {
                    needMoreClick(needMore === 1 ? 0 : needMore === 0 ? 1 : 3);
                  }}
                >
                  {needMore === 1 ? (
                    <>
                      展开 <DownOutlined />
                    </>
                  ) : needMore === 0 ? (
                    <>
                      收起 <UpOutlined />
                    </>
                  ) : (
                    ''
                  )}
                </span>
                <br />
                <div className="main_Mangement">
                  主要管理：
                  <span className="main_Mangement_Tags">{item.manageFundType || '-'}</span>
                  投资行业偏好:
                  <span className="main_Mangement_Tags">{item.industryPref || '-'}</span>
                </div>
              </>
            }
          />
        </List.Item>
      )}
    />
  );
};
{
  /* {collection ? (
   <HeartFilled
     style={{ color: 'red' }}
     onClick={() => {
       setCollect(0);
     }}
   />
 ) : (
   <HeartOutlined
     onClick={() => {
       setCollect(1);
     }}
   />
 )} */
}
export default memo(ManageList);
