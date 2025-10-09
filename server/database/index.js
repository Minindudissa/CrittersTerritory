const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://avoline3d:PAYLOop3d@cluster0.uj0ht.mongodb.net/")
  .then(() => console.log("MongoDB Connection Successfull"))
  .catch((error) => console.log("Error Occured" + error));
