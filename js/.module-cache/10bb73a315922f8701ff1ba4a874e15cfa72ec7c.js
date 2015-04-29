

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
  , Navbar = ReactBootstrap.Navbar
  , ListGroup = ReactBootstrap.ListGroup
  , DropdownButton = ReactBootstrap.DropdownButton
  , MenuItem = ReactBootstrap.MenuItem

var React = require('react');
var Router = require('react-router');
var { Route, DefaultRoute, RouteHandler, Link } = Router;

var Timeline = require("./Timeline.js");

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
        React.createElement(Navbar, null, 
          React.createElement(Nav, null, 
            React.createElement(DropdownButton, {title: "Switch User"}, 
              React.createElement(MenuItem, {href: "#timeline/tschaul"}, 
                "tschaul"
              ), 
              React.createElement(MenuItem, {href: "#timeline/timbuktu"}, 
                "timbuktu"
              ), 
              React.createElement(MenuItem, {href: "#timeline/pampalulu"}, 
                "pampalulu"
              )
            )
          )
        ), 
        React.createElement(RouteHandler, {pollInterval: "60", key: this.getHandlerKey()})
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

setInterval(saveCache,300000);

Twister.loadServerAccounts(intitializeApp);

////// INIT EVENTLISTENERS ON WINDOW

window.onscroll = function(ev) {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    var event = new Event('scrolledtobottom');
    window.dispatchEvent(event);
  }
};