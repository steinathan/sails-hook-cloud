module.exports = function(data = {}) {
  /** TODO
   * Check if running on production or development then serialize the data
   */
  return JSON.parse(JSON.stringify(data));
};
