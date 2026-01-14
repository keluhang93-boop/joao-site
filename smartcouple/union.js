// This wrapper ( { ... } ) prevents "already declared" errors
{
    const connectionQuestions = [
        "Quelle est la petite chose que j'ai faite cette semaine qui t'a fait te sentir aimé(e) ?",
        "Si nous pouvions partir en voyage demain, sans limite de budget, où irions-nous ?",
        "Quelle est la qualité que tu admires le plus chez moi aujourd'hui ?",
        "Y a-t-il quelque chose qui te pèse en ce moment et dont je pourrais te soulager ?",
        "Quel est ton souvenir préféré de nous deux au cours du mois dernier ?",
        "Comment puis-je mieux te soutenir dans tes projets personnels cette semaine ?",
        "Quelle est la chose la plus importante que tu as apprise sur notre relation cette année ?"
    ];

    const shuffleQuestion = () => {
        const textElement = document.getElementById('daily-question');
        if (textElement) {
            const randomIndex = Math.floor(Math.random() * connectionQuestions.length);
            textElement.innerText = connectionQuestions[randomIndex];
        }
    };

    // Initialize when page loads
    document.addEventListener('DOMContentLoaded', () => {
        shuffleQuestion();
        
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', shuffleQuestion);
        }
    });
}
