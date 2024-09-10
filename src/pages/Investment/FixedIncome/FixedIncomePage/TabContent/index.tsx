import type { FormInstance } from 'antd';
import type { TemplateItem, Pagination } from '../data';
import { useState, useRef, useEffect } from 'react';
import { message } from 'antd';
import ProTable from '@ant-design/pro-table';
import ProCardPlus from '@/components/ProCardPlus';
import { ExportExcelComponent } from '@/components/thfund-front-component/src';
import moment from 'moment';

import { queryInfoList, queryTemplateDetail } from '../service';
import { tableEmptyCellRender } from '@/utils/utils';
import styles from './index.less';

// const getAllValue = (values) => {
//   const result = [];
//   if (values && values.length) {
//     values.forEach((option) => {
//       if (option) {
//         result.push(option.entityValue);
//       }
//     });
//   }
//   return result;
// };

const getParamDefine = (key, originParams) => {
  if (originParams && originParams.length > 0 && key) {
    for (let i = 0; i < originParams.length; i++) {
      if (originParams[i] && originParams[i].paramCode === key) {
        return originParams[i];
      }
    }
  }
  return null;
};

const getParamValue = (key, value, originParams) => {
  const itemDefine = getParamDefine(key, originParams);
  if (itemDefine) {
    if (itemDefine.paramType === 'select' && itemDefine.ifMulti === 'Y') {
      if (value && value.length > 1) {
        return value.join(',');
      } else if (value && value.length === 1) {
        return value[0];
      } else {
        return null;
      }
    } else if (itemDefine.paramType === 'date' && itemDefine.paramFormat) {
      return moment(value).format(itemDefine.paramFormat);
    }
  }
  return value || '';
};

const TableView: React.FC = (props: any) => {
  const formRef = useRef<FormInstance>();
  const [templateId] = useState(props.templateId);
  const [tableId] = useState('thStableProfitTable' + props.templateId);
  const [tableColumns, setColumns] = useState([]);
  const [originParams, setOriginParams] = useState([]);
  const [downloadColumns, setDownloadColumns] = useState([]);
  const [downloadName] = useState(props.downloadName);

  useEffect(() => {
    queryTemplateDetail({ modelId: templateId })
      .then((res) => {
        if (
          res &&
          res.success &&
          res.data &&
          res.data.paramList &&
          res.data.paramList.length &&
          res.data.columnList &&
          res.data.columnList.length
        ) {
          const paramList = res.data.paramList.sort((a, b) => {
            return a.orderIndex - b.orderIndex;
          });
          const columnList = res.data.columnList.sort((a, b) => {
            return a.orderIndex - b.orderIndex;
          });
          const columnDownload = [];
          const columns = [];
          paramList.forEach((item) => {
            if (item) {
              let formItemProps = undefined;
              if (item.ifRequired === 'Y') {
                formItemProps = {
                  rules: [
                    {
                      required: true,
                      message: '此项为必填项',
                    },
                  ],
                };
              }
              let optionRequest = undefined;
              if (item.optionalValues) {
                optionRequest = async () => {
                  const options = [];
                  item.optionalValues.forEach((option) => {
                    if (option) {
                      options.push({
                        value: option.entityKey,
                        label: option.entityValue,
                      });
                    }
                  });
                  return options;
                };
              }
              let initialValue = undefined;
              if (item.defaultValues) {
                if (item.paramType === 'select' && item.ifMulti === 'Y') {
                  initialValue = item.defaultValues;
                } else {
                  initialValue = item.defaultValues && item.defaultValues[0];
                }
              }
              let fieldProps = undefined;
              if (item.ifMulti === 'Y') {
                fieldProps = {
                  mode: 'multiple',
                  // dropdownRender: (menu: any) => {
                  //   return (
                  //     <div>
                  //       {menu}
                  //       <Divider style={{ margin: '4px 0' }} />
                  //       <Button
                  //         type="link"
                  //         style={{ width: '100%', textAlign: 'left' }}
                  //         onClick={() => {
                  //           formRef?.current?.setFieldsValue({
                  //             [item.paramCode]: getAllValue(item.optionalValues),
                  //           });
                  //         }}
                  //       >
                  //         全选
                  //       </Button>
                  //     </div>
                  //   );
                  // },
                };
              }
              if (item.paramType === 'select') {
                if (fieldProps) {
                  fieldProps.showSearch = true;
                  fieldProps.maxTagCount = 3;
                } else {
                  fieldProps = {
                    showSearch: true,
                    maxTagCount: 3,
                  };
                }
              }
              const columnParam = {
                title: item.paramName,
                dataIndex: item.paramCode,
                valueType: item.paramType,
                formItemProps,
                request: optionRequest,
                initialValue,
                fieldProps,
                hideInTable: true,
              };
              columns.push(columnParam);
            }
          });

          columnList.forEach((item1) => {
            if (item1) {
              const listColumn = {
                title: item1.dataTitle,
                dataIndex: item1.dataIndex,
                search: false,
                ellipsis: true,
              };
              columns.push(listColumn);
              columnDownload.push(listColumn);
            }
          });

          setDownloadColumns(columnDownload);
          setOriginParams(paramList);
          setColumns(columns);
        } else {
          message.error(res.message || '查询模型数据有问题！');
        }
      })
      .catch((e) => console.log(e));
  }, [templateId]);

  // 下载文件
  const downloadFile = async () => {
    const paramList: any[] = [];
    const p = formRef.current?.getFieldsValue();
    if (p) {
      for (const key in p) {
        if (key !== 'current' && key !== 'pageSize') {
          paramList.push({
            paramCode: key,
            qryValues: getParamValue(key, p[key], originParams),
          });
        }
      }
    }

    const params: any = {
      modelId: templateId,
      pageIndex: 1,
      pageSize: 50000,
      paramList,
    };

    const res = await queryInfoList(params);
    if (res.success) {
      if (res.data && res.data.length > 0) {
        return { ...res, result: res.data };
      } else {
        message.info('查询条件下没有可导出数据！');
      }
    } else {
      message.error('查询失败' + res.message);
    }
    return { ...res, result: res.data };
  };

  return (
    <ProCardPlus ghost className={styles.demoCard}>
      <ProTable
        id={tableId}
        formRef={formRef}
        size="small"
        options={false}
        onReset={() => {}}
        rowKey="id"
        manualRequest={true}
        search={{
          defaultCollapsed: false,
          optionRender: (searchConfig, formProps, dom) => {
            return [
              dom && dom[1],
              <ExportExcelComponent
                title={downloadName}
                exportName="下载"
                data={downloadFile}
                columns={downloadColumns}
                tableId={tableId}
              />,
              ,
            ];
          },
        }}
        request={async (p: TemplateItem & Pagination) => {
          const paramList: any[] = [];
          if (p) {
            for (const key in p) {
              if (key !== 'current' && key !== 'pageSize') {
                paramList.push({
                  paramCode: key,
                  qryValues: getParamValue(key, p[key], originParams),
                });
              }
            }
          }
          const params: any = {
            modelId: templateId,
            pageIndex: p.current,
            pageSize: p.pageSize,
            paramList,
          };

          const res = await queryInfoList(params);
          if (!res.success) {
            message.error(res.message || '查询业务数据出错！');
          }
          return res;
        }}
        columns={tableEmptyCellRender(tableColumns as any)}
        pagination={{
          pageSize: 20,
        }}
        form={{
          ignoreRules: false,
        }}
        scroll={{ x: 'max-content' }}
      />
    </ProCardPlus>
  );
};

export default TableView;
