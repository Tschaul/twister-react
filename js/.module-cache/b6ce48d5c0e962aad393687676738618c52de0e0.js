
var ReactBootstrap = require('react-bootstrap')
  , Grid = ReactBootstrap.Grid
  , Col = ReactBootstrap.Col

var React = require('react');

module.exports = Post = React.createClass({displayName: "Post",
    getInitialState: function() {
        return {avatar: "img/genericPerson.png", fullname: ""};
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
    },
    render: function() {
        var post = this.props.post;
        return (
          React.createElement(ListGroupItem, null, 
            React.createElement(Grid, null, 
              React.createElement(Col, {xs: 3}, React.createElement("img", {src: this.state.avatar})), 
              React.createElement(Col, {xs: 9}, post.content)
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
                        {post.isRetwist && 
                            <span> retwisted by {post.retwistingUser}</span>
                        }
                    </div>
                    <div className="post-timestamp">{post.timestamp}</div>
                    <div className="post-content">{post.content}</div>
                </div>
                <hr/>
                
                */