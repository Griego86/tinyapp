const generateRandomString = function() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let count = 0; count < 6; count++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const getUserByEmail = function(email, userDatabase) {
  for (let user in userDatabase) {
    if (userDatabase[user].email === email) {
      return userDatabase[user];
    }
  }
  return null;
};

const urlsForUser = function(userID, urlDatabase) {
  let urls = {};
  for (let urlID in urlDatabase) {
    if (userID === urlDatabase[urlID].userID) {
      urls[urlID] = urlDatabase[urlID];
    }
  }
  return urls;
};

const checkUrlId = function(urlID, userID, urlDatabase) {
  const userDatabase = urlsForUser(userID, urlDatabase); 
  if (Object.keys(userDatabase).includes(urlID)) {
    return true;
  }
  return false;
};

// Visitor count function

const getUniqueVisitorCount = function(visitorList) {
  let uniqueList = [];
  let count = 0;
  if (!Array.isArray(visitorList)) {
    return;
  }
  for (let visit of visitorList) {
    const visitorID = visit[0];
    if (!uniqueList.includes(visitorID)) {  
      uniqueList.push(visitorID);
    }
  }
  count = uniqueList.length;
  return count;
};

module.exports = { generateRandomString, getUserByEmail, urlsForUser, checkUrlId, getUniqueVisitorCount };