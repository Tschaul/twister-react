module.exports = AppSettingsMixin = {
  getInitialState: function() {
    this.appSettings = JSON.parse(localStorage.getItem("twister-react-settings"));
  },
  componentDidMount: function() {
    window.addEventListener("appsettingschanged", this.onappsettingschanged);
  },
  componentWillUnmount: function() {
    window.removeEventListener("appsettingschanged", this.onappsettingschanged);
  },
  onappsettingschanged: function() {
    
    this.setState({appSettings: JSON.parse(localStorage.getItem("twister-react-settings"))});
  
  }
  
};