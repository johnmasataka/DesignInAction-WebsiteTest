const { isValidPhoneNumber } = require('./index');

test('valid phone number returns true', () => {
  expect(isValidPhoneNumber('555-555-5555')).toBe(true);
});

test('invalid phone number returns false', () => {
  expect(isValidPhoneNumber('abc')).toBe(false);
});
