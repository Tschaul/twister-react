
var ReactBootstrap = require('react-bootstrap')
  , NavItem = ReactBootstrap.NavItem
  , Nav = ReactBootstrap.Nav
  , ListGroup = ReactBootstrap.ListGroup
  , Panel = ReactBootstrap.Panel

var Post = require("./Post.js");

module.exports = Postboard = React.createClass({displayName: "Postboard",
  render: function() {
    var posts = this.props.data.map(function(post, index) {
      return (
        React.createElement(Post, {post: post, key: post.postid})
      );
    });
    return (
      React.createElement(ListGroup, {fill: true}, 
        posts
      )
    );
  }
}); 