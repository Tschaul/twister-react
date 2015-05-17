
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
var Router = require('react-router');
var { Route, DefaultRoute, RouteHandler, Link } = Router;

var SetIntervalMixin = require("../common/SetIntervalMixin.js");
var SafeStateChangeMixin = require('../common/SafeStateChangeMixin.js');
var ProfileMixin = require('../common/ProfileMixin.js');

module.exports = Post = React.createClass({displayName: "Post",
  mixins: [SetIntervalMixin,SafeStateChangeMixin,ProfileMixin],
  contextTypes: {
    router: React.PropTypes.func
  },
  getHandlerKey: function () {
    var childDepth = 2; // assuming App is top-level route
    var { router } = this.context;
    //console.log(router.getCurrentParams())
    if ( router.getCurrentRoutes()[childDepth] ) {
      var key = router.getCurrentRoutes()[childDepth].name;
      if (key.indexOf("active")>-1) {key+="/"+this.props.activeAccount;}
      var id = JSON.stringify(router.getCurrentParams());
      if (id) { key += id; }
      console.log(key);
      return key;
    } else {return "none"}
  },
  render: function() {
    
    var routeprefix = "#/profile/"+(this.context.router.getCurrentParams().username ? this.context.router.getCurrentParams().username+"/" : "")
    
    var subroute = this.context.router.getCurrentRoutes()[2].name
    
    console.log(this.context.router.getCurrentRoutes());
        
    return (
      React.createElement(ListGroup, {fill: true}, 
        React.createElement(ListGroupItem, null, 
            React.createElement(Row, {className: "nomargin"}, 
              React.createElement(Col, {xs: 3, md: 3, className: "fullytight"}, 
                React.createElement("img", {className: "img-responsive", src: this.state.avatar})
              ), 
              React.createElement(Col, {xs: 8, md: 8}, 
                React.createElement("h4", {className: "nomargin-top"}, this.state.fullname, React.createElement("small", null, "   ", '@'+this.state.username)), 
                React.createElement("p", {className: "text-center"}, this.state.location), 
                React.createElement("p", {className: "text-center"}, this.state.bio), 
                React.createElement("p", {className: "text-center"}, React.createElement("a", {href: this.state.url}, this.state.url))
              ), 
              React.createElement(Col, {xs: 1, md: 1, className: "fullytight text-align-right"})
            )
        ), 
        React.createElement(ListGroupItem, {className: "fullytight_all"}, 
          React.createElement(ButtonGroup, {justified: true}, 
            React.createElement(Button, {href: routeprefix+"timeline", bsStyle: subroute.indexOf("timeline")>-1 ? "primary" : "default"}, React.createElement(Glyphicon, {glyph: "list"})), 
            React.createElement(Button, {href: routeprefix+"followings", bsStyle: subroute.indexOf("followings")>-1 ? "primary" : "default"}, React.createElement(Glyphicon, {glyph: "eye-open"})), 
            React.createElement(Button, {href: routeprefix+"mentions", bsStyle: subroute.indexOf("mentions")>-1 ? "primary" : "default"}, React.createElement(Glyphicon, {glyph: "comment"}))
          )
        ), 
        React.createElement(RouteHandler, {
          pollInterval: this.props.pollInterval, 
          pollIntervalProfile: this.props.pollIntervalProfile, 
          activeAccount: this.props.activeAccount, 
          key: this.getHandlerKey()}
        )
      )
    );
  }
});