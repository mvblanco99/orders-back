declare global {
  namespace Express {
    interface Request {
      user?: ModelUser;
    }
  }
}

export {};
