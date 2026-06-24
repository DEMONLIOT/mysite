// --- VARIABLES DE BASE ---
let score = 0;
let puissanceClic = 1; 
let pointsParSeconde = 0;

let prixMultiplicateur = 50;
let prixAutoclicker = 1000000000000; // Exactement 1 000 milliards (sans espaces)

// --- SÉLECTION DES ÉLÉMENTS HTML ---
const affichageScore = document.getElementById('score');
const boutonClic = document.getElementById('boutonClic');

const btnMulti = document.getElementById('btnMulti');
const affichagePrixMulti = document.getElementById('prixMulti');
const affichagePuissance = document.getElementById('puissance');

const btnAuto = document.getElementById('btnAuto');
const affichagePrixAuto = document.getElementById('prixAuto');
const affichageVitesseAuto = document.getElementById('vitesseAuto');

// --- 1. LE CLIC PRINCIPAL ---
boutonClic.addEventListener('click', () => {
  score += puissanceClic; 
  // Arrondi à l'entier inférieur pour éviter les bugs visuels dus aux 0.5
  affichageScore.textContent = Math.floor(score); 
});

// --- 2. ACHAT DU MULTIPLICATEUR ---
btnMulti.addEventListener('click', () => {
  if (score >= prixMultiplicateur) {
    score -= prixMultiplicateur; 
    
    puissanceClic += 0.5; // Augmente proprement de 0.5 à chaque fois
    prixMultiplicateur = Math.floor(prixMultiplicateur * 2); // Le prix double
    
    // Mise à jour de l'interface
    affichageScore.textContent = Math.floor(score);
    affichagePrixMulti.textContent = prixMultiplicateur;
    affichagePuissance.textContent = puissanceClic; 
  } else {
    alert("Pas assez de points ! Continue de cliquer !");
  }
});

// --- 3. ACHAT DE L'AUTOCLICKER ULTRA ---
btnAuto.addEventListener('click', () => {
  if (score >= prixAutoclicker) {
    score -= prixAutoclicker; 
    pointsParSeconde += 500000; // Ajoute un énorme bonus passif (+500 000/sec)
    
    prixAutoclicker = Math.floor(prixAutoclicker * 3.5); // Le prix augmente drastiquement
    
    // Mise à jour de l'interface avec séparateur de milliers lisible
    affichageScore.textContent = Math.floor(score);
    affichagePrixAuto.textContent = prixAutoclicker.toLocaleString(); 
    affichageVitesseAuto.textContent = pointsParSeconde;
  } else {
    alert("C'est beaucoup trop cher pour toi... Il te faut 1 000 milliards de clics !");
  }
});

// --- 4. LA BOUCLE DE L'AUTOCLICKER (Toutes les secondes) ---
setInterval(() => {
  if (pointsParSeconde > 0) {
    score += pointsParSeconde; 
    affichageScore.textContent = Math.floor(score); 
  }
}, 1000);
