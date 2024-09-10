import { memo, useState, useEffect, useCallback } from 'react';
import ProCard from '@ant-design/pro-card';
import { cardGutter } from '@/themes';
import { Table, Tree, Select } from 'antd';
import { tableEmptyCellRender } from '@/utils/utils';
import { queryFileTypeAll, queryFileInfoList } from './service';
import styles from './index.less';

const columns = [
  {
    title: '文档名称',
    // width: 300,
    ellipsis: true,
    dataIndex: 'fileName',
  },
  {
    title: '流程编号',
    dataIndex: 'processNumber',
  },
  {
    title: '文件类型',
    dataIndex: 'fileTypeName',
  },
  {
    title: '上传人',
    dataIndex: 'uploadPerson',
  },
  {
    title: '上传时间',
    dataIndex: 'uploadTime',
  },
  {
    title: '状态',
    dataIndex: 'fileStatus',
  },
  {
    title: '版本',
    dataIndex: 'versionNumber',
  },
];

// 产品文件柜
function FileCabinet({ fundId }: { fundId: string }) {
  const [fileTypeList, setFileTypeList] = useState<any[]>([]);
  const [fileTypeTree, setFileTypeTree] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);

  const getFileInfoList = useCallback(
    async (keys, pageInfo) => {
      setLoading(true);
      const data = await queryFileInfoList({
        pageNo: pageInfo.current,
        pageSize: pageInfo.pageSize,
        fileType: keys,
        fundId: fundId,
      });
      setLoading(false);
      setDataList(data.dataList || []);
      setPagination((preState) => {
        return {
          ...preState,
          current: data.pageNum || 1,
          total: data.total || 0,
        };
      });
    },
    [fundId],
  );

  useEffect(() => {
    (async () => {
      const data = await queryFileTypeAll();
      setFileTypeTree(data || []);
      setFileTypeList(() => {
        return data.reduce((prev: any, cur: any) => {
          const { list, ...other } = cur;
          if (Array.isArray(list)) {
            return prev.concat(other).concat(list);
          }
          return prev.concat(other);
        }, []);
      });
    })();
    getFileInfoList([], pagination);
  }, []);

  // 文件选择改变
  const handleTypeChange = useCallback(
    (keys) => {
      setSelectedType(keys);
      getFileInfoList(keys, { ...pagination, current: 1 });
    },
    [pagination],
  );

  // 分页改变
  const handlePageChange = useCallback(
    (pageInfo) => {
      getFileInfoList(selectedType, pageInfo);
    },
    [selectedType],
  );

  // 删除选中
  const handleCancleSelect = useCallback(
    (value) => {
      const keys = selectedType.filter((key) => key !== value);
      setSelectedType(keys);
      getFileInfoList(keys, { ...pagination, current: 1 });
    },
    [selectedType, pagination],
  );

  // 清空选中
  const handleClear = useCallback(() => {
    setSelectedType([]);
    getFileInfoList([], { ...pagination, current: 1 });
  }, []);

  return (
    <ProCard style={{ marginTop: 8 }} gutter={cardGutter} ghost>
      <ProCard colSpan={6} style={{ height: '100%' }} bordered size="small">
        <Select
          style={{ width: '100%', marginBottom: 8 }}
          className={styles['select-wrap']}
          mode="tags"
          allowClear
          value={selectedType}
          options={fileTypeList}
          optionLabelProp="typeName"
          fieldNames={{
            label: 'typeName',
            value: 'id',
          }}
          open={false}
          onClear={handleClear}
          onDeselect={handleCancleSelect}
        />
        <Tree
          checkable
          selectable={false}
          fieldNames={{
            title: 'typeName',
            key: 'id',
            children: 'list',
          }}
          className={styles['tree-wrap']}
          checkedKeys={selectedType}
          onCheck={handleTypeChange}
          treeData={fileTypeTree}
        />
      </ProCard>
      <ProCard colSpan={18} bordered className={styles['table-wrap']}>
        <Table
          rowKey="id"
          size="small"
          loading={loading}
          bordered={false}
          columns={tableEmptyCellRender(columns as any)}
          dataSource={dataList}
          pagination={pagination}
          onChange={handlePageChange}
          scroll={{ x: 'max-content' }}
        />
      </ProCard>
    </ProCard>
  );
}

export default memo(FileCabinet);
