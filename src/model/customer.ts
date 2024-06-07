import { ObjectId } from "mongodb"

export type CustomerModel = {
    id?: string, 
    name: string,
    surname: string,
    patronomic?: string,
    address: string,
    email?: string,
    age?: Date
}