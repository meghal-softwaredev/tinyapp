const { assert } = require('chai');
const { findUserByEmail, generateRandomString, urlsForUser, authenticateUser, validateRegistration } = require('../helperFunctions/helper');

describe('findUserByEmail', () => {
  it('should return a user with valid email', () => {
    const user = findUserByEmail("a@a.com");
    assert.strictEqual(user, "userRandomID");
  });

  it('should return a undefined if non existent email', () => {
    const user = findUserByEmail("user@exam.com");
    assert.strictEqual(user, undefined);
  });
});

describe('generateRandomString', () => {
  it('should return string of length 6', () => {
    const randomString = generateRandomString();
    assert.strictEqual(randomString.length, 6);
  });
});

describe('urlsForUser', () => {
  it('should return urls for user', () => {
    const result = urlsForUser("user2RandomID");
    const expectedOutput = {
      i3BoGr: "https://www.google.ca", 
      i3BoKr: "https://www.facebook.ca",
      i3RoGr: "https://www.twitter.ca"
    };
    assert.deepEqual(result, expectedOutput);
  });

  it('should return {} for invalid user', () => {
    const result = urlsForUser("abc");
    assert.deepEqual(result, {});
  });
});

describe('authenticateUser', () => {
  it('return error if no user found with valid email', () => {
    const result = authenticateUser("c@c.com", "abc");
    const expectedOutput = { 
      user: null, 
      error: 'Wrong Credentials' 
    };
    assert.deepEqual(result, expectedOutput);
  });

  it('return error if password mismatch', () => {
    const result = authenticateUser("a@a.com", "abc");
    const expectedOutput = { 
      user: null, 
      error: 'Wrong Credentials' 
    };
    assert.deepEqual(result, expectedOutput);
  });

  it('should return a user with valid email and password', () => {
    const result = authenticateUser("a@a.com", "purple-monkey-dinosaur");
    const expectedOutput = {
      user: "userRandomID",
      error: null
    }
    assert.deepEqual(result, expectedOutput);
  });
});

describe('validateRegistration', () => {
  it('should return error if no email provided', () => {
    const result = validateRegistration('','abc');
    let expectedOutput = { error: 'Enter valid Email/Password' };
    assert.deepEqual(result, expectedOutput);
  });

  it('should return error if no password provided', () => {
    const result = validateRegistration('c@c.com','');
    let expectedOutput = { error: 'Enter valid Email/Password' };
    assert.deepEqual(result, expectedOutput);
  });

  it('should return error if email already exists', () => {
    const result = validateRegistration('a@a.com','purple-monkey-dinosaur');
    let expectedOutput = { error: 'Email already exists.' };
    assert.deepEqual(result, expectedOutput);
  });

  it('should return no errors if new email and password', () => {
    const result = validateRegistration('c@c.com','bootcamp-rocks');
    let expectedOutput = { error: null };
    assert.deepEqual(result, expectedOutput);
  })
});