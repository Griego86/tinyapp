const bcrypt = require("bcryptjs");
const PORT = 8080; 

const logInLink = `<a href='http://localhost:${PORT}/login'>log in</a>`;
const registerLink = `<a href='http://localhost:${PORT}/register'>register</a>`;

const logInPrompt = `Please ${logInLink} to view TinyURLs page.\n`;
const logInRegisterPrompt = `Please ${logInLink} or ${registerLink} to view TinyURL page.\n`;

const urlDoesNotExistMsg = `The TinyURL does not exist.\n`;
const doesNotOwnURLMsg = `Attention: This user does not own the TinyURL.\n`;
const unauthorizedDeleteMsg = `Attention: Please ${logInLink} to delete TinyURL.\n`;
const unauthorizedUpdateMsg = `Attention: Please ${logInLink} to view, add or modify TinyURL.\n`;

const emptyFieldsLoginMsg = `The Email and Password fields cannot be empty. Try ${logInLink} again.\n`;
const emptyFieldsRegisterMsg = `The Email and Password field cannot be empty. Try ${registerLink} again.\n`;
const invalidEmailMsg = `The user with this email address is not found. Please ${registerLink} to log in.\n`;
const invalidPasswordMsg = `Password incorrect. Please ${logInLink} and try again.\n`;
const emailExistsMsg = `An account with this email already exists.\n`;

const urlDatabase = {
};

const users = {
};

module.exports = {
  PORT,
  logInPrompt,
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
  users };