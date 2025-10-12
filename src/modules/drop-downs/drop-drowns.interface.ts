export interface DropDown {
  value: number | string;
  label: string;
}

export enum DropDownsParam {
  'menu-items-drop-down' = 'menu-items-drop-down',
  'menu-items' = 'menu-items',
  'categories' = 'categories',
  'tags' = 'tags',
  'authors' = 'authors',
  'post-status' = 'post-status',
}

export type DropDownsExecute = Record<DropDownsParam, () => Promise<DropDown>>;

export type DropDownsExecuteById = Record<
  DropDownsParamById,
  (param: any) => Promise<DropDown>
>;

export enum DropDownsParamById {
}
