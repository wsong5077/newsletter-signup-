require("dotenv").config();
const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));//to help embed the custom css and images files....shud be stored in a part folder:public

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/failure", function (req, res) {
  res.redirect("/");//redirect after clicking the buttton to the root route
});

app.post("/", function (req, res) {
  const name1 = req.body.fname;
  const name2 = req.body.lname;
  const emailId = req.body.email;

  const data = {
    members: [
      {
        email_address: emailId,
        status: "subscribed",
        merge_fields: {
          FNAME: name1,
          LNAME: name2,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);//convert the js object into a string.....compact version....this data shud be given to the mailchimp servers
  const url = "https://us20.api.mailchimp.com/3.0/lists/32d0afeaf6";
  const options = {
    method: "POST",
    auth: "Weijia-song:442913276123f6b316694b850e24d91a"
  };
  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      // console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.listen(process.env.PORT || 3000, function () {
  console.log("your server is live at port 3000!");
});