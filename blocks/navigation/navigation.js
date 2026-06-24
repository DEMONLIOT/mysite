document.addEventListener("DOMContentLoaded", function() {
    // On cherche le tableau que tu as créé pour le menu en mode édit
    // Souvent, AEM met les composants dans un conteneur principal. On cible le premier tableau trouvé.
    const editTable = document.querySelector("table");

    if (editTable) {
        // On enveloppe ton tableau dans notre ID sécurisé pour ne pas toucher aux autres tableaux du site
        const wrapper = document.createElement("div");
        wrapper.id = "eva-projet-nav";
        
        editTable.parentNode.insertBefore(wrapper, editTable);
        wrapper.appendChild(editTable);
    }
});
