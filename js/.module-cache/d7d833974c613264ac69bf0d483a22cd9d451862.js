
var ReactBootstrap = require('react-bootstrap')
  , NavItem = ReactBootstrap.NavItem
  , Nav = ReactBootstrap.Nav
  , ListGroup = ReactBootstrap.ListGroup
  , Panel = ReactBootstrap.Panel


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
                React.createElement("div", {className: "post-avatar"}, 
                    React.createElement("img", {src: this.state.avatar})
                ), 
                React.createElement("div", {className: "post-bulk"}, 
                    React.createElement("div", {className: "post-username"}, 
                        React.createElement("span", {className: "post-fullname"}, this.state.fullname, " "), 
                        "@", post.username, " - ", post.id, 
                        post.isRetwist && 
                            React.createElement("span", null, " retwisted by ", post.retwistingUser)
                        
                    ), 
                    React.createElement("div", {className: "post-timestamp"}, post.timestamp), 
                    React.createElement("div", {className: "post-content"}, post.content)
                ), 
                React.createElement("hr", null)
            )
        );
    }
});