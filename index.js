  /**
 * qs hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */
var builtRoutes = require("./built-routes"),
  { resolve } = require("path"),
  routes_ = require("./private/register-routes");
module.exports = function defineCloudHook(sails) {
  return {
    // dc5a81205d4e4a069729323c7a5dec59
    /**
     * Runs when this Sails app loads/lifts.
     */
    async initialize() {
      sails.log.warn("cloud", sails.config.cloud);
      sails.log.info("Initializing Cloud hook (`Cloud`)");
      sails.log.warn(
        "[cloud] This hook overides the default `views` folder of your app.."
      );
    },
    defaults(req, res) {
      sails.config.paths.views = resolve(__dirname, "views");
      sails.config.views.layout = resolve(__dirname, "views/layout");
    },
    routes: {
      // after: {
      //   "GET /log": async (req, res, next) => {
      //     sails.router.bind("GET /log", {
      //       action: "syncs/unsync-user",
      //     });
      //     return next();
      //   },
      // },
      after: {
        "GET /__cloud": async (req, res, next) => {
          return res.render("prapp", {
            actions: await builtRoutes(),
          });
        },
        "PATCH /__cloud/actions": async function(req, res, next) {
          return res.json(builtRoutes());
        },
      },
    },
  };
};
