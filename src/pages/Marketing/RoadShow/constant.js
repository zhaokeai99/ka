// 路演状态，完成，待开始
const STATUS = {
  ALL: 0,
  DONE: 1,
  UNDONE: 2,
  GOING: 3,
  CANCEL: 4,
};
// 所有，我创建，我参与
const MY = {
  ALL: 0,
  CREATE: 1,
  PARTICIPATE: 2,
};
// 所有，线上视频，线下
const STYLE = {
  ALL: '0',
  ONLINE: '1',
  OFFLINE: '2',
};
// 所有，线上视频，线下，标签
const STYLE_LABEL = {
  0: '所有',
  1: '线上视频',
  2: '线下',
};
// 所有，公开，不公开
const PUBLIC = {
  ALL: 'all',
  YES: 'yes',
  NO: 'no',
};
// 个人，群组
const PARTICIPANT_TYPE = {
  PEOPLE: '0',
  GROUP: '1',
  OUT: '2',
};

export { STATUS, MY, STYLE, STYLE_LABEL, PUBLIC, PARTICIPANT_TYPE };
