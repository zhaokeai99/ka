import React, { useCallback, useState, useEffect } from 'react';
import { Select, DatePicker, Tabs, Tag, Form, Spin } from 'antd';
import moment from 'moment';
import ProCard from '@ant-design/pro-card';
import styles from '../index.less';
import {
  IIndustySearchParams,
  QueryTypeTabKeys,
  PublicSentimentKeys,
  filterParams,
  initStartDate,
  initEndDate,
} from '../data.d';
import EmotionCharts from './EmotionCharts';
import { contentPadding } from '@/themes';
import PopularityCharts from './PopularityCharts';
import { queryTrendChart } from '../service';
interface ITrendCardPropsType {
  params: IIndustySearchParams;
  onChangeParams: (e: IIndustySearchParams) => void;
  total: number | string;
}

interface IChartDataType {
  [QueryTypeTabKeys.EMOTION]: Record<string, any>[];
  [QueryTypeTabKeys.POPULARITY]: Record<string, any>[];
}

const queryTypeTab = {
  [QueryTypeTabKeys.EMOTION]: '情绪',
  [QueryTypeTabKeys.POPULARITY]: '热度',
};

const publicSetimentSelect = {
  [PublicSentimentKeys.BEARISH]: '利空',
  [PublicSentimentKeys.GOOD]: '利好',
  [PublicSentimentKeys.NEUTRAL]: '中性',
};

const { RangePicker }: { RangePicker: any } = DatePicker;

const TrendCard: React.FC<ITrendCardPropsType> & { isProCard: boolean } = ({
  params,
  total,
  onChangeParams,
}) => {
  const [chartData, setChartData] = useState<IChartDataType>({
    emotion: [],
    popularity: [],
  });
  const [queryType, setQueryType] = useState<QueryTypeTabKeys>(QueryTypeTabKeys.EMOTION);
  const [loading, setLoading] = useState<boolean>(false);

  const disabledDate = useCallback((current: any) => {
    return current && (current < moment('2020-01-01') || current > moment().subtract(0, 'days'));
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const newParams = filterParams(params);
      if (!(Reflect.has(newParams, 'industryId') && Reflect.has(newParams, 'industryName'))) {
        setLoading(false);
        return;
      }
      const [emotionData, popularityData] = await Promise.all([
        queryTrendChart({
          ...newParams,
          queryType: QueryTypeTabKeys.EMOTION,
        }),
        queryTrendChart({
          ...newParams,
          queryType: QueryTypeTabKeys.POPULARITY,
        }),
      ]);
      if (emotionData?.success) {
        setChartData((prevData) => {
          return {
            ...prevData,
            emotion: emotionData?.data ?? [],
          };
        });
      } else {
        setChartData((prevData) => {
          return {
            ...prevData,
            emotion: [],
          };
        });
      }
      if (popularityData?.success) {
        setChartData((prevData) => {
          return {
            ...prevData,
            popularity: popularityData?.data ?? [],
          };
        });
      } else {
        setChartData((prevData) => {
          return {
            ...prevData,
            popularity: [],
          };
        });
      }
      setLoading(false);
    })();
  }, [params]);

  const onFormValuesChange = useCallback(
    async (values) => {
      if (Reflect.has(values, 'date')) {
        const startDate = values.date?.[0]?.format('yyyy-MM-DD 00:00:00');
        const endDate = values.date?.[1]?.format('yyyy-MM-DD 23:59:59');
        onChangeParams({
          startDate: startDate ?? '',
          endDate: endDate ?? '',
        });
      } else if (Reflect.has(values, 'publicSentiment')) {
        //不能以中文为键值
        const key = values['publicSentiment'];
        onChangeParams({
          publicSentiment: publicSetimentSelect?.[key],
        });
      } else {
        onChangeParams({
          ...values,
        });
      }
    },
    [params],
  );

  const onTabsChange = useCallback(
    (e) => {
      setQueryType(e);
    },
    [params],
  );

  const extralEle = (
    <Form
      layout="inline"
      className={styles['trend-search-form']}
      onValuesChange={onFormValuesChange}
      initialValues={{
        date: [initStartDate, initEndDate],
      }}
    >
      <Form.Item name="publicSentiment">
        <Select placeholder="请选择情绪" size="small" allowClear style={{ minWidth: 120 }}>
          {Object.keys(publicSetimentSelect).map((item) => {
            return (
              <Select.Option key={item} value={item}>
                {publicSetimentSelect[item]}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item name="date" style={{ marginRight: 0 }}>
        <RangePicker size="small" picker={'date'} disabledDate={disabledDate} />
      </Form.Item>
    </Form>
  );

  return (
    <Spin spinning={loading}>
      <ProCard
        ghost
        size="small"
        extra={extralEle}
        bodyStyle={{
          paddingTop: 0,
          paddingLeft: contentPadding,
          paddingRight: contentPadding,
          paddingBottom: contentPadding,
        }}
      >
        <Tabs
          size="small"
          onChange={onTabsChange}
          activeKey={queryType}
          tabBarExtraContent={<Tag color="geekblue">共{total ?? 0}条数据</Tag>}
        >
          {Object.keys(queryTypeTab).map((item) => {
            return (
              <Tabs.TabPane
                tab={queryTypeTab[item]}
                key={item}
                style={{
                  minHeight: 255,
                }}
              >
                {item === QueryTypeTabKeys.EMOTION && <EmotionCharts data={chartData?.emotion} />}
                {item === QueryTypeTabKeys.POPULARITY && (
                  <PopularityCharts data={chartData?.popularity} />
                )}
              </Tabs.TabPane>
            );
          })}
        </Tabs>
      </ProCard>
    </Spin>
  );
};

TrendCard.isProCard = true;

export default TrendCard;
