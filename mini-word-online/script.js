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

/**
 * Main function to apply formatting
 */
function formatDoc(cmd, value = null) {
    document.execCommand(cmd, false, value);
}

/**
 * Word Count Logic
 */
editor.addEventListener('input', () => {
    const text = editor.innerText.trim();
    // Split by spaces and filter out empty strings
    const words = text ? text.split(/\s+/).length : 0;
    wordCountDisplay.innerText = words;
});

/**
 * Tab key support
 */
editor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
    }
});
