const express = require("express");
const app = express();
const mongoose=require('mongoose')
//const cors=require("cors")
const { body, validationResult } = require("express-validator");
const path = require("path");
const bodyparser=require('body-parser');
const signuppage = require(('./signup'))
app.use(bodyparser.urlencoded({extended: false}));
var errors1="";

url=`mongodb+srv://Sajahan-1:Sajahan123@sajahan-cluster.g6e3xnk.mongodb.net/Signin?retryWrites=true&w=majority&appName=SAJAHAN-CLUSTER`;

mongoose.connect(url)
    .then((x)=>{console.log(`Connected Successfully! ${x.connections[0].name} `)})
    .catch((err)=>{console.error(`connection Problem: ${err}`)});


// Express.js middleware to use JSON objects    
app.use(express.json());
//app.use(express.static(path.join(__dirname,'..','form-validation')))
//app.use(cors());

app.get('/', (req, res) => {
	res.send(signuppage({errors1}))
})

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

app.post(
  "/",
  // using validation to verify valid inputs (MIDDLEWARE)
  [
    [
        body("name").notEmpty().withMessage("Enter Your Name"),
        body("email").isEmail().withMessage("Enter valid E-mail <i>ex:(wxyz@acd.com)</i>"),
        body("password").isLength({min:6}).withMessage("Password Must Conatains Minimu 6 Character"),
    ],
  ],
  async (req, res) => {
    
    var result1=[];
    
    const errors = validationResult(req);
    const result=Object.values(errors);
    result1= result[1]
    for(var i=0;i<result1.length;i++){
    errors1 +=result1[i].msg + '<br>';
  }
   if(req.body.password != req.body.pswrepeat){
    errors1 +="Password not Match with confirm password"
   }
    if (!errors.isEmpty() || (req.body.password != req.body.pswrepeat)) {
        res.send(signuppage({errors1}));
         }else{

          User.collection.insertOne({email:req.body.email,password: req.body.password})
          .then(()=>{console.log('EMP-Inserted successsfully');res.send(`<script>alert('EMP-Inserted successsfully');window.location.replace('${hostname}');</script>`)})
          .catch((err)=>{console.error(`connection Problem: ${err}`)});

    res.send(`<script>alert('Signup Success');history.go(-2);</script>`)
  }
  errors1="";
  }
);

// Server Listening at port 3000
const port = 4000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});