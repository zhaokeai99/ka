import React, { useEffect, useState } from 'react';
import { Filter } from '@/pages/LowCode/core/Filter';
import MyGrid from '@/pages/LowCode/core/Grid';
import { useModel } from 'umi';
import { queryPageList, addPageItem } from '../LowCode/Mng/PageMng/service';
import { message } from 'antd';

export default function () {
  const [myId, setMyId] = useState(-1);
  // 检查一下有没有当前用户的自定制页面
  const { initialState } = useModel('@@initialState');
  useEffect(() => {
    const keyWord = initialState?.userName + '_default_page_layout';
    queryPageList({
      current: 1,
      pageSize: 10,
      searchWord: keyWord,
    })
      .then((res) => {
        if (res && res.success && res.data && res.data.length > 0 && res.data[0]) {
          setMyId(res.data[0].id);
        } else {
          const createParam = {
            pageId: keyWord,
            title: initialState?.userName + '的首页',
            description: initialState?.userName + '的首页',
            keywords: '首页, ' + initialState?.userName,
            category: 'mainPage',
            layout: '-',
          };
          addPageItem(createParam)
            .then((resIn) => {
              if (resIn && resIn.success && resIn.data) {
                setMyId(resIn.data.id);
              } else {
                message.error('我的页面暂时不可用！');
              }
            })
            .catch((e) => console.log(e));
        }
      })
      .catch((e) => console.log(e));
  }, [initialState]);
  return (
    <Filter>
      <MyGrid id={myId} edit={false} />
    </Filter>
  );
}
