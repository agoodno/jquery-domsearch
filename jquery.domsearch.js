$(function($) {
  function guessUnit(tagName) {
    switch(tagName) {
      case 'TBODY':
      case 'TABLE':
        return 'tr';
      case 'OL':
      case 'UL':
        return 'li';
      case 'DIV':
        return 'div';
    }
    return undefined;
  }

  function search(query, searchIn, options) {
	//console.log('searchIn='+searchIn.name);
    $($.grep($(searchIn).find(options.unit), function(row) {
      var text;
      switch(options.criteria.constructor) {
        case Array:
          text = $.map(
            options.criteria,
            function(crit) { return $(row).find(crit).text(); }
          ).join(' ');
          break;
        case String:
          text = $(row).find(options.criteria).text();
          break;
        default:
          text = $(row).text();
          break;
      }
      
      $(row).show();
      
      //console.log('text='+text);
      //console.log('query='+query);
      var matches = text.indexOf(query) == -1;
      //console.log('matches='+matches);
      return matches;
    })).appendTo(searchIn)
       .hide();

  }

  function init(element, searchIn, options) {
    var target = $(searchIn),
      defaults = { unit: undefined, criteria: false, minimumScore: 0.5 },
      opts = $.extend(defaults, options);
    opts.unit = opts.unit || guessUnit(target[0].tagName);

    var originalOrder = target.find(opts.unit);

    $(element).keydown(function(event) {
      if (event.keyCode == 9) return true; // TAB
      var field = $(this);
      setTimeout(
        function() {
          //should be set to progress by client, doesn't work here
          //$("*").css("cursor", "progress");
          if (field.val() == '') {
            originalOrder.show().appendTo(target);
          } else {
        	//console.log("searching...field=" + field.val());
            search(field.val(), target[0], opts);
          }
          if (typeof opts.onkeydown == 'function') opts.onkeydown(field);
          $("*").css("cursor", "auto");
        },
      2000);
      return true;
    });
  }

  $.fn.sort       = function() { return this.pushStack([].sort.apply(this, arguments), []); };
  $.domsearch     = function(element, searchIn, options) { init(element, searchIn, options); };
  $.fn.domsearch  = function(query, options) {
    if (!$(this).data('domsearch.enabled')) {
      $(this).data('domsearch.enabled', true);
      return this.each(function() { new $.domsearch(this, query, options); });
    }
  };
});