const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/services');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const data=require("./serviceProvider");

const ServiceProvider=require("../models/serviceProvider");

ServiceProvider.insertMany(data)