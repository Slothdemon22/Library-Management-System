// In ../controllers/userControllers/OauthLogin.js

import { Request, Response } from 'express';  // This import was missing
export const OauthLogin = async (req: Request, res: Response): Promise<void> => {
    console.log("Oauth Login Body: ");
    console.log("request oauth body: ", req.body);
  };
  