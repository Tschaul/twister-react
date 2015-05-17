function isValidLifeCycleForReplaceState(instance) {
  // See function validateLifeCycleOnReplaceState(instance) in
  // ReactCompositeComponent.js
  var result = true;

  //result &= ReactCurrentOwner.current == null;
  //result &= __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined' || __REACT_DEVTOOLS_GLOBAL_HOOK__._reactRuntime.CurrentOwner.current == null;

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