import { ItemType } from './item-type';

export interface Ask {
  by: string;
  descendants: number;
  id: number;
  kids: number[];
  score: number;
  text: string;
  time: number;
  title: string;
  type: ItemType.Story;
  url: string;
}