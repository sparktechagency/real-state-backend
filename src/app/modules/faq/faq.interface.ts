import { Model } from 'mongoose';

export type IFaq = {
  question: string;
  ans: string;
};
export type FaqModel = Model<IFaq>;