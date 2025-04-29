export interface Element {
  _id: string;
  name: string;
  path: string;
  parent: string | null;
  owner: string;
  sharedWith: string[];
  gridFsId: string | null;
  type: 'file' | 'directory';
  //size?: number; // Only for files
}

export interface File extends Element {
  type: 'file';
}

export interface Directory extends Element {
  type: 'directory';
}
