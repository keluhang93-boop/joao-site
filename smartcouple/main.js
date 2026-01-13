/* --- GLOBAL NAVIGATION --- */
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.querySelector('.sketch-nav');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
});

/* --- SMART UNION QUIZ (Add if needed) --- */
const connectionQuestions = [
    "Quelle est la petite chose que j'ai faite cette semaine qui t'a fait te sentir aimé(e) ?",
    "Si nous pouvions partir en voyage demain, sans limite de budget, où irions-nous ?",
    "Quelle est la qualité que tu admires le plus chez moi aujourd'hui ?",
    "Y a-t-il quelque chose qui te pèse en ce moment et dont je pourrais te soulager ?"
];

function shuffleQuestion() {
    const textElement = document.getElementById('daily-question');
    if (textElement) {
        const randomIndex = Math.floor(Math.random() * connectionQuestions.length);
        textElement.innerText = connectionQuestions[randomIndex];
    }
}
