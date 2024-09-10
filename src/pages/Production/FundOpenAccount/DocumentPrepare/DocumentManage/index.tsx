import React, { memo, useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { Tree, Space, message, Spin, Upload } from 'antd';
import type { UploadProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { TreeProps } from 'antd/es/tree';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import styles from './index.less';
import Context from '../context';
import DocumentEdit from '../DocumentEdit';
import CheckDocument from '../CheckDocument';
import {
  queryMaterialTree,
  querySeatMaterialTree,
  queryMaterialList,
  querySeatMaterialList,
  previewOpenAccountMaterial,
  previewOpenSeatMaterial,
  uploadReviewFile,
} from '../service';
// import { saveAs } from 'file-saver';

type TableListItem = {
  id: string;
  name: string;
  type: string;
  time: string;
  version: string;
  fileType: number;
  reviewType: number;
  fileUrl: string;
  suffix: string;
  templateName: string;
  reviewData: Boolean;
  statusCode: Number;
};

type ModulProps = {
  id: number;
  isSeat: boolean | undefined;
};

const DocumentManage = (props: ModulProps) => {
  const [showEdit, setShowEdit] = useState(false); // 是否显示 文件表单编辑
  const [showCheck, setShowCheck] = useState(false); // 是否显示 复核弹窗
  const [editId, setEditId] = useState(''); // 编辑id
  const [current, setCurrent] = useState(0); // 当前选中的目录id
  const [treeData, setTreeData] = useState<any>([]); // 树形目录数据
  const [tableData, setTableData] = useState<any>([]); // 表格数据
  const [loading, setLoading] = useState(true); // 是否加载中
  const [tableLoading, setTableLoading] = useState(false); // 是否加载中
  const { id, isSeat } = props;
  const fundId = useContext(Context);
  const queryTree = isSeat ? querySeatMaterialTree : queryMaterialTree;
  const queryList = isSeat ? querySeatMaterialList : queryMaterialList;
  const previewOpenMaterial = isSeat ? previewOpenSeatMaterial : previewOpenAccountMaterial;
  // 预览
  const preview = async (url: string, suffix: string, previewId: string) => {
    if (url == '') {
      message.warning('请先编辑');
      return;
    }
    // if (suffix == 'pdf') {
    //   window.open(url);
    //   return;
    // }
    // 其他类型 转为pdf
    message.info('正在生成预览文件，请稍后...');
    setLoading(true);
    const data = await previewOpenMaterial({ id: previewId });
    setLoading(false);
    if (data) {
      window.open(data);
      return;
    }
    message.warning('预览失败');
  };

  const requestTableData = async (currentTreeId: number) => {
    setTableLoading(true);
    if (!currentTreeId) {
      setTableData([]);
      setTableLoading(false);
      return;
    }
    const result = await queryList({ id, treeId: currentTreeId });
    setTableData(result);
    setTableLoading(false);
  };

  const handleColse = useCallback(
    (key) => {
      setShowEdit(false);
      setShowCheck(false);
      if (key === 'reload') {
        requestTableData(current);
      }
    },
    [current, id],
  );

  // 下载
  const download = (url: string) => {
    if (url == '') {
      message.warning('请先编辑');
      return;
    }
    // if (suffix == 'pdf') {
    //   // pdf下载特殊处理
    //   const oReq = new XMLHttpRequest();
    //   const URLToPDF = url;
    //   oReq.open('GET', URLToPDF, true);
    //   oReq.responseType = 'blob';
    //   oReq.onload = function () {
    //     const file = new Blob([oReq.response], {
    //       type: 'application/pdf',
    //     });
    //     saveAs(file, templateName);
    //   };
    //   oReq.send();
    //   return;
    // }
    window.open(url);
  };

  const uploadProps: UploadProps = useMemo(() => {
    return {
      name: 'multipartFile',
      action: '/object',
      method: 'PUT',
      showUploadList: false,
      onChange: async (info) => {
        if (info.file.status === 'done' && info.file.response.success) {
          const data = await uploadReviewFile({ id: editId, fileUrl: info.file.response.data });
          if (data) message.success(`上传成功`);
          // 刷新表格数据
          handleColse('reload');
        } else if (info.file.status === 'error') {
          message.error(`文件上传失败`);
        }
      },
    };
  }, [editId]);

  const columns: ProColumns<TableListItem>[] = useMemo(() => {
    return [
      {
        dataIndex: 'templateName',
        title: '文档名称',
        width: 200,
        fixed: 'left',
        ellipsis: true,
      },
      {
        dataIndex: 'node',
        title: '文档类型',
        width: 80,
      },
      {
        dataIndex: 'updateTime',
        title: '最近修改时间',
        width: 100,
      },
      {
        dataIndex: 'version',
        title: '版本',
        width: 50,
        render: (text) => 'v' + text,
      },
      {
        dataIndex: 'status',
        title: '状态',
        width: 80,
      },
      {
        title: '操作',
        dataIndex: '',
        valueType: 'option',
        fixed: 'right',
        width: 160,
        render: (text, record) => {
          return (
            <Space>
              <a onClick={() => preview(record.fileUrl, record.suffix, record.id)}>预览</a>
              {
                // fileType为1或4时可编辑
                record.fileType == 1 || record.fileType == 4 ? (
                  <a
                    key="edit"
                    onClick={() => {
                      setShowEdit(true);
                      setEditId(record.id);
                    }}
                  >
                    编辑
                  </a>
                ) : null
              }
              {
                // reviewType为2时可上传 复核用
                record.reviewType === 2 ? (
                  <Upload {...uploadProps}>
                    <a key="upload" onClick={() => setEditId(record.id)}>
                      上传
                    </a>
                  </Upload>
                ) : null
              }
              {
                // reviewType不为0时可复核
                record.reviewType !== 0 && record.statusCode !== 3 ? (
                  <a
                    key="check"
                    onClick={() => {
                      // statusCode 0：待保存  2：复核不通过 提示请先编辑保存。
                      // 1：待复核 可以正常复核
                      // 3：复核通过 不展示
                      if (record.statusCode === 0 || record.statusCode === 2) {
                        message.warning('请先编辑保存');
                        return;
                      }
                      if (record.reviewType === 2 && !record.reviewData) {
                        // reviewData为false时，要先上传。
                        message.warning('请先上传');
                        return;
                      }
                      setShowCheck(true);
                      setEditId(record.id);
                    }}
                  >
                    复核
                  </a>
                ) : null
              }
              <a onClick={() => download(record.fileUrl)}>下载</a>
            </Space>
          );
        },
      },
    ];
  }, [editId]);

  const onSelect: TreeProps['onSelect'] = (selectedKeys) => {
    setCurrent(Number(selectedKeys[0]));
    requestTableData(Number(selectedKeys[0]));
  };

  useEffect(() => {
    (async () => {
      setTreeData([]);
      const result = await queryTree({ id, fundId });
      setLoading(false);
      setCurrent(result?.id);
      setTreeData([result]);
      requestTableData(result?.id);
    })();
  }, [id]);

  return (
    <>
      <Spin spinning={loading}>
        <p>开户材料管理：</p>
        <div className={styles['manage-wrapper']}>
          {treeData && treeData.length > 0 ? (
            <Tree
              className={styles['manage-tree']}
              showLine
              switcherIcon={<DownOutlined />}
              defaultExpandParent
              defaultExpandAll={true}
              height={500}
              onSelect={onSelect}
              treeData={treeData}
              fieldNames={{ title: 'name', key: 'id', children: 'child' }}
              defaultSelectedKeys={[current]}
            />
          ) : (
            '暂无数据'
          )}
          <ProTable<TableListItem>
            className={styles['manage-table']}
            columns={columns}
            rowKey="id"
            scroll={{ x: 800 }}
            loading={tableLoading}
            pagination={false}
            dataSource={tableData}
            toolBarRender={false}
            search={false}
          />
        </div>
        {/* 文件表单编辑 */}
        {showEdit && (
          <DocumentEdit showEdit={showEdit} onClose={handleColse} editId={editId} isSeat={isSeat} />
        )}
        {/* 复核 */}
        <CheckDocument
          showCheck={showCheck}
          onClose={handleColse}
          editId={editId}
          isSeat={isSeat}
        />
      </Spin>
    </>
  );
};

export default memo(DocumentManage);
