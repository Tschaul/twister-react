
var ReactBootstrap = require('react-bootstrap')
  , OverlayMixin = ReactBootstrap.OverlayMixin
  , Button = ReactBootstrap.Button
  , ButtonGroup = ReactBootstrap.ButtonGroup
  , Glyphicon = ReactBootstrap.Glyphicon
  , Modal = ReactBootstrap.Modal
  , Input = ReactBootstrap.Input

var React = require('react');

var SafeStateChangeMixin = require('./SafeStateChangeMixin.js');
var SetIntervalMixin = require("./SetIntervalMixin.js");

module.exports = NewPostModalButton = React.createClass({displayName: "NewPostModalButton",
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
    
    //Twister.getAccount(this.props.activeAccount).post(msg,function(post){
    
      var event = new CustomEvent('newpostbyuser',{detail: msg});
      //alert("scrolled to bottom")
      window.dispatchEvent(event);
    
    //});
    
    e.target[0].value = "";
    
    
    this.handleToggle();
    
    //React.findDOMNode(this.refs.msg).value = '';
    return;
  },
  render: function() {
    return (
        React.createElement(Button, {onClick: this.handleToggle, className: "pull-right fullytight_all", bsStyle: "link"}, 
          React.createElement(Glyphicon, {glyph: "pencil"})
        )
    );
  }, 
  renderOverlay: function() {
  
    if (!this.state.isModalOpen) {
      return React.createElement("span", null);
    }
    
    return (
      React.createElement(Modal, {bsStyle: "primary", title: React.createElement(Glyphicon, {glyph: "pencil"}), onRequestHide: this.handleToggle}, 
        React.createElement("div", {className: "modal-body"}, 
          React.createElement("form", {onSubmit: this.handleNewPost}, 
            React.createElement(Input, {type: "textarea", label: "Text Area", placeholder: "textarea"}), 
            React.createElement(Input, {type: "submit", value: "Submit button", "data-dismiss": "modal"})
          )
        )
      )
    );
  
  }
});