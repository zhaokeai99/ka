const EMOJI_SIZE = 40;
const padding = 15;
const areaWidth = window.innerWidth;
export const EMOJI_SOURCE = 'wechat-emoji.png';
export const perLine = Math.floor((areaWidth - padding * 2) / 45);
export const extraPadding = Math.floor(
  (areaWidth - padding * 2 - perLine * EMOJI_SIZE) / (perLine - 1),
);
