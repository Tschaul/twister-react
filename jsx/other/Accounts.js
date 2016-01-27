var React = require('react');
var SetIntervalMixin = require("../common/SetIntervalMixin.js");
var SafeStateChangeMixin = require('../common/SafeStateChangeMixin.js');
var EventListenerMixin = require('../common/EventListenerMixin.js');
var AppSettingsMixin = require('../common/AppSettingsMixin.js');

var ImportAccountModalButton = require('../other/ImportAccountModalButton.js');
var ExportAccountModalButton = require('../other/ExportAccountModalButton.js');
var GenerateAccountModalButton = require('../other/GenerateAccountModalButton.js');

var ReactBootstrap = require('react-bootstrap')
  , NavItem = ReactBootstrap.NavItem
  , Nav = ReactBootstrap.Nav
  , ListGroup = ReactBootstrap.ListGroup
  , ListGroupItem = ReactBootstrap.ListGroupItem
  , Panel = ReactBootstrap.Panel
  , Glyphicon = ReactBootstrap.Glyphicon
  , Button = ReactBootstrap.Button
  , Input = ReactBootstrap.Input

module.exports = Accounts = React.createClass({
    
  mixins: [
    SetIntervalMixin,
    SafeStateChangeMixin,
    AppSettingsMixin 
  ],
  render: function() {
    
    var thisComponent = this; 
    
    return (
        <ListGroup>
          <ListGroupItem>Accounts</ListGroupItem>
          <ListGroupItem>
            <ImportAccountModalButton/>
            <GenerateAccountModalButton/>
            <hr/>
            {this.props.accounts.map(function(acc,index) {
              //console.log(acc,index)
              return (
                <div key={"miniprofile:"+acc.name}>
                  <MiniProfile username={acc.name} pollIntervalProfile={thisComponent.props.pollIntervalProfile}/>
                  <p>
                    {acc.status}
                    <ExportAccountModalButton username={acc.name}/>
                  </p>
                </div>
              );
            })}
          </ListGroupItem>
        </ListGroup>
      );
  }
});