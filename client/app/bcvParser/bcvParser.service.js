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
            var passage = self.passages[i];

            if (1) { // (passage['text'] == "") {
              var ref = passage['ref'];
              // Dispatch request for text (always in English for now)
              var promise = dbpGrabber.osiRangeToVerse(ref, 'en');

              // Handle returned text
              promise.then(function success(response) {
                // Need to search for passage again because it may have moved
                // or disappeared when the callback arrives
                for (var j = 0; j < self.passages.length; j++) {
                  if (self.passages[j]['ref'] == ref) {
                    var text = self.format_verses(response);
                    // Update the output value
                    response['text'] = text;
                    self.passages[j] = {
                      'ref': ref,
                      'text': text,
                    };

                    // Store the returned text for later
                    self.texts[ref] = text;
                  }
                }
              }, function error(e) {
                // Some error occurred
                passage['text'] = "Unable to obtain Bible text";
              });
            }
          }
          if (callback) callback();
        } else {
          if (callback) callback();
        }
      },

      format_verses: function(verses) {
        // Ideally, all this would use templates...
        //
        // 'verses' is an array of verse objects from DBP API
        //
        // Verse object members:
        //  book_name: localized book name (e.g. "Apocalypse")
        //  book_id: OSIS book ID (e.g. "Rev")
        //  chapter_id: number of chapter (e.g. "1")
        //  chapter_title: non-localized chapter name (e.g. "Chapter 1")
        //  verse_id: number of verse (e.g. "2")
        //  verse_text: Text of the verse
        //  paragraph_number: Number of paragraph; add para break when increments
        var output = "";
        output = output + "<h2>" + verses[0]['book_name'] + " "
                        + verses[0]['chapter_id'] + "</h2>\n\n";
        output = output + "<p>\n";

        var current_para = verses[0]['paragraph_number'];
        for (var i = 0; i < verses.length; i++) {
          var verse = verses[i];

          // Deal with paragraph increments
          if (verse['paragraph_number'] != current_para) {
            output = output + "</p>\n<p>\n";
            current_para = verse['paragraph_number'];
          }

          // Need to deal with chapter increments here when we support them

          output = output + "<span class='verseno'>" + verse['verse_id'];
          output = output + "</span><span class='verse'>" + verse['verse_text'];
          output = output + "</span>\n"
        }

        output = output + "\n</p>";

        return output;
      },
    }
  });
