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
  getInitialState: function() {
    return {
      data: [], 
      postIdentifiers: {}, 
      usernames: [], 
      postrange: ( Date.now()/1000 - 12*60*60 ),
      min_posts: 30,
      loading: true
    };
  },
  handeSettingsUpdate: function (e) {
    e.preventDefault();
    console.log(React.findDOMNode(this.refs.pollInterval).value.trim())
    
    /*
    var msg = JSON.parse(JSON.stringify(e.target[0].value));
    if (!msg) {
      console.log("empty post was passed as new post")
      return;
    }
    
    Twister.getAccount(this.props.activeAccount).post(msg,function(post){
    
      var event = new CustomEvent('newpostbyuser',{detail: post});
      //alert("scrolled to bottom")
      window.dispatchEvent(event);
    
    });
    
    e.target[0].value = "";
    
    
    this.handleToggle();
    
    //React.findDOMNode(this.refs.msg).value = '';
    */
    return;
  },
  render: function() {
    return (
        React.createElement(Panel, {header: "Settings"}, 
          React.createElement("form", {onSubmit: this.handeSettingsUpdate}, 
            React.createElement(Input, {type: "text", label: "pollInterval", placeholder: "pollInterval", ref: "pollInterval"}), 
            React.createElement(Input, {type: "submit", value: "Save"})
          )
        )
      );
  }
});