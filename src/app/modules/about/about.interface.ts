import { Model } from 'mongoose';

export type IFaq = {
  text: string;
};
export type FaqModel = Model<IFaq>;