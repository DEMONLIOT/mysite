document.addEventListener("DOMContentLoaded", function() {
    function integrerMenuTableau() {
        const editTable = document.querySelector(".cmp-table, table, [role='table']");
        if (editTable) {
            if (editTable.parentNode.id === "eva-projet-nav") return;
            const wrapper = document.createElement("div");
            wrapper.id = "eva-projet-nav";
            editTable.parentNode.insertBefore(wrapper, editTable);
            wrapper.appendChild(editTable);
            clearInterval(chercheTableau);
        }
    }
    const chercheTableau = setInterval(integrerMenuTableau, 100);
    setTimeout(() => clearInterval(chercheTableau), 5000);
});
