'use strict';

angular.module('biyblApp')
  .service('bcvParser', function (dbpGrabber) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var bcv = new bcv_parser;

    bcv.set_options({
        "consecutive_combination_strategy": "combine",
        "ref_compaction_strategy": "b"
    });

    return {
      ref_str: "",  // Results of previous parse
      texts: {},    // Cache of texts from text grabber
      passages: [], // Return value - array of hashes, where hash has 'ref'
                    // and 'text' members

      parse_ref_and_fetch: function(input, callback) {
        var new_ref_str = bcv.parse(input).osis();
        var self = this;

        // When the user has typed a new or removed an old reference...
        if (new_ref_str != self.ref_str) {
          self.ref_str = new_ref_str;

          // Construct an array of passages and texts
          var refs = self.ref_str.split(",");
          var new_passages = [];

          for (var i = 0; i < refs.length; i++) {
            ref = refs[i];
            new_passages[i] = {
              'ref': ref,
              'text': self.texts[ref] || ""
            };
          };

          // Swap in the newly-constructed passages array
          self.passages = new_passages;

          // Dispatch async request for any missing Bible texts
          for (var i = 0; i < self.passages.length; i++) {
            if (self.passages[i]['text'] == "") {
              var ref = self.passages[i]['ref'];
              // Dispatch request for text (always in English for now)
              var promise = dbpGrabber.osiRangeToVerse(ref, 'en');

              // Handle returned text
              promise.then(function(response) {
                for (var j = 0; j < self.passages.length; j++) {
                  if (self.passages[j]['ref'] == ref) {
                    // Update the output value
                    self.passages[j] = response;

                    // Store the returned text for later
                    self.texts[ref] = response['text'];
                  }
                }
              }).catch(function(e) {
                // Some error occurred
                self.passages[j]['ref'] = "Unable to obtain Bible text";
              })
            }
          }
          if (callback) callback();
        } else {
          if (callback) callback();
        }
      },
    }
  });
