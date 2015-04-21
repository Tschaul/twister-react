

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
  , ListGroup = ReactBootstrap.ListGroup
  , Panel = ReactBootstrap.Panel

var React = require('react');
var Router = require('react-router');
var { Route, DefaultRoute, RouteHandler, Link } = Router;

var Timeline = require("./Timeline.js");

App = React.createClass({
  
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
      <div>
        <Nav bsStyle='pills' >
          <NavItem href="#timeline/tschaul">
            tschaul
          </NavItem>
          <NavItem href="#timeline/timbuktu">
            timbuktu
          </NavItem>
          <NavItem href="#timeline/pampalulu">
            pampalulu
          </NavItem>
        </Nav>
        <RouteHandler pollInterval="60000" key={this.getHandlerKey()}/>
      </div>
    );
  }
});


var routes = (
  <Route handler={App} path="/">
    <Route name="timeline" path="timeline/:timelineUser" handler={Timeline} />
  </Route>
);


var intitializeApp = function(res){
    
    Router.run(routes, function (Handler) {
      React.render(<Handler/>, document.getElementById('content'));
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