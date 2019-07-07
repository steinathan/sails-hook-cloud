/**
 * sails hook cloud
 *
 * @description :: A cloud hook definition.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */
let builtRoutes = require('./built-routes');
require('./private/register-routes');

module.exports = function defineCloudHook(sails) {
  return {
    /**
     * Runs when this Sails app loads/lifts.
     */
    async initialize() {
      sails.log.info('Initializing Cloud hook (`Cloud`)');
      // check if `config hook` is set
      if (_.isUndefined(sails.config.cloud)) {
        sails.log.error('Could not find `hooks config` for proxy request');
      }
    },
    routes: {
      after: {
        /**
         * @description GUI to see the built routes
         */
        'GET /__cloud': async (req, res, next) => {
          // There should be a way of doing this thing automatically...
          // ... without going to `node_modules` :(
          return await res.view(
            '../node_modules/sails-hook-cloud/views/prapp',
            {
              actions: await builtRoutes(),
              layout: false
            }
          );
        },
        /**
         * @description Exposes the actions to the client agent
         */
        'PATCH /__cloud/actions': async function(req, res, next) {
          return res.json(builtRoutes());
        }
      }
    }
  };
};
