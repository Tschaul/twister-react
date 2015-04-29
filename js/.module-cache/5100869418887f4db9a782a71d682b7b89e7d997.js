var React = require('react');
var Postboard = require("./Postboard.js");
var Timeline = require("./Timeline.js");
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

module.exports = Home = React.createClass({displayName: "Home",
    
  mixins: [StreamMixin,SetIntervalMixin,SafeStateChangeMixin,EventListenerMixin('scrolledtobottom')],
  contextTypes: {
    router: React.PropTypes.func
  },
  verifyPost: function (post) {
    return true;
  },
  getInitialState: function() {
    return {
      data: [], 
      postIdentifiers: {},
      postCount: 30
    };
  },
  updatePosts: function(outdatedLimit) {

    if (!outdatedLimit) {outdatedLimit=this.props.pollInterval/2;}

    var thisComponent = this;
    var thisUsername = this.props.username;

    var count = 0;
    
    Twister.getUser(this.props.username).doLatestPostsUntil(function(post){

      console.log(post.getContent())
      
      if (post!==null) {
        if(count++>=thisComponent.state.postCount) {
          return false;
        } else {
          thisComponent.addPost(post);
        }
      } else {
        return false;
      }

    },{outdatedLimit: outdatedLimit});

  },
  componentDidMount: function() {

      this.updatePosts(2*this.props.pollInterval);
      this.setInterval(this.updatePosts, this.props.pollInterval*1000);

  },
  onscrolledtobottom: function () {

    this.setStateSafe(function(previousState, currentProps){
      previousState.postrange += 10;
      return previousState;
    },function(){
      this.updatePosts(2*this.props.pollInterval);
    });

  },
  render: function() {
      return (
          React.createElement(Postboard, {data: this.state.data, header: ""})
        );
  }
});