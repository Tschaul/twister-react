
var ReactBootstrap = require('react-bootstrap')
  , NavItem = ReactBootstrap.NavItem
  , Nav = ReactBootstrap.Nav
  , ListGroup = ReactBootstrap.ListGroup
  , ListGroupItem = ReactBootstrap.ListGroupItem
  , Panel = ReactBootstrap.Panel
  , Glyphicon = ReactBootstrap.Glyphicon
  , Button = ReactBootstrap.Button

var React = require('react/addons');

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Post = require("../common/Post.js");

module.exports = Postboard = React.createClass({
  render: function() {
    var posts = this.props.data.map(function(post, index) {
      return (
        <Post post={post} key={post.postid} />
      );
    });
    
    if (this.props.loading) {
      var spinner = (
        <ListGroupItem><p className="text-center"><img src="img/bouncing_ball.gif"/></p></ListGroupItem>
      );
    } else { 
      var spinner = (<span/>);
    }
    
    return (
      <ListGroup fill>
        {this.props.header}
        {spinner}
        <ReactCSSTransitionGroup transitionName="item">
          {posts}
        </ReactCSSTransitionGroup>
      </ListGroup>
    );
  }
}); 