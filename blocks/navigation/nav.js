(function() {
    function initialiserMenuAEM() {
        // On cible le composant AEM (tableau, liste ou texte)
        const blocAEM = document.querySelector(".cmp-table, table, .cmp-navigation, .text, .htmlcontainer");

        if (blocAEM && !blocAEM.hasAttribute('data-menu-active')) {
            // On marque le bloc pour éviter les boucles infinies
            blocAEM.setAttribute('data-menu-active', 'true');
            
            // On lui donne l'ID que notre CSS va styliser
            blocAEM.id = "menu-horizontal-eva";

            console.log("🎯 Bloc AEM détecté et configuré pour le menu horizontal.");
            clearInterval(verifChrono);
        }
    }

    // Recherche active toutes les 100ms au chargement
    const verifChrono = setInterval(initialiserMenuAEM, 100);
    setTimeout(() => clearInterval(verifChrono), 8000);
})();
