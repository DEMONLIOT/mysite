let score = 0;
let puissanceClic = 1;

const affichageScore = document.getElementById('score');
const boutonClic = document.getElementById('boutonClic');

boutonClic.addEventListener('click', () =>{
  score += puissanceClic;
  affichageScore.textContent = score;
});
