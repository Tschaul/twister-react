module.exports = EventListenerMixin = function (eventtype) {
  
  return {
    componentDidMount: function() {
      window.addEventListener(eventtype, this.handleResize);
    },
    componentWillUnmount: function() {
      window.removeEventListener(eventtype, this.handleResize);
    }
  }
  
}