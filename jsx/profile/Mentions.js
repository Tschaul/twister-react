var React = require('react');
var MiniProfile = require("../common/MiniProfile.js");
var Postboard = require("../common/Postboard.js");
var SetIntervalMixin = require("../common/SetIntervalMixin.js");
var StreamMixin = require("../common/StreamMixin.js");
var SafeStateChangeMixin = require('../common/SafeStateChangeMixin.js');
var EventListenerMixin = require('../common/EventListenerMixin.js');
var AppSettingsMixin = require('../common/AppSettingsMixin.js');


module.exports = Mentions = React.createClass({
    
  mixins: [StreamMixin,AppSettingsMixin,SetIntervalMixin,SafeStateChangeMixin],
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function() {
    return {
      username: (this.context.router.getCurrentParams().username ? this.context.router.getCurrentParams().username : this.props.activeAccount),
      data: [],
      postIdentifiers: {},
      loading: true
    };
  },
  updateMentions: function(outdatedLimit) {

    thisComponent=this;
    
    if (outdatedLimit===undefined) {outdatedLimit=this.state.appSettings.pollInterval/2;}

    Twister.getUser(this.state.username).doMentions(function(mentions){
          
      for(var i in mentions){
          thisComponent.addPost(mentions[i]);
      }
      
      thisComponent.setStateSafe({loading: false});

    },{outdatedLimit: outdatedLimit});

    
  },
  componentDidMount: function() {

    this.updateMentions(this.state.appSettings.pollInterval*2);

    this.setInterval(this.updateMentions, this.state.appSettings.pollInterval*1000);
      
  },
  render: function() {
    return (
      <Postboard data={this.state.data} loading={this.state.loading}/>
    );
  }
}); 