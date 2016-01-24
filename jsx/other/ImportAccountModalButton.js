
var ReactBootstrap = require('react-bootstrap')
  , Button = ReactBootstrap.Button
  , ButtonGroup = ReactBootstrap.ButtonGroup
  , Glyphicon = ReactBootstrap.Glyphicon
  , Modal = ReactBootstrap.Modal
  , Input = ReactBootstrap.Input

var React = require('react');

var SafeStateChangeMixin = require('../common/SafeStateChangeMixin.js');
var SetIntervalMixin = require("../common/SetIntervalMixin.js");

module.exports = ImportAccountModalButton = React.createClass({
  getInitialState: function () {
    return {
      isModalOpen: false,
      privkey: "",
      username: "",
    };
  },
  handlePrivkeyChange: function(e) {
    this.setState({privkey: e.target.value});
  },
  handleUsernameChange: function(e) {
    this.setState({username: e.target.value});
  },
  handleToggle: function () {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  },
  handleImportAccount: function (e) {
    
    e.preventDefault();
    
    var newprivkey = this.state.privkey;
    var newusername = this.state.username;
    
    Twister.importClientSideAccount(newusername,newprivkey,function(newaccount){

      console.log(newaccount._name);
      
      var event = new CustomEvent('newaccountbyuser',{detail: newaccount});
      //alert("scrolled to bottom")
      window.dispatchEvent(event);

    })
            
    this.handleToggle();
    
    return;
  },
  render: function() {
    
    return (
        <Button onClick={this.handleToggle}>
          Import Account
          <Modal show={this.state.isModalOpen} bsStyle='primary' onHide={this.handleToggle}>
            <Modal.Header>
              <Glyphicon glyph='import'/>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={this.handleImportAccount}>
                <Input 
                  type='text' 
                  label='Username' 
                  value={this.state.username}
                  onChange={this.handleUsernameChange} 
                />
                <Input 
                  type='text' 
                  label='Private Key' 
                  value={this.state.privkey}
                  onChange={this.handlePrivkeyChange} 
                />
                <Input type='submit' value='Import Account' data-dismiss="modal" />
              </form>
            </Modal.Body>
          </Modal>
        </Button>
    );
  }
});