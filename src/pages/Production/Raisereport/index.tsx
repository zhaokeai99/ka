import React, { useRef, useState, useCallback, useMemo, MutableRefObject } from 'react';
import { Space, Button, Drawer, AutoComplete, Input, FormInstance, Select } from 'antd';
import { SearchOutlined, DownOutlined, UpOutlined, CloseOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import ProCardPlus from '@/components/ProCardPlus';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Link } from 'umi';
import getColumn from './columns';
import EffectBasic from './component/EffectBasic';
import Instructions from './component/Instructions';
import Investor from './component/Investors';
import type { IndexRaisereportItem } from './data';
import {
  queryRaisereportList,
  fetchAllEffectData,
  queryFilingReport,
  queryInvestorsDesReport,
  queryCVRReport,
} from './service';
import { cardGutter, contentPadding } from '@/themes';
import styles from './index.less';

const { Option } = Select;
const Raisereport: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const tableFormRef: MutableRefObject<FormInstance | undefined> = useRef();
  const [type, setType] = useState<number>(0);
  const [issponsor, setIssponsor] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [disData, setDisData] = useState<any>([]);
  const [instructionsData, setInstructionsData] = useState<any>({});
  const [investorData, setInvestorData] = useState<any>({});
  const [sponsorData, setSponsorData] = useState<any>([]);
  const [raiseData, setRaiseData] = useState<any>([]);
  const [investorList, setInvestorList] = useState<any>([]);
  const [verificationData, setVerificationData] = useState<any>([]);
  const [searchValue, setSearchValue] = useState('');
  const [collapsed, setCollapsed] = useState(true);

  const handleClick = useCallback((v: number, i: boolean, index: string) => {
    if (v === 1) {
      (async () => {
        const [basicData, sponsordData, raisedData] = await fetchAllEffectData({ fundCode: index });
        setDisData(basicData?.basicData);
        setSponsorData(sponsordData?.sponsordData);
        setRaiseData(raisedData?.raisedData);
      })();
    }

    if (v === 2) {
      (async () => {
        const { data } = await queryFilingReport({ fundCode: index });
        setInstructionsData(data);
      })();
    }

    if (v === 3) {
      (async () => {
        const { data } = await queryInvestorsDesReport({ fundCode: index });
        setInvestorData(data);
        setInvestorList(data?.investorOrgDetailList);
      })();
    }

    if (v === 4) {
      (async () => {
        const { data } = await queryCVRReport({ fundCode: index });
        setVerificationData(data ?? []);
      })();
    }

    setDrawerVisible(true);
    setType(v);
    setIssponsor(i);
  }, []);

  const columns: ProColumns<IndexRaisereportItem>[] = [
    {
      title: '基金代码',
      dataIndex: 'fundCode',
      width: '80px',
      search: false,
    },
    {
      title: '基金简称',
      dataIndex: 'fundShortName',
      hideInSearch: true,
      render: (_: any, v: any) => <Link to={`/production/index/detail/${v?.id}`}>{_}</Link>,
    },
    {
      title: '合同生效日',
      dataIndex: 'contractBeginDate',
      hideInSearch: true,
    },
    {
      title: '基金管理人',
      dataIndex: 'assetManager',
    },
    {
      title: '基金托管人',
      dataIndex: 'trustee',
    },
    {
      title: '是否发起式',
      dataIndex: 'sponsored',
      valueType: 'select',
      valueEnum: {
        true: { text: '是' },
        false: { text: '否' },
      },
      render: (_, record) => {
        return <span>{record?.sponsored ? '是' : '否'}</span>;
      },
    },
    {
      title: '产品经理',
      dataIndex: 'productManager',
    },
    {
      title: '只看我的',
      key: 'myFocus',
      hideInTable: true,
      dataIndex: 'direction',
      renderFormItem: () => {
        return (
          <Select allowClear>
            <Option value={true}>是</Option>
            <Option value={false}>否</Option>
          </Select>
        );
      },
    },
    {
      title: '相关报告',
      dataIndex: 'releaseReport',
      hideInSearch: true,
      render: (_, record) => (
        <Space size="large">
          <Button
            type="link"
            style={{ padding: 0, border: 0 }}
            onClick={() => handleClick(1, record?.sponsored, record?.fundCode)}
          >
            生效公告
          </Button>
          <Button
            type="link"
            style={{ padding: 0, border: 0 }}
            onClick={() => handleClick(2, false, record?.fundCode)}
          >
            备案请示
          </Button>
          <Button
            type="link"
            style={{ padding: 0, border: 0 }}
            onClick={() => handleClick(3, false, record?.fundCode)}
          >
            投资者情况说明
          </Button>
          <Button
            type="link"
            style={{ padding: 0, border: 0 }}
            onClick={() => handleClick(4, false, record?.fundCode)}
          >
            验资报告
          </Button>
        </Space>
      ),
    },
  ];

  const sponsoredColumns = [
    {
      title: '管理人类别',
      dataIndex: 'holderType',
    },
    {
      title: '持有份额总数',
      dataIndex: 'holderShare',
    },
    {
      title: '持有份额占总份额比例',
      dataIndex: 'holderShareRatio',
    },
    {
      title: '发起份额数',
      dataIndex: 'launchShare',
    },
    {
      title: '发起份额占基金总份额比例',
      dataIndex: 'launchShareRatio',
    },
  ];
  const investorColumns = [
    {
      title: '机构与超过20%个人客户姓名',
      dataIndex: 'investorName',
    },
    {
      title: '认购的基金份额',
      dataIndex: 'totalShare',
    },
    {
      title: '占基金总份额比例',
      dataIndex: 'shareRatioPercent',
    },
  ];
  const handleChangeVal = () => {
    tableFormRef?.current?.submit();
  };
  const renderTitle = useMemo(
    () => (
      <>
        <AutoComplete
          allowClear
          style={{ margin: '12px 0' }}
          filterOption={false}
          onClear={() => {
            setSearchValue('');
          }}
          onChange={(val: any) => setSearchValue(val)}
          value={searchValue}
        >
          <Input
            style={{ width: '480px' }}
            placeholder="基金代码/名称/维护人 模糊搜索"
            size="large"
            onPressEnter={() => handleChangeVal()}
          />
        </AutoComplete>
        <Button
          size="large"
          style={{ marginLeft: '12px' }}
          type="primary"
          icon={<SearchOutlined />}
          onClick={() => handleChangeVal()}
        >
          搜索
        </Button>
      </>
    ),
    [searchValue],
  );

  return (
    <ProCardPlus ghost style={{ padding: contentPadding }} direction="column">
      <ProCard
        ghost
        title={renderTitle}
        size="small"
        style={{ marginBottom: collapsed ? 12 : 1 }}
        className={
          collapsed
            ? styles['raisereport-form-title-container-collapsed']
            : styles['raisereport-form-title-container']
        }
        extra={
          <Button
            type="primary"
            onClick={() => {
              setCollapsed(!collapsed);
            }}
          >
            高级筛查
            {collapsed ? (
              <DownOutlined style={{ fontSize: 12 }} />
            ) : (
              <UpOutlined style={{ fontSize: 12 }} />
            )}
          </Button>
        }
        gutter={[0, cardGutter]}
      >
        <ProTable<IndexRaisereportItem>
          size="small"
          scroll={{ x: 'max-content' }}
          actionRef={actionRef}
          formRef={tableFormRef}
          rowKey="id"
          search={{
            collapseRender: false,
            collapsed,
            className: collapsed ? styles.hide : styles.show,
            labelWidth: 120,
          }}
          request={(params) =>
            queryRaisereportList({ ...params, keyword: searchValue, pageNo: params.current })
          }
          columns={columns}
          pagination={{
            pageSize: 10,
          }}
          options={{
            density: false,
          }}
        />
      </ProCard>
      <Drawer
        placement="bottom"
        size="default"
        closeIcon={null}
        visible={drawerVisible}
        extra={<CloseOutlined onClick={() => setDrawerVisible(false)} />}
      >
        {(type === 1 || type === 4) && (
          <>
            {type === 1 && <EffectBasic data={disData} />}
            <ProTable
              rowKey={(row) => row.fundName}
              scroll={{ x: 'max-content' }}
              columns={getColumn(type)}
              headerTitle={false}
              search={false}
              options={false}
              dataSource={type === 1 ? raiseData : verificationData}
              pagination={false}
            />
          </>
        )}
        {type === 2 && <Instructions data={instructionsData} />}
        {type === 3 && <Investor data={investorData} />}
        {type === 1 && issponsor && (
          <ProTable
            rowKey={(row) => row.dataIndex}
            scroll={{ x: 'max-content' }}
            columns={sponsoredColumns}
            headerTitle={false}
            search={false}
            options={false}
            dataSource={sponsorData}
            pagination={false}
          />
        )}
        {type === 3 && (
          <ProTable
            rowKey={(row) => row.dataIndex}
            scroll={{ x: 'max-content' }}
            columns={investorColumns}
            headerTitle={false}
            search={false}
            options={false}
            dataSource={investorList}
            pagination={false}
          />
        )}
      </Drawer>
    </ProCardPlus>
  );
};

export default Raisereport;
