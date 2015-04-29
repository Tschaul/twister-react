var React = require('react');
var Postboard = require("./Postboard.js");
var SetIntervalMixin = require("./SetIntervalMixin.js");
var StreamMixin = require("./StreamMixin.js");
var SafeStateChangeMixin = require('./SafeStateChangeMixin.js');
var EventListenerMixin = require('./EventListenerMixin.js');


var ReactBootstrap = require('react-bootstrap')
  , NavItem = ReactBootstrap.NavItem
  , Nav = ReactBootstrap.Nav
  , ListGroup = ReactBootstrap.ListGroup
  , ListGroupItem = ReactBootstrap.ListGroupItem
  , Panel = ReactBootstrap.Panel
  , Glyphicon = ReactBootstrap.Glyphicon
  , Button = ReactBootstrap.Button
  , Modal = ReactBootstrap.Modal
  , ModalTrigger = ReactBootstrap.ModalTrigger

module.exports = Home = React.createClass({displayName: "Home",
    
  mixins: [StreamMixin,SetIntervalMixin,SafeStateChangeMixin,EventListenerMixin('scrolledtobottom')],
  contextTypes: {
    router: React.PropTypes.func
  },
  verifyPost: function (post) {

    var verified = false;
    for (var i = 0; i<this.state.usernames.length; i++) {
      if (post.getUsername()==this.state.usernames[i]) { verified = true }
    }
    return verified;

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

      Twister.getUser(username).doFollowings(function(followings){

        for(var i in followings){
          thisComponent.addUser(followings[i].getUsername());
          console.log(followings[i].getUsername())
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
  handleNewPost: function () {
    e.preventDefault();
    var msg = React.findDOMNode(this.refs.msg).value;
    if (!msg) {
      return;
    }
    
    alert(msg);
    
    React.findDOMNode(this.refs.msg).value = '';
    return;
  },
  render: function() {
    
    var newPostModal = (
      React.createElement(Modal, React.__spread({},  this.props, {bsStyle: "primary", title: React.createElement(Glyphicon, {glyph: "pencil"})}), 
        React.createElement("div", {className: "modal-body"}, 
          React.createElement(Input, {type: "textarea", label: "Text Area", placeholder: "textarea", ref: "msg"}), 
          React.createElement(Input, {type: "submit", value: "Submit button", onClick: this.handleNewPost})
        )
      )
    );
    
    var newPostButton = (
      React.createElement(ModalTrigger, {modal: newPostModal}, 
        React.createElement(Button, {className: "pull-right fullytight_all", bsStyle: "link"}, 
              React.createElement(Glyphicon, {glyph: "pencil"})
            )
      )
    );

    return (
        React.createElement(Postboard, {data: this.state.data, header: 
          React.createElement(ListGroupItem, null, 
            "Home", 
            newPostButton
          )
        })
      );
  }
});