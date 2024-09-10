import './assets/emoji.css';
import './assets/position.css';
import { EMOJI_SOURCE } from './constants';
import { parseEmoji, textType } from './parse';

export const ContentWithEmoji = ({
  content = '',
  bodyStyle = {},
  textStyle = {},
  emojiScale = 0.5,
  source,
}) => {
  let tmpContent = content;
  if (!Array.isArray(content)) {
    tmpContent = parseEmoji(content);
  }
  return (
    <div className="wemoji-content" style={bodyStyle}>
      {tmpContent.map((item, index) => {
        if (item.type === textType.normal) {
          return <>{item.content}</>;
        }
        return (
          <div
            style={{
              height: `${64 * emojiScale}px`,
              width: `${64 * emojiScale}px`,
            }}
            className="wemoji-content__emoji"
            key={index}
          >
            <div
              style={{
                transformOrigin: '0px 0px',
                transform: `scale(${emojiScale})`,
                backgroundImage: `url(${source || EMOJI_SOURCE})`,
              }}
              className={item.imageClass}
            />
          </div>
        );
      })}
    </div>
  );
};
