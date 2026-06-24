// 1. LE BOUCLIER : On désactive complètement la fonction d'impression sur cette page
window.print = function() { 
    console.log("🛡️ Tentative d'impression bloquée avec succès !"); 
};

(function() {
    function calerMenuHorizontal() {
        // 2. CIBLE UNIVERSELLE : On attrape ABSOLUMENT TOUT le composant où tu as mis ton menu
        // (Qu'AEM l'ait généré en table, en div, en liste ou en texte)
        const composantMenu = document.querySelector('.cmp-table, table, .cmp-navigation, .text, .htmlcontainer');

        if (composantMenu && !composantMenu.hasAttribute('data-menu-done')) {
            
            // On lui colle un badge pour ne pas répéter l'action
            composantMenu.setAttribute('data-menu-done', 'true');
            
            // On force son ID pour que le CSS l'habille en noir
            composantMenu.id = "eva-projet-nav-direct";

            // On cherche toutes les structures à l'intérieur pour casser la verticale
            const structures = composantMenu.querySelectorAll('table, tbody, tr, ul');
            structures.forEach(el => {
                el.style.setProperty('display', 'flex', 'important');
                el.style.setProperty('flex-direction', 'row', 'important');
                el.style.setProperty('flex-wrap', 'wrap', 'important');
                el.style.setProperty('background-color', '#333', 'important');
                el.style.setProperty('width', '100%', 'important');
                el.style.setProperty('margin', '0', 'important');
                el.style.setProperty('padding', '0', 'important');
                el.style.setProperty('list-style', 'none', 'important');
            });

            // On couche les cellules / puces côte à côte
            const cases = composantMenu.querySelectorAll('td, li');
            cases.forEach(c => {
                c.style.setProperty('display', 'block', 'important');
                c.style.setProperty('padding', '0', 'important');
                c.style.setProperty('margin', '0', 'important');
                c.style.setProperty('border', 'none', 'important');
            });

            // On stylise les liens (les boutons du menu)
            const liens = composantMenu.querySelectorAll('a, p');
            liens.forEach(l => {
                l.style.setProperty('display', 'block', 'important');
                l.style.setProperty('color', '#ffffff', 'important');
                l.style.setProperty('padding', '15px 22px', 'important');
                l.style.setProperty('text-decoration', 'none', 'important');
                l.style.setProperty('font-family', 'sans-serif', 'important');
                l.style.setProperty('font-weight', 'bold', 'important');
            });

            clearInterval(chrono);
        }
    }

    const chrono = setInterval(calerMenuHorizontal, 50);
    setTimeout(() => clearInterval(chrono), 8000);
})();
