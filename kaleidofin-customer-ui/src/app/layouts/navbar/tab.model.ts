export interface Tab {
  name?: string;
  active?: boolean;
  route?: string;
  isDefault?: boolean;
}
export interface TabsList {
  parentCompo: string;
  tabs: Tab[];
  type: "hasBack" | "tabList";
}
