
var ReactBootstrap = require('react-bootstrap')
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
  handleReply: function (msg) {
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
        
    this.handleToggle();
    
    //React.findDOMNode(this.refs.msg).value = '';
    return;
  },
  render: function() {
    return (
        <a onClick={this.handleToggle} className="link-button-gray">
          <Glyphicon glyph='arrow-left' />
          <Modal bsStyle='primary' show={this.state.isModalOpen} onHide={this.handleToggle}>
            <Modal.Header>
              <Glyphicon glyph='arrow-left'/>
            </Modal.Header>
            <Modal.Body>
              <strong>{this.props.replyUserFullname}</strong>
              <PostContent content={this.props.originalMsg}/>
              <PostComposer onSubmit={this.handleReply} />
            </Modal.Body>
          </Modal>
        </a>
    );
  }
});