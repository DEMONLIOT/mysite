let score = 0;
let puissanceClic = 1; 
let pointsParSeconde = 0;
let prixMultiplicateur = 50;
let prixAutoclicker = 1000000000000; 

const affichageScore = document.getElementById('score');
const boutonClic = document.getElementById('boutonClic');
const btnMulti = document.getElementById('btnMulti');
const affichagePrixMulti = document.getElementById('prixMulti');
const affichagePuissance = document.getElementById('puissance');
const btnAuto = document.getElementById('btnAuto');
const affichagePrixAuto = document.getElementById('prixAuto');
const affichageVitesseAuto = document.getElementById('vitesseAuto');

boutonClic.addEventListener('click', function() {
  score = score + puissanceClic; 
  affichageScore.textContent = Math.floor(score); 
});

btnMulti.addEventListener('click', function() {
  if (score >= prixMultiplicateur) {
    score = score - prixMultiplicateur; 
    puissanceClic = puissanceClic + 0.5; 
    prixMultiplicateur = Math.floor(prixMultiplicateur * 2); 
    affichageScore.textContent = Math.floor(score);
    affichagePrixMulti.textContent = prixMultiplicateur;
    affichagePuissance.textContent = puissanceClic; 
  } else {
    alert("Pas assez de points !");
  }
});

btnAuto.addEventListener('click', function() {
  if (score >= prixAutoclicker) {
    score = score - prixAutoclicker; 
    pointsParSeconde = pointsParSeconde + 500000; 
    prixAutoclicker = Math.floor(prixAutoclicker * 3.5);
    affichageScore.textContent = Math.floor(score);
    affichagePrixAuto.textContent = prixAutoclicker.toLocaleString(); 
    affichageVitesseAuto.textContent = pointsParSeconde;
  } else {
    alert("Il te faut 1 000 milliards de clics !");
  }
});

setInterval(function() {
  if (pointsParSeconde > 0) {
    score = score + pointsParSeconde; 
    affichageScore.textContent = Math.floor(score); 
  }
}, 1000);
