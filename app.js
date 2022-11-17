const express = require("express");
const mongoose = require("mongoose");
const listModel = require(__dirname + "/models/listModel");
const customModal = require(__dirname + "/models/customModel")
const _=require('lodash')
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose
  .connect(
    "mongodb+srv://santosh:Santosh24@cluster0.xy0vu.mongodb.net/todolistDb?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(
    () => console.log("Database connected"),
    (error) => console.log(error)
  );

app.set("view engine", "ejs");


//Routes

app.get("/", async (req, res) => {
  const itemsData = await listModel.find({ tag: 'Today' });
  res.render("list", { days: "Today", newItems: itemsData });
});

app.post("/", async (req, res) => {
  const data = req.body.newItem.trim();
  const listName = req.body.lisTitle
  const inputData = await listModel.create({ item: data });
  if (listName === "Today") {
    return res.redirect("/");
  }
  else {
    inputData.tag = _.capitalize(listName) 
    inputData.save()
    const customList = await customModal.findOne({ name: listName })
    customList.items.push(inputData)
    customList.save()
    res.redirect("/" + listName)
  }

});

app.get('/:customList', async (req, res) => {
  const customList = _.capitalize(req.params.customList) 
  if(!(customList=="Favicon.ico")) {
  const check = await customModal.findOne({ name: customList })
  if (check) {
    res.render("list", { days: check.name, newItems: check.items });
  }
  else {
    let data = new Object()
    data.name = customList
    await customModal.create(data)
    res.redirect('/' + customList)
  }
  }
})



app.post('/delete', async (req, res) => {
  const removeList = req.body.checkbox
  const check = await listModel.findOne({ _id: removeList })
  await listModel.deleteOne({ _id: removeList })
  if (check.tag =="Today") {
    return res.redirect('/')
  }
  const checkCustom = await customModal.findOne({ name: check.tag })
  const array = checkCustom.items
  for (let i = 0; i < array.length; i++) {
    if (array[i]._id == removeList) {
      array.splice(i, 1)
      checkCustom.save()
      break;
    }
  }
  return res.redirect('/' + check.tag)

})





app.listen(process.env.PORT || 3000, () => console.log("Server running"));
