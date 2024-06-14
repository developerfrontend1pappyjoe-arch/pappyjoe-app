import {Dimensions} from 'react-native';

function isValidEmail(email: string) {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  return emailRegex.test(email);
}

function isValidPhoneNumber(phoneNumber: string) {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phoneNumber);
}

const isRequiredField = (text: string) => {
  if (text !== '' && text.trim() !== '' && text.trim().length >= 0) {
    return true;
  } else return false;
};

const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

export {
  isValidPhoneNumber,
  isValidEmail,
  isRequiredField,
  deviceWidth,
  deviceHeight,
};
