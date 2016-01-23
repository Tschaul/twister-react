
var ReactBootstrap = require('react-bootstrap')
  , Grid = ReactBootstrap.Grid
  , Col = ReactBootstrap.Col
  , Row = ReactBootstrap.Row
  , ListGroupItem = ReactBootstrap.ListGroupItem
  , ListGroup = ReactBootstrap.ListGroup
  , Nav = ReactBootstrap.Nav
  , NavItem = ReactBootstrap.NavItem
  , Button = ReactBootstrap.Button
  , ButtonGroup = ReactBootstrap.ButtonGroup
  , Glyphicon = ReactBootstrap.Glyphicon

var React = require('react');
var Router = require('react-router');
var Route = Router.Route; var DefaultRoute = Router.DefaultRoute; var RouteHandler = Router.RouteHandler; var Link = Router.Link;

var SetIntervalMixin = require("../common/SetIntervalMixin.js");
var SafeStateChangeMixin = require('../common/SafeStateChangeMixin.js');
var ProfileMixin = require('../common/ProfileMixin.js');

var FollowButton = require('../common/FollowButton.js');
var EditProfileModalButton = require('../profile/EditProfileModalButton.js');
var EditAvatarModalButton = require('../profile/EditAvatarModalButton.js');

module.exports = Post = React.createClass({
  mixins: [
    SetIntervalMixin,
    SafeStateChangeMixin,
    ProfileMixin
  ],
  render: function() {
    
    var routeprefix = "#/profile/"+(this.context.router.getCurrentParams().username ? this.context.router.getCurrentParams().username+"/" : "")
    
    var subroute = this.context.router.getCurrentRoutes()[2].name
    
    //console.log(this.context.router.getCurrentRoutes());
        
    return (
      <ListGroup fill>
        <ListGroupItem>
            <Row className="nomargin">
              <Col xs={3} md={3} className="fullytight">
                <img className="img-responsive" src={this.state.avatar}/>
                <br/>
                <EditAvatarModalButton 
                  activeAccount={this.props.activeAccount} 
                  username={this.state.username}
                  avatar={this.state.avatar}
                />
                <FollowButton activeAccount={this.props.activeAccount} username={this.state.username}/>
              </Col>
              <Col xs={8} md={8}>
                <h4 className="nomargin-top">{this.state.fullname}<small> {'@'+this.state.username}</small></h4>
                <p className="text-center">{this.state.location}</p>
                <p className="text-center">{this.state.bio}</p>
                <p className="text-center"><a href={this.state.url}>{this.state.url}</a></p>
                <EditProfileModalButton 
                  activeAccount={this.props.activeAccount} 
                  username={this.state.username}
                  fullname={this.state.fullname}
                  location={this.state.location}
                  bio={this.state.bio}
                  url={this.state.url}
                />
              </Col>
              <Col xs={1} md={1} className="fullytight text-align-right"></Col>
            </Row>
        </ListGroupItem>
        <ListGroupItem className="fullytight_all">
          <ButtonGroup justified>
            <Button href={routeprefix+"timeline"} bsStyle={subroute.indexOf("timeline")>-1 ? "primary" : "default"}><Glyphicon glyph="list"/></Button>
            <Button href={routeprefix+"followings"} bsStyle={subroute.indexOf("followings")>-1 ? "primary" : "default"}><Glyphicon glyph="eye-open"/></Button>
            <Button href={routeprefix+"mentions"} bsStyle={subroute.indexOf("mentions")>-1 ? "primary" : "default"}><Glyphicon glyph="comment"/></Button>
          </ButtonGroup>
        </ListGroupItem>
          {this.props.children && React.cloneElement(this.props.children, {
            activeAccount:this.state.activeAccount
          })}
      </ListGroup>
    );
  }
});