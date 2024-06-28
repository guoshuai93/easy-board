export interface ITags {
  id: string;
  title: string;
  bgColor: string;
}

export interface IColumns {
  id: string;
  title: string;
}

export interface ITasks {
  id: string;
  title: string;
  /** 链接：文档等 */
  link: string;
  /** 需求起止时间 */
  time: string[];
  /** 创建时间 */
  createTime: string;
  /** 备注 */
  remark: string;
  /** 看板ID */
  colId: string;
}

export interface IListItem extends IColumns {
  data: ITasks[];
}

export interface IPorject {
  label: string;
  value: string;
  theme: string;
}
