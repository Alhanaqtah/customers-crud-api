import {Collection, MongoClient, ObjectId} from 'mongodb';

import {CustomerModel} from '../model/customer';

export class UserNotFoundError extends Error {
    constructor() {
        super('User not found');
        this.name = 'UserNotFoundError';
    }
}

export class Storage {
    collection!: Collection;

    constructor(connURL: string) {
        this.connect(connURL);
    }

    async connect(connURL: string): Promise<void> {
        try {
            const client = await MongoClient.connect(connURL);
            let db = client.db('customers-crud-db');
            this.collection = db.collection('customers');
            console.log('Connected successfully to storage!');
        } catch(error) {
            console.error('Error connecting to MongoDB: ', error);
        }
    }

    async create(customerInfo: CustomerModel): Promise<string> {
        try {
            let customerID: string = (await this.collection.insertOne(customerInfo)).insertedId.toString();
            return customerID;
        } catch(error) {
            throw error;
        }
    }

    async getAll(): Promise<CustomerModel[]> {
        try {
            let customers: any[] = await this.collection.find().toArray();
            return customers;
        } catch(error) {
            throw error;
        }
    }

    async get(customerID: string): Promise<CustomerModel | null> {
        try {
            let customer = await this.collection.findOne({'_id': new ObjectId(customerID)});
            if (customer === null) {
                throw new Error('User not found');
            }
            
            let c: CustomerModel = {
                name: customer.name,
                surname: customer.surname,
                patronomic: customer.patronomic || null,
                address: customer.address || null,
                email: customer.email || null,
                age: customer.age || null,
            }

            return c;
        } catch(error) {
            throw error;
        }
    }

    async remove(customerID: string): Promise<void> {
        try {
            let deleted: boolean = Boolean((await this.collection.deleteOne({'_id': new ObjectId(customerID)})).deletedCount);
            if (!deleted) {
                throw new UserNotFoundError;
            }
        } catch(error) {
            throw error;
        }
    }

    async update(customerInfo: CustomerModel): Promise<void> {
        try {
            let modified: boolean = Boolean((await this.collection.updateOne({'_id': new ObjectId(customerInfo.id!)}, {$set:customerInfo})).modifiedCount)
            if (!modified) {
                throw new UserNotFoundError();
            }
        } catch(error) {
            throw error;
        }
    }
}