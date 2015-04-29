

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
  , Glyphicon = ReactBootstrap.Glyphicon
  , Grid = ReactBootstrap.Grid
  , Col = ReactBootstrap.Col
  , Row = ReactBootstrap.Row

var React = require('react');
var Router = require('react-router');
var { Route, DefaultRoute, RouteHandler, Link } = Router;

var Home = require("./Home.js");
var Profile = require("./Profile.js");
var SetIntervalMixin = require("./SetIntervalMixin.js");
var SafeStateChangeMixin = require('./SafeStateChangeMixin.js');
var Timeline = require('./Timeline.js');
var Followings = require('./Followings.js');
var Mentions = require('./Mentions.js');


App = React.createClass({
    
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
      if (key=="home" || key=="profile-active" || key=="accountProfileMore") {key=key+"/"+this.state.activeAccount;}
      var id = JSON.stringify(router.getCurrentParams());
      if (id) { key += id; }
      console.log(key);
      return key;
    } else {return "none"}
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
      thisComponent.setStateSafe({activeAccount: newaccoutname},function(){
        localStorage.setItem("twister-react-activeAccount", newaccoutname);
      });
    });
    
  },
  
  getInitialState: function () {
    
    Twister.deserializeCache(JSON.parse(localStorage.getItem("twister-cache")));
    
    //this.clearCache();
    
    var state={};
    
    state.activeAccount = localStorage.getItem("twister-react-activeAccount")
    
    state.pollInterval = 60;
    state.pollIntervalProfile = 60*60;
    
    state.accounts = Twister.getAccounts();
    
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
    
    var firstroute = this.context.router.getCurrentRoutes()[1].name;
    
    //console.log(firstroute);
    
    var userbuttons = [];
    for (var i in this.state.accounts) {
      userbuttons.push(
        <MenuItem 
          key={this.state.accounts[i]}
          bsStyle={this.state.accounts[i]==this.state.activeAccount ? 'primary' : 'default'}
          onClick={this.switchAccount.bind(this,this.state.accounts[i])}
          href="javascript:void(0);"
        >{this.state.accounts[i]}</MenuItem>
      );
    }
    
    return (
      <Grid>
        <Row>
          <Col xs={12} sm={10} smOffset={1} md={8} mdOffset={2} lg={6} lgOffset={3}>
            <ButtonGroup justified>  
              <Button 
                href='#' 
                bsStyle={firstroute=="home" ? 'primary' : 'default'}
              ><Glyphicon glyph="home"/></Button>
              <Button 
                href='#/profile'
                bsStyle={firstroute=="profile-active" ? 'primary' : 'default'}
              ><Glyphicon glyph="user"/></Button>
              <Button href='#/directmessages'><Glyphicon glyph="transfer"/></Button>
              <DropdownButton title={this.state.activeAccount}>
                {userbuttons}
              </DropdownButton>
              <DropdownButton title={<Glyphicon glyph="menu-hamburger"/>}>
                <MenuItem 
                  onClick={this.clearCache}
                  href="javascript:void(0);"
                >Clear Cache</MenuItem>
                <MenuItem href="#/search" >Search</MenuItem>
                <MenuItem href="#/settings" >Settings</MenuItem>
                <MenuItem href="#/howtofollow" >How to Follow</MenuItem>
                <MenuItem href="#/trendinghashtags" >Trending Hashtags</MenuItem>
              </DropdownButton>
            </ButtonGroup>
            <br/>
            <RouteHandler 
              pollInterval={this.state.pollInterval} 
              pollIntervalProfile={this.state.pollIntervalProfile} 
              activeAccount={this.state.activeAccount} 
              key={this.getHandlerKey()}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
});


var routes = (
  <Route handler={App} path="/">
    <Route name="profile-active" path="/profile" handler={Profile}>
      <Route name="profile-active-timeline" path="timeline" handler={Timeline} />
      <Route name="profile-active-followings" path="followings" handler={Followings} />
      <Route name="profile-active-mentions" path="mentions" handler={Mentions} />
      <DefaultRoute name="profile-active-timeline-default" handler={Timeline} />
    </Route>
    <Route name="profile" path="/profile/:username" handler={Profile}>
      <Route name="profile-timeline" path="timeline" handler={Timeline} />
      <Route name="profile-followings" path="followings" handler={Followings} />
      <Route name="profile-mentions" path="mentions" handler={Mentions} />
      <DefaultRoute name="profile-timeline-default" handler={Timeline} />
    </Route>
    <DefaultRoute name="home" handler={Home} />
  </Route>
);


    
Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('content'));
});
   


////// INIT EVENTLISTENERS ON WINDOW

window.onscroll = function(ev) {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
    var event = new Event('scrolledtobottom');
    //alert("scrolled to bottom")
    window.dispatchEvent(event);
  }
};