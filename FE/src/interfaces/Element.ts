export interface Element {
  name: string;
  path: string;
  parent: string | null;
  owner: string;
  sharedWith: string[];
  gridFsId: string | null;
  type: string;
}
