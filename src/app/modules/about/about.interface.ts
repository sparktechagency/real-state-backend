import { Model } from 'mongoose';

export type IAbout = {
  text: string;
};
export type AboutModel = Model<IAbout>;