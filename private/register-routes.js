sails.on("router:after", function() {
  var machines = require("../built-routes")();
  for (let route in machines) {
    var bare = machines[route];
    sails.router.bind(`${bare.verb} ${bare.url}`, {
      action: `${bare.action}`,
    });
  }
});
