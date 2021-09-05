const express = require('express');
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.set('view engine', 'ejs');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// GLOBAL STUFF \\

//Random string Generator
function generateRandomString() {
  const result = (Math.random() + 1).toString(36).substring(6);
  return result;
}

const emailChecker = (email) => {
  for (const user in users) {    
    if (users[user].email === email) {
      return user;
    }
  }
  return null;
};

//Global user object
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

// this is a JSON database of urls...proto shortener.
const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

app.post("/login", (req, res) => {
  const {email, password } = req.body;

  if (!emailChecker(email)) {
    res.status(403).send("Email not signed up.");
  } else {
    const user_id = emailChecker(email);
    if (users[user_id].password !== password) {
      res.status(403).send("Password incorrect");
    } else {
      res.cookie('user_id', user_id);
      res.redirect("/urls");
    }
  }

});

app.get('/login', (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]],
    urls: urlDatabase 
  };
  res.render("urls_login", templateVars);
});

// 
const addUser = (email, password) => {
  const id = generateRandomString()
  users[id] = {
    id,
    email,
    password
  };
  return id;
};

app.post("/logOn", (req,res) => {
  
  res.redirect("/login");
 
});



app.post("/signUp", (req,res) => {
  
res.redirect("/register");

});

// POST for generating smoll url w\ genrandom string
app.post('/urls', (req, res) => {
  const shortURL = generateRandomString(); // if long url exsists
  urlDatabase[shortURL] = req.body.longURL;
  
  res.redirect(`urls/${shortURL}`);
  
});

// POST for handling delete function
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');

});

app.post('/urls/:shortURL', (req, res) => {
  
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect('/urls');
});



app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');

});

//POST for logout button
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});


// user_id login using cookies
app.get('/register', (req, res) => {
  const templateVars = {

    user: users[req.cookies["user_id"]],
    urls: urlDatabase 
  };
  res.render("urls_register", templateVars);
});

// this registers the a handler on the root path of '/'
app.get('/', (req, res) => {
  res.redirect("/urls");
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// reguest handler for urldatabase
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});







//passes the URL data to temmplate3
app.get('/urls', (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]],
    urls: urlDatabase 
  };
  res.render('urls_index', templateVars);
});

//template for new urls page w/username banner
app.get('/urls/new', (req, res) => {
  let templateVars = { 
    user: users[req.cookies["user_id"]],
};
  res.render("urls_new", templateVars);
});

app.get('/urls/:shortURL', (req, res) => {

  const templateVars = { 
    user: users[req.cookies["user_id"]],
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

app.post('/register', (req, res) => {
  const {email, password } = req.body;
  if (emailChecker(email)) {
    return res.status(400).send('Email Already Registered');
  }   
  const user_id = addUser(email, password);
  console.log("Here it is", user_id)
  if (email === '' || password === '') {
    return res.status(400).send('400 Bad Request');
  } 
  
    res.cookie('user_id', user_id);
    res.redirect('/urls');
   
});


