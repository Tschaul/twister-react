var React = require('react');
var Postboard = require("../common/Postboard.js");
var NewPostModalButton = require("../home/NewPostModalButton.js");
var SetIntervalMixin = require("../common/SetIntervalMixin.js");
var StreamMixin = require("../common/StreamMixin.js");
var SafeStateChangeMixin = require('../common/SafeStateChangeMixin.js');
var EventListenerMixin = require('../common/EventListenerMixin.js');


var ReactBootstrap = require('react-bootstrap')
  , NavItem = ReactBootstrap.NavItem
  , Nav = ReactBootstrap.Nav
  , ListGroup = ReactBootstrap.ListGroup
  , ListGroupItem = ReactBootstrap.ListGroupItem
  , Panel = ReactBootstrap.Panel
  , Glyphicon = ReactBootstrap.Glyphicon
  , Button = ReactBootstrap.Button

module.exports = Home = React.createClass({
    
  mixins: [
    StreamMixin,
    SetIntervalMixin,
    SafeStateChangeMixin,
    EventListenerMixin('scrolledtobottom'),
    EventListenerMixin('newpostbyuser')
  ],
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function() {
    return {
      data: [], 
      postIdentifiers: {}, 
      usernames: [], 
      postrange: ( Date.now()/1000 - 12*60*60 ),
      min_posts: 30
    };
  },
  addUser: function(username) {

    var thisComponent = this;
    this.setStateSafe(function(previousState, currentProps){
      
      previousState.usernames.push(username);
      return previousState;

    },function(){
    
      Twister.getUser(username).doLatestPostsUntil(function(post){
        
        if (post!==null) {
          if(post.getTimestamp()<thisComponent.state.postrange) {
            return false;
          } else {
            thisComponent.addPost(post);
            //console.log("adding post",post.getUsername(),post.getId())
          }
        } else {
          thisComponent.removeUser(thisUsername);
          return false;
        }

      },{outdatedLimit: 2*thisComponent.props.pollInterval});
    
    });

  },
  removeUser: function(username) {

    this.setStateSafe(function(previousState, currentProps){

      var newusers = [];

      for (var i = 0; i<previousState.usernames.length; i++) {
        if (previousState.usernames[i]!=username) {
          newusers.push(previousState.usernames[i]);
        }
      }

      previousState.usernames = newusers;

      var newdata = [];

      for (var i = 0; i<previousState.data.length; i++) {
        if (previousState.data[i].username!=username) {
          newusers.push(previousState.data[i]);
        } else {
          previousState.postIdentifiers[previousState.data[i].postid]=false;
        }
      }

      previousState.data = newdata;

      return previousState;

    });
  },
  updatePosts: function(outdatedLimit) {

    if (!outdatedLimit) {outdatedLimit=this.props.pollInterval/2;}

    for (var i = 0; i<this.state.usernames.length; i++) {

      var thisComponent = this;
      var thisUsername = this.state.usernames[i];

      Twister.getUser(thisUsername).doLatestPostsUntil(function(post){
        
        if (post!==null) {
          if(post.getTimestamp()<thisComponent.state.postrange) {
            return false;
          } else {
            thisComponent.addPost(post);
            //console.log("adding post",post.getUsername(),post.getId())
          }
        } else {
          thisComponent.removeUser(thisUsername);
          return false;
        }

      },{outdatedLimit: outdatedLimit});

    }
  },
  componentDidMount: function() {

    if (this.props.activeAccount) {
      
      console.log("active account is "+this.props.activeAccount)
    
      var thisComponent = this;
      
      var username=this.props.activeAccount;

      thisComponent.addUser(username);
      
      Twister.getUser(username).doFollowings(function(followings){

        for(var i in followings){
          thisComponent.addUser(followings[i].getUsername());
          //console.log(followings[i].getUsername())
        }

        //thisComponent.updatePosts(thisComponent.props.pollInterval);

      });

      this.setInterval(this.updatePosts, this.props.pollInterval*1000);
      
    } else {console.log("active account is null")}

  },
  onscrolledtobottom: function () {

    this.setStateSafe(function(previousState, currentProps){
      previousState.postrange -= 6*60*60;
      return previousState;
    },function(){
      this.updatePosts(2*this.props.pollInterval);
    });

  },
  onnewpostbyuser: function (event) {
        
    for (var i in this.state.usernames) {
      if(this.state.usernames[i]==event.detail.getUsername()) {
         this.addPost(event.detail);
      }
    }

  },
  render: function() {
    return (
        <Postboard data={this.state.data} header={
          <ListGroupItem>
            Home
            <NewPostModalButton activeAccount={this.props.activeAccount}/>
          </ListGroupItem>
        }/>
      );
  }
});