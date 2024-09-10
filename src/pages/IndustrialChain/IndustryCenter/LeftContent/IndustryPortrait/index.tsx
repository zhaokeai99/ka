import ProCardPlus from '@/components/ProCardPlus';
import { Radar } from '@ant-design/charts';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import DetailList from './DetailList';
import TabsContent from './Tabs';

import { Empty } from 'antd';
import { meanBy as _meanBy } from 'lodash';
import {
  IndustryProvider,
  queryIndustryPortrait,
  queryIndustryPortraitSub,
  queryIndustryPortraitSubSort,
  queryIndustryPortraitHistoryScore,
} from '../../service';

const IndustryPortrait = () => {
  const { industryName } = useContext(IndustryProvider);
  const [columnTitle, setColumnTitle] = useState('');
  const [radarData, setRadarData] = useState([]);
  const [radioData, setRadioData] = useState([]);
  const [listData, setListData] = useState<any>([]);
  const [rankData, setRankData] = useState([]);
  const [avgNum, setAvgNum] = useState('');
  const [date, setDate] = useState('--');
  const [rankLoading, setRankLoading] = useState<boolean>(false);
  const [scoreLoading, setScoreLoading] = useState<boolean>(false);
  const [scoreData, setScoreData] = useState<any[]>([]);

  // 行业画像-子类排名
  const querySubRank = useCallback(async (params: any) => {
    setRankLoading(true);

    const rank = await queryIndustryPortraitSubSort({ ...params });
    setRankData(rank);

    setRankLoading(false);
  }, []);

  // 行业画像-历史得分
  const queryHistoryScore = useCallback(async (params: any) => {
    setScoreLoading(true);

    const { data, success } = await queryIndustryPortraitHistoryScore({ ...params });

    if (success) {
      setScoreData(data || []);
    }

    setScoreLoading(false);
  }, []);

  // 行业画像-子类得分
  const querySubList = useCallback(async (featureName: any, parentInfo: any) => {
    const { description, featureScore } = parentInfo || {};
    const list = await queryIndustryPortraitSub({
      industryName,
      featureName,
    });

    setDate(list[0]?.tDate || '--');
    setListData([
      ...new Set([
        ...[{ subdescription: description, subfeatureScore: featureScore, ...parentInfo }],
        ...list,
      ]),
    ]);

    if (list?.length > 0) {
      querySubRank({ featureName: list[0]['featureName'] });
      queryHistoryScore({ featureName: list[0]['featureName'], industryName });
    }
  }, []);

  // 行业画像-大类得分
  useEffect(() => {
    (async () => {
      const rData = await queryIndustryPortrait({ industryName });

      const radioList = rData?.map((i: any) => ({ label: i.featureName, value: i.featureName }));
      const avg = _meanBy(rData, 'featureScore').toFixed(2);
      setRadarData(rData);
      setRadioData(radioList);
      setAvgNum(avg);

      if (rData?.length > 0) {
        setColumnTitle(rData[0]['featureName']);
        querySubList(rData[0]?.featureName, rData[0]);
      }
    })();
  }, []);

  // 雷达图配置详情
  const radarConfig: any = useMemo(
    () => ({
      data: radarData,
      xField: 'featureName',
      yField: 'featureScore',
      style: {
        height: '100%',
      },
      appendPadding: 15,
      meta: {
        featureScore: {
          alias: '评分',
          nice: true,
        },
      },
      xAxis: {
        tickLine: null,
      },
      yAxis: {
        tickCount: 4,
        label: false,
        min: 0,
        grid: {
          alternateColor: 'rgba(0, 0, 0, 0.04)',
        },
      },
      point: {
        size: 3,
      },
      annotations: [
        {
          type: 'text',
          position: [0, 0],
          content: avgNum,
          style: {
            fontSize: 24,
            textAlign: 'center',
          },
        },
      ],
    }),
    [radarData, avgNum],
  );

  //  切换子类列表标题
  const listOnChange = useCallback((val: any) => {
    const { subfeature, featureName } = val || {};

    setColumnTitle(subfeature || featureName);
    querySubRank({ featureName, subfeature });
    queryHistoryScore({ featureName, subfeature, industryName });
  }, []);

  // 切换父类类型
  const radioOnChange = useCallback(
    (name: string) => {
      setListData([]);
      const parentInfo: any = radarData.find((i: any) => i.featureName === name);
      setColumnTitle(name);
      querySubList(parentInfo?.featureName, parentInfo);
    },
    [radarData],
  );

  return (
    <ProCardPlus split="horizontal" title="行业画像" extra={`日期: ${date || '--'}`}>
      <ProCardPlus split="vertical" style={{ height: '280px' }}>
        <ProCardPlus colSpan={8} style={{ height: '100%' }}>
          {radarData?.length <= 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <Radar {...radarConfig} />
          )}
        </ProCardPlus>
        <DetailList
          radioData={radioData}
          data={listData}
          radioOnChange={radioOnChange}
          listOnChange={listOnChange}
        />
      </ProCardPlus>
      <ProCardPlus>
        <TabsContent
          scoreData={scoreData}
          rankData={rankData}
          rankLoading={rankLoading}
          scoreLoading={scoreLoading}
          columnTitle={columnTitle}
        />
      </ProCardPlus>
    </ProCardPlus>
  );
};

IndustryPortrait.isProCard = true;

export default IndustryPortrait;
