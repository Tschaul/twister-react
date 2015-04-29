

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
  , DropdownButton = ReactBootstrap.DropdownButton
  , MenuItem = ReactBootstrap.MenuItem
  , Button = ReactBootstrap.Button
  , ButtonGroup = ReactBootstrap.ButtonGroup
  , OverlayTrigger = ReactBootstrap.OverlayTrigger
  , Popover = ReactBootstrap.Popover

var React = require('react');
var Router = require('react-router');
var { Route, DefaultRoute, RouteHandler, Link } = Router;

var Timeline = require("./Timeline.js");
var SetIntervalMixin = require("./SetIntervalMixin.js");
var SafeStateChangeMixin = require('./SafeStateChangeMixin.js');

App = React.createClass({displayName: "App",
    
  mixins: [SetIntervalMixin,SafeStateChangeMixin],
  
  contextTypes: {
    router: React.PropTypes.func
  },

  getHandlerKey: function () {
    var childDepth = 1; // assuming App is top-level route
    var { router } = this.context;
    //console.log(router.getCurrentParams())
    if ( router.getCurrentRoutes()[childDepth] ) {
      var key = router.getCurrentRoutes()[childDepth].name;
      if (key=="timeline" || !key) {key=key+"/"+this.state.activeAccount;}
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
  
  switchAccount: function (newaccoutname) {
    
    console.log(newaccoutname);
    
    var thisComponent = this;
    
    Twister.getAccount(newaccoutname).activateTorrents(function(){
      thisComponent.setStateSafe({activeAccount: newaccoutname});
    });
    
  },
  
  getInitialState: function () {
    
    this.loadCache();
    //this.clearCache();
    
    var state={};
    
    state.pollInterval = 60;
    
    state.accounts = Twister.getAccounts();
    
    if (state.accounts.length) {
      state.activeAccount = state.accounts[0];
    } else {
      state.activeAccount = null;
    }
    
    //console.log(state);
  
    return state;
  },
  
  componentDidMount: function () {
    
    var thisComponent = this;
    
    if (this.state.accounts.length==0) {

      Twister.init({
        host: 'http://user:pwd@localhost:28332',
        logfunc: function(log){console.log(log)}
      });
      Twister.loadServerAccounts(function(){
        
        thisComponent.setStateSafe(function(state){
          
          state.accounts = Twister.getAccounts();
          //console.log(state.accounts);
          state.activeAccount = state.accounts[0];
          
          return state;
          
        },function(){
          thisComponent.switchAccount(thisComponent.state.activeAccount);
        });
      });
    } else {
      this.switchAccount(this.state.activeAccount);
    }

    this.setInterval(this.saveCache,300000);

  },
  
  render: function() {
    
    var userbuttons = [];
    for (var i in this.state.accounts) {
      userbuttons.push(
        React.createElement(MenuItem, {
          key: this.state.accounts[i], 
          bsStyle: this.state.accounts[i]==this.state.activeAccount ? 'primary' : '', 
          onClick: this.switchAccount.bind(this,this.state.accounts[i]), 
          href: "javascript:void(0);"
        }, this.state.accounts[i])
      );
    }
    
    return (
      React.createElement("div", {className: "container"}, 
        React.createElement(ButtonGroup, null, 
          React.createElement(Button, {href: "#"}, "Home"), 
          React.createElement(Button, {onClick: this.clearCache}, "Clear Cache"), 
          React.createElement(DropdownButton, {title: "Switch Account"}, 
            userbuttons
          )
        ), 
        React.createElement("br", null), React.createElement("br", null), 
        React.createElement(RouteHandler, {
          pollInterval: this.state.pollInterval, 
          activeAccount: this.state.activeAccount, 
          key: this.getHandlerKey()}
        )
      )
    );
  }
});


var routes = (
  React.createElement(Route, {handler: App, path: "/"}, 
    React.createElement(Route, {name: "timeline", path: "timeline", handler: Timeline}), 
    React.createElement(DefaultRoute, {handler: Timeline})
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