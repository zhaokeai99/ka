import { Button, Empty, Form, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { familyTree, unique, flatTree } from '../service';
import { findIndex as _findIndex } from 'lodash';
import { CloseOutlined } from '@ant-design/icons';
interface LabelProps {
  fieldArr: any[];
  treeData: any[] | null;
  setField: any;
  getIfRenewel: any;
  getData: any;
  getTableInfo: any;
  tableInfoJson: any;
  ifRenewel: boolean;
  date: string;
  field: any;
}
interface partitionsCur {
  tableColumnName: string | number | readonly string[] | undefined;
  alias: string;
  tableName: string;
  dataColumn: string;
  dataType: string;
  dataValue: string;
}
const SelectedLabel = ({
  getIfRenewel,
  ifRenewel,
  fieldArr,
  field,
  getData,
  getTableInfo,
  setField,
  treeData,
  tableInfoJson,
  date,
}: LabelProps) => {
  const [inputValue, setInputValue] = useState('');
  const [inputColumn, setInputColumn] = useState('');
  const [tableInfo, setTableInfo] = useState<any[]>([]);
  const [data, setData] = useState<any[]>(tableInfoJson);
  const [inputTitle, setInputTitle] = useState('');

  //tableInfoJson
  useEffect(() => {
    setTableInfo((prev) => {
      let info: any[] = [];

      info = fieldArr?.map((item) => {
        let tagId = '';
        field.forEach((i) => {
          if (i?.tableName === item?.tableName) {
            tagId = i.tagId;
          }
        });
        const value: any = familyTree(treeData, item?.tagId || tagId);
        return {
          dataColumn: item?.columnName || item?.dataColumn,
          paramName: item?.alias,
          alias: item?.alias,
          dataType: item?.columnAttributeType,
          dataValue: date,
          tableName: value?.tableName || item.tableName,
          tableColumnName: value?.name || item.tableColumnName,
        };
      });

      const index = _findIndex(prev, { dataColumn: inputColumn, tableName: inputTitle });
      if (index !== -1 && prev?.length) {
        prev[index].dataValue = inputValue;
        info = [...prev];
        if (!ifRenewel) {
          setInputColumn('');
        }
        return info;
      }
      info?.map((item) => {
        prev?.forEach((cur) => {
          const i = _findIndex(info, { dataColumn: cur.dataColumn, tableName: cur.tableName });
          if (item.dataColumn === cur.dataColumn && item.tableName === cur.tableName) {
            info[i] = item;
          }
        });
      });
      return info;
    });
  }, [fieldArr, treeData, inputColumn, inputValue, date, field]);

  useEffect(() => {
    getData(data);
    getTableInfo(tableInfo);
  }, [tableInfo, data, date]);

  // 标签数据
  useEffect(() => {
    setData(unique(tableInfo));
  }, [fieldArr, tableInfo, inputColumn, inputValue, date]);

  // 返回分区字段
  useEffect(() => {
    if (tableInfoJson) {
      if (field?.tableName) {
        const newTableInfo = flatTree(
          tableInfoJson.map((item) => {
            let tagId = '';
            field.map((i) => {
              if (i?.tableName === item?.tableName) {
                tagId = i.tagId;
              }
            });
            const value: any = familyTree(treeData, item?.tagId || tagId);
            return {
              ...item,
              tableColumnName: value.tableColumnName,
            };
          }) || [],
        );
        setTableInfo(newTableInfo);
        setField(newTableInfo);
      }
    }
  }, [tableInfoJson, field, date]);

  // 删除已选分区字段
  const handleDeleteTable = (cur: partitionsCur, paramData: any[]) => {
    const j = _findIndex(paramData, { tableName: cur.tableName });
    const k = _findIndex(paramData[j]?.partitions, { dataColumn: cur.dataColumn });
    if (paramData[j]?.tableName === 't_data_bond_subject') {
      message.warn('此标签是必选项无法删除');
      return;
    } else {
      paramData[j]?.partitions?.splice(k, 1);
    }
    if (!paramData[j]?.partitions?.length) {
      paramData.splice(j, 1);
    }
    const newData = flatTree(paramData || []);
    setTableInfo(newData);
    setField(newData);
    setData(paramData);
  };

  if (!data.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <>
      {data?.map((item) => {
        return item?.partitions?.map((cur: partitionsCur) => {
          return (
            <Input.Group style={{ width: '100%' }} compact>
              <Form.Item style={{ width: '18%' }}>
                <Input value={cur.tableColumnName} disabled />
              </Form.Item>
              <Form.Item style={{ width: '15%' }}>
                <Input value={cur.alias} disabled />
              </Form.Item>
              <Form.Item style={{ width: '15%' }}>
                <Input value={cur.dataType} disabled />
              </Form.Item>
              <Form.Item style={{ width: '47%' }}>
                <Input
                  value={cur.dataValue}
                  onChange={(e) => {
                    setInputColumn(cur.dataColumn);
                    setInputTitle(cur.tableName);
                    setInputValue(e.target.value);
                    getIfRenewel(true);
                  }}
                />
              </Form.Item>
              <Form.Item style={{ width: '5%', margin: '0 auto' }}>
                <Button icon={<CloseOutlined />} onClick={() => handleDeleteTable(cur, data)} />
              </Form.Item>
            </Input.Group>
          );
        });
      })}
    </>
  );
};

export default SelectedLabel;
