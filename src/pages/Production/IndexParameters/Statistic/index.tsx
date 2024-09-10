import { EditOutlined } from '@ant-design/icons';
import { StatisticCard } from '@ant-design/pro-card';
import { Col, Input, message, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { addOrUpdateIndexHotMapUserWeights, getIndexHotMapUserWeights } from '../service';

interface PieData {
  type: string;
  title: string;
  value: number;
}

const Statistic = ({ queryPieData }: any) => {
  const [pieData, setPieData] = useState<PieData[]>([]);
  const [pieObj, setPieObj] = useState({});

  const getPieData = async () => {
    const weightsData = await getIndexHotMapUserWeights();
    setPieData(weightsData);
    queryPieData(weightsData);
  };

  const updatePie = async (e: any, item: PieData) => {
    pieData.forEach((cur) => {
      if (cur.type === item.type) {
        pieObj[cur.type] = Number(e.target.value) / 100;
      } else {
        pieObj[cur.type] = cur.value / 100;
      }
      setPieObj(pieObj);
    });
    const res = await addOrUpdateIndexHotMapUserWeights(pieObj);
    if (res) {
      getPieData();
      message.success('修改成功');
    } else {
      message.error('修改失败');
    }
  };

  useEffect(() => {
    getPieData();
  }, []);

  return (
    <Row gutter={[16, 16]}>
      {pieData?.map((item) => {
        return (
          <Col key={item.type} span={6}>
            <StatisticCard
              style={{ border: '1px solid rgba(0,0,0,8%)', padding: '12px' }}
              statistic={{
                title: `${item.title}(%)`,
                formatter: () => {
                  return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Input
                        bordered={false}
                        id={item.title}
                        defaultValue={item.value.toFixed(2)}
                        style={{
                          fontSize: '26px',
                          color: '#4568F5',
                          padding: '0',
                          fontWeight: '500',
                          width: '68px',
                        }}
                        onChange={(e) => updatePie(e, item)}
                      />
                      <label htmlFor={item.title}>
                        <EditOutlined />
                      </label>
                    </div>
                  );
                },
                valueStyle: { paddingTop: '6px', fontSize: '26px' },
              }}
            />
          </Col>
        );
      })}
    </Row>
  );
};

export default Statistic;
