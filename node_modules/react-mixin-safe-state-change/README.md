react-mixin-safe-state-change
=============================

[![npm version](https://img.shields.io/npm/v/react-mixin-safe-state-change.svg)](http://www.npmjs.com/package/react-mixin-safe-state-change)
[![npm downloads](https://img.shields.io/npm/dm/react-mixin-safe-state-change.svg)](http://www.npmjs.com/package/react-mixin-safe-state-change)

React mixin which sets or replaces state only when it is safe to do so.

## Motivation
When processing the response of an asynchronous request, it might not be safe to call setState or replaceState, because the component might no longer be mounted.


## Install
`npm install react-mixin-safe-state-change`

## Usage
```javascript
var safeStateChangeMixin = require('react-mixin-safe-state-change');

React.createClass({
  mixins: [safeStateChangeMixin]

  someCallback: function(newValue) {
    if (!this.setStateSafe({value: newValue})) {
      console.warn('Could not set the state.');
    }

    // or

    if (!this.replaceStateSafe({value: newValue})) {
      console.warn('Could not replace the state.');
    }
  }
});
```
