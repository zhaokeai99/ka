import { memo, useEffect, useState } from 'react';
import SearchForm from './components/search';
import ResultForm from './components/result';

const IndexInfo = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [objId, setObjId] = useState<string | undefined>(undefined);
  const [showList, setShowList] = useState<Boolean>(false);
  useEffect(() => {}, []);

  const onSearch = (key: string) => {
    setShowList(true);
    setKeyword(key);
    setObjId(undefined);
  };

  const onChange = (key: string) => {
    setShowList(true);
    setObjId(key);
  };

  const onBack = () => {
    setShowList(false);
    setKeyword('');
    setObjId(undefined);
  };

  return (
    <>
      <div style={{ padding: 12 }}>
        {showList ? (
          <ResultForm keyword={keyword} objId={objId} onBack={onBack} key={'resultForm'} />
        ) : (
          <SearchForm onSearch={onSearch} key={'searchForm'} onChange={onChange} />
        )}
      </div>
    </>
  );
};
export default memo(IndexInfo);
