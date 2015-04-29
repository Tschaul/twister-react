
var ReactBootstrap = require('react-bootstrap')
  , Grid = ReactBootstrap.Grid
  , Col = ReactBootstrap.Col
  , Row = ReactBootstrap.Row
  , ListGroupItem = ReactBootstrap.ListGroupItem
  , ListGroup = ReactBootstrap.ListGroup
  , Nav = ReactBootstrap.Nav
  , NavItem = ReactBootstrap.NavItem
  , Button = ReactBootstrap.Button
  , ButtonGroup = ReactBootstrap.ButtonGroup
  , Glyphicon = ReactBootstrap.Glyphicon

var React = require('react');

var SetIntervalMixin = require("./SetIntervalMixin.js");
var SafeStateChangeMixin = require('./SafeStateChangeMixin.js');
var Timeline = require('./Timeline.js');

module.exports = Post = React.createClass({displayName: "Post",
  mixins: [SetIntervalMixin,SafeStateChangeMixin],
  getInitialState: function() {
    return {
      avatar: "img/genericPerson.png", 
      fullname: "", 
      bio: "", 
      location: "", 
      url: ""
    };
  },
  componentDidMount: function () {
    var thisComponent = this;

    Twister.getUser(this.props.username).doAvatar(function(avatar){
      if (avatar.getUrl()) {
        thisComponent.setStateSafe({avatar: avatar.getUrl()});  
      }
    });
    
    Twister.getUser(this.props.username).doProfile(function(profile){
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
        React.createElement(ListGroupItem, null, 
            React.createElement(Row, {className: "nomargin"}, 
              React.createElement(Col, {xs: 2, md: 2, className: "fullytight"}, 
                React.createElement("img", {className: "img-responsive", src: this.state.avatar})
              ), 
              React.createElement(Col, {xs: 9, md: 9}, 
                React.createElement("h6", {className: "nomargin-top"}, this.state.fullname, React.createElement("small", null, "   ", '@'+this.props.username)), 
                React.createElement("p", {class: "text-center"}, this.state.bio)
              ), 
              React.createElement(Col, {xs: 1, md: 1, className: "fullytight text-align-right"})
            )
        )
    );
  }
});