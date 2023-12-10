var moment = require("moment");

const getDate = (unxTime) => {
  return moment.unix(parseInt(unxTime) / 1000).format("YYYY-MM-DD");
};

module.exports = { getDate };
