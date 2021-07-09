const express = require('express')
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;

const app = express()
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 5000;


app.get('/', (req, res) => {
  res.send('Hello World!')
})


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h5fiw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const foodCollection = client.db("Red-Onion").collection("Foods");
  const orderCollection = client.db("Red-Onion").collection("orders");
  const adminCollection = client.db("Red-Onion").collection("admins");
  console.log("Connected");

    app.post("/addFood",(req,res)=>{
        const data = req.body;
        foodCollection.insertOne(data)
        .then(result =>{
            res.send(result.insertedCount>0);
        })
    })

    app.get('/allFoods',(req,res)=>{
        foodCollection.find({})
        .toArray((err,documents)=>{
            res.send(documents);
        })
    })

    app.get('/foodById/:id',(req,res)=>{
        foodCollection.find({_id:ObjectID(req.params.id)})
        .toArray((err,documents)=>{
          res.send(documents);
        })
    })

    app.post('/addOrder',(req,res)=>{
      const orderData = req.body;
      console.log(orderData)
      orderCollection.insertOne(orderData)
      .then((result)=>{
        res.send(result)
        console.log(documents)
      })
    })
    app.post("/addAdmin",(req,res)=>{
      const adminData = req.body;
      console.log(adminData);
      adminCollection.insertOne(adminData)
      .then((result)=>{
        console.log(result);
        res.send(result.insertedCount>0);
      })
    })
    app.delete("/delete/:id",(req,res)=>{
      const id = req.params.id;
      foodCollection.deleteOne({_id:ObjectID(id)})
      .then(result=>{
        console.log(result);
      })
    })
    app.get("/allOrders",(req,res)=>{
      orderCollection.find({})
      .toArray((err,documents)=>{
        res.send(documents);
      })
    })
    app.post("/isAdmin",(req,res)=>{
      const email = req.body.email;
      console.log(email);
      adminCollection.find({email:email})
      .toArray((err,documents)=>{
        res.send(documents.length>0)
      })
    })
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})