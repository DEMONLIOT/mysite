export default async function decorate(block) {
  console.log("=== Lancement du Header Sécurisé ===");

  // On essaie de récupérer la liste <ul> générée par tes puces décalées
  const mainUl = block.querySelector('ul');
  
  if (!mainUl) {
    console.warn("Pas de liste <ul> standard trouvée, bascule sur la méthode alternative...");
    // Méthode de secours si AEM a aplati la structure du tableau
    const rows = block.querySelectorAll('div > div > *');
    if (!rows.length) return;
    
    const backupUl = document.createElement('ul');
    backupUl.classList.add('nav-menu');
    let currentUl = null;

    rows.forEach((el) => {
      const text = el.textContent.trim();
      if (!text) return;
      const link = el.querySelector('a');

      if (!link) {
        const li = document.createElement('li');
        li.classList.add('nav-item', 'dropdown');
        li.innerHTML = `<span class="dropdown-toggle" style="cursor:pointer; font-weight:bold;">${text} ▼</span>`;
        currentUl = document.createElement('ul');
        currentUl.classList.add('dropdown-menu');
        li.appendChild(currentUl);
        backupUl.appendChild(li);

        li.addEventListener('click', (e) => {
          e.stopPropagation();
          li.classList.toggle('is-open');
        });
      } else if (currentUl && !text.toLowerCase().includes('accueil')) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${link.href}">${text}</a>`;
        currentUl.appendChild(li);
      } else {
        const li = document.createElement('li');
        li.classList.add('nav-item');
        li.innerHTML = `<a href="${link.href}">${text}</a>`;
        backupUl.appendChild(li);
      }
    });

    block.textContent = '';
    block.appendChild(backupUl);
    return;
  }

  // SI LA LISTE UL EXISTE (Grâce à tes puces décalées sur l'éditeur DA)
  mainUl.classList.add('nav-menu');

  // On configure chaque élément de la liste
  const lis = mainUl.querySelectorAll('li');
  lis.forEach((li) => {
    const subUl = li.querySelector('ul');
    const link = li.querySelector('a');

    // Si la puce contient une sous-liste décalée ou n'a pas de lien direct (ex: Jeux, Interviews...)
    if (subUl || !link) {
      li.classList.add('nav-item', 'dropdown');
      if (subUl) subUl.classList.add('dropdown-menu');

      // On isole le texte du titre pour y ajouter la petite flèche et le rendre cliquable
      const firstChild = li.firstChild;
      if (firstChild && firstChild.nodeType === Node.TEXT_NODE) {
        const span = document.createElement('span');
        span.classList.add('dropdown-toggle');
        span.style.cursor = 'pointer';
        span.textContent = firstChild.textContent.trim() + " ▼";
        li.insertBefore(span, firstChild);
        firstChild.remove();
      }

      // Écouteur de clic pour ouvrir/fermer le menu déroulant
      li.addEventListener('click', (e) => {
        e.stopPropagation();
        // Ferme les autres menus ouverts pour éviter qu'ils se chevauchent
        block.querySelectorAll('.dropdown.is-open').forEach((d) => {
          if (d !== li) d.classList.remove('is-open');
        });
        li.classList.toggle('is-open');
      });
    } else {
      // C'est un lien direct (comme Accueil)
      li.classList.add('nav-item');
    }
  });

  // Fermer tous les menus déroulants si on clique n'importe où ailleurs sur l'écran
  document.addEventListener('click', () => {
    block.querySelectorAll('.dropdown.is-open').forEach((d) => d.classList.remove('is-open'));
  });

  console.log("=== Header configuré avec succès ===");
}
