
var ReactBootstrap = require('react-bootstrap')
  , NavItem = ReactBootstrap.NavItem
  , Nav = ReactBootstrap.Nav
  , ListGroup = ReactBootstrap.ListGroup
  , Panel = ReactBootstrap.Panel

var React = require('react');

var Post = require("./Post.js");

module.exports = Postboard = React.createClass({
  render: function() {
    var posts = this.props.data.map(function(post, index) {
      return (
        <Post post={post} key={post.postid} />
      );
    });
    return (
      <ListGroup fill>
        {posts}
      </ListGroup>
    );
  }
}); 