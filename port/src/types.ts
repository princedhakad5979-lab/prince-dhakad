export type ProjectType = 'youtube' | 'reel';

export interface ProjectItem {
  id: number;
  projectNumber: string;
  type: ProjectType;
  typeLabel: string;
  defaultSrc: string;
  aspectRatio: '16:9' | '9:16';
}
