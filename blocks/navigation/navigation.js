(function() {
    function alignerLeMenu() {
        // 1. On cherche la barre noire qu'on a créée avec le CSS
        const barreNoire = document.querySelector("#eva-projet-nav-direct");
        
        if (barreNoire) {
            // 2. On cherche TOUS les liens (<a>) ou textes qui sont dans cette zone
            const tousLesLiens = barreNoire.querySelectorAll("a, p, td, li");
            
            if (tousLesLiens.length > 0) {
                console.log("🎯 Liens trouvés ! Forçage de l'alignement...");

                // 3. On force TOUS les conteneurs parents (tables, tr, ul) à se mettre à l'horizontale
                const structures = barreNoire.querySelectorAll("table, tbody, tr, ul");
                structures.forEach(el => {
                    el.style.display = "flex" !important;
                    el.style.flexDirection = "row" !important;
                    el.style.flexWrap = "nowrap" !important;
                    el.style.width = "100%" !important;
                    el.style.margin = "0" !important;
                    el.style.padding = "0" !important;
                    el.style.listStyle = "none" !important;
                });

                // 4. On s'assure que les cellules ou listes ne s'empilent pas verticalement
                const items = barreNoire.querySelectorAll("td, li");
                items.forEach(item => {
                    item.style.display = "inline-block" !important;
                    item.style.float = "none" !important;
                });

                clearInterval(chrono);
            }
        }
    }

    // Exécution rapide et répétée pour devancer le chargement d'AEM
    const chrono = setInterval(alignerLeMenu, 50);
    setTimeout(() => clearInterval(chrono), 8000);
})();
