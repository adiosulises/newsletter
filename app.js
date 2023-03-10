const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

// api key 36f27aeaa607b4137493edfc1150a0a9-us8
// list id c07f410b42

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const nombre = req.body.nombre;
  const apellido = req.body.apellido;
  const correo = req.body.correo;

  const data = {
    members: [
      {
        email_address: correo,
        status: "subscribed",
        merge_fields: {
          FNAME: nombre,
          LNAME: apellido,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const client = require("@mailchimp/mailchimp_marketing");

  client.setConfig({
    apiKey: "36f27aeaa607b4137493edfc1150a0a9-us8",
    server: "us8",
  });

  const run = async () => {
    const response = await client.lists.batchListMembers("c07f410b42", data);
    console.log(response);

    if (response.error_count > 0) {
      console.log("Errores encontrados: "+response.error_count);
      console.log(response.errors[0].error_code);
      res.sendFile(__dirname + "/failure.html");
    } else { res.sendFile(__dirname + "/success.html"); }
  };

  run();

});

app.post("/failure", function(req,res) {
  console.log("boton")
  res.redirect("/")
})

app.listen(process.env.PORT || 3000, function () {
  console.log("Server iniciado");
});
