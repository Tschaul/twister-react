module.exports = EventListenerMixin = function (eventtype) {
  
  return {
    componentDidMount: function() {
      window.addEventListener(eventtype, this["on"+scrolledtobottom]);
    },
    componentWillUnmount: function() {
      window.removeEventListener(eventtype, this["on"+scrolledtobottom]);
    }
  }
  
}