import { Input, Tree, Tooltip, Modal } from 'antd';
import { some as _some, pull as _pull } from 'lodash';
import { memo, useCallback, useMemo, useState } from 'react';
import styles from './index.less';

const { Search } = Input;
const { DirectoryTree } = Tree;

const generateList = (datas: []) => {
  const dataList = [];
  const getList = (data: [{ children?: [] }]) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key, title } = node;
      dataList.push({ key, title });
      if (node.children) {
        getList(node.children);
      }
    }
  };
  getList(datas);
  return dataList;
};

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (_some(node.children, (item) => item.key === key)) {
        parentKey = node.key;
        break;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

const SearchTree = ({ treeData, handleChange, checkedKeys, ...restProps }) => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const onExpand = (newExpandedKeys: string[]) => {
    setExpandedKeys(newExpandedKeys);
  };
  const handleSearchChange = (e) => {
    const { value } = e.target;
    const dataList = generateList(treeData);
    if (!value) {
      setExpandedKeys([]);
    } else {
      const newExpandedKeys = dataList
        .map((item) => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, treeData);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      setExpandedKeys(newExpandedKeys);
    }
    setSearchValue(value);
  };

  const addTips = (trees: []) => {
    return trees.map((tree) => ({
      ...tree,
      title: (
        <span className={styles['tree-leaf']}>
          {tree.title}

          {tree.desc ? (
            <span className={styles['tree-leaf-desc']}>
              <Tooltip title={tree.desc}>
              </Tooltip>
            </span>
          ) : null}
        </span>
      ),
      children: tree.children ? addTips(tree.children) : null,
    }));
  };

  const treeList = useMemo(() => {
    if (!searchValue) {
      return addTips(treeData);
    }
    const loop = (data) => {
      const nD = [];
      data.forEach((item) => {
        const strTitle = item.title;
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title = (
          <span>
            {index > -1 ? (
              <span>
                {beforeStr}
                <span className="site-tree-search-value">{searchValue}</span>
                {afterStr}
              </span>
            ) : (
              <span>{item.title}</span>
            )}
          </span>
        );
        if (index > -1) {
          nD.push({
            ...item,
            title,
            isInSearch: index > -1,
            // key: item.key
          });
        } else if (item.children) {
          nD.push({
            ...item,
            title,
            children: loop(item.children),
          });
        }
      });
      return nD;
    };
    const trees = loop(treeData).filter((item) => {
      const { children, isInSearch } = item;
      return isInSearch || (children && children.length >= 1);
    });
    return addTips(trees);
  }, [searchValue, treeData]);

  const handleChecked = useCallback(
    ({ checked, node: { key } }) => {
      if (checked) {
        handleChange([...checkedKeys, key], { checked, key });
      } else {
        const keys = [...checkedKeys];
        _pull(keys, key);
        handleChange(keys, { checked, key });
      }
    },
    [checkedKeys],
  );

  return (
    <>
      <div>
        <Search
          style={{ marginBottom: 8, marginRight: 10, textAlign: 'left', padding: 0 }}
          placeholder="搜索"
          allowClear
          onChange={(e) => handleSearchChange(e)}
        />
        <DirectoryTree
          {...restProps}
          treeData={treeList}
          checkedKeys={checkedKeys}
          expandedKeys={expandedKeys}
          onExpand={onExpand}
          onCheck={(_, ev) => {
            handleChecked(ev);
          }}
        />
      </div>
      <Modal />
    </>
  );
};

export default memo(SearchTree);
