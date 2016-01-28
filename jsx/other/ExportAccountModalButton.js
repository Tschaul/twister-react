
var ReactBootstrap = require('react-bootstrap')
  , Button = ReactBootstrap.Button
  , ButtonGroup = ReactBootstrap.ButtonGroup
  , Glyphicon = ReactBootstrap.Glyphicon
  , Modal = ReactBootstrap.Modal
  , Input = ReactBootstrap.Input

var React = require('react');

var SafeStateChangeMixin = require('../common/SafeStateChangeMixin.js');
var SetIntervalMixin = require("../common/SetIntervalMixin.js");

module.exports = ExportAccountModalButton = React.createClass({
  mixins: [
    SafeStateChangeMixin
  ],
  getInitialState: function () {
    return {
      isModalOpen: false,
      useEncryption: true,
      passphrase1: "",
      passphrase2: "",
      encryptionInProgess: false,
      encryptionComplete: false,
      encryptedKey: "",
      publishedOnTiwster: false,
    };
  },
  handleUseEncryptionChange: function(e) {
    this.setState({
      useEncryption: e.target.checked,
      encryptionInProgess: false,
      encryptionComplete: false,
      encryptedKey: "",
      publishedOnTwister: false,
    });
  },
  handlePassphrase1Change: function(e) {
    this.setState({
      passphrase1: e.target.value,
      encryptionInProgess: false,
      encryptionComplete: false,
      encryptedKey: "",
      publishedOnTwister: false,
    });
  },
  handlePassphrase2Change: function(e) {
    this.setState({
      passphrase2: e.target.value,
      encryptionInProgess: false,
      encryptionComplete: false,
      encryptedKey: "",
      publishedOnTwister: false,
    });
  },
  handleToggle: function () {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  },
  handleEncryption: function (e) {
    
    e.preventDefault();
    
    var thisComponent = this;
    
    if(this.state.useEncryption){
    
      var passphrase = this.state.passphrase1;

      thisComponent.setStateSafe({encryptionInProgess: true});

      Twister.getAccount(this.props.username).encryptPrivateKey(passphrase,
      function(encryptedKey){

        thisComponent.setStateSafe({encryptedKey: encryptedKey, encryptionComplete: true, encryptionInProgess: false});

      });
      
    }else{
      
      var wif = Twister.getAccount(this.props.username).getPrivateKey();
      
      thisComponent.setStateSafe({encryptedKey: wif, encryptionComplete: true, encryptionInProgess: false});
      
    }

                
    return;
  },
  publishOnTwister: function() {
    
    var thisComponent = this;
    
    if(this.state.useEncryption && this.state.encryptedKey.length && this.state.encryptedKey.startsWith("6P")){
      
      Twister.getAccount(this.props.username).updateProfileFields({bip38:this.state.encryptedKey},function(profile){
        
        thisComponent.setStateSafe({publishedOnTwister: true});
        
      })
      
    }
    
  },
  render: function() {
    
    var belowForm = (
      <p/>
    );
      
    if(this.state.encryptionInProgess){
      belowForm = (
        <p>Encryption in progress. Sorry for the lag.</p>
      )
    }
    
    if(this.state.encryptionComplete){
      if(this.state.useEncryption){
        
        var formattedBody = "Your encrypted key for Twister: "
          +this.state.encryptedKey
          +"\n\nAdvice: Print this email and note down your username and passphrase on the same piece of paper.";
        
        var subject = "Encrypted Twister Private Key";
        
        var mailToLink = "mailto:?body=" + encodeURIComponent(formattedBody) + "&subject=" + encodeURIComponent(subject);
        
        var dataUrl = "data:text/plain;charset=utf-8;base64,"+btoa(this.state.encryptedKey);
        
        var publishOnTwisterDisabled = this.props.accountStatus != "confirmed";
        
        var publishedOnTwisterButtonStr = "Publish on Twister" + (this.state.publishedOnTwister?" ✓":"");
        
        
        belowForm = (
          <p>
            {"Your encrypted key: "+this.state.encryptedKey}
            <br/>
            <Button download="twisterkey.txt" href={dataUrl}>Download</Button>         
            <Button href={mailToLink}>Send via Email</Button>
            <Button onClick={this.publishOnTwister} disabled={publishOnTwisterDisabled}>{publishedOnTwisterButtonStr}</Button>   
          </p>
        )
      }else{        
        
        var dataUrl = "data:text/plain;charset=utf-8;base64,"+btoa(this.state.encryptedKey);

        belowForm = (
          <p>
            {"Your private key: "+this.state.encryptedKey}      
            <Button download="twisterkey.txt" href={dataUrl}>Download</Button>
            <Button disabled>Send via Email</Button>
            <Button disabled>Publish on Twister</Button>      
          </p>
        )
      }
    }
    
    var submitButton = (
      <Input type='submit' value='Encrypt Private Key' disabled={this.state.passphrase1!=this.state.passphrase2}/>
    )
    if(!this.state.useEncryption){
       submitButton = (
        <Input type='submit' value='Reveal Private Key'/>
       );
    }
    
    return (
        <Button onClick={this.handleToggle}>
          Export Account
          <Modal show={this.state.isModalOpen} bsStyle='primary' onHide={this.handleToggle}>
            <Modal.Header>
              <Glyphicon glyph='export'/>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={this.handleEncryption}>
                <Input 
                  type='checkbox' 
                  label='Use Encrpytion (highly recommended)' 
                  checked={this.state.useEncryption}
                  onChange={this.handleUseEncryptionChange} 
                />
                <Input 
                  type='password' 
                  label='Passphrase' 
                  value={this.state.passphrase1}
                  onChange={this.handlePassphrase1Change} 
                  disabled={!this.state.useEncryption}
                />
                <Input 
                  type='password' 
                  label='Repeat Passphrase' 
                  value={this.state.passphrase2}
                  onChange={this.handlePassphrase2Change}
                  disabled={!this.state.useEncryption}
                />
                {submitButton}
              </form>
              {belowForm}
              
            </Modal.Body>
          </Modal>
        </Button>
    );
  }
});