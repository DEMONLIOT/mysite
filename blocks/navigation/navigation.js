(function() {
    function construireMenuPropre() {
        // 1. On cherche où sont tes éléments (tableaux, listes ou liens du bloc)
        const blocOrigine = document.querySelector(".cmp-table, table, [role='table'], .cmp-navigation");
        
        // Sécurité : si la barre existe déjà ou qu'on ne trouve pas ton bloc, on arrête
        if (!blocOrigine || document.querySelector("#eva-projet-nav")) return;

        console.log("🎯 Bloc d'origine trouvé ! Reconstruction du menu...");

        // 2. On extrait tous los liens textuels (les boutons de ton menu)
        const liens = blocOrigine.querySelectorAll("a");
        if (liens.length === 0) return;

        // 3. On crée la nouvelle structure HTML ultra-propre et isolée
        const navConteneur = document.createElement("nav");
        navConteneur.id = "eva-projet-nav";

        const ulPrincipal = document.createElement("ul");
        ulPrincipal.className = "nav-menu";

        // 4. On range tes liens dans notre nouvelle structure
        liens.forEach(lien => {
            // Si le lien contient une flèche ou le mot "Sous-partie", on l'ignorera ou on le traitera
            // Pour faire simple, on recrée un bouton propre pour chaque lien trouvé
            const li = document.createElement("li");
            li.className = "nav-item";
            
            // On clone le lien pour garder son adresse (href) et son texte
            const nouveauLien = lien.cloneNode(true);
            nouveauLien.className = "nav-link";
            li.appendChild(nouveauLien);
            
            ulPrincipal.appendChild(li);
        });

        navConteneur.appendChild(ulPrincipal);

        // 5. Injection MAGIQUE tout en haut de la page du site
        document.body.insertAdjacentElement('afterbegin', navConteneur);

        /* 6. OPTION DÉROULANT AUTOMATIQUE : 
           Si un de tes liens s'appelle "Partie 1", on lui greffe un sous-menu en exemple.
           Tu pourras modifier les textes ci-dessous pour coller à tes pages.
        */
        const items = ulPrincipal.querySelectorAll(".nav-item");
        items.forEach(item => {
            const txt = item.textContent.toLowerCase();
            // Si le bouton s'appelle "partie 1" ou "projet", on lui crée son menu déroulant
            if (txt.includes("partie 1") || txt.includes("▾")) {
                const subUl = document.createElement("ul");
                subUl.className = "dropdown-menu";
                subUl.innerHTML = `
                    <li><a href="#sous-page1">Sous-partie 1.1</a></li>
                    <li><a href="#sous-page2">Sous-partie 1.2</a></li>
                `;
                item.appendChild(subUl);
            }
        });

        // 7. On cache le vieux bloc vertical d'AEM pour qu'il disparaisse de l'écran
        blocOrigine.style.display = "none";

        // Mission réussie, on coupe le chrono
        clearInterval(chronoMenu);
    }

    // On cherche ton bloc toutes les 100ms au chargement de la page
    const chronoMenu = setInterval(construireMenuPropre, 100);
    // Sécurité d'arrêt après 8 secondes
    setTimeout(() => clearInterval(chronoMenu), 8000);
})();
