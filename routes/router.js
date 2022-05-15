const express = require("express");
const bodyParser = require("body-parser");
const Router = express.Router();
const Item = require("../model/item");
const uuid = require("uuid");
const connectDB = require("../config/database");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

connectDB();

Router.post("/addItem",(req,res)=>{
    const id = uuid.v4();
    const itemName = req.body.itemName;
    const category = req.body.category;
    const description = req.body.description;
    const price = req.body.price;

    const item = new Item({
        itemID : id,
        itemName : itemName,
        category : category,
        description : description,
        price: price,
    });

    item.save(err => {
        console.log(err);
        if (err) return res.status(500).send(err);
        return res.status(200).send(item)
    });
    
});

Router.get("/items",(req,res)=>{
    Item.find((err,result)=>{
        if(err){
            console.log(err);
        }else{
            const items = result;
           res.send(items);
        }
    });
});

Router.post("/items",(req,res)=>{
    const userId = req.body.userId;
    Item.find({userId: userId},(err,result)=>{
        if(err){
            console.log(err);
        }else{
            const items = result;
            res.send(items);
        }
    });
});

Router.put("/updateItem",(req,res)=>{
    const itemID =  req.body.itemID;
    const itemName = req.body.itemName;
    const category = req.body.category;
    const description = req.body.description;
    const price = req.body.price;
    const userId = req.body.userId;

    const query = {itemID:itemID};
    Item.findOneAndUpdate(query,{$set:{
            itemName : itemName,
            category : category,
            description : description,
            price: price,
    }},(err)=>{
        if (err) return res.status(500).send(err);
        return res.status(200).send(itemID)
    });
});

Router.delete("/deleteItem",(req,res)=>{
    const itemID =  req.body.itemID;
    const query = {itemID: itemID};
    Item.findOneAndDelete(query,(err,result)=>{
        if (err) return res.status(500).send(err);
        return res.status(200).send(result);
    });
});

module.exports = Router;