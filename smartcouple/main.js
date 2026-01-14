/* --- GLOBAL NAVIGATION --- */
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const overlay = document.getElementById('mobile-menu-overlay');

    if (menuBtn && overlay) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevents the click from immediately closing
            overlay.classList.toggle('active');
            
            // Optional: Toggle a class on the button for animation
            menuBtn.classList.toggle('open');
        });

        // Close menu if clicking outside the links
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    }
});

/* --- SMART UNION QUIZ LOGIC --- */
// This will only run on the Smart Union page
document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.getElementById('daily-question');
    const refreshBtn = document.getElementById('refresh-btn');

    // 1. Check if we are actually on the Smart Union page
    if (textElement) {
        // Show the first question immediately
        shuffleQuestion();

        // 2. Attach the click event to the button if it exists
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                // Add a simple fade-out/in effect
                textElement.style.opacity = 0;
                setTimeout(() => {
                    shuffleQuestion();
                    textElement.style.opacity = 1;
                }, 200);
            });
        }
    }
});

// The actual function that picks the random question
function shuffleQuestion() {
    const textElement = document.getElementById('daily-question');
    const connectionQuestions = [
        "Quelle est la petite chose que j'ai faite cette semaine qui t'a fait te sentir aimé(e) ?",
        "Si nous pouvions partir en voyage demain, sans limite de budget, où irions-nous ?",
        "Quelle est la qualité que tu admires le plus chez moi aujourd'hui ?",
        "Y a-t-il quelque chose qui te pèse en ce moment et dont je pourrais te soulager ?",
        "Quel est ton souvenir préféré de nous deux au cours du mois dernier ?",
        "Comment puis-je mieux te soutenir dans tes projets personnels cette semaine ?",
        "Quelle est la chose la plus importante que tu as apprise sur notre relation cette année ?"
    ];

    if (textElement) {
        const randomIndex = Math.floor(Math.random() * connectionQuestions.length);
        textElement.innerText = connectionQuestions[randomIndex];
    }
}
