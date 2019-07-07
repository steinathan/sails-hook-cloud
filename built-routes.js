module.exports = function() {
  var guess = require("./private/guess-verb");
  var actions = sails._actions;
  var endpointsByMethodName = {};

  // loop through the actions
  for (let action in actions) {
    var bareActionName = _.last(action.split(/\//));
    var methodName = _.camelCase(bareActionName);
    var expandedAddress = {};
    try {
      expandedAddress = sails.getRouteFor(action);
    } catch (e) {
      /** do noting */
    }
    if (bareActionName.match(/^view-/)) {
      continue;
    }
    var requestable = sails.getActions()[action];
    if (!requestable) {
      sails.log.warn("[cloud] Skipping unrecognized action: `" + action + "`");
      continue;
    }

    var def = requestable.toJSON && requestable.toJSON();

    // retouch the definition name to handle conflicts with file names
    methodName = !_.isUndefined(def)
      ? _.camelCase(def.friendlyName)
      : methodName;
    // attempt a verb guess
    endpointsByMethodName[methodName] = {
      verb: guess(action).httpMethodGuess,
      action: action,
      url: !_.isUndefined(sails.config.cloud && sails.config.cloud.proxy)
        ? sails.config.cloud.proxy + action
        : guess(action).pathPrefixGuess + action
    };
    if (def && def.fn && def.inputs) {
      endpointsByMethodName[methodName].args = _.keys(def.inputs);
      endpointsByMethodName[methodName].description = def.description;
    } // </fi>
    // remove all builtins that dont have argins
    if (_.isUndefined(endpointsByMethodName[methodName].args)) {
      delete endpointsByMethodName[methodName];
      continue;
    }
  }
  return endpointsByMethodName;
};
