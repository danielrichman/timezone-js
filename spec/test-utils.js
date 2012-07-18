(function () {

  var root = this;
  var fs = null;

  var TestUtils = {};
  if (typeof exports !== 'undefined') {
    TestUtils = exports;
    fs = require('fs');
  } else {
    TestUtils = root.TestUtils = {};
  }

  var init = function (timezoneJS, options) {
    var opts = {
      async: false,
      loadingScheme: timezoneJS.timezone.loadingSchemes.LAZY_LOAD
    };
    // So that loadingScheme may be specified before timezoneJS is loaded.
    if (options && options._loadingScheme) {
      options.loadingScheme = timezoneJS.timezone.loadingSchemes[options._loadingScheme];
      delete options._loadingScheme;
    }
    for (var k in (options || {})) {
      opts[k] = options[k];
    }

    //Reset everything
    timezoneJS.timezone.zones = {};
    timezoneJS.timezone.rules = {};
    timezoneJS.timezone.loadedZones = {};

    //Set up again
    timezoneJS.timezone.zoneFileBasePath = 'lib/tz';
    if (fs !== null) {
      timezoneJS.timezone.transport = function (opts) {
        // No success handler, what's the point?
        if (opts.async) {
          if (typeof opts.success !== 'function') return;
          opts.error = opts.error || console.error;
          return fs.readFile(opts.url, 'utf8', function (err, data) {
            return err ? opts.error(err) : opts.success(data);
          });
        }
        return fs.readFileSync(opts.url, 'utf8');
      };
    }
    timezoneJS.timezone.loadingScheme = opts.loadingScheme;
    timezoneJS.timezone.init(opts);
    return timezoneJS;
  };

  TestUtils.getTimezoneJS = function (options) {
    var date = null;
    if (typeof exports !== 'undefined') {
      date = require('../src/date');
    } else {
      date = root.timezoneJS;
    }
    return init(date, options);
  }

  TestUtils.dateToISOString = function (date) {
    var pad = function (number, length) {
      var s = "" + number;
      while (s.length < length)
        s = "0" + s;
      return s;
    }

    // When running the tests on old versions of IE, need to provide toISOString
    // since the native Date object doesn't have it.
    // Don't edit Date.prototype, because we don't want timezoneJS.Date to be able
    // to use this method which is only available in tests.
    if (typeof date.toISOString === "function") {
      return date.toISOString();
    } else {
      return date.getUTCFullYear() + "-" +
             pad(date.getUTCMonth() + 1, 2) + "-" +
             pad(date.getUTCDate(), 2) + "T" +
             pad(date.getUTCHours(), 2) + ":" +
             pad(date.getUTCMinutes(), 2) + ":" +
             pad(date.getUTCSeconds(), 2) + "." +
             pad(date.getUTCMilliseconds(), 3) + "Z";
    }
  }

  TestUtils.dateToJSON = function (date) {
    // same deal as DateToISOString
    if (typeof date.toJSON === "function") {
      return date.toJSON();
    } else {
      return TestUtils.dateToISOString(date);
    }
  }
}).call(this);
