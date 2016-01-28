
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
  mixins: [SafeStateChangeMixin],
  getInitialState: function () {
    return {
      isModalOpen: false,
      privkey: "",
      username: "",
      passphrase: "",
    };
  },
  handlePrivkeyChange: function(e) {
    this.setState({privkey: e.target.value});
  },
  handleUsernameChange: function(e) {
    this.setState({username: e.target.value});
  },
  handlePassphraseChange: function(e) {
    this.setState({passphrase: e.target.value});
  },
  handleToggle: function () {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  },
  pullFromTwister: function(){
  
    var thisComponent = this;
    
    Twister.getUser(this.state.username).doProfile(function(profile){
      
      var key = profile.getField("bip38");
      
      if(key) {
        thisComponent.setStateSafe({privkey:key});
      }
      
    })
    
  },
  handleImportAccount: function (e) {
    
    var thisComponent = this;
    
    e.preventDefault();
    
    var newprivkey = this.state.privkey;
    var newusername = this.state.username;
    var passphrase = this.state.passphrase;
    
    var success = function(newaccount){

      console.log(newaccount._name);
      
      var event = new CustomEvent('newaccountbyuser',{detail: newaccount});
      //alert("scrolled to bottom")
      window.dispatchEvent(event);
      
      thisComponent.handleToggle();

    }
    
    if(passphrase.length){
      Twister.importClientSideAccountFromEncryptedKey(newusername,newprivkey,passphrase,success)
    }else{
      Twister.importClientSideAccount(newusername,newprivkey,success)
    }
    
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
                  label='(Encrypted) Private Key' 
                  value={this.state.privkey}
                  onChange={this.handlePrivkeyChange} 
                />
                <Button onClick={this.pullFromTwister}>Pull From Twister</Button>
                <Input 
                  type='password' 
                  label='Passphrase (only for encrypted keys)' 
                  value={this.state.passphrase}
                  onChange={this.handlePassphraseChange} 
                />
                <Input type='submit' value='Import Account' data-dismiss="modal" />
              </form>
            </Modal.Body>
          </Modal>
        </Button>
    );
  }
});