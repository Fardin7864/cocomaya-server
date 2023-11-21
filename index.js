const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const jwt = require("jsonwebtoken");
const stipe = require("stripe")(process.env.payment_key);
const cors = require("cors");
var cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7k1zdza.mongodb.net/?retryWrites=true&w=majority`;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
  })
);

const verify = (req, res, next) => {
  // console.log("Passed by middleware");
  const token = req.cookies["cocoToken"];
  // console.log(token)
  if (!token) {
    return res.status(401).send({ message: "Unauthorized!" });
  }

  jwt.verify(token, process.env.jwt_secret, (err, decoded) => {
    if (err) {
      console.error("jwt verification error!");
      return res.status(401).send({ message: "Unauthorized!" });
    }
    // console.log("from middlewar", decoded)
    req.user = decoded;
    next();
  });
};

app.get("/", (req, res) => {
  res.send("Server is runnig");
});

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const cartColl = client.db("cocomaya-booms").collection("cart");
    const userColl = client.db("cocomaya-booms").collection("users");
    const menuColl = client.db("cocomaya-booms").collection("menu");
    const paymentColl = client.db("cocomaya-booms").collection("payments");

    //Jwt route
    app.post("/api/v1/jwt", async (req, res) => {
      const email = req.body;
      // console.log(email)
      const token = await jwt.sign(email, process.env.jwt_secret, {
        expiresIn: "1h",
      });
      // console.log(email, "this is token: ", token)
      try {
        res
          .cookie("cocoToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          })
          .send(token);
      } catch (error) {
        res.status(500).send({ message: "JWT error!" });
      }
    });

    // verify admin
    const verifyAdmin = async (req, res, next) => {
      const email = req.user.email;
      // console.log(email)
      const query = { email: email };
      console.log(query);
      const user = await userColl.findOne(query);
      // console.log("this is from middle:",user)
      const isAdmin = user?.role === "admin";
      console.log(isAdmin);
      if (!isAdmin) {
        return res.status(403).send({ message: "Forbidden!" });
      }
      next();
    };
    //check admin
    app.get("/api/v1/users/admin/:email", verify, async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      // console.log("this from middle",req.user)
      if (email !== req.user.email) {
        return res.status(403).send("Unauthorized!");
      }
      try {
        const user = await userColl.findOne(query);
        // console.log(user)
        let admin = false;
        if (user) {
          admin = user?.role === "admin";
        }
        // console.log(admin)
        res.send(admin);
      } catch (error) {
        res.status(500).send("server error!");
      }
    });
    //Add item on menu
    app.post("/api/v1/menu", async (req, res) => {
      const menuItem = req.body;
      try {
        const result = await menuColl.insertOne(menuItem);
        res.send(result);
      } catch (error) {
        res.status(500).send("Server Error!");
      }
    });
    //Get item from menu
    app.get("/api/v1/menu", async (req, res) => {
      const query = {};
      try {
        const result = await menuColl.find(query).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send("Server error!");
      }
    });
    //Get Single item from menu
    app.get("/api/v1/menu/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      try {
        const result = await menuColl.findOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send("Server error!");
      }
    });
    //Update Single item from menu
    app.patch("/api/v1/menu/update/:id", async (req, res) => {
      const item = req.body;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          name: item.name,
          recipe: item.recipe,
          image: item.image,
          category: item.category,
          price: item.price,
        },
      };
      try {
        const result = await menuColl.updateOne(query, update);
        res.send(result);
      } catch (error) {
        res.status(500).send("Server error!");
      }
    });
    //Delete Single item from menu
    app.delete("/api/v1/menu/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      try {
        const result = await menuColl.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send("Server error!");
      }
    });
    //get users from database
    app.get("/api/v1/users", verify, verifyAdmin, async (req, res) => {
      console.log("user route hited!!!");
      try {
        const result = await userColl.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send("server error!");
      }
    });
    //add user to database
    app.post("/api/v1/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      try {
        const signleUser = await userColl.findOne(query);
        if (signleUser) {
          return res.send({ message: "This email already exist!" });
        }
        const result = await userColl.insertOne(user);
        res.send(result);
      } catch (err) {
        res.status(5000).send("Server error!");
      }
    });
    //create user to admin
    app.patch("/api/v1/users/admin/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: { role: "admin" },
      };
      try {
        const result = await userColl.updateOne(query, update);
        res.send(result);
      } catch (error) {
        res.status(500).send("Server error!");
      }
    });
    //remove from admin
    app.patch("/api/v1/users/normal/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: { role: "normal" },
      };
      try {
        const result = await userColl.updateOne(query, update);
        res.send(result);
      } catch (error) {
        res.status(500).send("Server error!");
      }
    });
    //Delete from users list
    app.delete(`/api/v1/users/:id`, async (req, res) => {
      const id = req.params.id;
      const email = req.body.email;
      const query = {
        _id: new ObjectId(id),
        email: email,
      };
      try {
        const result = await userColl.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send("Server Error!!");
      }
    });
    //Get Cart data from Database
    app.get("/api/v1/cart", verify, async (req, res) => {
      const queryObj = {};
      const sortObj = {};
      const page = req.query.page || 0;
      const pageSize = req.query.pageSize || 10;
      const userEmail = req.query.userEmail;
      if (userEmail) {
        queryObj.userEmail = userEmail;
      }
      try {
        const result = await cartColl
          .find(queryObj)
          .sort(sortObj)
          .skip(page)
          .limit(pageSize)
          .toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send("Server Error!");
      }
    });
    //Add Data to cart
    app.post("/api/v1/cart", async (req, res) => {
      const food = req.body;
      // console.log(food)
      try {
        const result = await cartColl.insertOne(food);
        res.send(result);
      } catch (error) {
        res.status(500).send("Server Error!!");
      }
    });
    //Delete from cart
    app.delete(`/api/v1/cart/:id`, async (req, res) => {
      const id = req.params.id;
      const email = req.body.email;
      const query = {
        _id: new ObjectId(id),
        email: email,
      };
      try {
        const result = await cartColl.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send("Server Error!!");
      }
    });

    //stipe
    app.post("/api/v1/create-payment-intent", async (req, res) => {
      const { price } = req.body;
      const amount = parseInt(price * 100);
      console.log(amount, "total amount!");
      try {
        const paymentIntent = await stipe.paymentIntents.create({
          amount: amount,
          currency: "usd",
          payment_method_types: ["card"],
        });
        res.send({
          clientSecret: paymentIntent.client_secret,
        });
      } catch (err) {
        console.log(err);
        res.status(500).send("server error");
      }
    });

    //get payment history
  app.get('/api/v1/payments/:email',verify,async (req,res) => { 
        const query ={email: req.params.email};
        const emailDcode = req.user;
        console.log(emailDcode)
        try {
          const result = await paymentColl.find(query).toArray();
          res.send(result)
        } catch (error) {
          console.log(error);
          res.status(500).send("server error!")
        }
   })

    //payment api
    app.post("/api/v1/payments", async (req, res) => {
      const payment = req.body;
      const paymentResult = await paymentColl.insertOne(payment);
      console.log(payment, ":payment info");
      const query = {
        _id: {
          $in: payment.cartId.map(id => new ObjectId(id))
        }
      };
      const deleteResult = await cartColl.deleteMany(query)
      res.send({paymentResult, deleteResult});
    });

    //admin states
  app.get('/api/v1/admin-stats',verify,verifyAdmin,async (req,res) => { 
    const users = await userColl.estimatedDocumentCount();
    const menuItems = await menuColl.estimatedDocumentCount();
    const orders = await paymentColl.estimatedDocumentCount();

    const result = await paymentColl.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: '$price',
          }
        }
      }
    ]).toArray();

    const revenue = result.length > 0 ? result[0].totalRevenue : 0;

    res.send({
      users,
      menuItems,
      orders,
      revenue,
    })

   })

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is runnig on port ${port}`);
});
