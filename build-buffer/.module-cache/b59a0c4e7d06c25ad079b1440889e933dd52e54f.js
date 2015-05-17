
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

module.exports = Post = React.createClass({displayName: "Post",
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
        React.createElement(OverlayTrigger, {placement: "left", overlay: 
          React.createElement(Tooltip, null, "View Conversation")
        }, 
      React.createElement("small", null, React.createElement("a", {href: "#/conversation/"+post.getReplyUsername()+"/"+post.getReplyId(), className: "link-button-gray"}, React.createElement(Glyphicon, {glyph: "comment"})))
    )
      );
    } else {
      var conversationLink = (React.createElement("span", null));
    }
    
    return (
      React.createElement(ListGroupItem, null, 
          React.createElement(Row, {className: "nomargin"}, 
            React.createElement(Col, {xs: 2, md: 2, className: "fullytight"}, 
              React.createElement("a", {href: "#/profile/"+post.getUsername()}, 
                React.createElement("img", {className: "img-responsive", src: this.state.avatar})
              )
            ), 
            React.createElement(Col, {xs: 9, md: 9}, 
              React.createElement("strong", null, this.state.fullname), " ", 
              post.getContent()
            ), 
            React.createElement(Col, {xs: 1, md: 1, className: "fullytight text-align-right"}, this.state.timeAgo)
          ), 
          React.createElement(Row, {className: "nomargin"}, 
            React.createElement(Col, {xs: 6, md: 6, className: "fullytight"}, 
        retwist && React.createElement("small", null, React.createElement("em", null, "  retwisted by ", this.state.retwistingUser))
          
            ), 
            React.createElement(Col, {xs: 6, md: 6, className: "fullytight text-align-right"}, conversationLink)
          )

      )
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