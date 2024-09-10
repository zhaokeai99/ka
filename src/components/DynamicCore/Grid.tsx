import React, { useCallback, useEffect, useState } from 'react';
// import { FilterContext } from './Filter';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { map as _map } from 'lodash';
import { dynamic } from 'umi';
import GridItem from './GridItem';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function () {
  // const [lock, setLock] = useState<boolean>(false);
  const [gridData, setGridData] = useState<any[]>([]);
  // const { data } = useContext(FilterContext);

  useEffect(() => {
    setTimeout(() => {
      const result = [
        {
          i: 'a',
          x: 0,
          y: 0,
          w: 3,
          h: 2,
          static: true,
          compName: 'CompB',
          url: 'http://www.baidu.com',
        },
        {
          i: 'b',
          x: 3,
          y: 0,
          w: 6,
          h: 2,
          compName: 'CompA',
          url: 'http://www.baidu.com',
        },
        {
          i: 'c',
          x: 9,
          y: 0,
          w: 3,
          h: 2,
          compName: 'CompB',
          url: 'http://www.baidu.com',
        },
      ];

      const dynamicComponents = [...new Set(_map(result, 'compName'))];
      const dynamicObj = {};
      dynamicComponents.forEach((moduleName) => {
        const dynamicComponent = dynamic(() => import(`../DynamicComp/${moduleName}`));

        dynamicObj[moduleName] = dynamicComponent;
      });

      setGridData(
        result.map((d) => ({
          ...d,
          comp: dynamicObj[d.compName],
        })),
      );
    }, 800);
  }, []);

  const createElement = useCallback((el) => {
    const { i } = el;
    return (
      <div key={i} data-grid={el}>
        <GridItem gridProps={el} />
      </div>
    );
  }, []);

  return (
    <ResponsiveGridLayout
      className="layout"
      isBounded={true}
      breakpoints={{ lg: 1200 }}
      cols={{ lg: 12 }}
    >
      {gridData.map((data) => createElement(data))}
    </ResponsiveGridLayout>
  );
}
