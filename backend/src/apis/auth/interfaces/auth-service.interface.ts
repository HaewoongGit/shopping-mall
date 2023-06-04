import { Request, Response } from 'express';
import { User } from 'src/apis/user/entities/user.entity';
import { IAuthUser, IContext } from 'src/commons/interfaces/context';

export interface IAuthServiceGetAccessToken {
    user: User | IAuthUser['user'];
}

export interface IAuthServiceSetRefreshToken {
    user: User;
    res: Response;
}

export interface IAuthServiceLogin {
    email: string;
    password: string;
    context: IContext;
}

export interface IAuthServiceRestoreAccessToken {
    user: IAuthUser['user'];
}

export interface IOAuthUser {
    user: Omit<User, 'userId'>;
}

export interface IAuthServiceLoginOAuth {
    req: Request & IOAuthUser;
    res: Response;
}
