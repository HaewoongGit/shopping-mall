// point-transaction-serviced.interface.ts

import { IAuthUser } from "src/commons/interfaces/context";

export interface IPaymentTransactionsServiceCreate {
    impUid: string;
    amount: number;
    deliveryAddress: string;
    contactNumber: string;
    orderInformation: string;
    user: IAuthUser["user"];
}
