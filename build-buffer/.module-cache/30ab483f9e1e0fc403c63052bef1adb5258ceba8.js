var React = require('react');
var Postboard = require("../common/Postboard.js");
var SetIntervalMixin = require("../common/SetIntervalMixin.js");
var StreamMixin = require("../common/StreamMixin.js");
var SafeStateChangeMixin = require('../common/SafeStateChangeMixin.js');
var EventListenerMixin = require('../common/EventListenerMixin.js');
var AppSettingsMixin = require('../common/AppSettingsMixin.js');


var ReactBootstrap = require('react-bootstrap')
  , NavItem = ReactBootstrap.NavItem
  , Nav = ReactBootstrap.Nav
  , ListGroup = ReactBootstrap.ListGroup
  , ListGroupItem = ReactBootstrap.ListGroupItem
  , Panel = ReactBootstrap.Panel
  , Glyphicon = ReactBootstrap.Glyphicon
  , Button = ReactBootstrap.Button

module.exports = Timeline = React.createClass({displayName: "Timeline",
    
  mixins:[
    StreamMixin,
    SetIntervalMixin,
    SafeStateChangeMixin,
    AppSettingsMixin,
    EventListenerMixin('scrolledtobottom'),
    EventListenerMixin('newpostbyuser')
  ],
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function() {
    return {
      username: (this.context.router.getCurrentParams().username ? this.context.router.getCurrentParams().username : this.props.activeAccount),
      data: [], 
      postIdentifiers: {},
      postCount: 30,
      loading: true
    };
  },
  updatePosts: function(outdatedLimit) {

      //console.log("updating " + this.state.username)
      
    if (!outdatedLimit) {outdatedLimit=this.state.appSettings.pollInterval/2;}

    var thisComponent = this;
    var thisUsername = this.state.username;

    var count = 0;
    
    Twister.getUser(this.state.username).doLatestPostsUntil(function(post){

      //console.log("updating "+count);
      
      thisComponent.setStateSafe({loading: false});
      
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

      this.updatePosts(2*this.state.appSettings.pollInterval);
      this.setInterval(this.updatePosts, this.state.appSettings.pollInterval*1000);
      
  },
  onscrolledtobottom: function () {

    this.setStateSafe(function(previousState, currentProps){
      previousState.postrange += 10;
      return previousState;
    },function(){
      this.updatePosts(2*this.state.appSettings.pollInterval);
    });

  },
  onnewpostbyuser: function (event) {
    
    //alert("got event")
    
    if(this.state.username==event.post.getUsername()) {
       this.addPost(event.post);
    }
    
  },
  render: function() {
      return (
          React.createElement(Postboard, {data: this.state.data, loading: this.state.loading})
        );
  }
});