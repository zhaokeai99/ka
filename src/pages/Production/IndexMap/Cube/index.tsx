import { Popover } from 'antd';

export default function Cube({ content, getStepColor, data, onClick, style = {} }: any) {
  if (content) {
    return (
      <Popover content={content} title="">
        <div
          onClick={onClick}
          className="heatmap-cube"
          style={{
            backgroundColor: getStepColor(data.thermalValue * 100),
            ...style,
          }}
          key={data.indexCode}
        >
          {data.indexName}
          {data.thfundPublish === 1 ? null : (
            <div className="cube-corner-flag">
              <span>TH</span>
            </div>
          )}
        </div>
      </Popover>
    );
  }

  return (
    <div
      className="heatmap-cube"
      style={{
        backgroundColor: getStepColor(data.thermalValue * 100),
      }}
      onClick={onClick}
    >
      {data.indexName}
      {data.thfundPublish === 1 ? null : (
        <div className="cube-corner-flag">
          <span>TH</span>
        </div>
      )}
    </div>
  );
}
