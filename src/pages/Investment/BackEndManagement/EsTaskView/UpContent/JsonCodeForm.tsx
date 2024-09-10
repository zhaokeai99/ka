import React, { useState } from 'react';
import { Radio, Switch, Space } from 'antd';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import { jsx, javascript, sass, scss } from "react-syntax-highlighter/dist/esm/languages/prism";

// 代码高亮主题风格
//
// vscDarkPlus vscode 暗色主题
// darcula webstorm 暗色主题
// coyWithoutShadows 上面展示的效果
type tProps = {
  textContent: string;
  language: string;
  darkMode?: boolean;
};

const them = {
  dark: oneDark,
  light: coy,
};
const OmsSyntaxHighlight = (props: tProps) => {
  const { textContent, darkMode, language = 'txt' } = props;
  const [colorMode, setColorMode] = useState<boolean | undefined>(darkMode);
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true);
  const [wrapLongLines, setWrapLongLines] = useState<boolean>(false);

  const setDarkMode = (v: string) => {
    if (v === 'dark') {
      setColorMode(true);
      return;
    }
    setColorMode(false);
  };

  const lineNumbersChange = (checked: boolean) => {
    setShowLineNumbers(checked);
  };
  const wrapLongLinesChange = (checked: boolean) => {
    setWrapLongLines(checked);
  };
  return (
    <>
      <div>
        <Space>
          <Radio.Group
            size={'small'}
            value={colorMode ? 'dark' : 'light'}
            onChange={(e) => setDarkMode(e.target.value)}
          >
            <Radio.Button value="dark">深色</Radio.Button>
            <Radio.Button value="light">浅色</Radio.Button>
          </Radio.Group>

          <Switch
            checkedChildren="显示行号"
            unCheckedChildren="关闭行号"
            defaultChecked
            onChange={lineNumbersChange}
          />
          <Switch checkedChildren="换行" unCheckedChildren="不换" onChange={wrapLongLinesChange} />
        </Space>
      </div>
      <SyntaxHighlighter
        showLineNumbers={showLineNumbers} // 是否展示左侧行数
        lineNumberStyle={{ color: '#ddd', fontSize: 10 }} // 左侧行数的样式
        style={colorMode ? them.dark : them.light} // 主题风格
        language={language} // 需要语言类型 如css, jsx , javascript 等
        wrapLongLines={wrapLongLines}
        PreTag="div"
      >
        {String(textContent).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </>
  );
};
export default OmsSyntaxHighlight;
