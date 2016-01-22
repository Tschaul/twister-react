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

module.exports = Accounts = React.createClass({
    
  mixins: [
    SetIntervalMixin,
    SafeStateChangeMixin,
    AppSettingsMixin
  ],
  contextTypes: {
    router: React.PropTypes.func
  },
  render: function() {
    
    var thisComponent = this;
    
    return (
        <ListGroup>
          <ListGroupItem>Accounts</ListGroupItem>
          <ListGroupItem>
            <ImportAccountModalButton/>
            <hr/>
            {this.props.accounts.map(function(acc,index) {
              //console.log(acc,index)
              return (
                <div>
                  <MiniProfile username={acc.name} key={"miniprofile:"+acc.name} pollIntervalProfile={thisComponent.props.pollIntervalProfile}/>
                  <p>{acc.status}</p>
                </div>
              );
            })}
          </ListGroupItem>
        </ListGroup>
      );
  }
});