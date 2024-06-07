import {Collection, MongoClient} from 'mongodb';

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

    // async getAll(customerInfo: CustomerModel): Promise<CustomerModel[]> {
    //     try {
    //         let customerID: string = (await this.collection.find;
    //         return customerID;
    //     } catch(error) {
    //         throw error;
    //     }
    // }
}