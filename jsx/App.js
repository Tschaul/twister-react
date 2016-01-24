

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
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route; 
var IndexRoute = ReactRouter.IndexRoute; 
var RouteHandler = ReactRouter.RouteHandler; 
var Link = ReactRouter.Link;
var hashHistory = ReactRouter.hashHistory;

var Home = require("./home/Home.js");
var Profile = require("./profile/Profile.js");
var SetIntervalMixin = require("./common/SetIntervalMixin.js");
var SafeStateChangeMixin = require('./common/SafeStateChangeMixin.js');
var Timeline = require('./profile/Timeline.js');
var Followings = require('./profile/Followings.js');
var Mentions = require('./profile/Mentions.js');
var Conversation = require('./other/Conversation.js');
var Hashtag = require('./other/Hashtag.js');
var Settings = require('./other/Settings.js');
var Accounts = require('./other/Accounts.js');
var Featured = require('./other/Featured.js');
var AppSettingsMixin = require('./common/AppSettingsMixin.js');

App = React.createClass({
    
  mixins: [
    AppSettingsMixin,
    SetIntervalMixin,
    SafeStateChangeMixin,
    EventListenerMixin('newaccountbyuser')],
  
  getInitialState: function () {
    
    var state={};
    
    state.activeAccount = localStorage.getItem("twister-react-activeAccount")
    
    state.accounts = Twister.getAccounts().map(function(acc){
      return {
        name: acc.getUsername(),
        status: acc.getKeyStatus()
      }
    });
        
    //console.log(state);
  
    return state;
    
  },
  
  componentDidMount: function () {
    
    this.setInterval(this.saveCache,300000);
    
    this.setInterval(this.checkAccounts,60000);
    
    setTimeout(this.checkAccounts,0);

  },
  
  clearCache: function () {
    localStorage.setItem("twister-cache", null);
  },
  
  saveCache: function () { 
    var timestamp = Date.now()/1000 - 60*60*24*14;
    Twister.trimCache(timestamp);
    localStorage.setItem("twister-cache", JSON.stringify(Twister.serializeCache()))
  },
  
  checkAccounts: function() {
    
    var thisComponent = this;
    
    thisComponent.state.accounts.map(function(acc){
      
      Twister.getAccount(acc.name).verifyKey(function(key){
        thisComponent.setState(function(oldstate,props){
          
          oldstate.accounts.find(function(a){
            return a.name==acc.name;
          }).status = key.getStatus();
          
          return oldstate;
          
        });
      });
      
    })
    
  },
  
  switchAccount: function (newaccoutname) {
    
    //console.log(newaccoutname);
    
    var thisComponent = this;
    
    Twister.getAccount(newaccoutname).activateTorrents(function(){
      thisComponent.setStateSafe({activeAccount: newaccoutname},function(){
        localStorage.setItem("twister-react-activeAccount", newaccoutname);
      });
    });
    
  },
  
  onnewaccountbyuser: function(event) {
    
    console.log("catched onnewaccountbyuser event !!!!! ",event,this.state)
    
    this.saveCache();
    
    if(!this.state.activeAccount){
      
      this.switchAccount(event.detail.getUsername());
      
    }
    
    this.setState(function(oldstate,props){
      oldstate.accounts.push({
        name: event.detail.getUsername(),
        status: event.detail.getKeyStatus()
      })
      return oldstate;
    })
    
  },
  
  render: function() {
    
    var route = this.props.location.pathname.split("/").filter(function(s){
      return s!="";
    });
        
    var isOnHome = (route.length==0);
    
    var isOnOwnProfile = ( route[0]="profile" && route[1]==this.state.activeAccount );
    
    var guestMode = true;
    
    if(this.state.accounts.filter(function(acc){
      return acc.status=="confirmed";
    }).length){
      guestMode = false;
    }
    
    if(guestMode){
      var accountSelector = (
        <Button href='#/accounts' disabled>guest</Button>
      );
    }else{
      var userbuttons = [];
      for (var i in this.state.accounts.filter(function(acc){
        return acc.status=="confirmed";
      })) {
        userbuttons.push(
          <MenuItem 
            key={this.state.accounts[i].name}
            bsStyle={this.state.accounts[i].name==this.state.activeAccount ? 'primary' : 'default'}
            onClick={this.switchAccount.bind(this,this.state.accounts[i].name)}
            href="javascript:void(0);"
            eventKey={i}
          >{this.state.accounts[i].name}</MenuItem>
        );
      }  
      var accountSelector = (

        <DropdownButton title={this.state.activeAccount} id={'dropdown-accounts'}>
          {userbuttons}
        </DropdownButton>

      );
    }
  
    
    return (
      <Grid>
        <Row>
          <Col xs={12} sm={10} smOffset={1} md={8} mdOffset={2} lg={6} lgOffset={3}>
            <ButtonGroup justified>  
              <Button 
                href='#/' 
                bsStyle={isOnHome ? 'primary' : 'default'}
                disabled = {guestMode}
              ><Glyphicon glyph="home"/></Button>
              <Button 
                href={'#/profile/'+this.state.activeAccount}
                bsStyle={isOnOwnProfile ? 'primary' : 'default'}
                disabled = {guestMode}
              ><Glyphicon glyph="user"/></Button>
              <Button href='#/directmessages' disabled><Glyphicon glyph="transfer"/></Button>
              {accountSelector}
              <DropdownButton title={<Glyphicon glyph="menu-hamburger"/>} id={'dropdown-other'}>
                <MenuItem 
                  onClick={this.clearCache}
                >Clear Cache</MenuItem>
                <MenuItem href="#/search" >Search</MenuItem>
                <MenuItem href="#/settings" >Settings</MenuItem>
                <MenuItem href="#/accounts" >Accounts</MenuItem>
                <MenuItem href="#/featured" >Featured</MenuItem>
                <MenuItem href="#/howtofollow" >How to Follow</MenuItem>
                <MenuItem href="#/trendinghashtags" >Trending Hashtags</MenuItem>
              </DropdownButton>
            </ButtonGroup>
            <br/>
            {this.props.children && React.cloneElement(this.props.children, {
              accounts:this.state.accounts,
              activeAccount:this.state.activeAccount
            })}
          </Col>
        </Row>
      </Grid>
    );
  }
});


initializeApp = function () {
    
  //Router.run(routes, function (Handler) {
    ReactDOM.render((
      <Router history={hashHistory}>
        <Route component={App} path="/">
          <IndexRoute component={Home} />
          <Route path="/profile/:username" component={Profile}>
            <IndexRoute component={Timeline} />
            <Route path="timeline" component={Timeline} />
            <Route path="followings" component={Followings} />
            <Route path="mentions" component={Mentions} />
          </Route>
          <Route path="/conversation/:username/:postid" component={Conversation}/>
          <Route path="/hashtag/:hashtag" component={Hashtag}/>
          <Route path="/settings" component={Settings}/>
          <Route path="/accounts" component={Accounts}/>
          <Route path="/featured" component={Featured}/>
        </Route>
      </Router>
    ), document.getElementById('content'));
  //});
   
}

Twister.deserializeCache(JSON.parse(localStorage.getItem("twister-cache")));

//Twister.setup({logfunc: function(log){console.log(log)}})

var accounts = Twister.getAccounts();

if (accounts.length==0) {

  if (!localStorage.getItem("twister-react-settings")) {

    var appSettings = {

      pollInterval:60,
      pollIntervalProfile: 3600,
      ignoredUsers: "nobody",
      host: window.location.protocol+"//"+window.location.host+"/"

    };
    
    console.log(appSettings)
    
    localStorage.setItem("twister-react-settings",JSON.stringify(appSettings));

  } else {

    var appSettings = JSON.parse(localStorage.getItem("twister-react-settings"));

  }
  
  Twister.setup({
    host: appSettings.host,
    logfunc: function(log){console.log(log)},
    outdatedLimit: appSettings.pollInterval,
    signatureVerification: "none",
    walletType: "client",
    querySettingsByType: {

      outdatedLimit: {
          pubkey: appSettings.pollIntervalProfile,
          profile: appSettings.pollIntervalProfile,
          avatar: appSettings.pollIntervalProfile,
          torrent: appSettings.pollIntervalProfile,
          followings: appSettings.pollIntervalProfile
      }

    }
  });

  initializeApp();
  
} else {

  var activeAccount =  localStorage.getItem("twister-react-activeAccount");
    
  var accounts = Twister.getAccounts();

  if (!activeAccount) {

    activeAccount = accounts[0];
    localStorage.setItem("twister-react-activeAccount",activeAccount);

  }

  console.log("active account defaulted to "+activeAccount)
    console.log(Twister.getAccount(activeAccount))

  Twister.getAccount(activeAccount).activateTorrents(function(){

    initializeApp();

  });
      
}

////// INIT EVENTLISTENERS ON WINDOW

window.onscroll = function(ev) {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
    var event = new Event('scrolledtobottom');
    //alert("scrolled to bottom")
    window.dispatchEvent(event);
  }
};

setInterval(function(){
  
  if($("#content").height()<window.innerHeight){
    var event = new Event('scrolledtobottom');
    //alert("scrolled to bottom")
    window.dispatchEvent(event);
  }
  
},1000);
