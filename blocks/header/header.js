import { loadCSS } from '../../scripts/aem.js';

/**
 * Décore le bloc header et force le chargement du CSS dédié
 * @param {Element} block Le bloc header
 */
export default async function decorate(block) {
  // Charge de force le CSS du header peu importe la profondeur de la page
  await loadCSS(`${window.hlx.codeBasePath}/blocks/header/header.css`);
}
