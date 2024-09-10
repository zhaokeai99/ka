import { Button, message, Modal, Tabs } from 'antd';
import React, { useCallback, useState } from 'react';
import { history } from 'umi';
import DetailDialog from '../components/DetailDialog';
import { cancelRoadShow } from '../service';
import CalendarTab from './CalendarTab';
import SearchTab from './SearchTab';

const { TabPane } = Tabs;
const { confirm } = Modal;

import styles from './index.less';

const RoadShow: React.FC<any> = () => {
  const [tab, setTab] = useState('Calendar');
  const [detailinfo, setDetailInfo] = useState({ visible: false, id: -1, dataDetail: {} });
  // 查看详情
  const onDetail = useCallback((id, data) => {
    setDetailInfo({ id, visible: true, dataDetail: data });
  }, []);

  // 关闭详情弹框
  const onCloseDetail = useCallback(() => {
    setDetailInfo({ visible: false, id: -1, dataDetail: {} });
  }, []);

  // 编辑
  const onEdit = useCallback((id) => {
    history.push('/marketing/app/roadShow/edit?id=' + id);
  }, []);

  // 取消路演
  const onCancel = useCallback(async (id) => {
    confirm({
      content: '确认取消本次路演？',
      onOk() {
        cancelRoadShow({ ids: [id] })
          .then((res) => {
            const { success } = res;
            if (success) {
              message.success('取消路演成功！');
            } else {
              message.error('取消失败！');
            }
          })
          .catch((e) => console.log(e));
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }, []);

  return (
    <div className={styles['main-container']}>
      <Tabs
        size="small"
        activeKey={tab}
        type="card"
        onChange={(key) => setTab(key)}
        tabBarStyle={{ background: '#fff', marginBottom: 0 }}
      >
        <TabPane key="Calendar" tab="日历">
          <CalendarTab onDetail={onDetail} onEdit={onEdit} onCancel={onCancel}></CalendarTab>
        </TabPane>
        <TabPane key="Search" tab="搜索">
          <SearchTab onDetail={onDetail} onEdit={onEdit} onCancel={onCancel}></SearchTab>
        </TabPane>
      </Tabs>
      <Button
        className={styles['new']}
        type="primary"
        onClick={() => {
          history.push('/marketing/app/roadShow/new');
        }}
      >
        新建
      </Button>
      <DetailDialog
        visible={detailinfo.visible}
        id={detailinfo.id}
        data={detailinfo.dataDetail}
        onClose={onCloseDetail}
      />
    </div>
  );
};

export default RoadShow;
