'use strict';

angular.module('biyblApp')
  .service('dbpGrabber', function ($http, $q) {
    return {

      devkey: "f241660c7e9b26ddf60d73b1d9fe5856",

      langmap: {
        'ar': ['ARZVDVO2ET', 'ARZVDVN2ET', 'العربية'],
        'bg': ['BULBBSO2ET', 'BULBBSN2ET', 'Български'],
        'bn': ['BNGCLVO2ET', 'BNGCLVN2ET', 'বাংলা'],
        'cs': ['CZCK13O2ET', 'CZCK13N2ET', 'Čeština'],
        'da': ['DAND33O2ET', 'DAND33N2ET', 'Dansk'],
        'de': ['GERD71O2ET', 'GERD71N2ET', 'Deutsch'],
        'en': ['ENGESVO2ET', 'ENGESVN2ET', 'English'],
        'es': ['SPNWTCO1ET', 'SPNWTCN1ET', 'Español'],
//        'fa': ['',           'PESTPVN2ET', 'پارسی'],
        'fr': ['FRNPDCO2ET', 'FRNPDCN2ET', 'Français'],
//        'hi': ['',           'HNSWBTN2ET', 'हिन्दी'],
        'hr': ['HRVCBVO2ET', 'HRVCBVN2ET', 'Hrvatski'],
        'hu': ['HUNK90O2ET', 'HUNK90N2ET', 'Magyar'],
        'id': ['INZNTVO2ET', 'INZNTVN2ET', 'Bahasa Indonesia'],
        'it': ['ITAR27O2ET', 'ITAR27N2ET', 'Italiano'],
//        'kr': ['',           '',           '한국의'],
//        'ku': ['',           '',           'سۆرانی'],
//        'mr': ['',           'MARWTCN1ET', 'मराठी'],
        'nl': ['NLDDSVO2ET', 'NLDDSVN2ET', 'Nederlands'],
//        'no': ['',           '',           'Norsk'],
//        'pa': ['',           'PANWTCN2ET', 'ਪੰਜਾਬੀ'],
        'pl': ['POLPBGO2ET', 'POLPBGN2ET', 'Polski'],
        'pt': ['PORBSPO2ET', 'PORBSPN2ET', 'Português'],
//        'ro': ['',           'RONBSRN2ET', 'Română'],
        'ru': ['RUSS76O2ET', 'RUSS76N2ET', 'Русский'],
        'so': ['SOMSIMO2ET', 'SOMSIMN2ET', 'Somali'],
        'sq': ['ALSABVO2ET', 'ALSABVN2ET', 'Shqip'],
//        'sr': ['',           '',           'Српски'],
//        'ur': ['',           '',           'اردو'],
        'zh-Hans': ['CHNUN1O2ET', 'CHNUN1N2ET', '简化字 / 简体字'], // Simplified
        'zh-Hant': ['CHNUNVO2ET', 'CHNUNVN2ET', '正體字 / 繁體字'], // Traditional
      },

      ot_books: ['Gen', 'Exod', 'Lev', 'Num', 'Deut', 'Josh', 'Judg', 'Ruth',
                 '1Sam', '2Sam', '1Kgs', '2Kgs', '1Chr', '2Chr', 'Ezra', 'Neh', 'Esth',
                 'Job', 'Ps', 'Prov', 'Eccl', 'Song', 'Isa', 'Jer', 'Lam', 'Ezek',
                 'Dan', 'Hos', 'Joel', 'Amos', 'Obad', 'Jonah', 'Mic', 'Nah', 'Hab',
                 'Zeph', 'Hag', 'Zech', 'Mal'
      ],

      // given "Gen.1.1","Gen.1.3"
      // will return "&book_id=Gen&chapter_id=1&verse_start=1&verse_end=3"
      // Like the API, only supports single chapters at once
      refToDBPParams: function(start, end) {
        var startParts = start.split('.');
        var endParts   = end.split('.');

        if ((startParts[0] != endParts[0]) || (startParts[1] != endParts[1])) {
          throw('Cross-chapter references are not supported by the API');
        }

        var b = startParts[0];
        var c = startParts[1];
        var ret = "&book_id=" + b + "&chapter_id=" + c;
        if (endParts.length == 3) {
          ret = ret + "&verse_start=" + (startParts[2] || "1");
          ret = ret + "&verse_end=" + endParts[2];
        } else if (endParts.length == 2) {
          // entire chapter - OK
        } else {
          throw(['Unusual osistart', start]);
        }

        return ret;
      },

      // given a language and a reference (examined only to find out the book
      // and therefore the Testament), returns the DAM ID
      // (digitalbibleplatform's translation identifier)
      getDam: function(lang, ref) {
        // Default to New Testament
        var damIndex = 1;
        if (this.ot_books.indexOf(ref.split('.')[0]) != -1) {
          // Old Testament
          damIndex = 0;
        }

        if (!(lang in this.langmap)) {
          // Unknown language; fall back to English.
          // TODO fall back to a customizable language
          lang = "en";
        }

        var dam = this.langmap[lang][damIndex];

        // Some languages haven't an OT; in that case fall back to English
        // TODO fall back to a customizable language
        if (!dam) {
          dam = this.langmap['en'][damIndex];
        }

        return dam;
      },

      // Turns "Gen.1.1" and "Gen.1.5" into array of verse data from
      // digitalbibleplatform. Supports only ranges within a single chapter
      osiToVerse: function(lang, first, last) {
        var self = this;

        var promise = $q(function(resolve, reject) {
          // URL example:
          // http://dbt.io/text/verse?v=2&key=XXX&dam_id=FRNDBYN2ET
          //   &book_id=Rev&chapter_id=1&verse_start=1&verse_end=2&markup=osis
          var url = "http://dbt.io/text/verse?v=2";
          url = url + "&key=" + self.devkey;
          url = url + "&markup=osis";
          url = url + "&dam_id=" + self.getDam(lang, first);
          url = url + self.refToDBPParams(first, last);

// Angular's $http seems to be made of fail :-(
//
//          $http.get(url).then(function success(response) {
//            console.log(response.data);
//            resolve(response.data);
//          }, function error(response) {
//            reject(Error("It broke!"));
//          });

          var myRequest = new XMLHttpRequest();
          myRequest.addEventListener("load", function(response) {
            resolve(JSON.parse(myRequest.responseText));
          });

          myRequest.addEventListener("error", function(response) {
            reject(Error("It broke!"));
          });

          myRequest.open("GET", url);
          myRequest.send();
        });

        return promise;
      },

      // Fetch the verse objects for a single verse or range within an entire
      // book.
      //
      // range: either "Gen.1.1-Gen.2.3" or "Gen.1.1"
      // lang: something like "en" or "fr"
      osiRangeToVerse: function(range, lang) {
        var rangeParts = range.split('-');
        var start = rangeParts[0];
        var end   = rangeParts[1] || rangeParts[0];

        // The API does not support requests across multiple chapters, so we
        // may have to make more than one call
        var startParts = start.split('.');
        var endParts   = end.split('.');
        var book = startParts[0];
        var ch1  = parseInt(startParts[1]);
        var v1   = startParts[2] || "1";
        var ch2  = parseInt(endParts[1]);
        var v2   = endParts[2] || "999";
        var promises = [];

        // Do the first (and perhaps only) chapter
        // 999 is an invalid verse number, but the API does the right thing
        var endVerse = ((ch1 < ch2) ? '999' : v2);

        var endOfFirstChapter = [book, ch1, endVerse].join('.');
        promises.push(this.osiToVerse(lang, start, endOfFirstChapter));

        // Do any additional chapters
        if (ch1 < ch2) {
          ch1 = ch1 + 1;

          while (ch1 < ch2) {
            // Whole chapters (no verse number means entire chapter)
            var wholeChapter = [book, ch1].join('.');
            promises.push(this.osiToVerse(lang, wholeChapter, wholeChapter));
            ch1 = ch1 + 1;
          }

          var startOfLastChapter = [book, ch2, "1"].join('.');
          promises.push(this.osiToVerse(lang, startOfLastChapter, end));
        }

        var combinedPromise = $q.all(promises).then(function(results) {
          var ret = [];
          for (var i = 0; i < results.length; i++)
            ret = ret.concat(results[i]);
          return ret;
        });

        return combinedPromise;
      },

      copyrightString: function(lang) {
        var self = this;
        var promise = $q(function(resolve, reject) {
          // http://dbt.io/library/metadata?key=f241660c7e9b26ddf60d73b1d9fe5856&dam_id=GERD71O2ET&v=2
          var url = "http://dbt.io/library/metadata?v=2";
          url = url + "&key=" + self.devkey;
          url = url + "&dam_id=" + self.getDam(lang, "Rev.1.1");  // the NT exists more often than the OT

          var myRequest = new XMLHttpRequest();
          myRequest.addEventListener("load", function(response) {
            var metadata = JSON.parse(myRequest.responseText);
            var copyright = metadata[0]['mark'];
            if (!copyright) {
              // TODO If the mark field is empty, display the name of the organization
              // where organization_role is “holder.”
              // Meaning, loop through resp[0]['organization'] doing:
              // if (organization[i]['organization_role'] == 'holder')
              //   self.copyright = organization[i]['organization'];
            }

            // We don't use their fonts, so remove font copyright
            copyright = copyright.replace(/FONT.*$/, "");
            copyright = copyright.replace(/TEXT:/, "");

            resolve(copyright);
          });

          myRequest.addEventListener("error", function(response) {
            reject(Error("It broke!"));
          });

          myRequest.open("GET", url);
          myRequest.send();
        });

        return promise;
      }
    };
  });
