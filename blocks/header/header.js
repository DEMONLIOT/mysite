import { loadCSS } from '../../scripts/aem.js';

/**
 * Charge le menu global directement depuis la racine absolue
 * @param {Element} block Le conteneur du bloc header
 */
export default async function decorate(block) {
  // 1. Charger de force le CSS dédié au header
  await loadCSS(`${window.hlx.codeBasePath}/blocks/header/header.css`);

  // 2. Aller chercher le HTML du menu via le point d'accès standard AEM
  try {
    // URL universelle d'AEM Edge Delivery Services pour le fragment nav
    const response = await fetch('/nav'); 
    if (response.ok) {
      const html = await response.text();
      
      // On crée la structure exacte attendue par notre CSS
      const navContainer = document.createElement('div');
      navContainer.className = 'header block';
      navContainer.innerHTML = `<div><div>${html}</div></div>`;
      
      // On vide le bloc actuel et on injecte le menu
      block.textContent = '';
      block.appendChild(navContainer);
    } else {
      console.error('Impossible de récupérer le fragment /nav');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la navigation :', error);
  }
}
