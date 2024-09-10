import { Spin, Tabs } from 'antd';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ModelInfoProvider, queryModelIntroInfoByModelName } from '../service';
import { ReadmeText, SampleData } from './components';

const { TabPane } = Tabs;

interface htmlType {
  exampleHtml: '';
  introHtml: '';
}

const RightContent = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [htmlData, setHtmlData] = useState<htmlType>({
    exampleHtml: '',
    introHtml: '',
  });

  const { modelInfo: { modelName = '' } = {} } = useContext<any>(ModelInfoProvider);

  // 根据模型名称查询模型详情
  const getModelIntroInfo = useCallback(async () => {
    if (modelName) {
      setLoading(true);

      const { exampleHtml, introHtml } =
        (await queryModelIntroInfoByModelName({ modelName })) || {};

      setHtmlData({ exampleHtml, introHtml });
      setLoading(false);
    }
  }, [modelName]);

  useEffect(() => {
    getModelIntroInfo();
  }, [modelName]);

  return (
    <Tabs size="small" defaultActiveKey="readmeText">
      <TabPane tab="说明文档" key="readmeText" forceRender={true}>
        <Spin spinning={loading}>
          <ReadmeText introHtml={htmlData.introHtml} />
        </Spin>
      </TabPane>
      <TabPane tab="样例数据" key="data" forceRender={true}>
        <Spin spinning={loading}>
          <SampleData exampleHtml={htmlData.exampleHtml} />
        </Spin>
      </TabPane>
    </Tabs>
  );
};

export default RightContent;
