export default function decorate(block) {
  // On récupère le contenu de la navigation (souvent généré via nav.plain.html par AEM)
  const nav = block.querySelector('nav') || block;
  
  // On cherche tous les éléments de liste (<li>) qui contiennent une sous-liste (<ul>)
  const menuItems = nav.querySelectorAll('ul > li');

  menuItems.forEach((item) => {
    const subList = item.querySelector('ul');
    
    if (subList) {
      // ÉTAPE 1 : On marque cet élément comme ayant un menu déroulant
      item.classList.add('has-dropdown');

      // ÉTAPE 2 : On crée un petit bouton/flèche pour cliquer
      const trigger = document.createElement('span');
      trigger.classList.add('dropdown-trigger');
      trigger.textContent = ' ▼';
      
      // On insère la flèche juste avant la sous-liste
      item.insertBefore(trigger, subList);

      // ÉTAPE 3 : Gestion du clic pour ouvrir/fermer
      item.addEventListener('click', (e) => {
        // Empêche le clic de fermer immédiatement si on clique sur un sous-lien
        if (e.target.closest('ul') === subList) return;

        e.preventDefault();
        e.stopPropagation();
        
        // On bascule la classe "is-open" pour afficher ou masquer en CSS
        item.classList.toggle('is-open');
      });
    }
  });
}
