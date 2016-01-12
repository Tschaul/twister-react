
var ReactBootstrap = require('react-bootstrap')
  , OverlayMixin = ReactBootstrap.OverlayMixin
  , Button = ReactBootstrap.Button
  , ButtonGroup = ReactBootstrap.ButtonGroup
  , Glyphicon = ReactBootstrap.Glyphicon
  , Modal = ReactBootstrap.Modal
  , Input = ReactBootstrap.Input

var React = require('react');

var SafeStateChangeMixin = require('../common/SafeStateChangeMixin.js');
var SetIntervalMixin = require("../common/SetIntervalMixin.js");

module.exports = EditProfileModalButton = React.createClass({
  mixins: [OverlayMixin],
  getInitialState: function () {
    return {
      isModalOpen: false,
      fullname: this.props.fullname,
      location: this.props.location,
      bio: this.props.bio,
      url: this.props.url
    };
  },
  handleFullnameChange: function(e) {
    this.setState({fullname: e.target.value});
  },
  handleLocationChange: function(e) {
    this.setState({location: e.target.value});
  },
  handleBioChange: function(e) {
    this.setState({bio: e.target.value});
  },
  handleUrlChange: function(e) {
    this.setState({url: e.target.value});
  },
  handleToggle: function () {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  },
  handleProfileEdit: function (e) {
    
    e.preventDefault();
    
    var newProfileFields = {
      fullname: this.state.fullname,
      location: this.state.location,
      bio: this.state.bio,
      url: this.state.url,
    };
    
    
    Twister.getAccount(this.props.activeAccount).updateProfileFields(newProfileFields,function(profile){
    
      console.log(profile._data);
      
      var event = new CustomEvent('profileupdatebyuser',{detail: profile});
      //alert("scrolled to bottom")
      window.dispatchEvent(event);
    
    });
        
    this.handleToggle();
    
    return;
  },
  render: function() {
    
    if(this.props.activeAccount!=this.props.username){
      return (
        <span/>
      )
    }
    
    return (
        <Button onClick={this.handleToggle} className="link-button-gray pull-right fullytight_all" bsStyle="link">
          <Glyphicon glyph='pencil' />
        </Button>
    );
  }, 
  renderOverlay: function() {
  
    if (!this.state.isModalOpen) {
      return <span/>;
    }
    
    return (
      <Modal bsStyle='primary' title={<Glyphicon glyph='pencil'/>} onRequestHide={this.handleToggle}>
        <div className='modal-body'>
          <form onSubmit={this.handleProfileEdit}>
            <Input 
              type='text' 
              label='Fullname' 
              value={this.state.fullname}
              onChange={this.handleFullnameChange} 
            />
            <Input 
              type='text' 
              label='Location' 
              value={this.state.location}
              onChange={this.handleLocationChange} 
            />
            <Input 
              type='text' 
              label='Bio' 
              value={this.state.bio}
              onChange={this.handleBioChange} 
            />
            <Input 
              type='text' 
              label='Url' 
              value={this.state.url}
              onChange={this.handleUrlChange} 
            />
            <Input type='submit' value='Update Profile' data-dismiss="modal" />
          </form>
        </div>
      </Modal>
    );
  
  }
});