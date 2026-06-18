export default function decorate(block) {
  // --- 1. TES COMPTEURS (Les variables de stockage) ---
  let pointsParClic = 1;
  let score = 0;
  const scoreSauvegarde=localStorage.getItem('clickerScore')
if (scoreSauvegarde) {
  score=parseInt(scoreSauvegarde,10);
  }else{ 
  score=0
}

  // --- 2. L'AFFICHAGE (Ce que le joueur voit à l'écran) ---
  const scoreDisplay = document.createElement('h2');
  scoreDisplay.textContent = "Score :"+score;
  scoreDisplay.style.fontSize = "2rem";

  const clickButton = document.createElement('button');
  clickButton.textContent = "🍪 CLIQUE !";
  clickButton.style.fontSize = "3rem";
  clickButton.style.padding = "20px";
  clickButton.style.cursor = "pointer";

  // --- 3. L'ASSEMBLAGE (On met tout dans la page web) ---
  block.innerHTML = '';
  block.append(scoreDisplay, clickButton);

  // --- 4. LA ZONE DE JEU (C'est là que tu codes !) ---
  clickButton.addEventListener('click', () => {
    score=score+pointsParClic
    // ÉTAPE 1 : Écris la ligne pour augmenter le score
    scoreDisplay.textContent="Score:"+score
    // ÉTAPE 2 : Écris la ligne pour mettre à jour le texte affiché à l'écran
localStorage.setItem('clickerScore', score);
  });
}
