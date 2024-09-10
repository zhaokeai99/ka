import { memo, useState, useEffect } from 'react';
import { queryComPlianceLibraryBoothIdData } from './service';
import './index.less';

function FundReward({ boothId }: any) {
  const [booth, setBooth] = useState('');
  useEffect(() => {
    (async () => {
      const data = await queryComPlianceLibraryBoothIdData({
        boothId: boothId,
      });
      setBooth(
        data
          .replace(/(<red>)/g, '<span class="red_color">')
          .replace(/(<\/red>)/g, '</span>')
          .replace(/(<br\/>)/g, '')
          .replace(/(<\/br>)/g, ''),
      );
    })();
  }, []);

  return booth ? (
    <div className="boothWrap">
      <div dangerouslySetInnerHTML={{ __html: booth }}></div>
    </div>
  ) : null;
}
export default memo(FundReward);
