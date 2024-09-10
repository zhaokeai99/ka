import ProCardPlus from '@/components/ProCardPlus';
import { Empty, Spin } from 'antd';
import { map as _map } from 'lodash';
import { useEffect, useState } from 'react';
import TextExtra from '../../Components/TitleExtra';
import LineChart from '../LineChart';
import { fundManagerTrendChart } from '../service';
import './index.less';

type PropsType = {
  codes: any;
};

const CustomerPreferences = (props: PropsType) => {
  const { codes } = props;
  const [loading, setLoading] = useState(false);
  const [institutionData, setInstitutionData] = useState([]);
  const [personalData, setPersonalData] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await Promise.all([
        fundManagerTrendChart({
          codeList: _map(codes, 'code'),
          colName: 'institution_user_proportion', // 机构用户占比
        }),
        fundManagerTrendChart({
          codeList: _map(codes, 'code'),
          colName: 'personal_user_proportion', // 个人用户占比
        }),
      ]);
      setLoading(false);
      setInstitutionData(result[0] || []);
      setPersonalData(result[1] || []);
    })();
  }, [codes]);

  return (
    <ProCardPlus
      title="客户喜好"
      extra={<TextExtra id="hobbies" />}
      direction="column"
      gutter={[0, 10]}
    >
      <ProCardPlus title="机构用户占比" bordered>
        <div className="pk-customer-preferences-empty-style">
          {loading ? (
            <Spin tip="加载中..." />
          ) : institutionData.length ? (
            <LineChart data={institutionData} type="RATIO" />
          ) : (
            <Empty />
          )}
        </div>
      </ProCardPlus>
      <ProCardPlus title="个人用户占比" bordered>
        <Spin tip="加载中..." spinning={loading}>
          <div className="pk-customer-preferences-empty-style">
            {personalData.length ? <LineChart data={personalData} type="RATIO" /> : <Empty />}
          </div>
        </Spin>
      </ProCardPlus>
    </ProCardPlus>
  );
};

CustomerPreferences.isProCard = true;

export default CustomerPreferences;
