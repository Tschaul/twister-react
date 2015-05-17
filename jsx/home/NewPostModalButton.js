
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

module.exports = NewPostModalButton = React.createClass({
  mixins: [OverlayMixin],
  getInitialState: function () {
    return {
      isModalOpen: false
    };
  },
  handleToggle: function () {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  },
  handleNewPost: function (e) {
    e.preventDefault();
    //console.log(e)
    var msg = JSON.parse(JSON.stringify(e.target[0].value));
    if (!msg) {
      console.log("empty post was passed as new post")
      return;
    }
    
    Twister.getAccount(this.props.activeAccount).post(msg,function(post){
    
      var event = new CustomEvent('newpostbyuser',{detail: post});
      //alert("scrolled to bottom")
      window.dispatchEvent(event);
    
    });
    
    e.target[0].value = "";
    
    
    this.handleToggle();
    
    //React.findDOMNode(this.refs.msg).value = '';
    return;
  },
  render: function() {
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
          <form onSubmit={this.handleNewPost}>
            <Input type='textarea' label='Text Area' placeholder='textarea'/>
            <Input type='submit' value='Submit button' data-dismiss="modal" />
          </form>
        </div>
      </Modal>
    );
  
  }
});