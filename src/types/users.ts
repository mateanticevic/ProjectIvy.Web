import { Currency } from "./expenses";

export type User = {
    defaultCurrency: Currency,
    firstName: string,
    lastName: string,
    email: string,
    username: string
}