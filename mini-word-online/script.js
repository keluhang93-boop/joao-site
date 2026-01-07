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
