var React = require('react');
var ContentEditable = require('react-wysiwyg');
var PostContentHelper = require('../common/PostContentHelper.js');
var SafeStateChangeMixin = require('../common/SafeStateChangeMixin.js');


var ReactBootstrap = require('react-bootstrap')
  , Button = ReactBootstrap.Button
  , DropdownButton = ReactBootstrap.DropdownButton
  , MenuItem = ReactBootstrap.MenuItem
  , ButtonGroup = ReactBootstrap.ButtonGroup
  , OverlayTrigger = ReactBootstrap.OverlayTrigger
  , Popover = ReactBootstrap.Popover
  , Glyphicon = ReactBootstrap.Glyphicon
  , Grid = ReactBootstrap.Grid
  , Col = ReactBootstrap.Col
  , Row = ReactBootstrap.Row

var escape = document.createElement('textarea')

function escapeHTML(html) {
  escape.textContent = html;
  return escape.innerHTML;
}

module.exports = PostComposer = React.createClass({
  mixins:[SafeStateChangeMixin],
  getInitialState: function(){
    var editing = false
    var defaultValue = ''

    return {
      html: defaultValue,
      editing: true,
      placeholder: true,
      maxLength: 140,
      totalLength: defaultValue.length,
      queryMention: false,
      text: defaultValue
    }

  },

  componentDidMount: function () {
    // Gives the window a callback to call before the next repaint.
    window.requestAnimationFrame(this.checkCursor)
  },

  checkCursor: function (timestamp) {
    var self = this
    var selection = window.getSelection()


    if (this.state.editing && selection.focusNode) {

      var node = selection
        .getRangeAt(0)
        .commonAncestorContainer
        .parentNode

      if (node.className === 'show-dropdown') {
        // you could use the node to determine its position,
        // and show the dropdown inline, too.
        this.setStateSafe({ queryMention : node.textContent })
      } else if (this.state.queryMention) {
        this.setStateSafe({ queryMention: false })
      }

    } else if (this.state.queryMention) {
      this.setStateSafe({ queryMention: false })
    }

    window.requestAnimationFrame(self.checkCursor)
  },

  render: function(){

    var isValid = (this.state.maxLength >= this.state.totalLength)
      && (this.state.totalLength > 0)

    return (
      <div>
        <div>{this.state.error}</div>
        <ContentEditable
          ref='editable'
          tagName='div'
          html={this.state.html}
          placeholder={this.state.placeholder}
          placeholderText='write'
          onKeyPress={this.onKeyPress}
          preventStyling
          noLinebreaks
          onChange={this.onChange}
          editing={this.state.editing}
          style={{"outline": "none"}}
        />
        <Row>
          <Col xs={9} md={9}>
          </Col>
          <Col xs={1} md={1}>
            <Button disabled id="content-length">
              {this.state.maxLength - this.state.totalLength}
            </Button>
          </Col>
          <Col xs={2} md={2}>
            <Button disabled={!isValid} onClick={this.handleSubmit}>
              Twist
            </Button>
          </Col>
        </Row>
      </div>
    );
        /*<div>
          Show autocomplete? {this.state.queryMention ? 'Yes ' + this.state.queryMention : 'No'}
        </div>*/
  },

  handleSubmit: function(){
    this.props.onSubmit(this.state.text);
  },
  
  autofocus: function () {
    if (this.state.editing) {
      this.refs.editable.autofocus()
    }
  },

  onChange: function(text, setPlaceholder) {
    // in order to render the updated html,
    // you need to pass it as a prop to contentEditable.
    // This gives you increased flexibility.
    if (setPlaceholder) {
      this.setState({
        placeholder: true,
        html: '',
        totalLength: 0,
        text: ''
      })
    } else {

      var copy = text.slice(0, this.state.maxLength)

      var parsedContent = PostContentHelper.parseContent(copy);
      
      //console.log(copy,parsedContent);
      
      var output = "";
      
      parsedContent.map(function(item,index){
        //console.log(item.raw)
        switch(item.type) {
          case "mention":
            output+=('<a class="text-muted" href="#/profile/"'+item.raw.substr(1)+'">'+item.raw+'</a>');
            break;
          case "hashtag":
            output+=('<a class="text-muted" href="#/hashtag/"'+item.raw.substr(1)+'">'+item.raw+'</a>');
            break;
          case "url":
            output+=('<a class="text-primary" href="'+item.raw+'" target="_blank">'+item.raw+'</a>');
            break;
          case "email":
            output+=('<span class="text-primary">'+item.raw+'</span>');
            break;
          default:
            output+=(item.raw);
        }
      });
            
      var rules = [
        {regex: /\[([^\[]+)\]\(([^\)]+)\)/g,
         replacement: '<span class="ghost">[</span><a>$1</a><span class="ghost">]($2)</span>'},        // hyperlink
        {regex: /(\s?)(\*)(.*?)(\*)(\s?)/g, 
         replacement: '$1<span class="ghost">*</span><b>$3</b><span class="ghost">*</span>$5'},                         // emphasis
        {regex: /(\s?)(\~)(.*?)(\~)(\s?)/g, 
         replacement: '$1<span class="ghost">~</span><i>$3</i><span class="ghost">~</span>$5'},                         // emphasis
        {regex: /(\s?)(\-)(.*?)(\-)(\s?)/g, 
         replacement: '$1<span class="ghost">-</span><del>$3</del><span class="ghost">-</span>$5'},                         // emphasis
        {regex: /(\s?)(\_)(.*?)(\_)(\s?)/g, 
         replacement: '$1<span class="ghost">_</span><u>$3</u><span class="ghost">_</span>$5'},                         // emphasis
      ]
      
      rules.forEach(function (rule) {
        output = output.replace(rule.regex, rule.replacement);
      });
      
      console.log(text.slice(0, this.state.maxLength),output)
      
      // text overflow
      if (text.length > this.state.maxLength) {
        var overflow = '<span style="text-decoration: line-through;">' +
          text.slice(this.state.maxLength) +
          '</span>'
        output = output + overflow
      }

      this.setState({
        placeholder: false,
        html: output,
        totalLength: text.length,
        text: copy
      })
    }

  },

  enableEditing: function(){
    var editing = !this.state.editing
    // set your contenteditable field into editing mode.
    this.setState({ editing: editing });
    if (editing) {
      this.refs.editable.autofocus()
      this.refs.editable.setCursorToEnd()
    }
  }

});