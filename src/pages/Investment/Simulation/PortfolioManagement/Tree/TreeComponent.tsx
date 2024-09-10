import { Button, Form, Input, message, Modal, Tree } from 'antd';
import React, { memo, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import {
  MpRsPortfolioFacadeAdd,
  MpRsPortfolioFacadeMyPortfolio,
  MpRsPortfolioFacadeQueryByPage,
} from '../service';
import lodash from 'lodash';
import {
  ApartmentOutlined,
  AppstoreAddOutlined,
  AppstoreOutlined,
  HomeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import AddForm from '@/pages/Investment/Simulation/PortfolioManagement/Portfolio/add';
import moment from 'moment';
import '../index.less';

const { DirectoryTree } = Tree;

interface ModalProps {
  onSelect: (keys: any[], info: any) => void;
  dicMap: { domain: []; benchmark: [] };
  cRef: any;
  isHide: boolean;
  onRefresh: () => void;
  checkJumpUrlParam: any;
}

const TreeComponent = (props: ModalProps) => {
  const { dicMap, onSelect, cRef, isHide, onRefresh, checkJumpUrlParam } = props;
  const [treeDate, setTreeDate] = useState<any>([]);
  const [fatherKeys, setFatherKeys] = useState<any>([]);
  const [son, setSon] = useState<any>([]);
  const [selectedKeys, setSelectedKeys] = useState<any>([]);

  const [expandedKeys, setExpandedKeys] = useState<any>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [dataList] = useState<any[]>([]);

  const [showAdd, setShowAdd] = useState<any>(false);
  const [addForm] = Form.useForm();

  const [treeHeight, setTreeHeight] = useState<number>(document.body.clientHeight - 240);
  const [showOrHide, setShowOrHide] = useState<boolean>(true);

  const expendTreeNodeAll = (data: any) => {
    const newExpend: any = [];
    data?.map((d: any) => {
      if (d.children !== undefined && d.children?.length > 0) {
        newExpend.push(...expendTreeNodeAll(d.children));
      } else {
        newExpend.push(d.key);
      }
    });
    return newExpend;
  };
  //展开全部树
  const expendTreeAll = (data: any) => {
    setExpandedKeys(expendTreeNodeAll(data));
    setAutoExpandParent(true);
  };

  const treeCreate = async (param?: any) => {
    let tDate = [];
    {
      const treeNode = {
        title: '我的组合',
        key: 'id',
        children: [],
        orderBy: 1,
        icon: <HomeOutlined />,
      };
      const params = { status: '1', sortField: 'bmCode', sortOrder: 'asc', ...param };
      const result = await MpRsPortfolioFacadeMyPortfolio(params);
      const children = result.map((item: any) => {
        return {
          title: item.mpName,
          code: item.mpCode,
          key: 'mp_' + item.mpCode,
          data: item,
          fatherNode: { title: '我的组合', key: 'id' },
          icon: <AppstoreOutlined />,
        };
      });
      treeNode.children = children;
      tDate.push(treeNode);
    }
    await Promise.all(
      dicMap?.domain.map(async (item: any) => {
        const params = {
          domain: item.value,
          isPublic: '1',
          status: '1',
          sortField: 'mpCode',
          sortOrder: 'asc',
          ...param,
        };
        const result = await MpRsPortfolioFacadeQueryByPage(params);
        const children = result.data.map((d: any) => {
          return {
            title: d.mpName,
            code: d.mpCode,
            key: item.value + '_' + d.mpCode,
            data: d,
            fatherNode: { title: item.label, key: item.value },
            icon: <AppstoreOutlined />,
          };
        });
        const treeNode = {
          title: item.label,
          key: item.value,
          children: children,
          orderBy: 2,
          icon: <ApartmentOutlined />,
        };
        tDate.push(treeNode);
      }),
    );
    tDate = lodash.sortBy(tDate, ['orderBy', 'key']);
    setTreeDate(tDate);
    expendTreeAll(tDate);
  };

  useEffect(() => {
    // 加截
    treeCreate();
  }, [dicMap?.domain]);

  //更新
  useImperativeHandle(cRef, () => ({
    // 更新树
    refresh: () => {
      treeCreate();
    },
  }));

  // 监听resize
  useEffect(() => {
    function onResize() {
      const h = document.body.clientHeight;
      setTreeHeight(h - 240);
    }

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const generateList = (data: any) => {
    for (let i = 0; i < data?.length; i++) {
      const node = data[i];
      const { title, code, key } = node;
      dataList.push({ title, code, key });
      if (node.children) {
        generateList(node.children);
      }
    }
  };
  useEffect(() => {
    generateList(treeDate);
  }, [treeDate]);

  const treeSelect = (e: any[], info: any) => {
    if (e?.length > 0 && JSON.stringify(info?.node?.fatherNode) !== '{}') {
      setFatherKeys([info?.node?.fatherNode?.key]);
      setSon(e);
      setSelectedKeys(e);
    } else {
      setFatherKeys([]);
      setSon({});
      setSelectedKeys([]);
    }
    onSelect(e, info);
  };

  const onExpand = (newExpandedKeys: any) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const getParentKey = (value: any, tree: any): React.Key => {
    let parentKey: React.Key;
    for (let i = 0; i < tree?.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item: any) => item.title === value)) {
          parentKey = node.key;
        } else if (node.children.some((item: any) => item.code === value)) {
          parentKey = node.key;
        } else if (getParentKey(value, node.children)) {
          parentKey = getParentKey(value, node.children);
        }
      }
    }
    return parentKey!;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e?.target;

    if (!value) {
      setSearchValue('');
    }
    treeCreate({ searchValue: value });

    const newExpandedKeys = dataList
      .map((item: any) => {
        if (item?.title?.indexOf(value) > -1) {
          return getParentKey(item.title, treeDate);
        } else if (item?.code?.indexOf(value) > -1) {
          return getParentKey(item.code, treeDate);
        }
        return null;
      })
      .filter((item: any, i: any, self: any) => item && self.indexOf(item) === i);
    setExpandedKeys(newExpandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const loop = (data: any) => {
    return data.map((item: any) => {
      const strTitle = item.title as string;
      const strCode = item.code as string;

      const index = strTitle?.indexOf(searchValue);
      const indexCode = strCode?.indexOf(searchValue);

      const beforeStr = strTitle.substring(0, index);
      const afterStr = strTitle.slice(index + searchValue?.length);
      const title =
        searchValue && index > -1 ? (
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          )
        ) : searchValue && indexCode > -1 ? (
          indexCode > -1 ? (
            <span>
              <span style={{ color: '#f50' }}>{strTitle}</span>
            </span>
          ) : (
            <span>{strTitle}</span>
          )
        ) : (
          <span>{strTitle}</span>
        );

      if (item.children) {
        return { ...item, title, key: item.key, children: loop(item.children) };
      }

      return {
        ...item,
        title,
        key: item.key,
      };
    });
  };

  // 新增保存
  const addSave = useCallback(async () => {
    const values = await addForm?.validateFields();
    if (values.beginDate !== undefined) {
      values.beginDate = moment(values.beginDate).format('YYYYMMDD');
    }
    if (values.endDate !== undefined) {
      values.endDate = moment(values.endDate).format('YYYYMMDD');
    }
    if (values.startMoney !== undefined) {
      values.startMoney = values.startMoney * 10000;
    }
    if (values?.investPool !== undefined) {
      values.investPool = values?.investPool?.join(',');
    }
    values.status = '1';
    const { success } = await MpRsPortfolioFacadeAdd(values);
    if (success) {
      message.success('保存成功');
      setShowAdd(false);
      onRefresh();
      return;
    }
  }, [addForm]);

  useEffect(() => {
    if (JSON.stringify(checkJumpUrlParam) != '{}') {
      const { e, jumpInfo } = checkJumpUrlParam;
      setSelectedKeys(e);
      treeSelect(e, jumpInfo);
    }
  }, [checkJumpUrlParam, treeDate]);

  const renderTitle = (nodeData: any) => {
    return (
      <span
        style={{
          display: 'inline-flex',
          width: '100px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >
        {nodeData?.title}
      </span>
    );
  };

  if (isHide) return null;
  return (
    <ProCard
      style={{ height: '100%' }}
      headStyle={{ marginTop: 13 }}
      title={'组合列表'}
      extra={
        <>
          <Button
            type="text"
            onClick={() => setShowAdd(true)}
            title={'新增组合'}
            icon={<AppstoreAddOutlined />}
          />
          &nbsp;&nbsp;
          <Button
            type="text"
            onClick={() => setShowOrHide(!showOrHide)}
            title={showOrHide ? '隐藏组合搜索' : '显示组合搜索'}
            icon={<SearchOutlined />}
          />
        </>
      }
    >
      <div>
        {showOrHide && (
          <Input
            placeholder="请搜索组合"
            style={{ marginBottom: 10 }}
            prefix={<SearchOutlined />}
            onChange={onChange}
            allowClear
            value={searchValue}
          />
        )}
        <DirectoryTree
          height={treeHeight}
          showIcon
          onSelect={treeSelect}
          treeData={loop(treeDate)}
          titleRender={renderTitle}
          defaultExpandedKeys={fatherKeys}
          defaultSelectedKeys={son}
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          defaultExpandAll={true}
          selectedKeys={selectedKeys}
        />
      </div>
      <Modal
        title="新增组合"
        visible={showAdd}
        onOk={addSave}
        onCancel={() => setShowAdd(false)}
        width="800px"
        destroyOnClose={true}
      >
        <AddForm form={addForm} dicMap={dicMap} />
      </Modal>
    </ProCard>
  );
};
export default memo(TreeComponent);
