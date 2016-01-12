
var ReactBootstrap = require('react-bootstrap')
  , OverlayMixin = ReactBootstrap.OverlayMixin
  , Button = ReactBootstrap.Button
  , ButtonGroup = ReactBootstrap.ButtonGroup
  , Glyphicon = ReactBootstrap.Glyphicon
  , Modal = ReactBootstrap.Modal
  , Input = ReactBootstrap.Input

var React = require('react');

var SafeStateChangeMixin = require('../common/SafeStateChangeMixin.js');

module.exports = FollowButton = React.createClass({
  mixins: [SafeStateChangeMixin],
  getInitialState: function () {
    return {
      hasLoaded: false,
      isCurrentlyFollowing: false
    };
  },
  handleClick: function (e) {
    
    thisComponent = this;
    
    e.preventDefault();
    
    if(this.state.hasLoaded){
      
      var methodName = thisComponent.state.isCurrentlyFollowing ? "unfollow" : "follow";
      var newValForState = !thisComponent.state.isCurrentlyFollowing;
      var eventName = thisComponent.state.isCurrentlyFollowing ? "unfollowbyuser" : "followbyuser";

      Twister.getAccount(thisComponent.props.activeAccount)[methodName](
        thisComponent.props.username,
        function(following){

          thisComponent.setStateSafe({isCurrentlyFollowing:newValForState});

          Twister.getAccount(thisComponent.props.activeAccount).activateTorrent(thisComponent.props.username)
          
      });
    
    }
    
    return;
  },
  componentDidMount: function () {
    
    thisComponent = this;
    
    Twister.getUser(thisComponent.props.activeAccount).doFollowings(function(followings){
      if(followings.map(function(fol){
        return fol.getUsername();
      }).indexOf(thisComponent.props.username)<0){
        thisComponent.setStateSafe({isCurrentlyFollowing: false, hasLoaded: true});
      }else{
        thisComponent.setStateSafe({isCurrentlyFollowing: true, hasLoaded: true});        
      }
    })
  },
  render: function() {
    
    if(!this.state.hasLoaded || this.props.activeAccount==this.props.username){
      return (
        <span/>
      )
    }
    
    var methodName = this.state.isCurrentlyFollowing ? "Unfollow" : "Follow";
        
    return (
        <button onClick={this.handleClick}>{methodName}</button>
    );
  }
});