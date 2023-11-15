const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));

app.get('/',(req, res) => {
res.send("Server is runnig");
})


const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7k1zdza.mongodb.net/?retryWrites=true&w=majority`;

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
    const cartColl = client.db("cocomaya-booms").collection("cart");

    app.get('/api/v1/cart',async (req,res) => { 
        const queryObj = {};
        const sortObj = {};
        const page = req.query.page || 0;
        const pageSize = req.query.pageSize || 10;
        const userEmail = req.query.userEmail;
        if (userEmail) {
          queryObj.userEmail = userEmail;
        }
        try {
            const result = await cartColl.find(queryObj).sort(sortObj).skip(page).limit(pageSize).toArray();
            res.send(result);
        } catch (error) {
            res.status(500).send("Server Error!");
        }
     })

    app.post('/api/v1/cart',async (req,res) => { 
        const food = req.body;
        // console.log(food)
        try {
            const result = await cartColl.insertOne(food);
            res.send(result);
        } catch (error) {
            res.status(500).send("Server Error!!")
        }
     })
    
    

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => { 
    console.log(`Server is runnig on port ${port}`)
 })