
var ReactBootstrap = require('react-bootstrap')
  , NavItem = ReactBootstrap.NavItem
  , Nav = ReactBootstrap.Nav
  , ListGroup = ReactBootstrap.ListGroup
  , ListGroupItem = ReactBootstrap.ListGroupItem
  , Panel = ReactBootstrap.Panel
  , Glyphicon = ReactBootstrap.Glyphicon
  , Button = ReactBootstrap.Button

var React = require('react/addons');

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Post = require("../common/Post.js");

module.exports = Postboard = React.createClass({displayName: "Postboard",
  render: function() {
    
    var thisComponent = this;
    
    var profiles = this.props.data.map(function(username, index) {
      return (
        React.createElement(MiniProfile, {username: username, key: "miniprofile:"+username, pollIntervalProfile: thisComponent.props.pollIntervalProfile})
      );
    });
    
    if (this.props.loading) {
      var spinner = (
        React.createElement(ListGroupItem, null, React.createElement("p", {className: "text-center"}, React.createElement("img", {src: "img/bouncing_ball.gif"})))
      );
    } else { 
      var spinner = (React.createElement("span", null));
    }
    
    return (
      React.createElement(ListGroup, {fill: true}, 
        spinner, 
        this.props.header, 
        React.createElement(ReactCSSTransitionGroup, {transitionName: "item"}, 
          profiles
        )
      )
    );
  }
}); 