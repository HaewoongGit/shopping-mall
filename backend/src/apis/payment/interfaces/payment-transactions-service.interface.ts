// point-transaction-serviced.interface.ts

import { IAuthUser } from "src/commons/interfaces/context";
import { CreatePaymentInput } from "../dto/createPayment.input";

export interface IPaymentServiceCreate {
    createPaymentInput: CreatePaymentInput;
    user: IAuthUser["user"];
}
