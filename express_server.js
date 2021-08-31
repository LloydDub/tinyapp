const express = require('express');

const app = express();

const PORT = 8080; // default port 8080

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set('view engine', 'ejs');

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));

// app.post('/urls', (req, res) => {
//   console.log(req.body);  // Log the POST request body to the console
//   res.send('Ok');         // Respond with 'Ok' (we will replace this)
// });

app.post("/login", (req,res) => {
  res.cookie('username', req.body.username);
  res.redirect("/urls");
});

 
app.post('/urls', (req, res) => {
  const shortURL = generateRandomString(); // if long url exsists
  urlDatabase[shortURL] = req.body.longURL;
  
  res.redirect(`urls/${shortURL}`);
  
});

app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');

});

app.post('/urls/:shortURL', (req, res) => {
  console.log(req.params);
  console.log(req.params.shortURL);
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect('/urls');
});



app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');

});

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect("/urls");
});



// app.get('/urls/:shortUrl', (req, res) => {
//   res.redirect(`urls/${req.params.shortURL}`);

// })

// this is a JSON database of urls...proto shortener.
const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

// this registers the a handler on the root path of '/'
app.get('/', (req, res) => {
  res.send('Hello!');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// reguest handler for urldatabase
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

//
app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>world</b></body></html>\n');
});

app.get('/set', (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});
 
app.get('/fetch', (req, res) => {
  res.send(`a = ${a}`);
});

//passes the URL data to temmplate3
app.get('/urls', (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase 
  };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  let templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});

app.get('/urls/:shortURL', (req, res) => {

  const templateVars = { 
    username: req.cookies["username"],
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL] 
  };
  res.render('urls_show', templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  if (!urlDatabase[req.params.shortURL]) {
    return res.send('Error, please check your shortened URL');
  }
  res.redirect(longURL);
});

function generateRandomString() {
  const result = (Math.random() + 1).toString(36).substring(6);
  return result;
}