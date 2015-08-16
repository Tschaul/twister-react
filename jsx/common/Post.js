
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
var PostContent = require('../common/PostContent.js');
var ReplyModalButton = require('../common/ReplyModalButton.js');

module.exports = Post = React.createClass({
  mixins: [SetIntervalMixin,SafeStateChangeMixin],
  getInitialState: function() {
    
    return {
      avatar: "img/genericPerson.png", 
      fullname: "",
      timeAgo: "",
      retwistingUser: this.props.post.username
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

    var post = Twister.getUser(this.props.post.username).getPost(this.props.post.id);
    
    if (post.isRetwist()) {
      
      post.getUser().doProfile(function(profile){
        thisComponent.setStateSafe({retwistingUser: profile.getField("fullname")});  
      });
      
      post=post.getRetwistedPost();
      
    }
      
    //console.log(this.props.post.username+":post"+this.props.post.id);
    post.getUser().doAvatar(function(avatar){
      if (avatar.getUrl()) {
        thisComponent.setStateSafe({avatar: avatar.getUrl()});  
      } 
    });
    
    post.getUser().doProfile(function(profile){
      thisComponent.setStateSafe({fullname: profile.getField("fullname")});  
    });

    this.updateTimeAgo();

    this.setInterval(this.updateTimeAgo,60000);
    
  },
  render: function() {
    
    var post = Twister.getUser(this.props.post.username).getPost(this.props.post.id);
    var retwist = false;
    
    if (post.isRetwist()) {
      retwist = true;
      post=post.getRetwistedPost();
      
    }
    
    if (post.isReply()) {
      var conversationLink = (
        <OverlayTrigger placement='left' overlay={
          <Tooltip>View Conversation</Tooltip>
        }>
      <small><a href={"#/conversation/"+post.getUsername()+"/"+post.getId()} className="link-button-gray"><Glyphicon glyph="comment"/></a></small>
    </OverlayTrigger>
      );
    } else {
      var conversationLink = (<span/>);
    }
                                          
                                          
    if (!post.isRetwist()) {
      var replyLink = <OverlayTrigger placement='left' overlay={
          <Tooltip>Reply</Tooltip>
        }>
          <small>
            <ReplyModalButton replyUsername={post.getUsername()} replyPostId={post.getId()} activeAccount={this.props.activeAccount} originalMsg={post.getContent()} replyUserFullname={this.state.fullname}/>
          </small>
        </OverlayTrigger>
    } else {
      var replyLink = (<span/>);
    }
    
    return (
      <ListGroupItem>
          <Row className="nomargin">
            <Col xs={2} md={2} className="fullytight">
              <a href={"#/profile/"+post.getUsername()}>
                <img className="img-responsive" src={this.state.avatar}/>
              </a>
            </Col>
            <Col xs={9} md={9}>
              <strong>{this.state.fullname}</strong>&nbsp;
              <PostContent content={post.getContent()}/>
            </Col>
            <Col xs={1} md={1} className="fullytight text-align-right">{this.state.timeAgo}</Col>
          </Row>
          <Row className="nomargin">
            <Col xs={6} md={6} className="fullytight">
        {retwist && <small><em> &nbsp;retwisted by {this.state.retwistingUser}</em></small>
          }
            </Col>
            <Col xs={5} md={5} className="fullytight text-align-right">
              {replyLink}
            </Col>
            <Col xs={1} md={1} className="fullytight text-align-right">
              {conversationLink}
            </Col>
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