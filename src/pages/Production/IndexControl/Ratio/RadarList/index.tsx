import { useState, useCallback, useEffect } from 'react';
import List from './List';
import Radar from './Radar';
import { calThIndexSectorLatestRanking } from '../service';

export default function (props: any) {
  const [type, setType] = useState('PERSON');
  const [radarData, setRadarData] = useState([]);

  useEffect(() => {
    (async () => {
      const { list } =
        props?.typeItem?.sectorId &&
        (await calThIndexSectorLatestRanking({
          sectorId: props.typeItem.sectorId,
          customerType: type,
          floodFund: props?.floodFund,
        }));
      const radarList = (list || []).map((item: { name: any; rank: any }) => {
        return {
          ...item,
          name: item.name.replace(/(.{6})/g, '$1' + '\n') + '\n' + item.rank,
        };
      });

      setRadarData(radarList);
    })();
  }, [props?.typeItem?.sectorId, type, props?.floodFund]);

  const onChange = useCallback((e) => {
    setType(e.target.value);
  }, []);

  return (
    <>
      <div>
        <Radar
          data={radarData}
          onChange={onChange}
          title={
            props.typeItem &&
            props.typeItem.sectorName + (type === 'PERSON' ? ' - 个人客户' : ' - 机构客户')
          }
        />
      </div>
      <div>
        <List
          floodFund={props?.floodFund}
          sectorId={props.typeItem && props.typeItem.sectorId}
          title={props.typeItem && props.typeItem.sectorName}
        />
      </div>
    </>
  );
}
