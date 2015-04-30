var React = require('react');
var SetIntervalMixin = require("../common/SetIntervalMixin.js");
var SafeStateChangeMixin = require('../common/SafeStateChangeMixin.js');
var EventListenerMixin = require('../common/EventListenerMixin.js');
var AppSettingsMixin = require('../common/AppSettingsMixin.js');


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
    SafeStateChangeMixin,
    AppSettingsMixin
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
        React.createElement(ListGroup, null, 
          React.createElement(ListGroupItem, null, "Settings"), 
          React.createElement(ListGroupItem, null, 
            React.createElement("form", {onSubmit: this.handeSettingsUpdate, className: "form-horizontal"}, 
              React.createElement(Input, {type: "text", label: "pollInterval", 
                defaultValue: this.state.appSettings.pollInterval, labelClassName: "col-xs-4", 
                wrapperClassName: "col-xs-8", className: "settings-pollInterval"}), 
              React.createElement(Input, {type: "text", label: "pollIntervalProfile", 
                defaultValue: this.state.appSettings.pollIntervalProfile, labelClassName: "col-xs-4", 
                wrapperClassName: "col-xs-8", className: "settings-pollIntervalProfile"}), 
              React.createElement(Input, {type: "text", label: "ignoredUsers", 
                defaultValue: this.state.appSettings.ignoredUsers, labelClassName: "col-xs-4", 
                wrapperClassName: "col-xs-8", className: "settings-ignoredUsers"}), 
              React.createElement(Input, {type: "submit", value: "Save", wrapperClassName: "col-xs-offset-10 col-xs-2"})
            )
          )
        )
      );
  }
});