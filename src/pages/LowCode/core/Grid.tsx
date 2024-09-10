import { primaryColor } from '@/themes/index';
import {
  CloseSquareTwoTone,
  EditTwoTone,
  InfoCircleOutlined,
  PlusCircleTwoTone,
  SaveTwoTone,
  StopTwoTone,
} from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import ProProvider from '@ant-design/pro-provider';
import { Card, Drawer, Input, message, Pagination, Popover } from 'antd';
import { map as _map } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { dynamic, history } from 'umi';
import { queryBizComponentList } from '../Mng/BizComponentMng/service';
import { getBizComponentsProps, getPageDetail, updatePageItem } from '../Mng/PageMng/service';
import GridItem from './GridItem';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import styles from './grid.less';

const { Search } = Input;
const ResponsiveGridLayout = WidthProvider(Responsive);

// 简单获取最大的y，x取值0，来布局新添加的元素，后续可以考虑优化一下
const getMaxY = (list) => {
  let y = 0;
  if (list && list.length > 0) {
    for (let i = 0; i < list.length; i++) {
      if (list[i] && list[i].y + list[i].h > y) {
        y = list[i].y + list[i].h;
      }
    }
  }
  return y;
};

// 标记一下被选中
const setSelect = (list, selectList) => {
  if (list && list.length > 0 && selectList && selectList.length > 0) {
    for (let i = 0; i < list.length; i++) {
      if (list[i]) {
        list[i].select = selectList.some((element) => element && element.i == list[i].id);
      }
    }
  }
  return list;
};

// 解析处理数据
const parseData = (list) => {
  if (list && list.length > 0) {
    for (let i = 0; i < list.length; i++) {
      if (list[i]) {
        let itemPorps = {};
        try {
          itemPorps = JSON.parse(list[i].props);
        } catch (e) {
          console.log('解析item props出错, ', e);
        }
        list[i].colWidth = itemPorps.colWidth;
        list[i].rowHeight = itemPorps.rowHeight;
      }
    }
  }
  return list;
};

// 标记一下被反选中
const unSelect = (list, item) => {
  if (list && list.length > 0 && item) {
    for (let i = 0; i < list.length; i++) {
      if (list[i] && list[i].id == item.i) {
        list[i].select = false;
        break;
      }
    }
  }
  return [].concat(list);
};

// 从页面删除业务组件
const deleteItem = (list, item) => {
  if (list && list.length > 0 && item) {
    for (let j = 0; j < list.length; j++) {
      if (list[j] && item.i === list[j].i) {
        list.splice(j, 1);
        break;
      }
    }
  }
  return [].concat(list);
};

// 更新layout变化后的位置数据到gridData，保存使用
const updatePos = (gridData, pos) => {
  const newLayoutSaveData = [];
  if (gridData && gridData.length > 0 && pos && pos.length > 0) {
    for (let k = 0; k < gridData.length; k++) {
      if (gridData[k]) {
        for (let j = 0; j < pos.length; j++) {
          if (pos[j] && pos[j].i === gridData[k].i) {
            gridData[k].x = pos[j].x;
            gridData[k].y = pos[j].y;
            gridData[k].w = pos[j].w;
            gridData[k].h = pos[j].h;
            newLayoutSaveData.push({
              i: gridData[k].i,
              x: pos[j].x,
              y: pos[j].y,
              w: pos[j].w,
              h: pos[j].h,
              // compName: gridData[k].compName, 存储只存一个id，显示时直接查出来，省数据空间
            });
          }
        }
      }
    }
  }
  return newLayoutSaveData;
};

// 获取layout中所有biz组件的id
const getAllIds = (list) => {
  const ids = [];
  if (list && list.length) {
    for (let j = 0; j < list.length; j++) {
      if (list[j] && list[j].i) {
        ids.push(0 + list[j].i);
      }
    }
  }
  return ids;
};

// 整合原始page中存储的layout，和查回来的layout中biz组件的数据
const mergeLayout = (layout, bizComponents) => {
  if (layout && layout.length > 0 && bizComponents && bizComponents.length) {
    for (let j = 0; j < layout.length; j++) {
      if (layout[j]) {
        for (let k = 0; k < bizComponents.length; k++) {
          if (bizComponents[k].id == layout[j].i) {
            layout[j].compName = bizComponents[k].uiComponent;
            layout[j].props = JSON.parse(bizComponents[k].props);
          }
        }
      }
    }
  }
  return [].concat(layout);
};

export default function (params: any) {
  // const [lock, setLock] = useState<boolean>(false);
  const [gridData, setGridData] = useState<any[]>([]);
  // const { data } = useContext(FilterContext);
  // 是否编辑态
  const [isEdit, setIsEdit] = useState(params.edit);
  // 是否显示组件列表
  const [showComponentList, setShowComponentList] = useState(false);
  // 保存布局信息
  const [newLayout, setNewLayout] = useState([]);
  // 保存业务组件列表，只保存单页用于展示选择即可
  const [bizComponentDisplay, setBizComponentDisplay] = useState([]);
  const [total, setTotal] = useState(0); // 业务组件总数
  const [current, setCurrent] = useState(1); // 业务组件当前页码
  const [keywords, setKeywords] = useState(''); // 搜索值
  const [pageData, setPageData] = useState({}); // 页面数据

  const [menuCollapsed, setMenuCollapsed] = useState(1390);
  const layoutRef = useRef(null);

  // 收起组件列表抽屉
  const closeDrawer = useCallback(() => {
    setShowComponentList(false);
  }, []);

  // 点击添加业务组件按钮响应
  const addComponent = useCallback(() => {
    queryBizComponentList({ pageSize: 6, current: 1 }).then((res) => {
      if (res && res.success && res.data) {
        setBizComponentDisplay(setSelect(parseData(res.data), gridData));
        setTotal(res.total);
        setCurrent(1);
      } else {
        message.error('查询组件列表异常!');
      }
    });
    setShowComponentList(true);
  }, [gridData]);

  // 业务组件翻页
  const handlePageChange = useCallback(
    (page) => {
      queryBizComponentList({ pageSize: 6, current: page, keywords }).then((res: any) => {
        if (res.success && res.data && res.data.length > 0) {
          setBizComponentDisplay(setSelect(parseData(res.data), gridData));
          setTotal(res.total);
          setCurrent(page);
        } else {
          message.error('查询组件列表异常!');
        }
      });
    },
    [gridData],
  );

  // 搜索业务组件
  const handleSearch = useCallback(
    (newkeywords) => {
      queryBizComponentList({ pageSize: 8, current: 1, searchWord: newkeywords }).then(
        (res: any) => {
          if (res.success && res.data && res.data.length > 0) {
            setBizComponentDisplay(setSelect(parseData(res.data), gridData));
            setTotal(res.total);
            setCurrent(1);
            setKeywords(newkeywords);
          } else {
            message.error('查询组件列表异常!');
          }
        },
      );
    },
    [gridData],
  );

  // 添加选中元素，选中元素添加后最好是不要再出现了，展示列表时筛选禁用掉已选的
  const addNewItem = useCallback(
    (item) => {
      if (item.select) {
        message.error('该组件已近添加过了！');
        return;
      }
      // 简单获取最大的y，x取值0，来布局新添加的元素，后续可以考虑优化一下
      const maxY = getMaxY(gridData);
      const dynamicComp = dynamic(
        () => import(`../../../components/DynamicComp/${item.uiComponent}`),
      );

      let props = {};
      try {
        props = JSON.parse(item.props);
      } catch (error) {
        console.log('解析item props出错, ', error);
      }

      gridData.push({
        i: '' + item.id, // 业务组件元素不能重复
        x: 0,
        y: maxY,
        w: item.colWidth || 2,
        h: item.rowHeight || 2,
        minH: item.rowHeight || 2,
        maxH: item.rowHeight || 2,
        compName: item.uiComponent,
        comp: dynamicComp,
        ...props,
      });

      // 添加到界面中
      const temp = [].concat(gridData);

      setGridData(temp);

      // 刷新抽屉中元素选中态
      item.select = true;
      setBizComponentDisplay([].concat(bizComponentDisplay));
    },
    [gridData, bizComponentDisplay],
  );

  // 删除组件，需要更新biz组件列表选中状态
  const deleteBizComponent = useCallback(
    (item) => {
      const newList = deleteItem(gridData, item);
      setGridData(newList);
      setBizComponentDisplay(unSelect(bizComponentDisplay, item));
    },
    [gridData, bizComponentDisplay],
  );

  useEffect(() => {
    getPageDetail({ id: params.id })
      .then((res) => {
        if (res && res.success && res.data) {
          // 这里查询时，id需要转一下，因为存的layout是子串
          setPageData(res.data);
          if (res.data.layout) {
            const result = JSON.parse(res.data.layout);
            setNewLayout(result);
            const ids = getAllIds(result);
            if (!ids || ids.length === 0) {
              return;
            }
            getBizComponentsProps({ ids, currIndex: 1, pageSize: 200 })
              .then((resIn) => {
                if (resIn && resIn.success && resIn.data) {
                  const newResult = mergeLayout(result, resIn.data);

                  const dynamicComponents = [...new Set(_map(newResult, 'compName'))];
                  const dynamicObj = {};
                  dynamicComponents.forEach((moduleName) => {
                    // 这里可以用React.lazy替代
                    const dynamicComponent = dynamic({
                      loader: () => import(`../../../components/DynamicComp/${moduleName}`),
                      loading: () => <ProCard loading />,
                    });

                    dynamicObj[moduleName] = dynamicComponent;
                  });

                  const datas = result.map((d) => ({
                    ...d,
                    minH: d.h,
                    maxH: d.h,
                    comp: dynamicObj[d.compName],
                  }));
                  console.log('girdDatas ', datas);
                  setGridData(datas);
                } else {
                  console.log('查询layout 业务组件列表失败.');
                }
              })
              .catch((e) => {
                console.log(e);
              });
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [params.id]);

  const createElement = useCallback(
    (el) => {
      const { i } = el;

      // 这里可以通过Suspense + lazy替代
      return (
        <div key={i} data-grid={el}>
          <GridItem
            gridProps={{ ...el, ...el.props, isEdit }}
            deleteCallBack={() => deleteBizComponent(el)}
          />
        </div>
      );
    },
    [isEdit, deleteBizComponent],
  );

  const layoutChange = useCallback((layout) => {
    // 处理一下，把newlayout里边的UI组件信息补充一下
    setNewLayout(layout);
  }, []);

  useEffect(() => {
    if (layoutRef && layoutRef.current && layoutRef.current?.onWindowResize) {
      layoutRef.current?.onWindowResize();
    }
  }, [menuCollapsed]);

  return (
    <>
      <div className={styles['button-container']}>
        {!isEdit && (
          <EditTwoTone
            style={{ fontSize: 24 }}
            twoToneColor={primaryColor}
            onClick={() => setIsEdit(true)}
            title={'编辑页面'}
          />
        )}
        {isEdit && (
          <CloseSquareTwoTone
            style={{ fontSize: 24, marginLeft: 16 }}
            twoToneColor={primaryColor}
            onClick={() => {
              setIsEdit(false);
              setShowComponentList(false);
            }}
            title={'取消'}
          />
        )}
        {isEdit && (
          <PlusCircleTwoTone
            style={{ fontSize: 24, marginLeft: 16 }}
            twoToneColor={primaryColor}
            onClick={() => addComponent()}
            title={'添加新元素'}
          />
        )}
        {isEdit && (
          <SaveTwoTone
            style={{ fontSize: 24, marginLeft: 16 }}
            twoToneColor={primaryColor}
            onClick={() => {
              setIsEdit(false);
              setShowComponentList(false);
              pageData.layout = JSON.stringify(updatePos([].concat(gridData), newLayout));

              setPageData(pageData);
              updatePageItem(pageData)
                .then((res) => console.log(res))
                .catch((e) => {
                  console.log(e);
                });
              if (params.edit) {
                history.push(`/lowcode/mng/pageMng?timestamp=${new Date().getTime()}`);
              }
            }}
            title={'保存'}
          />
        )}
      </div>
      <ProProvider.Consumer>
        {(value) => {
          setMenuCollapsed(value.menuCollapsed);
          return (
            <ResponsiveGridLayout
              className="layout"
              style={{ width: menuCollapsed ? 'calc(100vw - 48px)' : 'calc(100vw - 210px)' }}
              isBounded={true}
              breakpoints={{ lg: 1200 }}
              cols={{ lg: 6 }}
              rowHeight={190}
              isDraggable={isEdit}
              isResizable={isEdit}
              onLayoutChange={layoutChange}
              ref={layoutRef}
            >
              {gridData.map((data) => createElement(data))}
            </ResponsiveGridLayout>
          );
        }}
      </ProProvider.Consumer>
      <Drawer
        title="添加元素"
        placement="right"
        width={500}
        onClose={closeDrawer}
        visible={showComponentList}
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
              {bizComponentDisplay.map((item) => {
                return (
                  <Card
                    style={{ width: 210, margin: 5 }}
                    onClick={() => addNewItem(item)}
                    title={item.title + `(${item.rowHeight || '-'} x ${item.colWidth || '-'})`}
                    extra={
                      <Popover content={<div>{item.description}</div>}>
                        <InfoCircleOutlined />
                        {item.select && (
                          <StopTwoTone style={{ marginLeft: 8 }} twoToneColor="red" />
                        )}
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
              pageSize={6}
              onChange={(page) => handlePageChange(page)}
              showSizeChanger={false}
            />
          </div>
        </>
      </Drawer>
    </>
  );
}
