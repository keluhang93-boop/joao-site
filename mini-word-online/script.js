/**
 * Main function to apply formatting
 * @param {string} cmd - The command (e.g., 'bold')
 * @param {string} value - Optional value (like color hex)
 */
function formatDoc(cmd, value = null) {
    if (value) {
        document.execCommand(cmd, false, value);
    } else {
        document.execCommand(cmd, false, null);
    }
}

// Optional: Add a listener to handle Tab key inside the editor
const editor = document.getElementById('editor');
editor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
    }
});

const editor = document.getElementById('editor');
const wordCountDisplay = document.getElementById('wordCount');

function formatDoc(cmd, value = null) {
    if (!cmd) return;
    // This command executes the formatting on the current selection
    document.execCommand(cmd, false, value);
    // Refocus the editor so you can keep typing
    document.getElementById('editor').focus();
}

// Wait for the window to load to make sure elements exist
window.onload = () => {
    const editor = document.getElementById('editor');
    const wordCountDisplay = document.getElementById('wordCount');

    // Word Count Logic
    editor.addEventListener('input', () => {
        // Use innerText to get only the visible text, not HTML tags
        const text = editor.innerText.trim();
        const words = text ? text.split(/\s+/).length : 0;
        wordCountDisplay.innerText = words;
    });

    // Fix for Tab key
    editor.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
        }
    });
};
