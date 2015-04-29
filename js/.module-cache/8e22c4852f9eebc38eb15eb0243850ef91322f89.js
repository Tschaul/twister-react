
var ReactBootstrap = require('react-bootstrap')
  , Grid = ReactBootstrap.Grid
  , Col = ReactBootstrap.Col
  , Row = ReactBootstrap.Row
  , ListGroupItem = ReactBootstrap.ListGroupItem

var React = require('react');

var SetIntervalMixin = require("./SetIntervalMixin.js");
var SafeStateChangeMixin = require('./SafeStateChangeMixin.js');

module.exports = Post = React.createClass({displayName: "Post",
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
    else if (secondsAgo<45*60*60) {newTimeAgo=Math.round(secondsAgo/60/60)+"h"}
    else if (secondsAgo<60*60*60*18) {newTimeAgo=Math.round(secondsAgo/60/60/60)+"d"}

    this.setStateSafe({timeAgo: newTimeAgo});

  },
  componentDidMount: function () {
    var thisComponent = this;

    //console.log(this.props.post.username+":post"+this.props.post.id);
    Twister.getUser(this.props.post.username).doAvatar(function(avatar){
      thisComponent.setStateSafe({avatar: avatar.getUrl()});  
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
    return (
      React.createElement(ListGroupItem, null, 
        React.createElement(Grid, null, 
          React.createElement(Row, null, 
            React.createElement(Col, {xs: 2, md: 2, className: "fullytight"}, React.createElement("img", {className: "img-responsive", src: this.state.avatar})), 
            React.createElement(Col, {xs: 9, md: 9}, 
              React.createElement("strong", null, this.state.fullname), " ", 
              post.content
            ), 
            React.createElement(Col, {xs: 1, md: 1, className: "fullytight"}, React.createElement("p", null, this.state.timeAgo))
          ), 
          React.createElement(Row, null, 
            React.createElement(Col, {xs: 6, md: 6, className: "fullytight"}, 
        post.isRetwist && React.createElement("small", null, React.createElement("span", {className: "glyphicon glyphicon-retweet", "aria-hidden": "true"}), " ", React.createElement("em", null, "  retwisted by ", this.state.retwistingUser))
          
            ), 
            React.createElement(Col, {xs: 6, md: 6, className: "fullytight"}, React.createElement("p", null, React.createElement("small", null, React.createElement("em", null, "test"))))
          )
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