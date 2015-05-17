"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _react = require("react");

var React = _interopRequire(_react);

var cloneElement = _react.cloneElement;

var OverlayMixin = _interopRequire(require("./OverlayMixin"));

var createChainedFunction = _interopRequire(require("./utils/createChainedFunction"));

var ModalTrigger = React.createClass({
  displayName: "ModalTrigger",

  mixins: [OverlayMixin],

  propTypes: {
    modal: React.PropTypes.node.isRequired
  },

  getInitialState: function getInitialState() {
    return {
      isOverlayShown: false
    };
  },

  show: function show() {
    this.setState({
      isOverlayShown: true
    });
  },

  hide: function hide() {
    this.setState({
      isOverlayShown: false
    });
  },

  toggle: function toggle() {
    this.setState({
      isOverlayShown: !this.state.isOverlayShown
    });
  },

  renderOverlay: function renderOverlay() {
    if (!this.state.isOverlayShown) {
      return React.createElement("span", null);
    }

    return cloneElement(this.props.modal, {
      onRequestHide: this.hide
    });
  },

  render: function render() {
    var child = React.Children.only(this.props.children);
    return cloneElement(child, {
      onClick: createChainedFunction(child.props.onClick, this.toggle)
    });
  }
});

module.exports = ModalTrigger;