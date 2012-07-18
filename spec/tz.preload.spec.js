(function () {
  var TestUtils; 
  if (typeof exports !== "undefined") {
    TestUtils = require('./test-utils');
  } else {
    TestUtils = this.TestUtils;
  }

  describe('TimezoneJS', function () {
    it('should preload everything correctly', function () {
      var i = 0
        , sampleTz
        , timezoneJS = TestUtils.getTimezoneJS({
          _loadingScheme: "PRELOAD_ALL"
        });

      expect(timezoneJS.timezone.loadingScheme).toEqual(timezoneJS.timezone.loadingSchemes.PRELOAD_ALL);
      //Make sure more than 1 zone is loaded
      for (var k in timezoneJS.timezone.loadedZones) {
        i++;
      }
      expect(i).toEqual(timezoneJS.timezone.zoneFiles.length);
      i = 0;
      sampleTz = timezoneJS.timezone.getTzInfo(new Date(), 'Asia/Bangkok');
      expect(sampleTz).toBeDefined();
      expect(sampleTz.tzAbbr).toEqual('ICT');
    });
  });
}).call(this);
