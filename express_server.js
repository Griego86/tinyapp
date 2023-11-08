const express = require("express");
const methodOverride = require("method-override");

const cookieSession = require("cookie-session");  
const bcrypt = require("bcryptjs");  

const { PORT, logInPrompt, 
  logInRegisterPrompt, 
  urlDoesNotExistMsg, 
  doesNotOwnURLMsg, 
  unauthorizedDeleteMsg,
  unauthorizedUpdateMsg,
  emptyFieldsLoginMsg,
  emptyFieldsRegisterMsg,
  invalidEmailMsg,
  invalidPasswordMsg,
  emailExistsMsg,
  urlDatabase,
  users } = require("./constants");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));
app.use(cookieSession({
  name: "session",
  secret: "p9Q!sL@3vE#zT2fG_8dR/wM",
  maxAge: 86400000 
}));

const { generateRandomString, getUserByEmail, urlsForUser, checkUrlId, getUniqueVisitorCount } = require("./helpers");

// app.get

app.get("/", (req, res) => {
  const userID = req.session.user_id;
  if (users[userID]) {
    return res.redirect("/urls");
  }
  return res.redirect("/login");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const userID = req.session.user_id;
  const templateVars = {
    users,
    user_id: userID,
    urls: urlsForUser(userID, urlDatabase)
  };
  if (users[userID]) {
    return res.render("urls_index", templateVars);
  }
  return res.status(403).send(`${logInPrompt}`);
});

app.get("/urls/new", (req, res) => {
  const userID = req.session.user_id;
  const templateVars = {
    users,
    user_id: userID
  };
  if (users[userID]) {
    return res.render("urls_new", templateVars);
  }
  return res.redirect("/login");
});

app.get("/urls/:id", (req, res) => {
  const userID = req.session.user_id;
  const urlID = req.params.id;
  if (!urlDatabase[urlID]) {
    return res.status(404).send(`${urlDoesNotExistMsg}`);
  }
  const templateVars = {
    users,
    id: urlID,
    longURL: urlDatabase[urlID].longURL,
    user_id: userID,
    visitorID:  urlDatabase[urlID].visitorID,
    totalVisits: urlDatabase[urlID].totalVisits,
    uniqueVisits: urlDatabase[urlID].uniqueVisits,
  };
  if (!users[userID]) {
    return res.status(403).send(`${logInRegisterPrompt}`);
  }
  if (!checkUrlId(urlID, userID, urlDatabase)) {
    return res.status(403).send(`${doesNotOwnURLMsg}`);
  }
  return res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const urlID = req.params.id;
  const urlIDObject = urlDatabase[urlID];
  if (!urlIDObject) {
    return res.status(404).send(`${urlDoesNotExistMsg}`);
  }
  const longURL = urlDatabase[urlID].longURL;
  const newVisitorID = generateRandomString();
  const currentTime = new Date().toString();
  if (!req.session.isNew && req.session.visitorID) {
    urlIDObject.totalVisits += 1;
    urlIDObject.visitorID.push([req.session.visitorID, currentTime]);
    urlIDObject.uniqueVisits = getUniqueVisitorCount(urlIDObject.visitorID);
    return res.redirect(longURL);
  }
  req.session.visitorID = newVisitorID;
  urlIDObject.totalVisits += 1;
  urlIDObject.visitorID.push([req.session.visitorID, currentTime]);
  urlIDObject.uniqueVisits = getUniqueVisitorCount(urlIDObject.visitorID);
  return res.redirect(longURL);
});


app.get("/register", (req, res) => {
  const userID = req.session.user_id;
  const templateVars = {
    users,
    user_id: userID
  };
  if (users[userID]) {
    return res.redirect("/urls");
  }
  return res.render("urls_registration", templateVars);
});

app.get("/login", (req, res) => {
  const userID = req.session.user_id;
  const templateVars = {
    users,
    user_id: userID
  };
  if (!users[userID]) {
    return res.render("urls_login", templateVars);
  }
  return res.redirect("/urls");
});

// app.post, delete, put

app.post("/urls", (req, res) => {
  const userID = req.session.user_id;
  const randomString = generateRandomString();
  let longURL = req.body.longURL;
  if (!users[userID]) {
    return res.status(403).send(`${unauthorizedUpdateMsg}`);
  }
  if (longURL === "") {
    return res.redirect("/urls/new");
  }
  if (!(longURL.includes("https://") || longURL.includes("http://"))) {
    longURL = `https://${longURL}`;
  }
  urlDatabase[randomString] = {
    longURL,
    userID,
    visitorID: [],
    totalVisits: 0,
    uniqueVisits: 0
  };
  return res.redirect(`/urls/${randomString}`);
});


app.delete("/urls/:id/delete", (req, res) => {
  const userID = req.session.user_id;
  const urlID = req.params.id;
  if (!userID) {
    return res.status(401).send(`${unauthorizedDeleteMsg}`);
  }
  if (!urlDatabase[urlID]) {
    return res.status(404).send(`${urlDoesNotExistMsg}`);
  }
  if (!checkUrlId(urlID, userID, urlDatabase)) {
    return res.status(401).send(`${doesNotOwnURLMsg}`);
  }
  delete urlDatabase[urlID];
  return res.redirect("/urls");
});

app.put("/urls/:id", (req, res) => {
  const userID = req.session.user_id;
  const urlID = req.params.id;
  let newlongURL = req.body.UpdatedLongURL;
  if (!userID) { 
    return res.status(401).send(`${unauthorizedUpdateMsg}`);
  }
  if (!urlDatabase[urlID]) {
    return res.status(404).send(`${urlDoesNotExistMsg}`);
  }
  if (!checkUrlId(urlID, userID, urlDatabase)) {
    return res.status(401).send(`${doesNotOwnURLMsg}`);
  }
  if (!(newlongURL.includes("https://") || newlongURL.includes("http://"))) {
    newlongURL = `https://${newlongURL}`;
  }
  urlDatabase[urlID].longURL = newlongURL;
  return res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email, users);
  if (email === "" || password === "") {
    return  res.status(400).send(`${emptyFieldsLoginMsg}`);
  }
  if (user === null) {
    return res.status(404).send(`${invalidEmailMsg}`);
  }
  if (bcrypt.compareSync(password, user.password)) {
    req.session.user_id = user.id;
    return res.redirect("/urls");
  }
  return res.status(400).send(`${invalidPasswordMsg}`);
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

app.post("/register", (req, res) => {
  const id = generateRandomString();
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  if (email === "" || password === "") {
    return  res.status(400).send(`${emptyFieldsRegisterMsg}`);
  }
  if (getUserByEmail(email, users) !== null) {
    return res.status(400).send(`${emailExistsMsg}`);
  }
  users[id] = {
    id,
    email,
    password: hashedPassword
  };
  req.session.user_id = id;
  res.redirect("/urls");
});

// app.listen

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});