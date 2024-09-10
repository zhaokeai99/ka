import Pie from './Pie';
import Radar from './Radar';

export default function (props: any) {
  return (
    <>
      <div>
        <Pie
          sectorId={props.typeItem && props.typeItem.sectorId}
          title={props.typeItem && props.typeItem.sectorName}
          floodFund={props?.floodFund}
        />
      </div>
      <div>
        <Radar
          sectorId={props.typeItem && props.typeItem.sectorId}
          title={props.typeItem && props.typeItem.sectorName}
          floodFund={props?.floodFund}
        />
      </div>
    </>
  );
}
