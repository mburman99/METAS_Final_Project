var express = require('express');
var app = express();

console.log("Connecting to localhost...");
app.listen(8080, () => console.log(`listening on port 8080`));

app.use(express.static('./public'));

app.get('/*', function(req, res) {
    res.sendFile(path.resolve('./index.html'));
   });