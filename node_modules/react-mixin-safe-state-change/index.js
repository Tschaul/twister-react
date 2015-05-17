/**
 * react-mixin-safe-state-change
 * React mixin which sets or replaces state only when it is safe to do so.
 *
 * Copyright (c) 2015 Rick Beerendonk,
 * https://github.com/rickbeerendonk/react-mixin-safe-state-change
 *
 * The MIT License (MIT)
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

function isValidLifeCycleForReplaceState(instance) {
  // See function validateLifeCycleOnReplaceState(instance) in
  // ReactCompositeComponent.js
  var result = true;

  //result &= ReactCurrentOwner.current == null;
  result &= __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined' || __REACT_DEVTOOLS_GLOBAL_HOOK__._reactRuntime.CurrentOwner.current == null;

  result &= instance.isMounted();

  return result;
}

var safeStateChangeMixin = {
  /**
   * Calls setState with the provided parameters if it is safe to do so.
   *
   * Safe means it will try to do the same checks as setState does
   * without throwing an exception.
   * See function validateLifeCycleOnReplaceState(instance) in
   * ReactCompositeComponent.js
   *
   * @param {object} partialState Next partial state to be merged with state.
   * @param {?function} callback Called after state is updated.
   * @return {boolean} Whether or not setState is called.
   * @final
   * @protected
   */
  setStateSafe: function (partialState, callback) {
    if (isValidLifeCycleForReplaceState(this)) {
      this.setState(partialState, callback);
      return true;
    }

    return false;
  },

  /**
   * Calls replaceState with the provided parameters if it safe to do so.
   *
   * Safe means it will try to do the same checks as replaceState does
   * without throwing an exception.
   * See function validateLifeCycleOnReplaceState(instance) in
   * ReactCompositeComponent.js
   *
   * @param {object} completeState Next state.
   * @param {?function} callback Called after state is updated.
   * @return {boolean} Whether or not setState is called.
   * @final
   * @protected
   */
  replaceStateSafe: function(completeState, callback) {
    if (isValidLifeCycleForReplaceState(this)) {
      this.replaceState(completeState, callback);
      return true;
    }

    return false;
  }
};

module.exports = safeStateChangeMixin;
