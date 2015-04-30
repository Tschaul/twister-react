var React = require('react');
var SetIntervalMixin = require("../common/SetIntervalMixin.js");
var SafeStateChangeMixin = require('../common/SafeStateChangeMixin.js');
var EventListenerMixin = require('../common/EventListenerMixin.js');


var ReactBootstrap = require('react-bootstrap')
  , NavItem = ReactBootstrap.NavItem
  , Nav = ReactBootstrap.Nav
  , ListGroup = ReactBootstrap.ListGroup
  , ListGroupItem = ReactBootstrap.ListGroupItem
  , Panel = ReactBootstrap.Panel
  , Glyphicon = ReactBootstrap.Glyphicon
  , Button = ReactBootstrap.Button
  , Input = ReactBootstrap.Input

module.exports = Home = React.createClass({displayName: "Home",
    
  mixins: [
    SetIntervalMixin,
    SafeStateChangeMixin
  ],
  contextTypes: {
    router: React.PropTypes.func
  },
  handeSettingsUpdate: function (e) {
    e.preventDefault();
    
    var newsettings = {}
    
    newsettings.pollInterval = $(this.getDOMNode()).find(".settings-pollInterval").val();
    newsettings.pollIntervalProfile = $(this.getDOMNode()).find(".settings-pollIntervalProfile").val();
    newsettings.ignoredUsers = $(this.getDOMNode()).find(".settings-ignoredUsers").val();
    
    console.log(newsettings)
    
    localStorage.setItem("twister-react-settings",JSON.stringify(newsettings));
    
    var event = new CustomEvent('appsettingschanged',{detail: newsettings});
    window.dispatchEvent(event);
    
    return;
  },
  render: function() {
    return (
        React.createElement(Panel, {header: "Settings"}, 
          React.createElement("form", {onSubmit: this.handeSettingsUpdate, className: "form-horizontal"}, 
            React.createElement(Input, {type: "text", label: "pollInterval", 
              value: this.state.appSettings.pollInterval, labelClassName: "col-xs-2", 
              wrapperClassName: "col-xs-10", className: "settings-pollInterval"}), 
            React.createElement(Input, {type: "text", label: "pollIntervalProfile", 
              value: this.state.appSettings.pollIntervalProfile, labelClassName: "col-xs-2", 
              wrapperClassName: "col-xs-10", className: "settings-pollIntervalProfile"}), 
            React.createElement(Input, {type: "text", label: "ignoredUsers", 
              value: this.state.appSettings.ignoredUsers, labelClassName: "col-xs-2", 
              wrapperClassName: "col-xs-10", className: "settings-ignoredUsers"}), 
            React.createElement(Input, {type: "submit", value: "Save", wrapperClassName: "col-xs-offset-10 col-xs-2"})
          )
        )
      );
  }
});