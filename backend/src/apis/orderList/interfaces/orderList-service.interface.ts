// point-transaction-serviced.interface.ts

import { IAuthUser } from "src/commons/interfaces/context";
import { CreateOrderListInput } from "../dto/createOrderList.input";

export interface IOrderListCreate {
    createOrderListInput: CreateOrderListInput;
    user: IAuthUser["user"];
}
