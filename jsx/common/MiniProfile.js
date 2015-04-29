
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

var SetIntervalMixin = require("../common/SetIntervalMixin.js");
var SafeStateChangeMixin = require('../common/SafeStateChangeMixin.js');
var ProfileMixin = require('../common/ProfileMixin.js');

module.exports = MiniProfile = React.createClass({
  mixins: [SetIntervalMixin,SafeStateChangeMixin,ProfileMixin],
  render: function() {
    return (
        <ListGroupItem>
            <Row className="nomargin">
              <Col xs={2} md={2} className="fullytight">
                <a href={"#/profile/"+this.props.username}>
                  <img className="img-responsive" src={this.state.avatar}/>
                </a>
              </Col>
              <Col xs={9} md={9}>
                <h5 className="nomargin-top">
                  {this.state.fullname}<small> &nbsp; {'@'+this.props.username}</small>
                </h5>
                <p>{this.state.bio}</p>
              </Col>
              <Col xs={1} md={1} className="fullytight text-align-right"></Col>
            </Row>
        </ListGroupItem>
    );
  }
});