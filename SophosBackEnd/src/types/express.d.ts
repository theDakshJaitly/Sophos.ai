import { UserJwtPayload } from './jwt';

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserJwtPayload;
  }
}

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}