/**
 * Check if the given identifier is a valid email address
 * @param {string} identifier
 * @returns {boolean}
 */

const isEmail = (identifier) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(identifier);
};

module.exports = isEmail;