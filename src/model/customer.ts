import { ObjectId } from "mongodb"

export type CustomerModel = {
    id?: ObjectId, 
    name: string,
    surname: string,
    patronomic?: string,
    address: string,
    email?: string,
    age?: Date
}