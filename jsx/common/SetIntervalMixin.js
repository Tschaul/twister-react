module.exports = SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    if (arguments[1]) {
      this.intervals.push(setInterval.apply(null, arguments));
    } else {
      console.log("setInterval requested with malformed interval argument");
    }
  },
  componentWillUnmount: function() {
    this.intervals.map(clearInterval);
  }
};