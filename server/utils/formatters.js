function formatINR(amount) {
  return '₹' + Math.abs(Math.round(amount)).toLocaleString('en-IN');
}

function round(value, decimals = 2) {
  return parseFloat(value.toFixed(decimals));
}

module.exports = { formatINR, round };