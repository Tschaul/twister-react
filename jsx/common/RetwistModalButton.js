
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

module.exports = RetwistModalButton = React.createClass({
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
  handleRetwist: function (e) {
    e.preventDefault();
        
    Twister.getAccount(this.props.activeAccount).retwist(
      this.props.retwistUsername,
      this.props.retwistPostId,
      function(post){
    
        var event = new CustomEvent('newpostbyuser',{detail: post});
        //alert("scrolled to bottom")
        window.dispatchEvent(event);
    
    });
    
    
    
    this.handleToggle();
    
    return;
  },
  render: function() {
    return (
        <a onClick={this.handleToggle} className="link-button-gray">
          <Glyphicon glyph='retweet' />
          <Modal show={this.state.isModalOpen} bsStyle='primary' onHide={this.handleToggle}>
            <Modal.Header>
              <Glyphicon glyph='retweet'/>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={this.handleRetwist}>
                <strong>{this.props.retwistUserFullname} </strong>
                <PostContent content={this.props.originalMsg}/>
                <Input type='submit' value='Retwist' data-dismiss="modal" />
              </form>
            </Modal.Body>
          </Modal>
        </a>
    );
  }
});