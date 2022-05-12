var express = require('express');
var app = express();
var myParser = require("body-parser");
var mysql = require('mysql');
var flash = require('flash');
const { Console } = require('console');


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

    // Now build the response: table of result and form to do another query
    response_form = `<form action="report.html" method="GET">`;
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

    // Now build the response: table of result and form to do another query
    response_form = `<form action="treatment.html" method="GET">`;
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

    // Now build the response: table of result and form to do another query
    response_form = `<form action="report.html" method="GET">`;
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

    // Now build the response: table of result and form to do another query
    response_form = `<form action="report.html" method="GET">`;
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
  // remake this query and make sure that it all makes sense and that all of the names are correct
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



  /// create an error message for if ssn already exisits
  query = "INSERT INTO patient VALUES (" + `"${Ssn}"` + "," + `"${Bdate}"` + "," + `"${Fname}"` + "," + `"${Minit}"` + "," + `"${Lname}"` + "," + `"${Address}"` + "," + `"${Gender}"` + "," + `"${Inumber}"` + "," + `"${Phone}"` + "," + `"${Email}"` + ");";

  con.query(query, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    var res_string = JSON.stringify(result);
    var res_json = JSON.parse(res_string);
    console.log(res_json);
    console.log('patient added');
    response.redirect('./schedule.html');
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

// create appointment for returning patient
function query_returnapp (POST, response) {

  Pnum = POST['Pnum'];
  Date = POST['Date'];
  Cost = POST['Cost'];
  Employee_number = POST['Employee_number'];
  Inum = POST['Inum'];
  Anum = POST ['Anum'];
  Anumber = POST['Anumber'];
  P_ssn = POST['P_ssn'];
  Employee_num = POST['Employee_num'];
  Date_time = POST['Date_time'];

  console.log(Pnum);
  console.log(Date);
  console.log(Cost);
  console.log(Employee_number);
  console.log(Inum);
  console.log(Anum);
  console.log(Anumber);
  console.log(P_ssn);
  console.log(Employee_num);
  console.log(Date_time);

  query = "INSERT INTO Bill VALUES ("+`"${Pnum}"`+","+`"${Date}"`+", "+`"${Cost}"`+", "+`"${Employee_number}"`+","+`"${Inum}"`+","+`"${Anum}"`+"); INSERT INTO Appointments VALUES ("+`"${Anumber}"`+", "+`"${P_ssn}"`+", "+`"${Employee_num}"`+", "+`"${Date_time}"`+");";

  con.query(query, function (err, result, fields){
    if (err) throw err;
    console.log(result);
    var res_string = JSON.stringify(result);
    var res_json = JSON.parse(res_string);
    console.log(res_json);
    console.log('New Appointment Added');
    response.redirect('./schedule.html');
  });

}

app.all('*', (request, response, next) => {
  console.log(request.method + ' to ' + request.path);
  next();
});

app.post('/return_pat_book', function (request, response) {
  let POST = request.body;
  query_returnapp(POST, response);
});


// Function for weekly Appointments
function query_appw (POST, response){


  query ="SELECT Anumber, Date_time, Fname, Lname FROM Appointments, Patient WHERE P_ssn = Ssn AND Date_time BETWEEN '2022-05-01' AND '2022-05-07' GROUP BY Anumber;"

con.query(query, function (err, result, fields){
  if (err) throw err;
  console.log(result);
  var res_string = JSON.stringify(result);
  var res_json = JSON.parse(res_string);
  console.log(res_json);
  console.log('result');

  response_form = `<form action="report.html" method="GET">`;
    response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
    response_form += `<tr><td>Appointment number</td><td>Date and time</td><td>First Name</td><td>Last Name</td></tr>`;
    for (i in res_json) {
      response_form += `<tr><td> ${res_json[i].Anumber}</td>`;
      response_form += `<td> ${res_json[i].Date_time}</td>`;
      response_form += `<td> ${res_json[i].Fname} </td>`;
      response_form += `<td> ${res_json[i].Lname} </td></tr>`;
    }
    response_form += "</table>";
    response_form += `<input type="submit" value="See other reports"> </form>`;
    response.send(response_form);
});
}
app.all('*', function (request, response, next) {
  console.log(request.method + ' to ' + request.path);
  next();
});

app.post("/process_app_week", function (request, response) {
  let POST = request.body;
  query_appw (POST, response);
});


// function for monthly appointments
function query_appm (POST, response){


  query ="SELECT Anumber, Date_time, Fname, Lname FROM Appointments, Patient WHERE P_ssn = Ssn AND Date_time BETWEEN '2022-05-01' AND '2022-05-31' GROUP BY Anumber;"

con.query(query, function (err, result, fields){
  if (err) throw err;
  console.log(result);
  var res_string = JSON.stringify(result);
  var res_json = JSON.parse(res_string);
  console.log(res_json);
  console.log('result');

  response_form = `<form action="report.html" method="GET">`;
    response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
    response_form += `<tr><td>Appointment number</td><td>Date and time</td><td>First Name</td><td>Last Name</td></tr>`;
    for (i in res_json) {
      response_form += `<tr><td> ${res_json[i].Anumber}</td>`;
      response_form += `<td> ${res_json[i].Date_time}</td>`;
      response_form += `<td> ${res_json[i].Fname} </td>`;
      response_form += `<td> ${res_json[i].Lname} </td></tr>`;
    }
    response_form += "</table>";
    response_form += `<input type="submit" value="See other reports"> </form>`;
    response.send(response_form);
});
}
app.all('*', function (request, response, next) {
  console.log(request.method + ' to ' + request.path);
  next();
});

app.post("/process_app_month", function (request, response) {
  let POST = request.body;
  query_appm (POST, response);
});

// function for weekly sales
function query_salesw (POST, response){
  query = "SELECT Anum, Cost, Date FROM bill WHERE Date BETWEEN '2022-05-01' AND '2022-05-07' GROUP BY Anum;"
  con.query(query, function (err, result, fields){
    if (err) throw err;
  console.log(result);
  var res_string = JSON.stringify(result);
  var res_json = JSON.parse(res_string);
  console.log(res_json);
  console.log('result');

  // change this so it fits the table
  response_form = `<form action="report.html" method="GET">`;
  response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
  response_form += `<tr><td>Appointment number</td><td>Date</td><td>Cost</td></tr>`;

  // create this table here (the headings)
  for (i in res_json) {
    response_form += `<tr><td> ${res_json[i].Anum}</td>`;
    response_form += `<td> ${res_json[i].Date} </td>`;
    response_form += `<td> ${res_json[i].Cost}</td></tr>`;

  }
  response_form += "</table>";
    response_form += `<input type="submit" value="See other reports"> </form>`;
    response.send(response_form);

  });
}
app.all('*', function (request, response, next) {
  console.log(request.method + ' to ' + request.path);
  next();
});

app.post("/process_sales_week", function (request, response) {
  let POST = request.body;
  query_salesw (POST, response);
});

// function for monthly sales
function query_salesm (POST, response){
query = "SELECT Anum, Cost, Date FROM bill WHERE Date BETWEEN '2022-05-01' AND '2022-05-31' GROUP BY Anum;"
  con.query(query, function (err, result, fields){
    if (err) throw err;
  console.log(result);
  var res_string = JSON.stringify(result);
  var res_json = JSON.parse(res_string);
  console.log(res_json);
  console.log('result');

  // change this so it fits the table
  response_form = `<form action="report.html" method="GET">`;
  response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
  response_form += `<tr><td>Appointment number</td><td>Cost</td><td>Date</td></tr>`;
  // create this table here (the headings)
  for (i in res_json) {
    response_form += `<tr><td> ${res_json[i].Anum}</td>`;
    response_form += `<td> ${res_json[i].Date} </td></tr>`;
    response_form += `<td> ${res_json[i].Cost}</td>`;
  }
  response_form += "</table>";
    response_form += `<input type="submit" value="See other reports"> </form>`;
    response.send(response_form);

  });
}
app.all('*', function (request, response, next) {
  console.log(request.method + ' to ' + request.path);
  next();
});

app.post("/process_sales_month", function (request, response) {
  let POST = request.body;
  query_salesm (POST, response);
});

// last appointment
function query_salesm (POST, response){
query = "SELECT Fname, Lname, MAX(Date) AS maxd FROM patient, bill WHERE Ssn = Pnum;";
  con.query(query, function (err, result, fields){
      if (err) throw err;
    console.log(result);
    var res_string = JSON.stringify(result);
    var res_json = JSON.parse(res_string);
    console.log(res_json);
    console.log('result');
  
    // change this so it fits the table
    response_form = `<form action="report.html" method="GET">`;
    response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
    response_form += `<tr><td>First Name</td><td>Last Name</td><td>Date</td></tr>`;
    // create this table here (the headings)
    for (i in res_json) {
      response_form += `<tr><td> ${res_json[i].Fname}</td>`;
      response_form += `<td> ${res_json[i].Lname}</td>`;
      response_form += `<td> ${res_json[i].maxd} </td></tr>`;
    }
    response_form += "</table>";
      response_form += `<input type="submit" value="See other reports reports"> </form>`;
      response.send(response_form);
  
    });
  }
  app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
  });
  
  app.post("/process_lastapp", function (request, response) {
    let POST = request.body;
    query_salesm (POST, response);
  });

  // Patients with no shows
  function noshow (POST, response){
    query = "SELECT Fname, Lname, COUNT(Ssn) AS NumP FROM patient WHERE Ssn IN (SELECT Pat_ssn FROM no_Show WHERE Ssn = Pat_ssn);";
    con.query(query, function (err, result, fields){
      if (err) throw err;
    
    console.log(result);
    var res_string = JSON.stringify(result);
    var res_json = JSON.parse(res_string);
    console.log(res_json);
    console.log('result');
  
    response_form = `<form action="report.html" method="GET">`;
    response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
    response_form += `<tr><td>First Name</td><td>Last Name</td><td>Number of No-Shows</td></tr>`;

    for (i in res_json) {
      response_form += `<tr><td> ${res_json[i].Fname}</td>`;
      response_form += `<td> ${res_json[i].Lname}</td>`;
      response_form += `<td> ${res_json[i].NumP} </td></tr>`;
    }
    response_form += "</table>";
    response_form += `<input type="submit" value="See other reports"> </form>`;
    response.send(response_form);
  });
  }

  app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
  });
  
  app.post("/process_noshow", function (request, response) {
    let POST = request.body;
    noshow (POST, response);
  });

// Injury trends

function injury_trend (POST, response){
  query ="SELECT Pob, COUNT(Pob) AS nob FROM type_of_injury GROUP BY Pob;";
  
  con.query(query, function (err, result, fields){
  if (err) throw err;
  
  console.log(result);
  var res_string = JSON.stringify(result);
  var res_json = JSON.parse(res_string);
  console.log('result');

  response_form = `<form action="report.html" method="GET">`;
    response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
      response_form += `<tr><td>Part of the body</td><td>Number of injuries</td></tr>`;
  
  for (i in res_json) {
  response_form += `<tr><td> ${res_json[i].Pob}</td>`;
        response_form += `<td> ${res_json[i].nob}</td>/tr>`;
  }
  
  response_form += "</table>";
      response_form += `<input type="submit" value="See other reports reports"> </form>`;
      response.send(response_form);
  
  });
  }
  app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
  });
  
  app.post("/process_itrend", function (request, response) {
    let POST = request.body;
    injury_trend (POST, response);
  });

  // appointents per employee

  function app_per_employee (POST, response){
    query ="SELECT Fname, Employee_num, COUNT(Anumber) AS Noapp, COUNT(Employee_num) AS Appperpt FROM Employee, Appointments WHERE Date_time BETWEEN '2022-05-01' AND '2022-05-31'AND Enumber=Employee_num GROUP BY Employee_num;";
    
    con.query(query, function (err, result, fields){
    if (err) throw err;
    
    console.log(result);
    var res_string = JSON.stringify(result);
    var res_json = JSON.parse(res_string);
    console.log('result');
    
    response_form = `<form action="report.html" method="GET">`;
        response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
        response_form += `<tr><td>Employee Number</td><td>Number of Appointments</td></tr>`;
    
    for (i in res_json) {
    response_form += `<tr><td> ${res_json[i].Employee_num}</td>`;
          response_form += `<td> ${res_json[i].Appperpt}</td></tr>`;
    }
    
    response_form += "</table>";
        response_form += `<input type="submit" value="See other reports reports"> </form>`;
        response.send(response_form);
    
    });
    }
    
    app.all('*', function (request, response, next) {
        console.log(request.method + ' to ' + request.path);
        next();
      });
      
      app.post("/process_app_per_employee", function (request, response) {
        let POST = request.body;
        app_per_employee (POST, response);
      });
    
// Patient progress specifically for bill
function pat_progress (POST, response){
  query ="SELECT Fname, Lname, Pob, Type, Start_date, Notes FROM Patient, type_of_injury, patient_notes WHERE Ssn = P_num AND Fname ='Bill' GROUP BY P_num;";
  
  con.query(query, function (err, result, fields){
  if (err) throw err;
  
  console.log(result);
  var res_string = JSON.stringify(result);
  var res_json = JSON.parse(res_string);
  console.log('result');
  
  response_form = `<form action="treatment.html" method="GET">`;
      response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
      response_form += `<tr><td>First Name</td><td>Last Name</td><td>Part of Body</td><td>Injury Type</td><td>Start Date</td><td>Notes</td></tr>`;
  
  for (i in res_json) {
  response_form += `<tr><td> ${res_json[i].Fname}</td>`;
        response_form += `<td> ${res_json[i].Lname}</td>`;
        response_form += `<td> ${res_json[i].Pob}</td>`;
        response_form += `<td> ${res_json[i].Type}</td>`;
        response_form += `<td> ${res_json[i].Start_date}</td>`;
        response_form += `<td> ${res_json[i].Notes} </td></tr>`;
  }
  
  response_form += "</table>";
      response_form += `<input type="submit" value="Back to reports"> </form>`;
      response.send(response_form);
  
  });
  }
  
  app.all('*', function (request, response, next) {
      console.log(request.method + ' to ' + request.path);
      next();
    });
    
    app.post("/process_progress", function (request, response) {
      let POST = request.body;
      pat_progress (POST, response);
    });
  

app.listen(8080, () => console.log(`listening on port 8080`));