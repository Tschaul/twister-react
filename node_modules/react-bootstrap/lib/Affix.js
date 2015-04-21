"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = _interopRequire(require("react"));

var classNames = _interopRequire(require("classnames"));

var AffixMixin = _interopRequire(require("./AffixMixin"));

var domUtils = _interopRequire(require("./utils/domUtils"));

var Affix = React.createClass({
  displayName: "Affix",

  statics: {
    domUtils: domUtils
  },

  mixins: [AffixMixin],

  render: function render() {
    var holderStyle = { top: this.state.affixPositionTop };

    return React.createElement(
      "div",
      _extends({}, this.props, {
        className: classNames(this.props.className, this.state.affixClass),
        style: holderStyle }),
      this.props.children
    );
  }
});

module.exports = Affix;