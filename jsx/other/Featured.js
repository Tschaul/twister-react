
var React = require('react');

var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var MiniProfile = require("../common/MiniProfile.js");
var ProfileBoard = require("../common/ProfileBoard.js");
var SetIntervalMixin = require("../common/SetIntervalMixin.js");
var StreamMixin = require("../common/StreamMixin.js");
var SafeStateChangeMixin = require('../common/SafeStateChangeMixin.js');
var EventListenerMixin = require('../common/EventListenerMixin.js');
var AppSettingsMixin = require('../common/AppSettingsMixin.js');

var ReactBootstrap = require('react-bootstrap'),
    NavItem = ReactBootstrap.NavItem,
    Nav = ReactBootstrap.Nav,
    ListGroup = ReactBootstrap.ListGroup,
    ListGroupItem = ReactBootstrap.ListGroupItem,
    Panel = ReactBootstrap.Panel,
    Glyphicon = ReactBootstrap.Glyphicon,
    Button = ReactBootstrap.Button;

module.exports = Featured = React.createClass({ displayName: "Featured",

  mixins: [AppSettingsMixin, SetIntervalMixin, SafeStateChangeMixin],
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      usernames: ["twister", "mfreitas", "letstwist ", "newusers", "blockhash", "userstats", "calm_client", "theme_nin", "hn", "bbc_world", "intercept", "colossal", "rt_com", "lgbt", "soltempore", "fourtwenty", "torrentfreak_com", "schneier_sec", "smashingmag", "manliness", "meduza_en"]
    };
  },
  render: function () {

    return React.createElement(ProfileBoard, {
      header: React.createElement(ListGroupItem, null, "Featured"),

      loading: false,
      data: this.state.usernames });
  }

});