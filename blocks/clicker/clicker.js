document.addEventListener("DOMContentLoaded", function() {
  const htmlJeu = `
    <div class="jeu-clicker">
      <h1>Score : <span id="score">0</span></h1>
      <button id="boutonClic">CLIQUE ICI !</button>
      <div class="boutique-clicker">
        <h3>Boutique</h3>
        <button id="btnMulti">Acheter Multiplicateur (Prix: <span id="prixMulti">50</span>)</button>
        <p>Chaque clic donne : +<span id="puissance">1</span> points</p>
        <button id="btnAuto">Acheter Auto-Clicker ULTRA (Prix: <span id="prixAuto">1000000000000</span>)</button>
        <p>Gain passif : +<span id="vitesseAuto">0</span>/seconde</p>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('afterbegin', htmlJeu);

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
    score += puissanceClic; 
    affichageScore.textContent = Math.floor(score); 
  });

  btnMulti.addEventListener('click', function() {
    if (score >= prixMultiplicateur) {
      score -= prixMultiplicateur; 
      puissanceClic += 0.5; 
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
      score -= prixAutoclicker; 
      pointsParSeconde += 500000; 
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
      score += pointsParSeconde; 
      affichageScore.textContent = Math.floor(score); 
    }
  }, 1000);
});
