

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
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement(Nav, null, 
          React.createElement(NavItem, null, 
            React.createElement(Link, {
                to: "timeline", 
                params: { timelineUser: "tschaul"}
              }, "\"tschaul\""), 
            React.createElement(RouteHandler, {pollInterval: "60000"})
          )
        )
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

/*
var saveCache = function () {

    localStorage.setItem("twister-cache", JSON.stringify(Twister.serializeCache()));

};

var loadCache = function () {

    Twister.deserializeCache(JSON.parse(localStorage.getItem("twister-cache")));

};

var clearCache = function () {

    localStorage.setItem("twister-cache", null);

};
*/
//loadCache();

Twister.loadServerAccounts(intitializeApp);