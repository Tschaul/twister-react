module.exports = EventListenerMixin = function (eventtype) {
  
  return {
    componentDidMount: function() {
      window.addEventListener(eventtype, this["on"+eventtype]);
    },
    componentWillUnmount: function() {
      window.removeEventListener(eventtype, this["on"+eventtype]);
    }
  }
  
}