



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

module.exports = EditAvatarModalButton = React.createClass({
  mixins: [OverlayMixin,SafeStateChangeMixin],
  getInitialState: function () {
    return {
      isModalOpen: false,
      avatar: this.props.avatar
    };
  },
  handleAvatarChange: function(event) {

    selectedFile=event.target.files[0];
    
    var thisComponent = this;
    
    var targetWidth = 64;

    var dataUrl = "";
    var reader = new FileReader();
    reader.onloadend = function () {
        dataUrl = reader.result;

        var sourceImage = new Image();

        sourceImage.onload = function () {
            // Create a canvas with the desired dimensions
            var canvas = document.createElement("canvas");

            var imWidth = sourceImage.width;
            var imHeight = sourceImage.height;

            var sx = 0;
            var sy = 0;

            sourceWidth = imWidth;

            if (imWidth > imHeight) {
                sx = (imWidth - imHeight) / 2;
                sourceWidth = imHeight;
            } else {
                sy = (imHeight - imWidth) / 2;
            }

            canvas.width = targetWidth;
            canvas.height = targetWidth;

            // Scale and draw the source image to the canvas
            canvas.getContext("2d").drawImage(sourceImage, sx, sy, sourceWidth, sourceWidth, 0, 0, targetWidth, targetWidth);

            var imgURL = undefined;
            for (var quality = 1.0; (!imgURL || imgURL.length > 4096) && quality > 0.1; quality -= 0.05) {
                imgURL = canvas.toDataURL('image/jpeg', quality);
            }
          
            thisComponent.setStateSafe({avatar: imgURL});
        };
        sourceImage.src = dataUrl;

    };
    reader.readAsDataURL(selectedFile);
  },
  handleToggle: function () {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  },
  handleAvatarEdit: function (e) {
    
    e.preventDefault();
    
    var newavatar = this.state.avatar;
    
    if(newavatar == "img/genericPerson.png") newavatar = "";
    
    var thisComponent = this;
    
    
    Twister.getAccount(this.props.activeAccount).updateAvatar(newavatar,function(avatar){
    
      console.log(avatar._data);
      
      var event = new CustomEvent('avatarupdatebyuser',{detail: avatar});
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
          <form onSubmit={this.handleAvatarEdit}>
            <img src={this.state.avatar}/>
            <Input 
              type='file' 
              label='Avatar' 
              onChange={this.handleAvatarChange} 
            />
            <Input type='submit' value='Update Avatar' data-dismiss="modal" />
          </form>
        </div>
      </Modal>
    );
  
  }
});