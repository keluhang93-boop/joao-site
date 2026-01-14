/* --- SMART UNION QUIZ --- */
const connectionQuestions = [
    "Quelle est la petite chose que j'ai faite cette semaine qui t'a fait te sentir aimé(e) ?",
    "Si nous pouvions partir en voyage demain, sans limite de budget, où irions-nous ?",
    "Quelle est la qualité que tu admires le plus chez moi aujourd'hui ?",
    "Y a-t-il quelque chose qui te pèse en ce moment et dont je pourrais te soulager ?",
    "Quel est ton souvenir préféré de nous deux au cours du mois dernier ?",
    "Comment puis-je mieux te soutenir dans tes projets personnels cette semaine ?",
    "Quelle est la chose la plus importante que tu as apprise sur notre relation cette année ?"
];

function shuffleQuestion() {
    const textElement = document.getElementById('daily-question');
    if (textElement) {
        const randomIndex = Math.floor(Math.random() * connectionQuestions.length);
        textElement.innerText = connectionQuestions[randomIndex];
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    shuffleQuestion();
    
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', shuffleQuestion);
    }
});
    // Category Filter Simulation
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // UI Toggle
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-category');
            console.log("Filtrage par catégorie:", category);
            // Here you would normally filter the articles display
        });
    });
});

function shuffleQuestion() {
    const textElement = document.getElementById('daily-question');
    if (!textElement) return;

    // Smooth fade effect
    textElement.style.opacity = 0;
    
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * connectionQuestions.length);
        textElement.innerText = connectionQuestions[randomIndex];
        textElement.style.opacity = 1;
    }, 300);
}
