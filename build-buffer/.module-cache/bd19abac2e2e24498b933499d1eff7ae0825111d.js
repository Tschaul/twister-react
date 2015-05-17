var React = require('react');
var MiniProfile = require("../common/MiniProfile.js");
var Postboard = require("../common/Postboard.js");
var SetIntervalMixin = require("../common/SetIntervalMixin.js");
var StreamMixin = require("../common/StreamMixin.js");
var SafeStateChangeMixin = require('../common/SafeStateChangeMixin.js');
var EventListenerMixin = require('../common/EventListenerMixin.js');


module.exports = Home = React.createClass({displayName: "Home",
    
  mixins: [StreamMixin,SetIntervalMixin,SafeStateChangeMixin],
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function() {
    return {
      username: (this.context.router.getCurrentParams().username ? this.context.router.getCurrentParams().username : this.props.activeAccount),
      data: [],
      postIdentifiers: {}
    };
  },
  updateMentions: function(outdatedLimit) {

    thisComponent=this;
    
    if (outdatedLimit===undefined) {outdatedLimit=this.props.pollInterval/2;}

    Twister.getUser(this.state.username).doMentions(function(mentions){
          
      for(var i in mentions){
          thisComponent.addPost(mentions[i]);
      }

    },{outdatedLimit: outdatedLimit});

    
  },
  componentDidMount: function() {

    this.updateMentions(this.props.pollInterval*2);

    this.setInterval(this.updateMentions, this.props.pollInterval*1000);
      
  },
  render: function() {
    return (
      React.createElement(Postboard, {data: this.state.data, header: ""})
    );
  }
}); 