import { useState, useEffect } from 'react';
import { queryComPlianceLibraryBoothIdData } from './service';
import './index.less';

function FundReward({ boothId }: any) {
  const [booth, setBooth] = useState('');
  useEffect(() => {
    (async () => {
      const data = await queryComPlianceLibraryBoothIdData({
        boothId: boothId,
      });
      setBooth(data);
    })();
  }, []);
  return booth ? (
    <div className="boothWrap">
      <div>{booth}</div>
    </div>
  ) : null;
}
export default FundReward;
