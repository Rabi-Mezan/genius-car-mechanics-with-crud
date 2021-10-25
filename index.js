const express = require("express")
const app = express();
const { MongoClient } = require('mongodb');
require("dotenv").config();
const cors = require("cors")
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;

//user:geniusMechanics
//password:nNW5zazHaGFkAWh3

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.krqaw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("geniusCar");
        const servicesCollection = database.collection("services");

        // post api
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('post api hited', service);
            const result = await servicesCollection.insertOne(service)
            console.log(result);
            res.json(result)
        })

        //delete api
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.deleteOne(query)
            res.json(result)
        })


        // get api
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })

        // get api for single id
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('hitting the id no ', id);
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.findOne(query)
            res.send(result)

        })

    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('genius car service is running')
})

app.listen(port, () => {
    console.log("running genius car server on port ", port);
})