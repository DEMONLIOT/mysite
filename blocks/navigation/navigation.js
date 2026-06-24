document.addEventListener("DOMContentLoaded", function() {
    
    // Fonction qui va chercher et transformer ton tableau
    function integrerMenuTableau() {
        // On cherche un tableau dans la page, ou un conteneur de composant AEM qui contient un tableau
        const editTable = document.querySelector(".cmp-table, table, [role='table']");

        if (editTable) {
            // On vérifie si on ne l'a pas déjà fait pour éviter les boucles infinies
            if (editTable.parentNode.id === "eva-projet-nav") return;

            console.log("🎯 Tableau de navigation trouvé ! Application du style...");

            const wrapper = document.createElement("div");
            wrapper.id = "eva-projet-nav";
            
            editTable.parentNode.insertBefore(wrapper, editTable);
            wrapper.appendChild(editTable);
            
            // On arrête de chercher puisqu'on l'a trouvé
            clearInterval(chercheTableau);
        }
    }

    // AEM charge parfois les composants en décalé. 
    // On vérifie toutes les 100 millisecondes si ton tableau est apparu à l'écran.
    const chercheTableau = setInterval(integrerMenuTableau, 100);

    // Sécurité : on arrête de chercher après 5 secondes si rien n'apparaît
    setTimeout(() => clearInterval(chercheTableau), 5000);
});
