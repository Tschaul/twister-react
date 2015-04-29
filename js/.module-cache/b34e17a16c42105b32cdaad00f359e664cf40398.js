

var React = require('react');

var Post = require("./Post.js");

module.exports = Postboard = React.createClass({displayName: "Postboard",
  render: function() {
    var posts = this.props.data.map(function(post, index) {
      return (
        React.createElement(Post, {post: post, key: post.postid})
      );
    });
    return ({posts});
  }
}); 