import express from 'express';
import bodyParser from 'body-parser';

import {Storage} from './storage/storage';
import {CustomerModel} from './model/customer';


const port: string | number = process.env.port || 5000;

const app = express();

app.use(bodyParser.json());


let storage: Storage = new Storage('mongodb://127.0.0.1:27017/customers');

// Routes
app.post('/customers', async (req, res) => {
    try {
        let customerInfo: CustomerModel = req.body

        if (customerInfo.name === '', customerInfo.surname === '', customerInfo.address === '') {
            return res.json({'error': 'Invalid credentials'});
        }

        let cutomerID: string = await storage.create(customerInfo);

        return res.json({'id': cutomerID});
    } catch (error) {
        console.error(error);
        return res.status(500).json({'error': 'Internal error'});
    }
});

app.get('/customers', async (req, res) => {
    try {
        let cutomers: any[] = await storage.getAll();

        return res.json(cutomers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({'error': 'Internal error'});
    }
});

app.get('/customers/:id', async (req, res) => {
    try {
        let customerID: string = req.params.id;

        let cutomer: CustomerModel | null = await storage.get(customerID);

        if (cutomer === null) {
            return res.status(404).json({ 'error': 'Customer not found' });
        }

        return res.json(cutomer);
    } catch (error) {
        console.error(error);
        return res.status(500).json({'error': 'Internal error'});
    }
});

// app.patch('/customers', async (req, res) => {

// });

app.delete('/customers', async (req, res) => {

});

const server = app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})

server.on('TERMINATE', () => {
    server.close();

    console.log('Server stopped');
});