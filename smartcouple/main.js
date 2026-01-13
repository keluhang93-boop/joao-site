document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('mobile-menu-btn');
    const overlay = document.getElementById('mobile-menu-overlay');

    if (btn && overlay) {
        btn.onclick = () => {
            overlay.classList.toggle('active');
        };
    }
});
