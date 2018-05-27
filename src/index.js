function _matchPattern(pattern, value) {
  if (pattern === value) {
    return [];
  }

  if (pattern && value && !pattern.matchPattern && value.matchPattern) {
    return _matchPattern(value, pattern);
  }

  if (pattern === String) {
    return typeof value === "string" ? [] : null;
  }

  if (pattern === Number) {
    return typeof value === "number" ? [] : null;
  }

  if (pattern === Array) {
    return Array.isArray(value) ? [] : null;
  }

  if (Array.isArray(pattern) && Array.isArray(value)) {
    var i, m;
    var matches = [];
    var pLen = pattern.length;
    var vLen = value.length;

    if (pLen !== vLen) {
      return null;
    }

    for (i = 0; i < pLen; i++) {
      m = _matchPattern(pattern[i], value[i]);

      if (!m) {
        return null;
      }

      matches = matches.concat(m);
    }

    return matches;
  }

  if (pattern && pattern.matchPattern) {
    return pattern.matchPattern(value);
  }

  return null;
}

var wildcard = (exports.$ = {
  matchPattern: function(x) {
    return [x];
  }
});

exports._ = {
  matchPattern: function() {
    return [];
  }
};

function Enum() {
  this._id = {};
}

Enum.prototype = {
  matchPattern: function(x) {
    if (x._id === this._id) {
      return [];
    }

    return null;
  }
};

function _createMatcher(fn) {
  var len = fn.length;
  var args = [];

  while (len-- > 0) {
    args.push(wildcard);
  }

  return fn.apply(null, args);
}

function Template(fn, args) {
  this._fn = fn;
  this._args = args;

  if (!_matchPattern(_createMatcher(fn), args)) {
    var message = [
      "Type created with invaid arguments. Expected ",
      this._fn.toString(),
      "."
    ];

    throw new TypeError(message.join(""));
  }
}

Template.prototype = {
  matchPattern: function(x) {
    if (this._fn === x._fn) {
      return _matchPattern(this._args, x._args);
    }

    return null;
  }
};

exports.type = function(fn) {
  if (typeof fn === "undefined") {
    return new Enum();
  }

  if (typeof fn === "function") {
    return function() {
      return new Template(fn, [].slice.call(arguments));
    };
  }

  throw new TypeError("Type argument must be either a function or undefined");
};

exports.match = function(patterns) {
  var pLen = patterns.length;

  return function() {
    var pattern, fn, i, m;
    var args = [].slice.call(arguments);

    for (i = 0; i < pLen; i++) {
      pattern = patterns[i].slice();
      fn = pattern.pop();
      m = _matchPattern(pattern, args);

      if (m) {
        return fn.apply(null, m);
      }
    }

    throw new TypeError("None of the patterns matched the input");
  };
};
