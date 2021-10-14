import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { TOKEN_SECRET } = process.env;

const verifyAuthToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void => {
  try {
    const authorizationHeader = req.headers.authorization as unknown as string;
    const token = authorizationHeader.split(' ')[1];

    const token_secret = TOKEN_SECRET as unknown as string;
    const decoded = jwt.verify(token, token_secret);
    next();
  } catch (err) {
    console.error(err);

    res.status(401);
    res.json(err);
  }
};

const verifyAuthTokenRoleAdmin = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void => {
  try {
    const authorizationHeader = req.headers.authorization as unknown as string;
    const token = authorizationHeader.split(' ')[1];

    const token_secret = TOKEN_SECRET as unknown as string;
    const decoded = jwt.verify(token, token_secret);

    const decoded_data = decoded as unknown as jwt.JwtPayload;
    if (decoded_data['user']['role'] != 'admin') {
      throw new Error("User must have role 'admin'");
    }

    next();
  } catch (err) {
    console.error(err);

    res.status(401);
    res.json(err);
  }
};

const verifyAuthTokenUserId = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void => {
  try {
    const authorizationHeader = req.headers.authorization as unknown as string;
    const token = authorizationHeader.split(' ')[1];

    const token_secret = TOKEN_SECRET as unknown as string;
    const decoded = jwt.verify(token, token_secret);

    const user_id = req.body.user_id as unknown as number;
    const decoded_data = decoded as unknown as jwt.JwtPayload;
    if (decoded_data['user']['id'] != user_id) {
      throw new Error('User id does not match with token');
    }

    next();
  } catch (err) {
    console.error(err);

    res.status(401);
    res.json(err);
  }
};

const verifyAuthTokenRoleAdminUserId = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void => {
  try {
    const authorizationHeader = req.headers.authorization as unknown as string;
    const token = authorizationHeader.split(' ')[1];

    const token_secret = TOKEN_SECRET as unknown as string;
    const decoded = jwt.verify(token, token_secret);

    const user_id = req.body.user_id as unknown as number;
    const decoded_data = decoded as unknown as jwt.JwtPayload;
    if (decoded_data['user']['id'] != user_id && decoded_data['user']['role'] != 'admin') {
      throw new Error("User id should match with token or User role should be 'admin'");
    }

    next();
  } catch (err) {
    console.error(err);

    res.status(401);
    res.json(err);
  }
};

export {
  verifyAuthToken,
  verifyAuthTokenRoleAdmin,
  verifyAuthTokenUserId,
  verifyAuthTokenRoleAdminUserId,
};
