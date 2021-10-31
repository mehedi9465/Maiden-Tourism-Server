const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u8ama.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const uri = "mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u8ama.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("Maiden_Tour");
      const packages = database.collection("Packages");
      const bookings = database.collection("Bookings");

      // Get All Packages
      app.get('/packages', async (req, res) => {
          const result = await packages.find({}).toArray();
          res.send(result);
      });

      // Add Package
      app.post('/packages', async (req, res) => {
        const package = req.body;
        const result = await packages.insertOne(package);
        res.send(result)
      });

       // Get All Bookings
       app.get('/bookings', async (req, res) => {
        const result = await bookings.find({}).toArray();
        res.send(result);
      });

      // Get a user's all Bookings
      app.get('/bookings/:email', async (req, res) => {
        const query = req.params;
        const result = await bookings.find(query).toArray();
        res.send(result);
      });

      // Get Booking using Query
      app.get('/bookings/approve/:status', async (req, res) => {
        const query = req.params;
        console.log(query);
        const result = await bookings.find(query).toArray();
        res.send(result);
      });

      // Get Booking By Id
      app.get('/bookings/update/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id:ObjectId(id) }
        const result = await bookings.findOne(query);
        res.send(result);
      });

      // Update Booking By Id
      app.put('/bookings/update/:id', async (req, res) => {
        const id = req.params.id;
        const booking = req.body;
        const query = { _id:ObjectId(id) }
        const updatedBooking = {
          $set:{
            address: booking.address,
            date: booking.date,
            email:  booking.email,
            img:  booking.img,
            name: booking.name,
            packageName:  booking.packageName,
            persons:  booking.persons,
            phone: booking.phone,
            status: booking.status
          }
        }
        console.log(query);
        const options = { upsert: true };
        const result = await bookings.updateOne(query, updatedBooking, options);
        console.log(result);
        res.send(result);
      });

      // Update Package By Id
      app.put('/packages/update/:id', async (req, res) => {
        const id = req.params.id;
        const pckg = req.body;
        const query = { _id:ObjectId(id) }
        const updatedPackage = {
          $set:{
            name: pckg.name,
            img: pckg.img,
            des:  pckg.des,
          }
        }
        console.log(updatedPackage);
        console.log(query);
        const options = { upsert: true };
        const result = await packages.updateOne(query, updatedPackage, options);
        console.log(result);
        res.send(result);
      });

      // Delete Booking by Id
      app.delete('/bookings/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await bookings.deleteOne(query);
        res.send(result);
      })
      

      // Get Package By Id
      app.get('/packages/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id:ObjectId(id) }
        const result = await packages.findOne(query);
        res.send(result);
      });

      // Delete Package By Id
      app.delete('/packages/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id:ObjectId(id) }
        const result = await packages.deleteOne(query);
        res.send(result);
      });

      // Insert Booking Infos
      app.post('/bookings', async (req, res) => {
        const informations = req.body;
        const result = await bookings.insertOne(informations);
        res.send(result);
      })
      
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

  app.get('/', (req, res) => {
      res.send('Server is Running');
  })

  app.listen(port, () => console.log('Listening to ', port))