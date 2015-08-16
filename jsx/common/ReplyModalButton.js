
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
var PostContent = require("../common/PostContent.js");

module.exports = ReplyModalButton = React.createClass({
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
  handleReply: function (e) {
    e.preventDefault();
    //console.log(e)
    var msg = JSON.parse(JSON.stringify(e.target[0].value));
    if (!msg) {
      console.log("empty post was passed as new post")
      return;
    }
        
    Twister.getAccount(this.props.activeAccount).reply(
      this.props.replyUsername,
      this.props.replyPostId,
      msg,
      function(post){
    
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
        <a onClick={this.handleToggle} className="link-button-gray"><Glyphicon glyph='arrow-left' /></a>
    );
  }, 
  renderOverlay: function() {
  
    if (!this.state.isModalOpen) {
      return <span/>;
    }
    
    return (
      <Modal bsStyle='primary' title={
          <Glyphicon glyph='arrow-left'/>
        } onRequestHide={this.handleToggle}>
        <div className='modal-body'>
          <form onSubmit={this.handleReply}>
              <strong>{this.props.replyUserFullname}</strong>&nbsp;
              <PostContent content={this.props.originalMsg}/>
            <Input type='textarea' label='' placeholder='textarea'/>
            <Input type='submit' value='Reply' data-dismiss="modal" />
          </form>
        </div>
      </Modal>
    );
  
  }
});