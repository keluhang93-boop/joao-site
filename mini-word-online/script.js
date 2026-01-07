let editor;
let wordCountDisplay;

window.onload = () => {
    editor = document.getElementById('editor');
    wordCountDisplay = document.getElementById('wordCount');

    // Robust Word Count Logic
    editor.addEventListener('input', () => {
        // 1. Get the text and remove HTML tags
        const text = editor.innerText || editor.textContent;
        
        // 2. Clean up the text: replace newlines/tabs with spaces
        const cleanText = text.replace(/\s+/g, ' ').trim();
        
        // 3. Split and count
        const words = cleanText === "" ? 0 : cleanText.split(' ').length;
        
        // 4. Update the screen
        wordCountDisplay.innerText = words;

        // Debugging: This will show you exactly what text is being counted in the Console
        console.log("Current text being counted:", cleanText);
    });

    editor.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
        }
    });
};

function formatDoc(cmd, value = null) {
    if (!cmd) return;
    document.execCommand(cmd, false, value);
    editor.focus();
}
