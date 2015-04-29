
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
var Followings = require('./Followings.js');

module.exports = Post = React.createClass({displayName: "Post",
  mixins: [SetIntervalMixin,SafeStateChangeMixin],
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function() {
    return {
      username: (this.context.router.getCurrentParams().username ? this.context.router.getCurrentParams().username : this.props.activeAccount),
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
    
    switch (this.context.router.getCurrentParams().subroute) {
        case "timeline":
          var subroute = "timeline"
          var subcontent = (
              React.createElement(Timeline, {username: this.state.username, pollInterval: this.props.pollInterval})
            );
        case "followings":
          console.log("followings selcted")
          var subroute = "followings"
          var subcontent = (
              React.createElement(Followings, {username: this.state.username, pollInterval: this.props.pollInterval})
            );
        default:
          console.log("default selcted")
          var subroute = "timeline"
          var subcontent = (
              React.createElement(Timeline, {username: this.state.username, pollInterval: this.props.pollInterval})
            );
    }
    
    var subroute
    
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
        React.createElement("div", {className: "container fullytight"}, 
          React.createElement(ButtonGroup, {justified: true}, 
            React.createElement(Button, {href: "javascript:void(0);", bsStyle: subroute=="timeline" ? "active" : ""}, React.createElement(Glyphicon, {glyph: "list"})), 
            React.createElement(Button, {href: "javascript:void(0);", bsStyle: subroute=="following" ? "active" : ""}, React.createElement(Glyphicon, {glyph: "eye-open"})), 
            React.createElement(Button, {href: "javascript:void(0);"}, React.createElement(Glyphicon, {glyph: "comment"})), 
            React.createElement(Button, {href: "javascript:void(0);"}, React.createElement(Glyphicon, {glyph: "transfer"}))
          )
        ), 
        subcontent
      )
    );
  }
});