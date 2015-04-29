
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
var { Route, DefaultRoute, RouteHandler, Link } = Router;

var SetIntervalMixin = require("./SetIntervalMixin.js");
var SafeStateChangeMixin = require('./SafeStateChangeMixin.js');
var ProfileMixin = require('./ProfileMixin.js');

module.exports = Post = React.createClass({
  mixins: [SetIntervalMixin,SafeStateChangeMixin,ProfileMixin],
  contextTypes: {
    router: React.PropTypes.func
  },
  getHandlerKey: function () {
    var childDepth = 2; // assuming App is top-level route
    var { router } = this.context;
    //console.log(router.getCurrentParams())
    if ( router.getCurrentRoutes()[childDepth] ) {
      var key = router.getCurrentRoutes()[childDepth].name;
      if (key.indexOf("active")>-1) {key+="/"+this.props.activeAccount;}
      var id = JSON.stringify(router.getCurrentParams());
      if (id) { key += id; }
      console.log(key);
      return key;
    } else {return "none"}
  },
  render: function() {
    
    var routeprefix = "#/profile/"+(this.context.router.getCurrentParams().username ? this.context.router.getCurrentParams().username+"/" : "")
    
    var subroute = this.context.router.getCurrentRoutes()[2].name
    
    console.log(this.context.router.getCurrentRoutes());
        
    return (
      <ListGroup fill>
        <ListGroupItem>
            <Row className="nomargin">
              <Col xs={3} md={3} className="fullytight">
                <img className="img-responsive" src={this.state.avatar}/>
              </Col>
              <Col xs={8} md={8}>
                <h4 className="nomargin-top">{this.state.fullname}<small> &nbsp; {'@'+this.state.username}</small></h4>
                <p className="text-center">{this.state.location}</p>
                <p className="text-center">{this.state.bio}</p>
                <p className="text-center"><a href={this.state.url}>{this.state.url}</a></p>
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
        <RouteHandler 
          pollInterval={this.props.pollInterval} 
          pollIntervalProfile={this.props.pollIntervalProfile} 
          activeAccount={this.props.activeAccount} 
          key={this.getHandlerKey()}
        />
      </ListGroup>
    );
  }
});