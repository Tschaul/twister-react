
var ReactBootstrap = require('react-bootstrap')
  , NavItem = ReactBootstrap.NavItem
  , Nav = ReactBootstrap.Nav
  , ListGroup = ReactBootstrap.ListGroup
  , ListGroupItem = ReactBootstrap.ListGroupItem
  , Panel = ReactBootstrap.Panel
  , Glyphicon = ReactBootstrap.Glyphicon
  , Button = ReactBootstrap.Button

var React = require('react');

var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var Post = require("../common/Post.js");

module.exports = Postboard = React.createClass({
  render: function() {
    
    var activeAccount = this.props.activeAccount;
    
    var posts = this.props.data.map(function(post, index) {
      return (
        <Post post={post} key={post.postid} activeAccount={activeAccount}/>
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
        <ReactCSSTransitionGroup transitionName="item" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
          {posts}
        </ReactCSSTransitionGroup>
      </ListGroup>
    );
  }
}); 