const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.htm");
});

app.post("/", (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };

    const jsonData = JSON.stringify(data);

    const listId = 3242423656;
    const serverNum = 19;
    const url = `https://us${serverNum}.api.mailchimp.com/3.0/lists/${listId}`;

    const options = {
        method: "POST",
        auth: "jojoliu:e30c8cbbdf66973be829e66f45f1b7c1-us19"
    };

    const request = https.request(url, options, (response) => {

        //console.log(response.statusCode);
        if (response.statusCode === 200) {
            // res.send("Successfully subscribed");
            res.sendFile(__dirname + "/success.htm");
        } else {
            // res.send("Error with signing up, please try again!");
            res.sendFile(__dirname + "/failure.htm");
        }
        
        response.on("data", (data) => {
            //console.log(JSON.parse(data));
        })
    });
    request.write(jsonData);
    request.end();
});


app.post("/failure", (req, res) => {
    res.redirect("/");
});

const portUsed = process.env.PORT || 3000; //heroku assigned port or port 3000

app.listen(portUsed, () => {
    console.log(`server is running on port ${portUsed}`);
});

// Mailchimp API Key:
// e30c8cbbdf66973be829e66f45f1b7c1-us19

//List Id"
//3242423656