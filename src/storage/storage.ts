import {Collection, MongoClient, ObjectId} from 'mongodb';

import {CustomerModel} from '../model/customer';

export class Storage {
    collection!: Collection;

    constructor(connURL: string) {
        this.connect(connURL);
    }

    async connect(connURL: string): Promise<void> {
        try {
            const client = await MongoClient.connect(connURL);
            let db = client.db('costomers-crud-db');
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
}