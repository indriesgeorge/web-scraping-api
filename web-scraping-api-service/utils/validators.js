const URL = require("url").URL;

exports.validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (ex) {
    return false;
  }
};
