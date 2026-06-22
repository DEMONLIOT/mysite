import { loadCSS } from '../../scripts/aem.js';

/**
 * Charge le menu global directement depuis le serveur de preview absolu d'AEM
 * @param {Element} block Le conteneur du bloc header
 */
export default async function decorate(block) {
  // 1. Charger de force le CSS dédié au header
  await loadCSS(`${window.hlx.codeBasePath}/blocks/header/header.css`);

  // 2. Récupérer le HTML brut via l'URL de preview de ton projet
  try {
    // ⚠️ REMPLACE "TON-DEPOT" ET "TON-ORGANISATION" PAR TES VRAIES INFOS DE SIDEKICK
    const projectUrl = 'https://main--TON-DEPOT--TON-ORGANISATION.hlx.page/nav.plain.html';
    
    const response = await fetch(projectUrl);
    if (response.ok) {
      const html = await response.text();
      
      // On recrée la structure exacte indispensable à notre CSS
      const navContainer = document.createElement('div');
      navContainer.className = 'header block';
      navContainer.innerHTML = `<div><div>${html}</div></div>`;
      
      // On nettoie le bloc actuel et on injecte la barre
      block.textContent = '';
      block.appendChild(navContainer);
    } else {
      console.error('Erreur de réponse lors du fetch du nav.plain.html');
    }
  } catch (error) {
    console.error('Erreur réseau lors de la récupération de la navigation :', error);
  }
}
