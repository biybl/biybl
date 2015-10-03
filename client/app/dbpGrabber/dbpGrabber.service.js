'use strict';

angular.module('biyblApp')
  .service('dbpGrabber', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function

    langmap: {
      'ar': ['ARZVDVO2ET', 'ARZVDVN2ET', 'العربية'],
      'bg': ['BULBBSO2ET', 'BULBBSN2ET', 'Български'],
      'bn': ['BNGCLVO2ET', 'BNGCLVN2ET', 'বাংলা'],
      'cs': ['CZCK13O2ET', 'CZCK13N2ET', 'Čeština'],
      'da': ['DAND33O2ET', 'DAND33N2ET', 'Dansk'],
      'de': ['GERD71O2ET', 'GERD71N2ET', 'Deutsch'],
      'en': ['ENGESVO2ET', 'ENGESVN2ET', 'English'],
      'es': ['SPNWTCO1ET', 'SPNWTCN1ET', 'Español'],
      'fa': ['',           'PESTPVN2ET', 'پارسی'],
      'fr': ['FRNPDCO2ET', 'FRNPDCN2ET', 'Français'],
      'hi': ['',           'HNSWBTN2ET', 'हिन्दी'],
      'hr': ['HRVCBVO2ET', 'HRVCBVN2ET', 'Hrvatski'],
      'hu': ['HUNK90O2ET', 'HUNK90N2ET', 'Magyar'],
      'id': ['INZNTVO2ET', 'INZNTVN2ET', 'Bahasa Indonesia'],
      'it': ['ITAR27O2ET', 'ITAR27N2ET', 'Italiano'],
      'kr': ['',           '',           '한국의'],
      'ku': ['',           '',           'سۆرانی'],
      'mr': ['',           'MARWTCN1ET', 'मराठी'],
      'nl': ['NLDDSVO2ET', 'NLDDSVN2ET', 'Nederlands'],
      'no': ['',           '',           'Norsk'],
      'pa': ['',           'PANWTCN2ET', 'ਪੰਜਾਬੀ'],
      'pl': ['POLPBGO2ET', 'POLPBGN2ET', 'Polski'],
      'pt': ['PORBSPO2ET', 'PORBSPN2ET', 'Português'],
      'ro': ['',           'RONBSRN2ET', 'Română'],
      'ru': ['RUSS76O2ET', 'RUSS76N2ET', 'Русский'],
      'so': ['SOMSIMO2ET', 'SOMSIMN2ET', 'Somali'],
      'sq': ['ALSABVO2ET', 'ALSABVN2ET', 'Shqip'],
      'sr': ['',           '',           'Српски'],
      'ur': ['',           '',           'اردو'],
      'zh_simp': ['CHNUN1O2ET', 'CHNUN1N2ET', '汉语'],
      'zh_trad': ['CHNUNVO2ET', 'CHNUNVN2ET', '汉语'],
    },

    ot_books: ['Gen', 'Exod', 'Lev', 'Num', 'Deut', 'Josh', 'Judg', 'Ruth',
               '1Sam', '2Sam', '1Kgs', '2Kgs', '1Chr', '2Chr', 'Ezra', 'Neh', 'Esth',
               'Job', 'Ps', 'Prov', 'Eccl', 'Song', 'Isa', 'Jer', 'Lam', 'Ezek',
               'Dan', 'Hos', 'Joel', 'Amos', 'Obad', 'Jonah', 'Mic', 'Nah', 'Hab',
               'Zeph', 'Hag', 'Zech', 'Mal'
    ],

    // given "Gen.1.1","Gen.1.3"
    // will return "&book_id=Gen&chapter_id=1&verse_start=1&verse_end=3"
    refToDBPParams: function(ref, ref2) {
      var parts = ref.split('.');
      var b = parts[0];
      var c = parts[1];
      var ret = "&book_id=" + b + "&chapter_id=" + c;
      if (parts.length == 3) {
        ret = ret + "&verse_start=" + parts[2];
        if (ref != ref2) {
          var parts2 = ref2.split('.');
          if ((parts[0] != parts2[0]) || (parts[1] != parts2[1]))
            throw('Cross-chapter references are not supported by the api');
          ret = ret + "&verse_end=" + parts2[2];
        }
      } else if (parts.length == 2) {  // entire chapter
        // no change
      } else
        throw(['Unusual osiRef', ref]);
      return ret;
    },

    // given a language and a reference (used only for the book),
    // returns the DAM ID (digitalbibleplatform's translation identifier)
    getDam: function(lang, ref) {
      var damIndex = 1;
      if (ref.split('.')[0] in ot_books)
        damIndex = 0;
      if (!(lang in langmap)) {
        // Unknown language; fall back to English.
        // TODO fall back to a customizable language
        lang = "en";
      }
      var dam = langmap[lang][damIndex];
      // Some languages haven't an OT; in that case fall back to English
      // TODO fall back to a customizable language
      if (!dam)
        dam = langmap['en'][damIndex];
      return dam;
    },

    // turns "Gen.1.1" and "Gen.1.5" into array of ref+verse hashes
    osiToVerse: function(range, lang, first, last) {
      var url = "http://dbt.io/text/verse?v=2&key=f241660c7e9b26ddf60d73b1d9fe5856";
      url = url + "&markup=osis";
      url = url + "&dam_id=" + getDam(lang, first);
      url = url + refToDBPParams(first, last);

      var self = this;
      self.ref = range;
      var promise = $http.get(url);
      promise.then(function(response) {
        console.log(response.data);
        self.text = response.data;
      }).catch(function(e) {
        throw e;
      });
    },

    return {
      // range: either "Gen.1.1-Gen.1.3" or "Gen.1.1"
      // lang: something like "en" or "fr"
      osiRangeToVerse: function(range, lang) {
        var pairs = range.split('-');
        if (pairs.length == 2)
          osiToVerse(range, lang, pairs[0], pairs[1]);
        else
          osiToVerse(range, lang, pairs[0], pairs[0]);
      },
    }
  });
