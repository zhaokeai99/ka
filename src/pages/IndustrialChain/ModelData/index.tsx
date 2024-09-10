import ProCardPlus from '@/components/ProCardPlus';
import { cardGutter, contentPadding } from '@/themes';
import ProCard from '@ant-design/pro-card';
import { useState } from 'react';
import LeftContent from './LeftContent';
import RightContent from './RightContent';
import { ModelInfoProvider } from './service';

// 模型说明
const ModelData = (props: any) => {
  const [modelInfo, setModelInfo] = useState<any>({});
  const { name = '景气度因子' } = props?.match?.params || {};

  const onSelect = (model: any) => {
    setModelInfo(model);
  };

  return (
    <ProCard ghost size="small" gutter={[cardGutter, 0]} style={{ padding: contentPadding }}>
      <ProCard split="vertical" bordered={false} gutter={[cardGutter, 0]}>
        <ProCard bordered={false} colSpan={5} size="small">
          <LeftContent modelName={name} onSelect={onSelect} />
        </ProCard>
        <ProCardPlus
          size="small"
          colSpan={19}
          bordered={false}
          title={modelInfo?.title}
          bodyStyle={{ paddingTop: 1 }}
        >
          <ModelInfoProvider.Provider value={{ modelInfo }}>
            <RightContent />
          </ModelInfoProvider.Provider>
        </ProCardPlus>
      </ProCard>
    </ProCard>
  );
};

ModelData.isProCard = true;

export default ModelData;
