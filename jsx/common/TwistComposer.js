var React = require('react');
var ContentEditable = require('../common/ContentEditable.js');

module.exports = TwistComposer = React.createClass({ displayName: "TwistComposer",

  getInitialState: function () {
    return {
      html: 'default text',
      placeholder: true,
      editing: true
    };
  },

  render: function () {
    return React.createElement("div", null, React.createElement(ContentEditable, {
      tagName: "textarea",
      onChange: this.onChange,
      html: this.state.html,
      preventStyling: true,
      noLinebreaks: true,
      placeholder: this.state.placeholder,
      placeholderText: "Your Name",
      editing: this.state.editing }), React.createElement("button", { onClick: this.enableEditing }, "Enable Editing"));
  },

  onChange: function (textContent, setPlaceholder) {
    if (setPlaceholder) {
      this.setState({
        placeholder: true,
        html: ''
      });
    } else {
      this.setState({
        placeholder: false,
        html: textContent
      });
    }
  },

  enableEditing: function () {
    // set your contenteditable field into editing mode.
    this.setState({ editing: true });
  }

});