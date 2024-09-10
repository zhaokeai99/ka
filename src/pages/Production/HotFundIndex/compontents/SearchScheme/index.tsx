import { SettingOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { SvgIcon } from '@/components/thfund-front-component/src';
import { Button, Divider, message, Modal, Popconfirm, Select, Space, Tooltip } from 'antd';
import { find as _find, get as _get } from 'lodash';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { history } from 'umi';
import { deleteSolution, hitSolution, querySolution, saveSolution } from '../../service';
import ProgrammeSetting from '../ProgrammeSetting';
import ShareModal from './ShareModal';

import styles from './index.less';
export type schemeProps = {
  callback?: any;
  allFilterData?: any[];
  allShowData?: any[];
  searcherType?: string;
  params?: any[];
  results?: any[];
  isEidt?: Boolean;
  initSchemeId?: string;
};

const SearchScheme: React.FC<any> = ({
  callback,
  allFilterData,
  allShowData,
  searcherType,
  params,
  results,
  isEidt,
  initSchemeId, // 传入方案id只用于初次加载
}) => {
  // 方案
  const [schemes, setSchemes] = useState<any[]>([]);
  const [currentScheme, setCurrentScheme] = useState<{
    label: string;
    value: string;
    canDel?: boolean;
    edit?: number;
  } | null>(null);
  const [schemeData, setSchemeData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [shareModalVisible, setShareModalVisible] = useState(false);

  // 控制方案管理弹出
  const showModal = () => {
    setIsModalOpen(true);
  };

  // 查询已保存的方案列表
  const querySolutionInfo = async () => {
    const data = await querySolution({ searcherType });
    setSchemeData(data);
  };

  // 取消
  const handleCancel = () => {
    querySolutionInfo();
    setIsModalOpen(false);
  };
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    querySolutionInfo();
  }, []);

  // 回复初始值
  const handleInitReset = useCallback(() => {
    setCurrentScheme(null);
    callback(
      {
        params: allFilterData.filter((d) => d?.supportQuery?.isChecked),
        results: allShowData.filter((d) => d?.supportResult?.isChecked),
      },
      false,
    );
  }, [allShowData, allFilterData]);

  // 选择方案
  const handleSchemeChange = (scheme) => {
    if (!scheme) {
      handleInitReset();
    } else {
      const selectScheme = schemeData.find(({ id }) => id === scheme.value);
      setCurrentScheme({ ...scheme, edit: selectScheme?.edit, canDel: !selectScheme?.delete });
      const paramList = _get(selectScheme, 'searchModel.params', []);
      const resultList = _get(selectScheme, 'searchModel.results', []);
      const finalData: any[] = [];

      paramList.forEach((param) => {
        const data = allFilterData.find((d) => d.colName === param.colName);
        finalData.push({
          ...data,
          extInfo: param?.extInfo || data?.extInfo,
          value: param.value,
        });
      });
      const finalResults: any[] = [];
      resultList.forEach((param) => {
        const data = allShowData.find((d) => d.colName === param.colName);
        finalResults.push({
          ...data,
          extInfo: param?.extInfo || data?.extInfo,
          value: param.value,
        });
      });
      callback(
        {
          params: finalData,
          results: finalResults,
        },
        true,
      );
      // 点击查询方案  上报用于排序
      hitSolution({ id: scheme.value, name: scheme.label });
    }
  };

  useEffect(() => {
    const schemeOpts = (schemeData || []).map(({ id, name }) => ({
      label: name,
      value: id,
      key: id,
    }));
    setSchemes(schemeOpts);
    if (firstLoad && schemeOpts.length >= 1) {
      const scheme = initSchemeId
        ? _find(schemeOpts, (i) => i?.value === initSchemeId) || schemeOpts[0]
        : schemeOpts[0];
      handleSchemeChange(scheme);
      setFirstLoad(false);
    }
  }, [schemeData]);

  const onSave = async (values) => {
    const { success, errorMsg } = await saveSolution({
      searchModel: {
        params,
        results,
      },
      searcherType,
      ...values,
    });

    if (success) {
      message.success(isEidt ? `方案【${values.name}】保存成功` : `新增方案【${values.name}】成功`);
      // 刷新列表
      querySolutionInfo();
    } else {
      message.error(errorMsg || '请求失败');
    }
    return { success };
  };

  const handleSave = async () => {
    await onSave({ id: currentScheme?.value, name: currentScheme?.label });
  };
  const addNew = async ({ schemeName }) => {
    const { success } = await onSave({ name: schemeName });
    return success;
  };

  // 删除方案
  const handleDelete = async () => {
    const { success, errorMsg } = await deleteSolution({
      id: currentScheme?.value,
    });
    if (success) {
      message.success('删除成功');
      // 刷新列表
      querySolutionInfo();
      handleInitReset();
    } else {
      message.error(errorMsg || '删除失败');
    }
  };

  const renderBtn = () => {
    const btnList = [];
    if (currentScheme) {
      btnList.push(
        <Button
          size="small"
          disabled={!!currentScheme?.edit || !isEidt}
          onClick={() => handleSave()}
        >
          保存
        </Button>,
      );
    }

    btnList.push(
      <ModalForm
        title="新建方案"
        layout="horizontal"
        trigger={
          <Button id="fund_index_save_btn" size="small">
            {schemes && schemes.length >= 1 ? '另存为' : '新增'}
          </Button>
        }
        autoFocusFirstInput
        modalProps={{ destroyOnClose: true }}
        onFinish={(values) => addNew(values)}
      >
        <ProFormText width="md" name="schemeName" label="方案名称" rules={[{ required: true }]} />
      </ModalForm>,
    );
    btnList.push(<Divider style={{ marginRight: '0', marginLeft: '0' }} type="vertical" />);
    return btnList;
  };

  const renderSchemeList = useCallback(() => {
    if (!schemes || schemes.length <= 0) {
      return null;
    }
    const bestSchemes: any[] = [],
      restSchemes: any[] = [];
    schemes.forEach((scheme, index) => {
      if (index <= 2) {
        bestSchemes.push(scheme);
      } else {
        restSchemes.push(scheme);
      }
    });
    return (
      <div>
        {bestSchemes.map((scheme, index) => {
          return currentScheme?.value === scheme?.value ? (
            <span
              className={styles['checked-best']}
              key={`${scheme?.value}-${index}`}
              onClick={() => {
                handleSchemeChange(null);
              }}
            >
              {scheme.label}
            </span>
          ) : (
            <span
              className={styles['best-scheme']}
              key={`${scheme?.value}-${index}`}
              onClick={() => {
                handleSchemeChange(scheme);
              }}
            >
              {scheme.label}
            </span>
          );
        })}
        {restSchemes && restSchemes.length >= 1 ? (
          <Select
            // 如果选中的是最优方案 下拉框需要置空
            value={
              !!_find(restSchemes, (i) => i?.value === currentScheme?.value) ? currentScheme : null
            }
            bordered={false}
            labelInValue
            placeholder="更多"
            className={styles['more-schemes']}
            dropdownStyle={{ minWidth: '120px' }}
            onChange={handleSchemeChange}
            options={restSchemes}
            allowClear
          />
        ) : null}
      </div>
    );
  }, [schemes, currentScheme]);

  const renderIcon = useCallback(() => {
    return [
      currentScheme && currentScheme.value && !!currentScheme?.canDel ? (
        <Popconfirm
          title="您确定要删除改方案么？"
          okText="确定"
          cancelText="取消"
          onConfirm={handleDelete}
        >
          <Tooltip placement="top" title="删除">
            <span>
              <SvgIcon.Delete />
            </span>
          </Tooltip>
        </Popconfirm>
      ) : null,
      <Tooltip placement="top" title="去云图">
        <span
          onClick={() =>
            history.push(
              `/marketing/app/CloudMapApplication?searcherType=${searcherType}&solution=${
                currentScheme?.value || ''
              }`,
            )
          }
        >
          <SvgIcon.Cloud />
        </span>
      </Tooltip>,
      currentScheme && currentScheme.value && currentScheme.label ? (
        <Tooltip placement="top" title="分享方案">
          <span onClick={() => setShareModalVisible(true)}>@</span>
        </Tooltip>
      ) : null,
      <Tooltip placement="top" title="方案管理">
        <span className={styles['iconSize']} onClick={showModal}>
          <SettingOutlined style={{ color: 'rgba(0,0,0,.85)' }} />
        </span>
      </Tooltip>,
    ];
  }, [schemes, currentScheme]);

  return (
    <div>
      <span style={{ color: 'rgba(0,0,0,0.85)', fontWeight: 'bold', marginRight: 20 }}>
        查询方案
      </span>
      <Space>
        {renderSchemeList()}
        {renderBtn()}
        {renderIcon()}
      </Space>
      <Modal
        title="方案管理"
        visible={isModalOpen}
        centered
        footer={false}
        destroyOnClose={true}
        width={1000}
        onCancel={handleCancel}
      >
        <ProgrammeSetting searcherType={searcherType} />
      </Modal>
      <ShareModal
        visible={!!currentScheme && shareModalVisible}
        searcherType={searcherType}
        setVisible={setShareModalVisible}
        scheme={currentScheme}
      />
    </div>
  );
};

export default memo(SearchScheme);
