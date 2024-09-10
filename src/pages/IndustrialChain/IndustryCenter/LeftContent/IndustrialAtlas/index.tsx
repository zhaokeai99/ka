import ProCardPlus from '@/components/ProCardPlus';
import { useContext } from 'react';
import { IndustryProvider } from '../../service';
import ChainImg from '@/pages/IndustrialChain/components/ChainImg';

const IndustrialAtlas = () => {
  const { industryName, industryId, chain } = useContext(IndustryProvider);

  return chain === '1' ? (
    <ProCardPlus
      title="产业链图谱"
      layout="center"
      extra={
        <a
          style={{ fontSize: 12 }}
          href={`#/industrialChain/chainDetail/${industryName}/${industryId}`}
        >
          详版产业链 &gt;
        </a>
      }
    >
      <ChainImg industryCode={industryId} resourcesType="chain_atlas" />
    </ProCardPlus>
  ) : null;
};

IndustrialAtlas.isProCard = true;

export default IndustrialAtlas;
