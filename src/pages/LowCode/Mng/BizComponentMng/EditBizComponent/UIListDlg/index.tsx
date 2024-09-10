import React, { useEffect, useState, useCallback } from 'react';
import { message, Modal, Input, Pagination, Card, Popover } from 'antd';
import { queryUIComponentList } from '../../../UIComponentMng/service';
import { InfoCircleOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Search } = Input;

export interface PropEditProps {
  chooseUIItem: (item: any) => any;
  visible: boolean;
  handleCancel: (item: any) => any;
}

const PropEdit: React.FC<PropEditProps> = ({
  chooseUIItem = () => {},
  visible = false,
  handleCancel = () => {},
}) => {
  const [dataList, setDatalist] = useState([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [searchWord, setKeywords] = useState(''); // 搜索值

  useEffect(() => {
    queryUIComponentList({ pageSize: 8, current: 1 })
      .then((res: any) => {
        if (res.success && res.data && res.data.length > 0) {
          setDatalist(res.data);
          setTotal(res.total);
        } else {
          message.error('查询UI组件列表异常!');
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handlePageChange = useCallback((page) => {
    queryUIComponentList({ pageSize: 8, current: page, searchWord })
      .then((res: any) => {
        if (res.success && res.data && res.data.length > 0) {
          setDatalist(res.data);
          setTotal(res.total);
          setCurrent(page);
        } else {
          message.error('查询UI组件列表异常!');
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleSearch = useCallback((newKeywords) => {
    queryUIComponentList({ pageSize: 8, current: 1, searchWord: newKeywords })
      .then((res: any) => {
        if (res.success && res.data && res.data.length > 0) {
          setDatalist(res.data);
          setTotal(res.total);
          setCurrent(1);
          setKeywords(newKeywords);
        } else {
          message.error('查询UI组件列表异常!');
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <Modal
      title="UI组件选择"
      width={'980px'}
      visible={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <>
        <div className={styles['search-area']}>
          <span>查询组件：</span>
          <Search
            style={{ width: 300 }}
            placeholder="搜索组件关键字"
            onSearch={(value) => {
              handleSearch(value);
            }}
            enterButton
          />
        </div>
        <>
          <div className={styles['card-container']}>
            {dataList.map((item) => {
              return (
                <Card
                  style={{ width: 210, margin: 5 }}
                  onClick={() => chooseUIItem(item)}
                  title={item.title}
                  extra={
                    <Popover content={<div>{item.description}</div>}>
                      <InfoCircleOutlined />
                    </Popover>
                  }
                >
                  <div style={{ height: 130, width: 200 }}>
                    <img style={{ height: '100%', width: '100%' }} src={item.imgUrl}></img>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
        <div className={styles['footer-area']}>
          <Pagination
            style={{ marginTop: 10 }}
            current={current}
            total={total}
            onChange={(page) => handlePageChange(page)}
            showSizeChanger={false}
          />
        </div>
      </>
    </Modal>
  );
};

export default PropEdit;
