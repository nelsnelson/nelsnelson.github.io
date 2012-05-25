
var param0 = gup('c');
var param1 = gup('start');
var param2 = gup('end');
var param3 = gup('inverted');

var start = param1 ? parseInt(param1) : param0 ? param0 : 0;
var end   = param2 ? parseInt(param2) : param0 ? parseInt(param0) + 1 : 250;
var inverted = param3;

var reload = function(event) {
  var i = $('input#start').val();
  var j = $('input#end').val();
  var href = 'chars.html?start=' + i + '&end=' + j;
  document.location.href = href;
  return false;
};

var goprev = function(e) {
  var clicked = e == undefined ? null : $(e.target ? e.target : e);
  var n = clicked ? parseInt(clicked.attr('id')) : 250;
  var j = parseInt($('input#start').val());
  var i = (j - n);
  i = (i < 0 ? 0 : i);
  var href = 'chars.html?start=' + i + '&end=' + j;
  document.location.href = href;
  return false;
};

var gonext = function(e) {
  var clicked = e == undefined ? null : $(e.target ? e.target : e);
  var n = clicked ? parseInt(clicked.attr('id')) : 250;
  var i = parseInt($('input#end').val());
  var j = (i + n);
  var href = 'chars.html?start=' + i + '&end=' + j;
  document.location.href = href;
  return false;
};

var invert = function(e) {
  $('div#canvas').toggle();
  $('html').toggleClass('inverted');
  createCookie('inverted', $('html').hasClass('inverted'));
  return false;
};

var loading;
var progress;

const PATTERNS = {
  // 'small': [ '⠟', '⠯', '⠷', '⠾', '⠽', '⠻' ],
  // 'large': [ '⡿', '⣟', '⣯', '⣷', '⣾', '⣽', '⣻', '⢿' ],
  'large': [ "&#10367", "&#10463", "&#10479", "&#10487", "&#10494", "&#10493", "&#10491", "&#10431" ]
};

var progress_indicator_index = 0;
var list_html = null;
var begin_loading = function() {
    var n = end - start;
    if (n > 100) {
        $('div#background').show();
        if (n > 1000) {
            var message = '<br />(Loading ' + n + ' characters at once will take a long time)';
            $('div#status').append(message);
        }
        $('div#status').show();
        $('div#status').css('display', 'inline-block !important');
        indicate_progress();
    }
    list_html = '';
    var el = replaceHtml('list', '');
    loading = setTimeout(load, 0);
};

var character = start;
var load = function() {
    if (character >= end) {
        setTimeout(finish_loading, 0);
        return;
    }

    char = String.fromCharCode(character);

    var ul = document.getElementById('list');

    var list = ul.innerHTML;

    var item = '<li>';
    var href = 'chars.html?start=' + character + '&end=' + (character+1) + '&c=' + character;
    var a = '<a id=' + character + ' class="char" href="' + href + '">' + char + '</a>';
    item += a;
    item += '</li>';
    list += item;

    if (end - start < 400) {
      var el = replaceHtml('list', list);
    } else {
      list_html += list;
    }

    character++;

    loading = setTimeout(load, 0);
};

var finish_loading = function() {
    $('div#status').hide();
    $('div#background').hide();
    clearInterval(progress);
    clearInterval(loading);

    if (list_html.length > 0) {
      var el = replaceHtml('list', list_html);
    }

    $('a.char').click(zoom);
    if (param0) {
        $('a#' + param0).trigger('click');
    }
};

var indicate_progress = function() {
    var pattern = PATTERNS['large'];
    var character = pattern[progress_indicator_index];
    $('span#progress').html(character);
    progress_indicator_index++;
    progress_indicator_index %= pattern.length;
    progress = setTimeout(indicate_progress, 60);
};

var zoom = function(event) {
    var a = event.target;
    var href = 'chars.html?c=' + a.id + '&start=' + $('input#start').val() + '&end=' + $('input#end').val();
    info = '<p>' + a.innerHTML + '</p>';
    info += '<a class="code" href="' + href + '">&amp;#' + a.id + '</a>';
    info += '<a class="x">&#10005</a>';

    var el = replaceHtml('zoomed', info);

    $('div#background').show();
    $('div#zoomed').show();
    $('a.x').click(unzoom);
    return false;
};

var unzoom = function() {
    $('div#background').hide();
    $('div#zoomed').hide();
    return false;
};

function replaceHtml(el, html) {
    var oldEl = typeof el === "string" ? document.getElementById(el) : el;
    /*@cc_on // Pure innerHTML is slightly faster in IE
        oldEl.innerHTML = html;
        return oldEl;
    @*/
    var newEl = oldEl.cloneNode(false);
    newEl.innerHTML = html;
    oldEl.parentNode.replaceChild(newEl, oldEl);
    /* Since we just removed the old element from the DOM, return a reference
    to the new element, which can be used to restore variable references. */
    return newEl;
};

function gup(name) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(window.location.href);
  if (results == null) return null;
  else return results[1];
}

function createCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

function tohex(decnum) {
    with (document.hexadecimal) {
        return Number(decnum).toString(16);
    }
}

function todecimal(hexnum) {
    with (document.hexadecimal) {
        return parseInt(hexnum, 16);
    }
}

var key_released = function(event) {
  if (event == null) {
    return false;
  }
  if (event.which == 13) {
    var el = document.activeElement;
    if (el) {
      if (el.tagName.toLowerCase() == 'input') {
        if (el.type == 'text' || el.tagName.toLowerCase() == 'textarea') {
          return reload();
        }
      }
    }
  } 
  switch (event.which) {
  case 27:
    return unzoom();
  case 37:
    return goprev();
  case 39:
    return gonext();
  }
  return false;
};

var init_chars = function() {
  $(document).on('keyup', key_released);
  if (inverted == 'true' || readCookie('inverted') == 'true') {
    invert();
  }

  $('a.prev').click(goprev);
  $('a.next').click(gonext);
  $('a.invert').click(invert);

  setTimeout(begin_loading, 1);

  $('input#start').val(start);
  $('input#end').val(end);
};

$(document).ready(init_chars);
