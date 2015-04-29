

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
      if (key=="timeline") {key=key+"/"+this.state.activeAccount;}
      var id = JSON.stringify(router.getCurrentParams());
      if (id) { key += id; }
      return key;
    } else {return "none"}
  },
  
  loadCache: function () {
    Twister.deserializeCache(JSON.parse(localStorage.getItem("twister-cache")));
  },
  
  clearCache: function () {
    localStorage.setItem("twister-cache", null);
  },
  
  saveCache: function () { 
    localStorage.setItem("twister-cache", JSON.stringify(Twister.serializeCache()))
  },
  
  getInitialState: function () {
    
    this.loadCache();
    
    var state={};
    
    state.pollInterval = 60;
    
    state.accounts = Twister.getAccounts();
    
    if (state.accounts.length) {
      state.activeAccount = state.accounts[0];
    }
  
    return state;
  },
  
  componentDidMount: function () {
    
    if (state.accounts.length==0) {
      Twister.init({
        host: 'http://user:pwd@localhost:28332',
        logfunc: function(log){console.log(log)}
      });
      Twister.loadServerAccounts(function(){
        
        this.setStateSafe(function(state){
          
          state.accounts = Twister.getAccounts();

          if (state.accounts.length) {
            state.activeAccount = state.accounts[0];
          }
          return state;
          
        });
      });
    }

    this.setInterval(this.saveCache,300000);

  },
  
  render: function() {
    return (
      React.createElement("div", {className: "container"}, 
        React.createElement(Navbar, null, 
          React.createElement(Nav, null, 
            React.createElement(NavItem, {href: "#"}, "Home"), 
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
        React.createElement(RouteHandler, {
          pollInterval: this.state.pollInterval, 
          activeUser: this.state.activeAccount, 
          key: this.getHandlerKey()}
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


    
Router.run(routes, function (Handler) {
  React.render(React.createElement(Handler, null), document.getElementById('content'));
});
   


////// INIT EVENTLISTENERS ON WINDOW

window.onscroll = function(ev) {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
    var event = new Event('scrolledtobottom');
    //alert("scrolled to bottom")
    window.dispatchEvent(event);
  }
};