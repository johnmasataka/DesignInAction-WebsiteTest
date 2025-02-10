const validator = require('validator');
//import validator from 'validator';


function isValidPhoneNumber(phoneNumber) {
  return validator.isMobilePhone(phoneNumber, 'any');
}

module.exports = {
  isValidPhoneNumber
};


