module.exports = AppSettingsMixin = {
  getInitialState: function() {
    
    var state = {};
    
    if (!localStorage.getItem("twister-react-settings")) {
    
      state.appSettings = {
        
        pollInterval:60,
        pollIntervalProfile: 3600,
        ignoredUsers: "nobody"
      
      };
    
    } else {
      
      state.appSettings = JSON.parse(localStorage.getItem("twister-react-settings"));
    
    }
    
    console.log(state);
    
    return state;
    
  },
  componentDidMount: function() {
    window.addEventListener("appsettingschanged", this.onappsettingschanged);
  },
  componentWillUnmount: function() {
    window.removeEventListener("appsettingschanged", this.onappsettingschanged);
  },
  onappsettingschanged: function(event) {
    
    this.setState({appSettings: event.detail});
  
  }
  
};