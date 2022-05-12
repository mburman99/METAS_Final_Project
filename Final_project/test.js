var express = require('express');
var app = express();
var myParser = require("body-parser");
var mysql = require('mysql');
var flash = require('flash');


console.log("Connecting to localhost...");
var con = mysql.createConnection({
  host: '127.0.0.1',
  user: "root",
  port: 3306,
  database: "hpt",
  password: ""
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.use(express.static('./public'));
app.use(myParser.urlencoded({ extended: true }));

  
// for new patients need, patient, insurance company, bill, type of injury before can make appointment
function query_register(POST, response) {
    Ssn = POST['Ssn'];
    Bdate = POST['Bdate'];
    Fname = POST['Fname'];
    Minit = POST['Minit'];
    Lname = POST['Lname'];
    Address = POST['Address'];
    Gender = POST['Gender'];
    Inumber = POST['Inumber'];
    Phone = POST['Phone'];
    Email = POST['Email'];
    I_number = POST["I_number"];
    Name = POST['Name'];
    I_address = POST['I_address'];
    Pssn = POST['Pssn'];
    Part_of_body = POST['Part_of_body'];
    Start_date = POST['Start_date'];
    TYPE = POST['TYPE'];
    console.log(Ssn);
    console.log(Bdate);
    console.log(Fname);
    console.log(Minit);
    console.log(Lname);
    console.log(Address);
    console.log(Gender);
    console.log(Inumber);
    console.log(Phone);
    console.log(Email);
    console.log(I_number);
    console.log(Name);
    console.log(I_address);
    console.log(Pssn);
    console.log(Part_of_body);
    console.log(Start_date);
    console.log(TYPE);
    query = "SELECT ssn FROM Patient WHERE Ssn =" +`"${Ssn}"`;
    console.log(query);
    con.query(query, function(err, result, fields){
       var res_string = JSON.stringify(result);
       var res_json = JSON.parse(res_string);
        console.log(res_json);
        if (res_json.Ssn = POST['Ssn']){
             window.alert('Patient already exists, Please book an appointment');
    } else {
        add = "INSERT INTO Patient VALUES ("+ `"${Ssn}"`+","+ `"${Bdate}"`+","+ `"${Fname}"`+","+ `"${Minit}"`+","+ `"${Lname}"`+","+ `"${Address}"`+","+ `"${Gender}"`+","+ `"${Inumber}"`+","+ `"${Phone}"`+","+ `"${Email}"`+") INSERT INTO Insurance_company VALUES("+ `"${I_number}"`+","+ `"${Name}"`+","+ `"${I_address}"`+") INSERT INTO type_of_injury VALUES("+ `"${Pssn}"`+","+ `"${Part_of_body}"`+","+ `"${Start_date}"`+","+ `"${TYPE}"`+")";
        console.log ('New patient successfully added');
        con.query(add, function(err, result, fields){
            if (err) throw err;
            console.log(result);
            window.alert('New patient successfully added, Please book appointment');
        });
    }});
}

app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
  });

app.post('/register_patient', function (request, response){
  let POST = request.body;
  query_register(POST, response);
});

app.listen(8080, () => console.log(`listening on port 8080`));

    