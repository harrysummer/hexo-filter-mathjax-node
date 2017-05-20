var cheerio = require('cheerio');
var deasync = require('deasync');
var mjAPI = require('mathjax-node');

hexo.extend.filter.register('after_render:html', function(str, data) {
  var $ = cheerio.load(str);
  $('span.math').each(function(i, elem) {
    var mode = 'display';
    if ($(this).hasClass('inline')) mode = 'inline';

    var result = deasync(function(callback) {
      mjAPI.typeset({
        math: $(elem).text().match(/^(\$\$|\$|\\\(|\\\[)((.|\n)*)(\$\$|\$|\\\)|\\\])$/)[2],
        format: mode === 'inline' ? 'inline-TeX' : 'TeX',
        svg: true
      }, function(data) {
        if (data.errors) callback(data.errors);
        else callback(null, data.svg);
      });
    })();
    if (mode === 'display')
      $(elem).replaceWith('<div style="text-align:center;">' + result + '</div>');
    else
      $(elem).replaceWith(result);
  });
  return $.html();
});
