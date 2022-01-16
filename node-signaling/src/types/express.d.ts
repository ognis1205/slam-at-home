/**
 * @fileoverview Defines module augumentations.
 * @copyright Shingo OKAWA 2022
 */
declare namespace Express {
  interface SessionFields {
    clientId: string;
  }

  export interface Request {
    session: Session & Partial<SessionData> & SessionFields;
  }
}
