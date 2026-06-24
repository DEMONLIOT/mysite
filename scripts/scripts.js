document.addEventListener("DOMContentLoaded", function() {
    
    // Structure HTML propre du menu
    const menuHTML = `
        <nav class="nav-container">
            <ul class="nav-menu">
                <li class="nav-item">
                    <a class="nav-link" href="#">Accueil</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Partie 1 ▾</a>
                    <ul class="dropdown-menu">
                        <li><a href="#">Sous-partie 1.1</a></li>
                        <li><a href="#">Sous-partie 1.2</a></li>
                    </ul>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Partie 2 ▾</a>
                    <ul class="dropdown-menu">
                        <li><a href="#">Sous-partie 2.1</a></li>
                    </ul>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Contact</a>
                </li>
            </ul>
        </nav>
    `;

    // Injection au tout début du site
    document.body.insertAdjacentHTML('afterbegin', menuHTML);
    
    print("Le menu a été injecté avec succès !");
});
