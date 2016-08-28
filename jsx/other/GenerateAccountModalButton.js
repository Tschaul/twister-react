
var ReactBootstrap = require('react-bootstrap')
  , Button = ReactBootstrap.Button
  , ButtonGroup = ReactBootstrap.ButtonGroup
  , Glyphicon = ReactBootstrap.Glyphicon
  , Modal = ReactBootstrap.Modal
  , Input = ReactBootstrap.Input

var React = require('react');

var SafeStateChangeMixin = require('../common/SafeStateChangeMixin.js');
var SetIntervalMixin = require("../common/SetIntervalMixin.js");

module.exports = GenerateAccountModalButton = React.createClass({
  mixins: [SafeStateChangeMixin],
  getInitialState: function () {
    return {
      isModalOpen: false,
      username: "",
      checkedUsername: "",
      available: false,
    }; 
  },
  handleUsernameChange: function(e) {
    this.setState({username: e.target.value});
    var thisComponent = this;
    if(e.target.value.length){
      Twister.checkUsernameAvailable(e.target.value,function(result){
        thisComponent.setStateSafe({
          checkedUsername: e.target.value,
          available: result
        });
      })
    }
  },
  handleToggle: function () {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  },
  handleGenerateAccount: function (e) {
    
    e.preventDefault();
    
    var newusername = this.state.username;
    
    Twister.generateClientSideAccount(newusername,function(newaccount){

      console.log(newaccount._name);
      
      var event = new CustomEvent('newaccountbyuser',{detail: newaccount});
      //alert("scrolled to bottom")
      window.dispatchEvent(event);

    })
            
    this.handleToggle();
    
    return;
  },
  render: function() {
        
    var showAvailable = (
      <span/>
    );
    
    if(this.state.username.length==0){
      
      showAvailable = (
        <p>try a username</p>
      );
      
    }else{
      if((this.state.username==this.state.checkedUsername)){
      
        if(this.state.available){
          showAvailable = (
            <p>{this.state.username + " is available"}</p>
          )
        }else{
          showAvailable = (
            <p>{this.state.username + " is already taken"}</p>
          )
        }

      }else{
        
        showAvailable = (
          <p>checking ...</p>
        );
        
      }
    }
      
    
    
    return (
        <Button onClick={this.handleToggle}>
          Generate Account
          <Modal show={this.state.isModalOpen} bsStyle='primary' onHide={this.handleToggle}>
            <Modal.Header>
              <Glyphicon glyph='certificate'/>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={this.handleGenerateAccount}>
                <Input 
                  type='text' 
                  label='Username' 
                  value={this.state.username}
                  onChange={this.handleUsernameChange} 
                />
                {showAvailable}
                <Input type='submit' value='Generate Account' data-dismiss="modal" />
              </form>
            </Modal.Body>
          </Modal>
        </Button>
    );
  }
});
