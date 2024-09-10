import React, { useEffect, useState } from 'react';
import { Button, Modal, Spin, Switch } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import {
  autoFundMarksSync,
  queryFundIndexSolution,
  querySchemEcho,
  saveAutoMark,
} from '../service';
import { Link } from 'umi';
import ProCard from '@ant-design/pro-card';
import AutoMarkingModal from './AutoMarkingModal';
import './index.less';

type PropsType = {
  params: {
    markId: any;
    markType: any;
  };
};

// 基金索引和标签的 type 类型暂无法统一
const mapToIndex = {
  FUND: 'FUND',
  MANAGER: 'FUND_MANAGER',
  COMPANY: 'FUND_CORP',
};

const relation = {
  OR: '或',
  AND: '且',
  NON: '非',
};

const AutoMarking = (props: PropsType) => {
  const { params } = props;
  const [switchStatus, setSwitchStatus] = useState(false); // 自动打标开关
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isMarkOwer, setIsMarkOwer] = useState(false);
  const [echoObj, setEchoObj] = useState<any>({});
  const [planOpt, setPlanOpt] = useState<any[]>([]);

  // 自动打标-保存方案查询
  const querySchem = async () => {
    setLoading(true);
    const res = await querySchemEcho({ markId: params.markId });
    setLoading(false);
    setSwitchStatus(res?.isAuto === 0);
    setIsMarkOwer(res?.isMarkOwer);
    setEchoObj(res);
  };

  // 查询配置方案
  const querySolution = async () => {
    const data = await queryFundIndexSolution({
      searcherType: mapToIndex[params.markType || 'FUND'],
    });
    setPlanOpt(data || []);
  };

  useEffect(() => {
    querySchem();
    querySolution();
  }, [params, visible]);

  // 自动打标-标题布局
  const autoTitle = () => (
    <div style={{ display: 'flex' }}>
      <span>自动打标</span>
      <Switch
        style={{ margin: '0 12px' }}
        checkedChildren="开"
        unCheckedChildren="关"
        checked={switchStatus}
        onChange={async (val: any) => {
          const res = await saveAutoMark({
            markId: params.markId,
            isAuto: val ? 0 : 1, // 自动打标：0：是，1：否
          });

          if (res?.success) {
            setSwitchStatus(val);
          }
        }}
        disabled={!isMarkOwer}
      />
      <div>
        <EditOutlined style={{ color: '#387bfb' }} />
        <Link to={`/production/summary/hotFundIndex/_single_/${params.markType}`}>
          去修改我的方案
        </Link>
      </div>
    </div>
  );

  // 关闭弹窗
  const onClose = (val: any) => {
    setVisible(false);
    if (val === 'RELOAD') {
      querySchem();
      Modal.confirm({
        title: '保存成功',
        content: '是否立即执行~',
        okText: '立即执行',
        cancelText: '取消',
        onOk: async () => {
          const res = await autoFundMarksSync({ markIds: [params.markId] });

          if (res?.success) {
            Modal.info({
              title: '执行中...',
              content: (
                <div>
                  数据更新需要
                  <span style={{ color: '#E64552' }}>10-15分钟</span>
                  ，请稍后~
                  <br />
                  <span style={{ color: '#E64552' }}>切勿重复提交呦！</span>
                </div>
              ),
            });
          }
        },
      });
    }
  };

  return (
    <ProCard title={autoTitle()}>
      <Spin spinning={loading}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <span>自动打标方案：</span>
          <div className="auto-marking-relation">
            {echoObj?.schemesName ? (
              <div style={{ marginBottom: '8px' }} className="auto-marking-tag">
                {echoObj.schemesName}
              </div>
            ) : (
              <span className="auto-marking-tag-empty">暂无配置方案</span>
            )}
            {echoObj?.schemes?.map((i: any) => (
              <div style={{ marginBottom: '8px' }}>
                <span>&nbsp;{relation[i.relation]}&nbsp;</span>
                <span className="auto-marking-tag">{i.schemesName}</span>
              </div>
            ))}
          </div>
        </div>
        <Button
          disabled={!isMarkOwer}
          style={{ display: 'flex', marginLeft: 'auto', marginRight: '0' }}
          type="primary"
          onClick={() => setVisible(true)}
        >
          配置方案
        </Button>
      </Spin>
      <AutoMarkingModal
        visible={visible}
        onClose={onClose}
        params={params}
        echoValue={echoObj}
        planList={planOpt}
      />
    </ProCard>
  );
};

AutoMarking.isProCard = true;

export default AutoMarking;
