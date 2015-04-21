
var ReactBootstrap = require('react-bootstrap')
  , Grid = ReactBootstrap.Grid
  , Col = ReactBootstrap.Col
  , ListGroupItem = ReactBootstrap.ListGroupItem

var React = require('react');

module.exports = Post = React.createClass({displayName: "Post",
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
      
      if (secondsAgo<30) {newTimeAgo="1m"}
      else if (secondsAgo<30*60) {newTimeAgo=round(secondsAgo/60)+"m"}
      else if (secondsAgo<30*60*60) {newTimeAgo=round(secondsAgo/60/60)+"h"}
      else if (secondsAgo<60*60*60*12) {newTimeAgo=round(secondsAgo/60/60/60)+"d"}
      
      this.setState({timeAgo: newTimeAgo});
      
    },
    componentDidMount: function () {
      var thisComponent = this;

      //console.log(this.props.post.username+":post"+this.props.post.id);
      Twister.getUser(this.props.post.username).doAvatar(function(avatar){
        thisComponent.setState({avatar: avatar.getUrl()});  
      });
      Twister.getUser(this.props.post.username).doProfile(function(profile){
        thisComponent.setState({fullname: profile.getField("fullname")});  
      });

      if (this.props.post.isRetwist) {

        Twister.getUser(this.props.post.retwistingUser).doProfile(function(profile){
          thisComponent.setState({retwistingUser: profile.getField("fullname")});  
        });

      }

      this.updateTimeAgo();
    },
    render: function() {
        var post = this.props.post;
        return (
          React.createElement(ListGroupItem, null, 
            React.createElement(Grid, {fill: true}, 
          post.isRetwist && 
              React.createElement(Col, {xs: 12}, React.createElement("small", null, React.createElement("span", {className: "glyphicon glyphicon-repeat", "aria-hidden": "true"}), " ", React.createElement("em", null, "retwisted by ", this.state.retwistingUser))), 
            
              React.createElement(Col, {xs: 2}, React.createElement("img", {className: "img-responsive", src: this.state.avatar})), 
              React.createElement(Col, {xs: 9}, 
                React.createElement("strong", null, this.state.fullname), " ", 
                post.content
              ), 
              React.createElement(Col, {xs: 1}, React.createElement("p", {className: "text-right"}, this.state.timeAgo))
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