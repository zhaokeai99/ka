import { Space, Table, Tooltip } from 'antd';
import { includes as _includes, remove as _remove } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import TagLabelModal from '../TagLabelModal';
import styles from './index.less';

// path 后期会有调整
const openUrlMap = {
  URL_FUND: '/production/index/newDetail/',
  URL_FUND_MANAGER: '/production/fundManager/',
  URL_FUND_CORP: '/production/fundCompany/',
};

const IndexTable: React.FC = ({
  data,
  searchParams,
  searcherType,
  pageInfo,
  onChange,
  loading,
  handleFundPkList,
  newResultTags,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pkFundList, setPkFundList] = useState<React.Key[]>([]);
  const [tagData, setTagData] = useState(null);

  const onSelectChange = useCallback(
    (record: any, selected: boolean) => {
      const newRowKeys = [...selectedRowKeys];
      const newPkList = [...pkFundList];

      const { code } = record;
      if (!code) {
        return;
      }
      if (!selected) {
        _remove(newRowKeys, (i) => i === record?.code);
        _remove(newPkList, (i) => i?.code === record?.code);
      } else {
        newRowKeys.push(record?.code);
        newPkList.push(record);
      }

      setSelectedRowKeys(newRowKeys);
      setPkFundList(newPkList);
    },
    [selectedRowKeys],
  );

  useEffect(() => {
    handleFundPkList([]);
    setSelectedRowKeys([]);
    setPkFundList([]);
  }, [searchParams]);

  useEffect(() => {
    handleFundPkList(pkFundList || []);
  }, [pkFundList]);

  const isRowDisabled = useCallback(
    (code) => {
      return _includes(selectedRowKeys, code) || selectedRowKeys.length < 5;
    },
    [selectedRowKeys],
  );

  const getLinkDoms = (texts: string, contents: string, showType: string) => {
    const textList = (texts || '').split(',');
    const contentList = (contents || '').split(',');
    return (
      <Space size={0} split={<a>,</a>}>
        {textList.map((text: string, index: number) => {
          return (
            <a href={`/#${openUrlMap[showType]}${contentList[index]}`} rel="noopener noreferrer">
              {text}
            </a>
          );
        })}
      </Space>
    );
  };

  const oprateColumns = [
    {
      title: '操作',
      fixed: 'right',
      render: (_, record) => (
        <Space size={20}>
          <a
            onClick={() => {
              if (isRowDisabled(record.code)) {
                onSelectChange(record, !_includes(selectedRowKeys, record.code));
              }
            }}
          >
            {selectedRowKeys.length >= 5 && !_includes(selectedRowKeys, record.code) ? (
              <Tooltip placement="leftTop" title={'达到对比上限（最多5项）'}>
                <span style={{ color: '#aaa' }}> 加入对比 </span>
              </Tooltip>
            ) : _includes(selectedRowKeys, record.code) ? (
              <span style={{ color: '#F27C49' }}>取消对比</span>
            ) : (
              <span>加入对比</span>
            )}
          </a>
          <a
            onClick={() => {
              setTagData(record);
            }}
          >
            打标
          </a>
        </Space>
      ),
    },
  ];

  const [columns, setColumns] = useState(oprateColumns);
  const getColumns = (results: any) => {
    const heads = [];
    results.forEach((result: any) => {
      const {
        supportResult: { content, showType, sorter, disabled },
        colDesc,
        colName,
        selfType,
        extInfo,
      } = result;
      // 年度收益率
      if (selfType == 1 || selfType === 2) {
        extInfo?.valueList?.forEach((valueResult) => {
          const { startYear, endYear, yearString } = valueResult;
          const head = {
            title: yearString ? `${colDesc}(${yearString})` : colDesc,
            dataIndex: `${colName}_${startYear}_${endYear}`,
            key: colName,
            sorter: sorter || false,
            render: (text: string, record: {}) => {
              return (
                <span style={{ color: record[`${colName}_${startYear}_${endYear}_color`] }}>
                  {' '}
                  {text || '--'}{' '}
                </span>
              );
            },
            fixed: disabled ? 'left' : '-',
          };
          heads.push(head);
        });
      } else {
        const head = {
          title: colDesc,
          dataIndex: colName,
          key: colName,
          sorter: sorter || false,
          render: (text: string, record: {}) => {
            if (showType && openUrlMap[showType] && text) {
              return getLinkDoms(text, record[content], showType);
            }
            return <span style={{ color: record[colName + '_color'] }}> {text || '--'} </span>;
          },
          fixed: disabled ? 'left' : '-',
        };
        heads.push(head);
      }
    });
    return heads;
  };
  useEffect(() => {
    const newColumns = getColumns(searchParams?.results || []);
    setColumns([...newColumns]);
  }, [searchParams?.results]);

  useEffect(() => {
    if (!!newResultTags?.length) {
      const newColumns = getColumns(newResultTags);
      setColumns([...newColumns]);
    }
  }, [newResultTags]);

  // const rowSelection = useMemo(() => {
  //   return {
  //     hideSelectAll: true,
  //     selectedRowKeys,
  //     onSelect: onSelectChange,
  //     selections: [Table.SELECTION_NONE],
  //     getCheckboxProps: (record) => ({ disabled: !isRowDisabled(record.code) }),
  //   };
  // }, [selectedRowKeys]);

  return (
    <>
      <Table
        rowKey="code"
        size="small"
        className={styles['index-table']}
        columns={[...columns, ...oprateColumns]}
        dataSource={data}
        // rowSelection={rowSelection}
        style={{ backgroundColor: '#fff', padding: 12 }}
        scroll={{ x: 'max-content' }}
        pagination={{
          ...pageInfo,
          showSizeChanger: true,
          showTotal: (totalNum: any) => `共 ${totalNum} 条数据`,
        }}
        onChange={onChange}
        loading={loading}
      />
      <TagLabelModal
        data={tagData}
        searcherType={searcherType}
        closeModal={() => setTagData(null)}
      />
    </>
  );
};

export default IndexTable;
