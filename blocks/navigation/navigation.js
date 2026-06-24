(function() {
    function forcerMenuHorizontal() {
        // 1. On cherche la barre horizontale qu'on a créée en CSS
        const barreHorizontale = document.querySelector("#eva-projet-nav-direct");
        
        // 2. On cherche le bloc vertical d'AEM où sont coincés tes éléments
        // On cible large : les tables, les listes (ul), ou les blocs de liens d'AEM
        const blocVertical = document.querySelector(".cmp-table, table, .cmp-navigation, ul.nav-menu");

        // Si on a trouvé le bloc vertical et qu'il n'est pas encore dans la barre
        if (blocVertical && barreHorizontale) {
            
            // Si le bloc trouvé EST la barre elle-même, on ne fait rien
            if (blocVertical.id === "eva-projet-nav-direct") return;

            console.log("🎯 Bloc vertical trouvé ! Déplacement des éléments...");

            // MAGIE : On prend tous les éléments du bloc vertical et on les injecte dans la barre
            while (blocVertical.firstChild) {
                barreHorizontale.appendChild(blocVertical.firstChild);
            }

            // On nettoie et on force la ligne horizontale sur tout ce qui est entré
            barreHorizontale.style.display = "flex";
            barreHorizontale.style.flexDirection = "row";
            barreHorizontale.style.flexWrap = "nowrap";

            // On applique la ligne sur les lignes de tableau si c'en était un
            const lignes = barreHorizontale.querySelectorAll("tr");
            lignes.forEach(l => {
                l.style.display = "flex";
                l.style.flexDirection = "row";
            });

            // On cache l'ancien conteneur vertical vide pour qu'il ne pollue pas l'écran
            blocVertical.style.display = "none";

            // Mission réussie, on arrête de chercher
            clearInterval(chronoCherche);
        }
    }

    // On cherche et on applique toutes les 50 millisecondes
    const chronoCherche = setInterval(forcerMenuHorizontal, 50);
    setTimeout(() => clearInterval(chronoCherche), 8000);
})();
