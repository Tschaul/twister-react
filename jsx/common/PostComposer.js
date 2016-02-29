var React = require('react');
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


module.exports = PostComposer = React.createClass({
  mixins:[SafeStateChangeMixin],
  getInitialState: function(){
    var defaultValue = ''

    return {
      maxLength: 140,
      totalLength: defaultValue.length,
      text: defaultValue
    }

  },

  render: function(){

    var isValid = (this.state.maxLength >= this.state.totalLength)
      && (this.state.totalLength > 0)

    return (
      <div className="form-group">
        <textarea
          className="form-control"  
          placeholder = "write something..."
          onChange={this.handleChange}
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
  
  handleChange: function(e) {
    
    var newText = e.target.value;
    
    this.setState({
      totalLength: newText.length,
      text: newText
    });

  },

});