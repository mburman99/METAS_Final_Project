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

// Showing all the patient data
function query_DB(POST, response) {
  query = "SELECT * FROM Patient ";  // Build the query string
  con.query(query, function (err, result, fields) {   // Run the query
    if (err) throw err;
    console.log(result);
    var res_string = JSON.stringify(result);
    var res_json = JSON.parse(res_string);
    console.log(res_json);

    // Now build the response: table of results and form to do another query
    response_form = `<form action="manager.html" method="GET">`;
    response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
    response_form += `<tr><td><B>Ssn</td><td><B>Bdate</td><td><B>Fname</td><td><B>Minit</td></b><td><b>Lname</b></td><td><b>Address</b></td><td><b>Gender</b></td><td><b>Inumber</b></td><td><b>Phone</b></td><td><b>Email</b></td></tr>`;
    for (i in res_json) {
      response_form += `<tr><td> ${res_json[i].Ssn}</td>`;
      response_form += `<td> ${res_json[i].Bdate}</td>`;
      response_form += `<td> ${res_json[i].Fname}</td>`;
      response_form += `<td> ${res_json[i].Minit}</td>`;
      response_form += `<td> ${res_json[i].Lname}</td>`;
      response_form += `<td> ${res_json[i].Address}</td>`;
      response_form += `<td> ${res_json[i].Gender}</td>`;
      response_form += `<td> ${res_json[i].Inumber}</td>`;
      response_form += `<td> ${res_json[i].Phone}</td>`;
      response_form += `<td> ${res_json[i].Email}</td></tr>`;
    }
    response_form += "</table>";
    response_form += `<input type="submit" value="Another Query?"> </form>`;
    response.send(response_form);
  });
}

app.all('*', function (request, response, next) {
  console.log(request.method + ' to ' + request.path);
  next();
});

app.post("/process_query", function (request, response) {
  let POST = request.body;
  query_DB(POST, response);
});

// showing the patient progress
function query_progress(POST, response) {
  query = "SELECT Fname, Minit, Lname, Notes FROM patient, patient_notes WHERE patient_notes.Ssn = patient.Ssn";  // Build the query string
  con.query(query, function (err, result, fields) {   // Run the query
    if (err) throw err;
    console.log(result);
    var res_string = JSON.stringify(result);
    var res_json = JSON.parse(res_string);
    console.log(res_json);

    // Now build the response: table of results and form to do another query
    response_form = `<form action="manager.html" method="GET">`;
    response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
    response_form += `<tr><td>First Name</td><td>Middle Initial</td><td>Last Name</td><td>Notes</td></tr>`;
    for (i in res_json) {
      response_form += `<tr><td> ${res_json[i].Fname}</td>`;
      response_form += `<td> ${res_json[i].Minit}</td>`;
      response_form += `<td> ${res_json[i].Lname}</td>`;
      response_form += `<td> ${res_json[i].Notes}</td> </tr>`;
    }
    response_form += "</table>";
    response_form += `<input type="submit" value="Another Query?"> </form>`;
    response.send(response_form);
  });
}

app.all('*', function (request, response, next) {
  console.log(request.method + ' to ' + request.path);
  next();
});

app.post("/process_query1", function (request, response) {
  let POST = request.body;
  query_progress(POST, response);
});

// showing appointments for the "week" and the total price of tem 
function query_billweek(POST, response) {
  query = "SELECT Ssn, Date, Cost, Enumber, Inumber, Anumber FROM Bill";  // Build the query string
  con.query(query, function (err, result, fields) {   // Run the query
    if (err) throw err;
    console.log(result);
    var res_string = JSON.stringify(result);
    var res_json = JSON.parse(res_string);
    console.log(res_json);

    // Now build the response: table of results and form to do another query
    response_form = `<form action="manager.html" method="GET">`;
    response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
    response_form += `<tr><td>Ssn</td><td>Date</td><td>Price</td><td>Enumber</td><td>Inumber</td><td>Anumber</td></tr>`;
    for (i in res_json) {
      response_form += `<tr><td> ${res_json[i].Ssn}</td>`;
      response_form += `<td> ${res_json[i].Date}</td>`;
      response_form += `<td> ${res_json[i].Cost}</td>`;
      response_form += `<td> ${res_json[i].Enumber}</td>`;
      response_form += `<td> ${res_json[i].Inumber}</td>`;
      response_form += `<td> ${res_json[i].Anumber}</td> </tr>`;
      // need to add th SUM function to see the sum and total prices /// also add from the shop and sales

    }
    response_form += "</table>";
    response_form += `<input type="submit" value="Another Query?"> </form>`;
    response.send(response_form);
  });
}

app.all('*', function (request, response, next) {
  console.log(request.method + ' to ' + request.path);
  next();
});

app.post("/process_query2", function (request, response) {
  let POST = request.body;
  query_billweek(POST, response);
});

// most recent appointment for patients
function query_mostrecentapp(POST, response) {
  query = "SELECT Fname, Lname, Date_time FROM patient, appointments WHERE Date_time =(SELECT MAX(Date_time) FROM appointments WHERE patient.Ssn = appointments.Ssn) GROUP BY Fname;";  // Build the query string
  con.query(query, function (err, result, fields) {   // Run the query
    if (err) throw err;
    console.log(result);
    var res_string = JSON.stringify(result);
    var res_json = JSON.parse(res_string);
    console.log(res_json);

    // Now build the response: table of results and form to do another query
    response_form = `<form action="manager.html" method="GET">`;
    response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
    response_form += `<tr><td>First Name</td><td>Last Name</td><td>Most Recent appointment</td></tr>`;
    for (i in res_json) {
      response_form += `<tr><td> ${res_json[i].Fname}</td>`;
      response_form += `<td> ${res_json[i].Lname}</td>`;
      response_form += `<td> ${res_json[i].Date_time} </tr>`;
      // need to add th SUM function to see the sum and total prices

    }
    response_form += "</table>";
    response_form += `<input type="submit" value="Another Query?"> </form>`;
    response.send(response_form);
  });
}

app.all('*', function (request, response, next) {
  console.log(request.method + ' to ' + request.path);
  next();
});

app.post("/process_query3", function (request, response) {
  let POST = request.body;
  query_mostrecentapp(POST, response);
});


// test to put in patient data look at the link chayse sent for how to do this cause this is wrong
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



  /// create an error message for if ssn already exisits
  query = "INSERT INTO patient VALUES (" + `"${Ssn}"` + "," + `"${Bdate}"` + "," + `"${Fname}"` + "," + `"${Minit}"` + "," + `"${Lname}"` + "," + `"${Address}"` + "," + `"${Gender}"` + "," + `"${Inumber}"` + "," + `"${Phone}"` + "," + `"${Email}"` + ");";
  //INSERT INTO insurance_company VALUES (" + `"${I_number}"` + "," + `"${Name}"` + "," + `"${I_address}"` + "); INSERT INTO type_of_injury VALUES (" + `"${Pssn}"` + "," + `"${Part_of_body}"` + "," + `"${Start_date}"` + "," + `"${TYPE}"` + ");";


  con.query(query, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    var res_string = JSON.stringify(result);
    var res_json = JSON.parse(res_string);
    console.log(res_json);
    console.log('patient added');
    window.alert('New patient successfully added');
  });
}
app.all('*', (request, response, next) => {
  console.log(request.method + ' to ' + request.path);
  next();
});

app.post('/register_patient', function (request, response) {
  let POST = request.body;
  query_register(POST, response);
});



app.listen(8080, () => console.log(`listening on port 8080`));