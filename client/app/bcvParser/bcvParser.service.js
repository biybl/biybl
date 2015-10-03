'use strict';

angular.module('biyblApp')
  .service('bcvParser', function (dbpGrabber) {
    var bcv = new bcv_parser;

    bcv.set_options({
        "consecutive_combination_strategy": "combine",
        "ref_compaction_strategy": "b"
    });

    return {
      texts: {},       // Cache of texts from text grabber
      text_lang: "en", // Language of text cache

      passages: [], // Passages currently important to the user - an array of
                    // hashes, where each hash has 'ref' and 'text' members

      ref_str: "",  // Results of previous parse in parse_ref_and_fetch

      parse_ref_and_fetch: function(input, callback) {
        if (input.trim() == "") {
          return;
        }

        var new_ref_str = bcv.parse(input).osis();
        var self = this;

        // When the user has typed a new or removed an old reference...
        if (new_ref_str != self.ref_str) {
          self.ref_str = new_ref_str;

          var refs = self.ref_str.split(",");

          // Admin UI is always in English for now
          self.set_refs(refs, 'en');
        }
        if (callback) callback();
      },

      set_refs: function(refs, lang) {
        var self = this;
        var new_passages = [];

        if (this.text_lang != lang) {
          // Language change - clear cache
          this.text_lang = lang;
          self.texts = {};
        }

        for (var i = 0; i < refs.length; i++) {
          var ref = refs[i];
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

          if (passage['text'] == "") {
            self.fetch(passage['ref'], lang);
          }
        }
      },

      // Fetch an OSIS reference for a particular language and store
      fetch: function(ref, lang) {
        var self = this;

        // Dispatch request for text
        var promise = dbpGrabber.osiRangeToVerse(ref, lang);

        // Handle returned text
        promise.then(function success(response) {
          var text = self.format_verses(response);
          self.update_passage_text(ref, text);
        }, function error(e) {
          // Some error occurred
          self.update_passage_text(ref, "<span class='error'>Unable to " +
                                        "obtain Bible text.</span>");
        });
      },

      // Store fetched passage in text cache and passages array (if still
      // needed)
      update_passage_text: function(ref, text) {
        var self = this;

        self.texts[ref] = text;

        // Need to search for passage again because it may have moved
        // or disappeared when a callback arrives
        for (var i = 0; i < self.passages.length; i++) {
          if (self.passages[i]['ref'] == ref) {
            self.passages[i]['text'] = text;
          }
        }
      },

      // Take an array of DBP verse objects and turn into HTML for display
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
        if (verses.length == 0) {
          return "";
        }

        var output = "";

        var current_para = verses[0]['paragraph_number'];
        var current_chapter_id = "0";

        for (var i = 0; i < verses.length; i++) {
          var verse = verses[i];

          // Deal with paragraph increments
          // XXX paragraph_number doesn't, sadly, do what we want :-(
          if (verse['paragraph_number'] != current_para) {
            current_para = verse['paragraph_number'];

            output = output + "</p>\n<p>\n";
          }

          // Deal with chapter headings
          // XXX We don't support cross-chapter references properly yet
          // everywhere, and when we do, this will need to handle displaying
          // ranges better
          if (verse['chapter_id'] != current_chapter_id) {
            current_chapter_id = verse['chapter_id'];

            output = output + "<h2>" + verses[0]['book_name'] + " "
                            + verses[0]['chapter_id'] + ":"
                            + verses[0]['verse_id'];
            if (verses.length > 1) {
              output = output + "-" + verses[verses.length - 1]['verse_id'];
            }

            output = output + "</h2>\n\n";
            output = output + "<p>\n";
          }

          output = output + "<span class='verseno'>" + verse['verse_id'];
          output = output + "</span><span class='verse'>" + verse['verse_text'];
          output = output + "</span> \n"
        }

        output = output + "\n</p>";

        return output;
      },
    }
  });
