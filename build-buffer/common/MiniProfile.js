
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

var SetIntervalMixin = require("../common/SetIntervalMixin.js");
var SafeStateChangeMixin = require('../common/SafeStateChangeMixin.js');
var ProfileMixin = require('../common/ProfileMixin.js');

module.exports = MiniProfile = React.createClass({displayName: "MiniProfile",
  mixins: [SetIntervalMixin,SafeStateChangeMixin,ProfileMixin],
  render: function() {
    return (
        React.createElement(ListGroupItem, null, 
            React.createElement(Row, {className: "nomargin"}, 
              React.createElement(Col, {xs: 2, md: 2, className: "fullytight"}, 
                React.createElement("a", {href: "#/profile/"+this.props.username}, 
                  React.createElement("img", {className: "img-responsive", src: this.state.avatar})
                )
              ), 
              React.createElement(Col, {xs: 9, md: 9}, 
                React.createElement("h5", {className: "nomargin-top"}, 
                  this.state.fullname, React.createElement("small", null, "   ", '@'+this.props.username)
                ), 
                React.createElement("p", null, this.state.bio)
              ), 
              React.createElement(Col, {xs: 1, md: 1, className: "fullytight text-align-right"})
            )
        )
    );
  }
});