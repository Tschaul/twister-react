

/*
var Router = require('react-router')
  , RouteHandler = Router.RouteHandler
  , Route = Router.Route;


var ReactRouterBootstrap = require('react-router-bootstrap')
  , NavItemLink = ReactRouterBootstrap.NavItemLink
  , ButtonLink = ReactRouterBootstrap.ButtonLink
  , ListGroupItemLink = ReactRouterBootstrap.ListGroupItemLink;
*/

var ReactBootstrap = require('react-bootstrap')
  , NavItem = ReactBootstrap.NavItem
  , Nav = ReactBootstrap.Nav
  , ListGroup = ReactBootstrap.ListGroup;

var React = require('react');
var Router = require('react-router');
var { Route, DefaultRoute, RouteHandler, Link } = Router;


App = React.createClass({displayName: "App",
  
  contextTypes: {
    router: React.PropTypes.func
  },

  getHandlerKey: function () {
    var childDepth = 1; // assuming App is top-level route
    var { router } = this.context;
    //console.log(router.getCurrentParams())
    if ( router.getCurrentRoutes()[childDepth] ) {
      var key = router.getCurrentRoutes()[childDepth].name;
      var id = JSON.stringify(router.getCurrentParams());
      if (id) { key += id; }
      return key;
    } else {return "none"}
  },
  
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement(Nav, {bsStyle: "pills"}, 
          React.createElement(NavItem, {href: "#timeline/tschaul"}, 
            "tschaul"
          ), 
          React.createElement(NavItem, null, 
            React.createElement(Link, {
                to: "timeline", 
                params: { timelineUser: "timbuktu"}
              }, "\"timbuktu\"")
          ), 
          React.createElement(NavItem, null, 
            React.createElement(Link, {
                to: "timeline", 
                params: { timelineUser: "pampalulu"}
              }, "\"pampalulu\"")
          )
        ), 
        React.createElement(RouteHandler, {pollInterval: "60000", key: this.getHandlerKey()})
      )
    );
  }
});


var routes = (
  React.createElement(Route, {handler: App, path: "/"}, 
    React.createElement(Route, {name: "timeline", path: "timeline/:timelineUser", handler: Timeline})
  )
);


var intitializeApp = function(res){
    
    Router.run(routes, function (Handler) {
      React.render(React.createElement(Handler, null), document.getElementById('content'));
    });
    
};

///////// LOAD TWISTER FROM CACHE AND INITIALIZE


Twister.init({
    host: 'http://user:pwd@localhost:28332',
    errorfunc: function(error){console.log(this,error)}
});

loadCache();

Twister.loadServerAccounts(intitializeApp);