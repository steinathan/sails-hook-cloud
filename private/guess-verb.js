module.exports = function(action) {
  var stem = _.last(action.split(/\//));
  // Make some guesses about how to build an appropriate route for this action:
  var httpMethodGuess;
  if (
    stem.match(
      /^(find|search|count|check|determine|validate|fetch|navigate|get)/i
    )
  ) {
    httpMethodGuess = "GET";
    pathPrefixGuess = "/api/v1/";
  } else if (
    stem.match(/^(subscribe|listen)/i) ||
    stem.match(/and-(subscribe|listen)$/i)
  ) {
    httpMethodGuess = "GET";
    pathPrefixGuess = "/api/v1/";
    isProbablyOptimizedForSocketRequests = true;
  } else if (stem.match(/^(download|stream)/i)) {
    httpMethodGuess = "GET";
    pathPrefixGuess = "";
  } else if (stem.match(/^(view|show)/i)) {
    httpMethodGuess = "GET";
    pathPrefixGuess = "";
  } else if (
    stem.match(/^redirect/i) ||
    stem.match(/or-redirect$/i) ||
    stem.match(/and-redirect$/i)
  ) {
    httpMethodGuess = "GET";
    pathPrefixGuess = "";
  } else if (stem.match(/^(destroy|remove|archive|detach|unlink|delete)/i)) {
    httpMethodGuess = "DELETE";
    pathPrefixGuess = "/api/v1/";
  } else if (stem.match(/^(update|modify|edit|adjust|tweak|patch)/i)) {
    httpMethodGuess = "PATCH";
    pathPrefixGuess = "/api/v1/";
  } else {
    httpMethodGuess = "POST";
    pathPrefixGuess = "/api/v1/";
  }

  return { httpMethodGuess, pathPrefixGuess };
};
