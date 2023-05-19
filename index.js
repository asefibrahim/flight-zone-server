const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5niozn3.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        const categoryCollection = client.db('categoryDB').collection('category')
        const addedProductsCollection = client.db('categoryDB').collection('products')

        //  category data


        app.get('/categories', async (req, res) => {
            const result = await categoryCollection.find().toArray()
            res.send(result)
        })

        // Add toy data by user

        app.post('/addToy', async (req, res) => {
            const dataFromClient = req.body
            const result = await addedProductsCollection.insertOne(dataFromClient)
            res.send(result)
        })

        // all data of all user
        app.get('/addedToys', async (req, res) => {
            console.log(req.query.email);

            let query = {}
            if (req.query.email) {
                query = {
                    sellerEmail: req.query.email
                }
            }
            const result = await addedProductsCollection.find(query).toArray()
            res.send(result)
        })

        // delete 

        app.delete('/addedToys/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await addedProductsCollection.deleteOne(query)
            res.send(result)
        })

        // update
        app.put('/addedToys/:id', async (req, res) => {
            const id = req.params.id
            const infoFromClient = req.body
            console.log(infoFromClient);
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const update = {
                $set: {
                    toyName: infoFromClient.toyName,
                    price: infoFromClient.price,
                    quantity: infoFromClient.quantity,
                    description: infoFromClient.description
                }
            }
            const result = await addedProductsCollection.updateOne(query, update, options)
            res.send(result)
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Server is Running.......')
})

app.listen(port)