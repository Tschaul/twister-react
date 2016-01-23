var React = require('react');
var SetIntervalMixin = require("../common/SetIntervalMixin.js");
var SafeStateChangeMixin = require('../common/SafeStateChangeMixin.js');
var EventListenerMixin = require('../common/EventListenerMixin.js');
var AppSettingsMixin = require('../common/AppSettingsMixin.js');

var ImportAccountModalButton = require('../other/ImportAccountModalButton.js');

var ReactBootstrap = require('react-bootstrap')
  , NavItem = ReactBootstrap.NavItem
  , Nav = ReactBootstrap.Nav
  , ListGroup = ReactBootstrap.ListGroup
  , ListGroupItem = ReactBootstrap.ListGroupItem
  , Panel = ReactBootstrap.Panel
  , Glyphicon = ReactBootstrap.Glyphicon
  , Button = ReactBootstrap.Button
  , Input = ReactBootstrap.Input

module.exports = Settings = React.createClass({
    
  mixins: [
    SetIntervalMixin,
    SafeStateChangeMixin,
    AppSettingsMixin
  ],
  handeSettingsUpdate: function (e) {
    e.preventDefault();
    
    var newsettings = {}
    
    newsettings.pollInterval = $(this.getDOMNode()).find(".settings-pollInterval").val();
    newsettings.pollIntervalProfile = $(this.getDOMNode()).find(".settings-pollIntervalProfile").val();
    newsettings.ignoredUsers = $(this.getDOMNode()).find(".settings-ignoredUsers").val();
    newsettings.host = $(this.getDOMNode()).find(".settings-host").val();
    newsettings.logging = $(this.getDOMNode()).find(".settings-logging").attr('checked');
    
    console.log(newsettings)
    
    localStorage.setItem("twister-react-settings",JSON.stringify(newsettings));
    
    var event = new CustomEvent('appsettingschanged',{detail: newsettings});
    window.dispatchEvent(event);
    
    return;
  },
  render: function() {
    return (
        <ListGroup>
          <ListGroupItem>Settings</ListGroupItem>
          <ListGroupItem>
            <form onSubmit={this.handeSettingsUpdate} className='form-horizontal'>
              <Input type='text' label='pollInterval' 
                defaultValue={this.state.appSettings.pollInterval} labelClassName='col-xs-4' 
                wrapperClassName='col-xs-8' className="settings-pollInterval"/>
              <Input type='text' label='pollIntervalProfile' 
                defaultValue={this.state.appSettings.pollIntervalProfile} labelClassName='col-xs-4' 
                wrapperClassName='col-xs-8' className="settings-pollIntervalProfile"/>
              <Input type='text' label='ignoredUsers' 
                defaultValue={this.state.appSettings.ignoredUsers} labelClassName='col-xs-4' 
                wrapperClassName='col-xs-8' className="settings-ignoredUsers"/>
              <Input type='text' label='host' 
                defaultValue={this.state.appSettings.host} labelClassName='col-xs-4' 
                wrapperClassName='col-xs-8' className="settings-host"/>
              <Input type='submit' value='Save' wrapperClassName='col-xs-offset-10 col-xs-2'/>
            </form>
          </ListGroupItem>
        </ListGroup>
      );
  }
});