import { Request, Response, NextFunction } from "express";

export const parseEmbeddedJson =
  (fields: string[]) => (req: Request, res: Response, next: NextFunction) => {
    try {
      for (const field of fields) {
        const value = req.body[field];
        if (typeof value === "string") {
          req.body[field] = JSON.parse(value);
        }
      }
      next();
    } catch (err) {
      next(err);
    }
  };
