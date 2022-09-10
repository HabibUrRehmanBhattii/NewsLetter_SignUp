//Importing the modules
const express = require("express");
const body_praser = require ("body-parser");
const request = require("request");
const https = require("https");
const { url } = require("inspector");

const app = express();

// sending public folder with html
app.use(express.static("public"));

//leting app to use body_praser
app.use(body_praser.urlencoded({extended: true}));

//sending  html file
app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

//Creating post route
app.post("/", function(req, res){
     //log user input
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email
    //Data type accourding from API
    const data ={
        members: [
            {
                email_address: email,
                status: "subscribed",
                merg_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    //converting data to JSON 
    const jasonData = JSON.stringify(data);

    const url = 'https://us13.api.mailchimp.com/3.0/lists/Your_List_unique_code';

    const option = {
        method: "post",
        auth: "Your_API_Key"
    }

    const request = https.request(url, option, function(response){

        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jasonData);
    request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/");
});


//setting sever on port 3000
app.listen(process.env.PORT || 3000, function(){
    console.log("Server is runing on port 3000");
});
