/**
 * Check if the given identifier is a valid Indian mobile number
 * Supports:
 * 9876543210
 * +919876543210
 * 919876543210
 *
 * @param {string} identifier
 * @returns {boolean}
 */

const isPhone = (identifier) => {
  const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
  return phoneRegex.test(identifier.trim());
};

module.exports = isPhone;