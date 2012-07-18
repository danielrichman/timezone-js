(function () {
  var TestUtils;
  if (typeof exports !== "undefined") {
    TestUtils = require('./test-utils');
  } else {
    TestUtils = this.TestUtils;
  }
  var timezoneJS = null;

  describe('timezoneJS.Date', function () {
    beforeEach(function () {
      timezoneJS = TestUtils.getTimezoneJS();
    });

    it('should have correct format when initialized', function () {
      var date = new timezoneJS.Date();
      expect(date.toString()).toMatch(/[\d]{4}(-[\d]{2}){2} ([\d]{2}:){2}[\d]{2}/);
    });
  
    it('should format string correctly in toISOString', function () {
      var date = new timezoneJS.Date();
      expect(date.toISOString()).toMatch(/[\d]{4}(-[\d]{2}){2}T([\d]{2}:){2}[\d]{2}.[\d]{3}/);
    });
  
    it('should get date correctly from UTC (2011-10-28T12:44:22.172000000)', function () {
      var date = new timezoneJS.Date(2011,9,28,12,44,22,172,'Etc/UTC');
      expect(date.getTime()).toEqual(1319805862172);
      expect(date.toString()).toEqual('2011-10-28 12:44:22');
      expect(date.toString('yyyy-MM-dd')).toEqual('2011-10-28');
    });
  
    it('should format 2011-10-28T12:44:22.172 UTC to different formats correctly', function () {
      var date = new timezoneJS.Date(2011,9,28,12,44,22,172,'Etc/UTC');
      expect(date.toString('MMM dd yyyy')).toEqual('Oct 28 2011');
      expect(date.toString('MMM dd yyyy HH:mm:ss k')).toEqual('Oct 28 2011 12:44:22 PM');
      expect(date.toString('MMM dd yyyy HH:mm:ss k Z')).toEqual('Oct 28 2011 12:44:22 PM UTC');
    });
  
    it('should format 2011-10-28T12:44:22.172 UTC to different formats and tz correctly', function () {
      var date = new timezoneJS.Date(2011,9,28,12,44,22,172,'Etc/UTC');
      expect(date.toString('MMM dd yyyy', 'America/New_York')).toEqual('Oct 28 2011');
      expect(date.toString('MMM dd yyyy HH:mm:ss k Z', 'America/New_York')).toEqual('Oct 28 2011 08:44:22 AM EDT');
      expect(date.toString('MMM dd yyyy HH:mm:ss k Z', 'Asia/Shanghai')).toEqual('Oct 28 2011 08:44:22 PM CST');
    });
  
    it('should format 2011-02-28T12:44:22.172 UTC (before daylight) to different formats and tz correctly', function () {
      var date = new timezoneJS.Date(2011,1,28,12,44,22,172,'Etc/UTC');
      expect(date.toString('MMM dd yyyy HH:mm:ss k Z', 'America/New_York')).toEqual('Feb 28 2011 07:44:22 AM EST');
      expect(date.toString('MMM dd yyyy HH:mm:ss k Z', 'Indian/Cocos')).toEqual('Feb 28 2011 07:14:22 PM CCT');
    });
  
    it('should convert dates from UTC to a timezone correctly', function () {
       var date = new timezoneJS.Date(2011,1,28,12,44,22,172,'Etc/UTC');
       date.setTimezone('America/Los_Angeles');
       expect(date.toString('MMM dd yyyy HH:mm:ss k Z')).toEqual('Feb 28 2011 04:44:22 AM PST');
       expect(date.getTime()).toEqual(1298897062172);
       expect(date.getHours()).toEqual(4);
    });
  
    it('should convert dates from a timezone to UTC correctly', function () {
      var date = new timezoneJS.Date(2007, 9, 31, 10, 30, 22, 'America/Los_Angeles');
      date.setTimezone('Etc/GMT');
      expect(date.getTime()).toEqual(1193851822000);
      expect(date.toString('MMM dd yyyy HH:mm:ss k Z')).toEqual('Oct 31 2007 05:30:22 PM UTC');
      expect(date.getHours()).toEqual(17);
    });
  
    it('should convert dates from one timezone to another correctly', function () {
      var dtA = new timezoneJS.Date(2007, 9, 31, 10, 30, 'America/Los_Angeles');
  
      dtA.setTimezone('America/Chicago');
      expect(dtA.getTime()).toEqual(1193851800000);
      expect(dtA.toString()).toEqual('2007-10-31 12:30:00');
    });
  
    it('should convert dates from unix time properly', function () {
      var dtA = new timezoneJS.Date(1193851800000);
  
      dtA.setTimezone('America/Chicago');
      expect(dtA.getTime()).toEqual(1193851800000);
      expect(dtA.toString()).toEqual('2007-10-31 12:30:00');
    });
  
    it('should output toISOString correctly', function () {
      var dtA = new Date()
        , dt = new timezoneJS.Date();
  
      dt.setTime(dtA.getTime());
      expect(dt.getTime()).toEqual(dtA.getTime());
      expect(dt.toISOString()).toEqual(TestUtils.dateToISOString(dtA));
    });
  
    it('should output toGMTString correctly', function () {
      var dtA = new Date()
        , dt = new timezoneJS.Date();
  
      dt.setTime(dtA.getTime());
      expect(dt.getTime()).toEqual(dtA.getTime());
      // Some browsers (IE7-9 at least) use UTC instead of GMT...
      var s = dtA.toGMTString().replace('UTC', 'GMT');
      expect(dt.toGMTString()).toEqual(s);
    });
  
  
    it('should output toJSON correctly', function () {
      var dtA = new Date()
        , dt = new timezoneJS.Date();
  
      dt.setTime(dtA.getTime());
      expect(dt.getTime()).toEqual(dtA.getTime());
      expect(dt.toJSON()).toEqual(TestUtils.dateToJSON(dtA));
    });
  
    it('should take in millis as constructor', function () {
      var dtA = new Date(0)
        , dt = new timezoneJS.Date(dtA.getTime());
  
      expect(dt.getTime()).toEqual(dtA.getTime());
      expect(dt.toJSON()).toEqual(TestUtils.dateToJSON(dtA));
    });
  
    it('should take in Date object as constructor', function () {
      var dtA = new Date(0)
        , dt = new timezoneJS.Date(dtA);
  
      expect(dt.getTime()).toEqual(dtA.getTime());
      expect(dt.toJSON()).toEqual(TestUtils.dateToJSON(dtA));
    });
  
    it('should take in millis and tz as constructor', function () {
      var dtA = new Date(1342531863000)
        , dt = new timezoneJS.Date(dtA.getTime(), 'Asia/Bangkok');
  
      expect(dt.getTime()).toEqual(1342531863000);
      expect(dt.toString()).toEqual('2012-07-17 20:31:03');
    });
  
    it('should take in Date object as constructor', function () {
      var dtA = new Date(1342531863000)
        , dt = new timezoneJS.Date(dtA, 'Asia/Bangkok');
  
      expect(dt.getTime()).toEqual(1342531863000);
      expect(dt.toString()).toEqual('2012-07-17 20:31:03');
    });
  
    it('should take in String and Asia/Bangkok as constructor', function () {
      var dt = new timezoneJS.Date('Jan 1 2012 15:00:00', 'Asia/Bangkok');
  
      expect(dt.toString()).toEqual('2012-01-01 15:00:00');
      expect(dt.toString('yyyy-MM-ddTHH:mm:ss.SSS', 'America/New_York')).toEqual('2012-01-01T03:00:00.000');
      expect(dt.toString('yyyy-MM-ddTHH:mm:ss.SSS')).toEqual('2012-01-01T15:00:00.000');
    });
  
    it('should take in String and Etc/UTC as constructor', function () {
      var dt = new timezoneJS.Date('Jan 1 2012 15:00:00', 'Etc/UTC');
  
      expect(dt.toString('yyyy-MM-ddTHH:mm:ss.SSS', 'America/New_York')).toEqual('2012-01-01T10:00:00.000');
      expect(dt.toString('yyyy-MM-ddTHH:mm:ss.SSS')).toEqual('2012-01-01T15:00:00.000');
  
    });
  
    it('should take in String as constructor', function () {
      var dtA = new Date()
        , dt = new timezoneJS.Date(TestUtils.dateToJSON(dtA));
  
      expect(dt.toJSON()).toEqual(TestUtils.dateToJSON(dtA));
    });

    it('should parse various RFC3339/ISO8601 formats', function () {
      // this must work in all browsers: old IEs don't support this format natively
      var dtA = new timezoneJS.Date("2012-07-18T14:29:20+01:30")
        , dtB = new timezoneJS.Date("1970-12-21T23:59:49-07:00")
      // with bits missing: (it should assume Z)
        , dtC = new timezoneJS.Date("2012-01-01T15:00:00.000")
        , dtD = new timezoneJS.Date("2012-08-11T01:59:59");

      expect(dtA.getTime()).toEqual(1342616360000);
      expect(dtB.getTime()).toEqual(30697189000);
      expect(dtC.getUTCHours()).toEqual(15);
      expect(dtD.getUTCHours()).toEqual(1);
    });
  
    it('should be able to set hours', function () {
      var dtA = new Date(0)
        , dt = new timezoneJS.Date(0, 'Etc/UTC');
  
      dt.setHours(6);
      expect(dt.getHours()).toEqual(6);
    });
  
    it('should be able to set date without altering others', function () {
      var dt = new timezoneJS.Date(2012, 2, 2, 5, 0, 0, 0, 'America/Los_Angeles')
        , dt2 = new timezoneJS.Date(2011, 4, 15, 23, 0, 0, 0, 'Asia/Bangkok');
  
      var hours = dt.getHours();
      dt.setDate(1);
      expect(dt.getHours()).toEqual(hours);
  
      hours = dt2.getHours();
      dt2.setDate(2);
      expect(dt2.getHours()).toEqual(hours);
    });
  
    it('should be able to set UTC date without altering others', function () {
      var dt = new timezoneJS.Date(2012, 2, 2, 5, 0, 0, 0, 'America/Los_Angeles');
  
      var hours = dt.getUTCHours();
      dt.setUTCDate(1);
      expect(dt.getUTCHours()).toEqual(hours);
    });
  
  
    it('should adjust daylight saving correctly', function () {
      var dt1 = new timezoneJS.Date(2012, 2, 11, 3, 0, 0, 'America/Chicago');
      expect(dt1.getTimezoneAbbreviation()).toEqual('CDT');
      var dt2 = new timezoneJS.Date(2012, 2, 11, 1, 59, 59, 'America/Chicago');
  
      expect(dt2.getTimezoneAbbreviation()).toEqual('CST');
      expect(dt2.getTimezoneOffset()).toEqual(360);
    });
  
    it('should be able to clone itself', function () {
      var dt = new timezoneJS.Date(0, 'America/Chicago')
        , dtA = dt.clone();
  
      expect(dt.getTime()).toEqual(dtA.getTime());
      expect(dt.toString()).toEqual(dtA.toString());
      expect(dt.getTimezoneOffset()).toEqual(dtA.getTimezoneOffset());
      expect(dt.getTimezoneAbbreviation()).toEqual(dtA.getTimezoneAbbreviation());
    });
  
    it('should convert timezone quickly', function () {
      if (typeof console === "undefined")
        return;
  
      var start = new Date()
        , yearToMillis = 5 * 365 * 24 * 3600 * 1000
        , date;
      for (var i = 0; i < 5000; i++) {
        date = new timezoneJS.Date(start - Math.random() * yearToMillis, 'America/New_York');
        date.setTimezone('Europe/Minsk');
      }
      console.log('Took ' + ((new Date()) - start) + 'ms to convert 5000 dates');
    });
  
    it('should output 1955-10-30T00:00:00 America/New_York as EDT', function () {
      expect(new timezoneJS.Date(1955, 9, 30, 0, 'America/New_York').getTimezoneOffset()).toEqual(240);
    });
  
  });
}).call(this);
