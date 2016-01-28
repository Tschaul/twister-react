
var ReactBootstrap = require('react-bootstrap')
  , Button = ReactBootstrap.Button
  , ButtonGroup = ReactBootstrap.ButtonGroup
  , Glyphicon = ReactBootstrap.Glyphicon
  , Modal = ReactBootstrap.Modal
  , Input = ReactBootstrap.Input

var React = require('react');

var SafeStateChangeMixin = require('../common/SafeStateChangeMixin.js');
var SetIntervalMixin = require("../common/SetIntervalMixin.js");

module.exports = LogoutModalButton = React.createClass({
  mixins: [
    SafeStateChangeMixin
  ],
  getInitialState: function () {
    return {
      isModalOpen: false,
    };
  },
  handleToggle: function () {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  },
  handleLogout: function (e) {
    
    var thisComponent = this;
    
    e.preventDefault();
    
    var username = this.props.username;
    
    Twister.removeAccount(this.props.username);
    
    var event = new CustomEvent('accountremovedbyuser',{detail: {username:this.props.username}});
    //alert("scrolled to bottom")
    window.dispatchEvent(event);

    thisComponent.handleToggle();
             
    return;
  },
  render: function() {
    
    return (
        <Button onClick={this.handleToggle}>
          Logout
          <Modal show={this.state.isModalOpen} bsStyle='primary' onHide={this.handleToggle}>
            <Modal.Header>
              <Glyphicon glyph='export'/>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={this.handleLogout}>
                <p>
                  Are you sure you want to logout? Be sure that you exported your private key. Othervise your account will be lost.
                </p>
                <Input type='submit' value='Logout'/>
              </form>
            </Modal.Body>
          </Modal>
        </Button>
    );
  }
});