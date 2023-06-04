// context.ts

import { Request, Response } from 'express';

export interface IAuthUser {
    user?: {
        email: string;
        userId: string;
    };
}

export interface IContext {
    req: Request & IAuthUser;
    res: Response;
}
