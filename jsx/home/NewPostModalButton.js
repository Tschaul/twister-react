
var ReactBootstrap = require('react-bootstrap')
  , Button = ReactBootstrap.Button
  , ButtonGroup = ReactBootstrap.ButtonGroup
  , Glyphicon = ReactBootstrap.Glyphicon
  , Modal = ReactBootstrap.Modal
  , Input = ReactBootstrap.Input
  , ListGroupItem = ReactBootstrap.ListGroupItem

var React = require('react');

var SafeStateChangeMixin = require('../common/SafeStateChangeMixin.js');
var SetIntervalMixin = require("../common/SetIntervalMixin.js");
var PostComposer = require("../common/PostComposer.js");

module.exports = NewPostModalButton = React.createClass({
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
  handleNewPost: function (text) {
    console.log(text)
    var msg = text;
    if (!msg) {
      console.log("empty post was passed as new post")
      return;
    }
    
    Twister.getAccount(this.props.activeAccount).post(msg,function(post){
    
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
        <Button onClick={this.handleToggle} className="link-button-gray pull-right fullytight_all" bsStyle="link">
          <Glyphicon glyph='pencil' />
          <Modal show={this.state.isModalOpen} bsStyle='primary' onHide={this.handleToggle}>
            <Modal.Header>
              <Glyphicon glyph='pencil'/>
            </Modal.Header>
            <Modal.Body>
              <PostComposer onSubmit={this.handleNewPost} />
            </Modal.Body>
          </Modal>
        </Button>
    );
  }
});