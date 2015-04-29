
var ReactBootstrap = require('react-bootstrap')
  , Grid = ReactBootstrap.Grid
  , Col = ReactBootstrap.Col
  , Row = ReactBootstrap.Row
  , ListGroupItem = ReactBootstrap.ListGroupItem
  , ListGroup = ReactBootstrap.ListGroup
  , Nav = ReactBootstrap.Nav
  , NavItem = ReactBootstrap.NavItem

var React = require('react');

var SetIntervalMixin = require("./SetIntervalMixin.js");
var SafeStateChangeMixin = require('./SafeStateChangeMixin.js');
var Timeline = require('./Timeline.js');

module.exports = Post = React.createClass({displayName: "Post",
  mixins: [SetIntervalMixin,SafeStateChangeMixin],
  getInitialState: function() {
    return {
      username: (this.props.params ? this.props.params.username : this.props.activeAccount),
      avatar: "img/genericPerson.png", 
      fullname: "", 
      bio: "", 
      location: "", 
      url: ""
    };
  },
  componentDidMount: function () {
    var thisComponent = this;

    Twister.getUser(this.state.username).doAvatar(function(avatar){
      if (avatar.getUrl()) {
        thisComponent.setStateSafe({avatar: avatar.getUrl()});  
      }
    });
    
    Twister.getUser(this.state.username).doProfile(function(profile){
      thisComponent.setStateSafe({
        fullname: profile.getField("fullname"),
        bio: profile.getField("bio"),
        location: profile.getField("location"),
        url: profile.getField("url"),
      });  
    });
    
  },
  render: function() {
    return (
      React.createElement(ListGroup, {fill: true}, 
        React.createElement(ListGroupItem, null, 
            React.createElement(Row, {className: "nomargin"}, 
              React.createElement(Col, {xs: 3, md: 3, className: "fullytight"}, 
                React.createElement("img", {className: "img-responsive", src: this.state.avatar})
              ), 
              React.createElement(Col, {xs: 8, md: 8}, 
                React.createElement("h4", {className: "nomargin-top"}, this.state.fullname, React.createElement("small", null, "   ", '@'+this.state.username)), 
                React.createElement("p", {class: "text-center"}, this.state.location), 
                React.createElement("p", {class: "text-center"}, this.state.bio), 
                React.createElement("p", {class: "text-center"}, React.createElement("a", {href: this.state.url}, this.state.url))
              ), 
              React.createElement(Col, {xs: 1, md: 1, className: "fullytight text-align-right"})
            )
        ), 
        React.createElement(Nav, {bsStyle: "tabs", justified: true, "fixed-top": true, activeKey: 1}, 
          React.createElement(NavItem, {eventKey: 1}, "Timeline"), 
          React.createElement(NavItem, {eventKey: 2}, "Following"), 
          React.createElement(NavItem, {eventKey: 3}, "Mentions"), 
          React.createElement(NavItem, {eventKey: 3}, "Direct Messages")
        ), 
        React.createElement(Timeline, {username: this.state.username, pollInterval: this.props.pollInterval})
      )
    );
  }
});