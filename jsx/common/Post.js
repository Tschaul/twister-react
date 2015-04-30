
var ReactBootstrap = require('react-bootstrap')
  , Grid = ReactBootstrap.Grid
  , Col = ReactBootstrap.Col
  , Row = ReactBootstrap.Row
  , ListGroupItem = ReactBootstrap.ListGroupItem
  , Glyphicon = ReactBootstrap.Glyphicon
  , OverlayTrigger = ReactBootstrap.OverlayTrigger
  , Tooltip = ReactBootstrap.Tooltip

var React = require('react');

var SetIntervalMixin = require("../common/SetIntervalMixin.js");
var SafeStateChangeMixin = require('../common/SafeStateChangeMixin.js');

module.exports = Post = React.createClass({
  mixins: [SetIntervalMixin,SafeStateChangeMixin],
  getInitialState: function() {
    return {
      avatar: "img/genericPerson.png", 
      fullname: "", 
      retwistingUser: this.props.post.retwistingUser,
      timeAgo: ""
    };
  },
  updateTimeAgo: function() {
    var secondsAgo = Date.now()/1000-this.props.post.timestamp;

    var newTimeAgo = "";

    if (secondsAgo<45) {newTimeAgo="1m"}
    else if (secondsAgo<45*60) {newTimeAgo=Math.round(secondsAgo/60)+"m"}
    else if (secondsAgo<18*60*60) {newTimeAgo=Math.round(secondsAgo/60/60)+"h"}
    else if (secondsAgo<26*24*60*60) {newTimeAgo=Math.round(secondsAgo/24/60/60)+"d"}
    else if (secondsAgo<9*30.5*24*60*60) {newTimeAgo=Math.round(secondsAgo/30.5/24/60/60)+"mo"}
    else  {newTimeAgo=Math.round(secondsAgo/365/24/60/60)+"y"}

    this.setStateSafe({timeAgo: newTimeAgo});

  },
  componentDidMount: function () {
    var thisComponent = this;

    //console.log(this.props.post.username+":post"+this.props.post.id);
    Twister.getUser(this.props.post.username).doAvatar(function(avatar){
      if (avatar.getUrl()) {
        thisComponent.setStateSafe({avatar: avatar.getUrl()});  
      } 
    });
    
    Twister.getUser(this.props.post.username).doProfile(function(profile){
      thisComponent.setStateSafe({fullname: profile.getField("fullname")});  
    });

    if (this.props.post.isRetwist) {
      Twister.getUser(this.props.post.retwistingUser).doProfile(function(profile){
        thisComponent.setStateSafe({retwistingUser: profile.getField("fullname")});  
      });
    }

    this.updateTimeAgo();

    this.setInterval(this.updateTimeAgo,60000);
    
  },
  render: function() {
    var post = this.props.post;
    
    if (post.isReply) {
      var conversationLink = (
        <OverlayTrigger placement='left' overlay={
          <Tooltip>View Conversation</Tooltip>
        }>
      <small><a href={"#/conversation/"+post.replyUser+"/"+post.replyId} className="link-button-gray"><Glyphicon glyph="comment"/></a></small>
    </OverlayTrigger>
      );
    } else {
      var conversationLink = (<span/>);
    }
    
    return (
      <ListGroupItem>
          <Row className="nomargin">
            <Col xs={2} md={2} className="fullytight">
              <a href={"#/profile/"+this.props.post.username}>
                <img className="img-responsive" src={this.state.avatar}/>
              </a>
            </Col>
            <Col xs={9} md={9}>
              <strong>{this.state.fullname}</strong>&nbsp;
              {post.content}
            </Col>
            <Col xs={1} md={1} className="fullytight text-align-right">{this.state.timeAgo}</Col>
          </Row>
          <Row className="nomargin">
            <Col xs={6} md={6} className="fullytight">
        {post.isRetwist && <small><Glyphicon glyph="retweet" aria-hidden="true"/><em> &nbsp;retwisted by {this.state.retwistingUser}</em></small>
          }
            </Col>
            <Col xs={6} md={6} className="fullytight text-align-right">{conversationLink}</Col>
          </Row>

      </ListGroupItem>
    );
  }
});

/*
<div className="post-avatar">
                    <img src={this.state.avatar}/>
                </div>
                <div className="post-bulk">
                    <div className="post-username">
                        <span className="post-fullname">{this.state.fullname} </span>
                        @{post.username} - {post.id}
                        
                    </div>
                    <div className="post-timestamp">{post.timestamp}</div>
                    <div className="post-content">{post.content}</div>
                </div>
                <hr/>
                
                */