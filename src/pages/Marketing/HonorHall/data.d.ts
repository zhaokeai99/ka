export interface ProptTableIndex {
  id: string;
  deptId: string;
  deptName: string;
  deptPhoto: string;
  gmtCreate: string;
  gmtModified: string;
}

export interface PrizesTableIndex {
  awardsId: string;
  awardsName: string;
  awardsType: string;
  awardsTypeDesc: string;
  gmtCreate: string;
  gmtModified: string;
}

export interface ListTableIndex {
  id: string;
  listId: string;
  listName: string;
  listYear: string;
  listCycle: string;
  listCycleDesc: string;
  awardsBgVOList: any[];
  gmtCreate: string;
  gmtModified: string;
}

export interface AwardsTableIndex {
  id: string;
  awardsId: string;
  awardsName: string;
  winnerId: string;
  winnerName: string;
  listId: string;
  listName: string;
  listYear: string;
  listCycle: string;
  listCycleDesc: string;
  winnerDesc: string;
  gmtCreate: string;
  gmtModified: string;
}

export interface MarketingTableIndex {
  id: string;
  pictureDesc: string;
  pageStaticPath: string;
  pictureOrder: string;
  skipUrl: string;
  skipUrlType: string;
  gmtCreate: string;
  gmtModified: string;
  pptOrPdfUrl: string;
}
