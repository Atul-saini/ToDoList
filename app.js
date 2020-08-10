const  express= require("express");
const bodyparser= require("body-parser");
const app = express();
const mongoose= require("mongoose");
app.set("view engine" , "ejs");

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const itemschema = {
   name : String
};
const Item = mongoose.model("Item", itemschema);

const item1 =new Item({
  name :"welcome to your todo list!"
});
const item2 =new Item({
  name :"click + to add more items!"
});
const item3 =new Item({
  name :"<--hit this to delete an item"
});
const defaultitem =[ item1,item2,item3];


app.use(bodyparser.urlencoded({extended: true}))
app.use(express.static("public"));
app.get("/",function(req,res){


    Item.find({},function(err,founditem){
      if(founditem.length===0)
      {
        Item.insertMany(defaultitem, function(err){
          if(err)
          {console.log("opps");}
          else {
            console.log("succesfuly added");
          }
        });
        res.redirect("/");
      }
      else {


    res.render("list",{kindofday: "Today",newlistitem:founditem});
  }
    });


});


app.post("/", function(req,res){
  const itemname= req.body.newitem;
  const item = new Item({
    name: itemname
  });

  item.save();
  res.redirect("/");

})

app.post("/delete",function(req,res){
  const checkeditem=req.body.checkbox;
  Item.findByIdAndRemove(checkeditem,function(err){
    if(!err)
    {    res.redirect("/");
      }
  });
});

app.listen(3000,function(){
   console.log("server is running at port 3000");
})
