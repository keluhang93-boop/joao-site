/* --- GLOBAL NAVIGATION & MENU --- */
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('mobile-menu-btn');
    const overlay = document.getElementById('mobile-menu-overlay');

    if (btn && overlay) {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); 
            overlay.classList.toggle('active');
            console.log("Menu Toggle: ", overlay.classList.contains('active'));
        });
    }

    // Close menu if a link is clicked
    const navLinks = document.querySelectorAll('.mobile-nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            overlay.classList.remove('active');
        });
    });
});
