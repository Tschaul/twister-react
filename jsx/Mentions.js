var React = require('react');
var MiniProfile = require("./MiniProfile.js");
var Postboard = require("./Postboard.js");
var SetIntervalMixin = require("./SetIntervalMixin.js");
var StreamMixin = require("./StreamMixin.js");
var SafeStateChangeMixin = require('./SafeStateChangeMixin.js');
var EventListenerMixin = require('./EventListenerMixin.js');


module.exports = Home = React.createClass({
    
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
      <Postboard data={this.state.data} header=""/>
    );
  }
}); 