import React, { memo } from 'react';
import { Spin, Empty } from 'antd';
import CubeGroup from '../CubeGroup';
import Cube from '../Cube';
import IndexRadar from '../IndexRadar';
import { indexMapColorRange, indexMapBorderColor } from '@/themes/index';
import { rgbStep } from '@/utils/utils';

rgbStep.initRgbStep(indexMapColorRange);

function CubeContainer({ data, loading, indexCode, setCubeSelected }: any) {
  return (
    <div className="cubes-container">
      {loading ? (
        <Spin />
      ) : data.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        data.map(({ indexSimpleInfo = [], indexTrackType }: any) => (
          <CubeGroup title={indexTrackType} key={indexTrackType}>
            {indexSimpleInfo.map((cube: any) => (
              <Cube
                style={{
                  border: cube.indexCode === indexCode ? `2px solid ${indexMapBorderColor}` : '',
                }}
                key={cube.indexCode}
                content={
                  <IndexRadar
                    id={cube.indexCode}
                    title={cube.indexName}
                    data={cube.radarData}
                    width={290}
                    height={290}
                    needCompare={true}
                  />
                }
                getStepColor={rgbStep.getStepColor}
                data={cube}
                onClick={() => {
                  setCubeSelected({
                    indexName: cube.indexName,
                    indexCode: cube.indexCode,
                  });
                }}
              />
            ))}
          </CubeGroup>
        ))
      )}
    </div>
  );
}

export default memo(CubeContainer);
