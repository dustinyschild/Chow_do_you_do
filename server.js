const pg = require('pg');
const express = require('express');
//const bodyParser = require('body-parser');
const requestProxy = require('express-request-proxy');
const PORT = process.env.PORT || 3000;
const app = express();
const conString = process.env.DATABASE_URL || 'postgres://postgres:DeltaV@localhost:5432/chow';
const client = new pg.Client(conString);
client.connect();
client.on('error', err => console.error(err));

app.use(express.static('./public'));

function proxyEdamam(request, response){
  console.log(`Routing Edamam request for ${request.params[0]}`);
  (requestProxy({
    url: `https://api.edamam.com/search${request.params[0]}`
  }))(request, response);
}

app.get('/edamam/*', proxyEdamam);
app.get('*', (request, response) => response.sendFile('index.html', {root: './public'}));

app.listen(PORT, ()=> console.log('express is listening on ' + PORT));

function createTables() {
  client.query(`
    CREATE TABLE IF NOT EXISTS
    users (
      user_id SERIAL PRIMARY KEY
      ,user_name VARCHAR(255) UNIQUE NOT NULL
    );`
  );
  client.query(`
    CREATE TABLE IF NOT EXISTS
    saved_recipes (
      saved_recipes_id SERIAL PRIMARY KEY
      ,user_id INTEGER NOT NULL REFERENCES users(user_id)
      ,body TEXT NOT NULL
      ,created DATETIME DEFAULT NOW()
    );`
  );
}
