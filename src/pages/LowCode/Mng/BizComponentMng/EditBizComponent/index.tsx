import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { FormInstance } from 'antd';
import { Button, message } from 'antd';
import { history } from 'umi';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { getItemDetail, addItem, updateItem } from '../service';
import { queryUIComponentList } from '../../UIComponentMng/service';
import UIListDlg from './UIListDlg';
import PropEdit from './PropEdit';

import styles from './index.less';

const EditDlg: React.FC<any> = () => {
  const formRef = useRef<FormInstance>();
  const id = history.location.query?.id;
  const type = history.location.query?.type;
  // 显示选择UI组件对话框
  const [showChooseUI, setShowChooseUI] = useState(false);
  // 设置选中UI元素
  const [selectItem, setSelectItem] = useState({});
  // 保存更新的props值
  const [propValues, setPropValues] = useState({});
  // // 更新老版本内容
  // const [lastVersion, setLastVersion] = useState('');

  useEffect(() => {
    if (type === 'edit') {
      if (id) {
        getItemDetail({ id })
          .then((res) => {
            if (res.success && res.data) {
              if (formRef && formRef.current) {
                formRef.current.setFieldsValue({
                  ...res.data,
                });
              }
              queryUIComponentList({
                pageSize: 8,
                current: 1,
                searchWord: res.data.uiComponent,
              })
                .then((resIn: any) => {
                  if (resIn.success && resIn.data && resIn.data.length > 0 && resIn.data[0]) {
                    console.log('resIn.data[0] ', resIn.data[0]);
                    setSelectItem(resIn.data[0]);
                  } else {
                    message.error('查询UI组件列表异常!');
                  }
                })
                .catch((e) => {
                  console.log(e);
                });
              setPropValues(JSON.parse(res.data.props));
              // setLastVersion(res.data.props);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  }, [type, id]);

  // 显示选择UI弹框
  const handleSelectUI = useCallback(() => {
    setShowChooseUI(true);
  }, []);

  // 收起UI选择框
  const handleCloseSelectUI = useCallback(() => {
    setShowChooseUI(false);
  }, []);

  // 点击选中一个UI组件
  const handleSelectOne = useCallback((item) => {
    setSelectItem(item);
    handleCloseSelectUI();
    if (formRef && formRef.current) {
      formRef.current.setFieldsValue({
        uiComponentId: item.id,
        uiComponent: item.componentName,
      });
    }
  }, []);

  console.log('render edit ', propValues, selectItem);
  return (
    <div style={{ background: 'white', padding: 20 }}>
      <h1>{type === 'edit' ? '编辑业务组件' : '新建业务组件'}</h1>
      <ProForm
        formRef={formRef}
        onFinish={async (values) => {
          const params = { ...values, props: JSON.stringify(propValues) };

          if (type === 'edit') {
            params.id = id;
          }

          const result = type === 'edit' ? await updateItem(params) : await addItem(params);
          history.push(`/lowcode/mng/bizComponentMng?timestamp=${new Date().getTime()}`);
          return result.success;
        }}
        layout={'horizontal'}
        submitter={{
          render: (props) => {
            return [
              <Button
                type="primary"
                key="rest"
                style={{ marginLeft: '1200px' }}
                onClick={() =>
                  history.push(`/lowcode/mng/bizComponentMng?timestamp=${new Date().getTime()}`)
                }
              >
                取消
              </Button>,
              <Button
                type="primary"
                key="submit"
                style={{ marginLeft: '20px' }}
                onClick={() => {
                  props.form?.submit?.();
                }}
              >
                提交
              </Button>,
            ];
          },
        }}
      >
        <div className={styles['container']}>
          <ProForm.Group>
            <ProFormText
              label="标题"
              name="title"
              placeholder="中文名字，展示提示"
              rules={[{ required: true, message: '请录入组件中文名字!' }]}
            />
            <ProFormText
              label="描述"
              name="description"
              placeholder="组件描述信息"
              rules={[{ required: true, message: '请录入一些组件描述!' }]}
            />
            <ProFormText
              label="关键词"
              name="keywords"
              placeholder="搜索用，英文逗号分割"
              rules={[{ required: true, message: '请录入一些关键词方便搜索!' }]}
            />

            <ProFormText
              label="类目"
              name="category"
              placeholder="英文类目信息便与分类"
              rules={[{ required: true, message: '请录入类目!' }]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormText
              label="业务组件ID"
              name="moduleId"
              disabled={type === 'edit'}
              placeholder="英文字母加下划线格式"
              rules={[{ required: true, message: '请录入英文字母加下划线格式ID!' }]}
            />
            <ProFormText
              label="缩略图"
              name="imgUrl"
              placeholder="缩略图URL"
              rules={[{ required: true, message: '请录入组件缩略图!' }]}
            />
            <ProFormText
              label="所属应用"
              name="app"
              placeholder="所属应用名"
              rules={[{ required: true, message: '请录入所属应用!' }]}
            />
            <ProFormText
              label="UI组件ID"
              name="uiComponentId"
              placeholder="UI组件ID"
              disabled
              rules={[{ required: true, message: '请选择UI组件!' }]}
            />
            <ProFormText
              label="UI组件名称"
              name="uiComponent"
              placeholder="UI组件名称"
              disabled
              rules={[{ required: true, message: '请选择UI组件!' }]}
            />
          </ProForm.Group>
          <Button type="primary" disabled={type === 'edit'} onClick={() => handleSelectUI()}>
            选择UI组件
          </Button>
          <div className={styles['edit-props-area']}>
            <div className={styles['preview']}>
              <img style={{ width: '100%', height: '100%' }} src={selectItem.imgUrl}></img>
            </div>
            <div
              style={{
                width: 320,
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                alignItems: 'flex-end',
                paddingTop: 10,
              }}
            >
              <PropEdit
                updateSchema={(key, value) => {
                  propValues[key] = value;
                  console.log('new propValues ', propValues);
                  setPropValues({ ...propValues });
                }}
                editData={propValues}
                currentDescription={selectItem.props ? JSON.parse(selectItem.props) : []}
              />
            </div>
          </div>
          {showChooseUI && (
            <UIListDlg
              visible={showChooseUI}
              handleCancel={handleCloseSelectUI}
              chooseUIItem={(item) => {
                handleSelectOne(item);
              }}
            ></UIListDlg>
          )}
        </div>
      </ProForm>
    </div>
  );
};

export default EditDlg;
