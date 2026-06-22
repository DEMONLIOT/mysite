import { loadCSS } from '../../scripts/aem.js';

/**
 * Charge le menu global directement depuis la racine absolue
 * @param {Element} block Le conteneur du bloc header
 */
export default async function decorate(block) {
  // 1. Charger de force le CSS dédié au header
  await loadCSS(`${window.hlx.codeBasePath}/blocks/header/header.css`);

  // 2. Aller chercher le HTML du menu (/nav) à la racine absolue du site
  try {
    const response = await fetch('/nav.plain.html');
    if (response.ok) {
      const html = await response.text();
      
      // On crée un conteneur propre pour accueillir le menu
      const navContainer = document.createElement('div');
      navContainer.className = 'header block';
      navContainer.innerHTML = `<div><div>${html}</div></div>`;
      
      // On vide le bloc actuel et on injecte le menu tout propre
      block.textContent = '';
      block.appendChild(navContainer);
    } else {
      console.error('Impossible de charger le fichier /nav.plain.html');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la navigation :', error);
  }
}
