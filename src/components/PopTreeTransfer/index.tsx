import { CloseCircleOutlined } from '@ant-design/icons';
import { Tag, Tooltip, Modal } from 'antd';
import { find as _find, cloneDeep as _cloneDeep, remove as _remove } from 'lodash';
import React, { memo, useCallback, useEffect, useState } from 'react';
import styles from './index.less';
import SearchTree from './SearchTree';
import MultiTabs from './MultiTabs';
interface TreeTransferProps {
  dataSource?: any[];
  onChange: () => void;
  onClose?: () => void;
  children: any;
  selectTags?: any[];
  schemeEmpty?: boolean;
}

const PopTreeTransfer: React.FC<TreeTransferProps> = ({
  dataSource,
  onChange,
  onClose,
  children,
  selectTags,
  schemeEmpty,
}) => {
  const [treeData, setTreeData] = useState([]);
  const [checkedKeys, setSelectedKeys] = useState([]);
  const [checkedTags, setCheckedTags] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (dataSource && dataSource.length >= 1) {
      const treeList = [];
      dataSource.forEach(
        ({ colCategoryDesc, colCategory, colName, noRemove, colDesc, ...rest }) => {
          const a = _find(treeList, ({ id }) => id === colCategory);
          if (a) {
            a.children.push({
              key: colName,
              id: colName,
              title: colDesc,
              colDesc,
              ...rest,
              disabled: noRemove,
            });
          } else {
            treeList.push({
              id: colCategory,
              key: colCategory,
              title: colCategoryDesc,
              checkable: false,
              children: [
                {
                  id: colName,
                  key: colName,
                  title: colDesc,
                  colDesc,
                  ...rest,
                  disabled: noRemove,
                },
              ],
            });
          }
        },
      );
      setTreeData(treeList);
    }
  }, [dataSource]);

  useEffect(() => {
    const keys = (selectTags || []).map((i) => i.colName);
    setSelectedKeys(keys);
  }, [selectTags]);

  useEffect(() => {
    const tagList = selectTags
      ?.map((tag) => {
        const cTag = _find(dataSource, ({ colName }) => colName === tag.colName);
        if (cTag) {
          return {
            ...tag,
            colDesc: cTag.colDesc,
          };
        }
      })
      .filter((t) => !!t);
    setCheckedTags(tagList);
  }, [selectTags, dataSource]);

  // 选择标签
  const handleChange = (_: any, { checked, key }) => {
    const newTags = _cloneDeep(checkedTags);
    // 新增
    if (checked) {
      const addTag = _find(dataSource, ({ colName }) => colName === key);
      newTags?.push({ ...addTag });
    } else {
      _remove(newTags, ({ colName }) => colName === key);
    }
    onChange(newTags);
  };

  const deleteColItem = useCallback(
    (colItem) => {
      const tagList = (checkedTags || []).filter((d) => {
        return d !== colItem;
      });
      onChange(tagList);
    },
    [checkedTags],
  );

  const updateMultiColItem = (colItem) => {
    const tagList = checkedTags ? [...checkedTags] : [];
    const { colName, extInfo } = colItem || {};
    const tag = _find(tagList, ({ colName: id }) => id === colName);
    tag.extInfo = extInfo;
    onChange(tagList);
  };

  const renderTag = (tagData, index) => {
    const { colDesc, noRemove, colName, selfType } = tagData || {};
    if (selfType === 1 || selfType === 2) {
      return (
        <MultiTabs
          key={`${index}-${colName}`}
          data={tagData}
          onChange={updateMultiColItem}
          deleteTag={deleteColItem}
        />
      );
    }
    return (
      <div key={`${index}-${colName}`} className={styles['tag-container']}>
        <Tag className={styles['tag']}>{colDesc}</Tag>
        {!noRemove ? (
          <span
            className={styles['delete-icon']}
            onClick={() => {
              deleteColItem(tagData);
            }}
          >
            <CloseCircleOutlined />
          </span>
        ) : null}
      </div>
    );
  };

  const onCloseMadal = () => {
    setVisible(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      <div onClick={() => setVisible(true)}>{children}</div>
      <Modal
        title=""
        width={600}
        visible={visible}
        maskClosable
        onCancel={onCloseMadal}
        footer={null}
      >
        <div className={styles['tree-container']}>
          <SearchTree
            treeData={treeData}
            className={styles['tree-style']}
            handleChange={handleChange}
            checkedKeys={checkedKeys}
            multiple={true}
            checkable
            selectable={false}
            expandAction="click"
            showIcon={false}
          />
          <div className={styles['tree-slider']}>
            <div className={styles['tag-title']}>
              已选中
              {schemeEmpty ? (
                <Tooltip title="当前查询方案，列展示项为空，此处为默认展示">
                </Tooltip>
              ) : null}
            </div>
            <div className={styles['tag-list']}>
              {checkedTags ? checkedTags.map((tagData, index) => renderTag(tagData, index)) : null}
            </div>
          </div>
        </div>
      </Modal>
      {/* <Modal
        visible={ visible }
        onCancel={onCloseMadal}
        // onOk={() => onConfirm()}
      >

      </Modal> */}
    </>
  );
};

export default memo(PopTreeTransfer);
