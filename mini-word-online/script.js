let editor;
let wordCountDisplay;

window.onload = () => {
    editor = document.getElementById('editor');
    wordCountDisplay = document.getElementById('wordCount');

    // Word Count
    editor.addEventListener('input', () => {
        const text = editor.innerText.trim();
        const words = text ? text.split(/\s+/).length : 0;
        wordCountDisplay.innerText = words;
    });
};

function formatDoc(cmd, value = null) {
    document.execCommand(cmd, false, value);
    editor.focus();
}

/**
 * NEW EXACT SIZE LOGIC
 * This ignores the browser's built-in font command and 
 * manually styles the highlighted text.
 */
function changeFontSize(size) {
    if (!size) return;

    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        
        // 1. Create a span element
        const span = document.createElement("span");
        
        // 2. Apply the exact pixel size
        span.style.fontSize = size + "px";
        
        // 3. Put the selected text inside the span
        try {
            // This 'extract' and 'insert' method is the most reliable way 
            // to force the browser to accept new CSS styles.
            span.appendChild(range.extractContents());
            range.insertNode(span);
        } catch (e) {
            console.error("Size change failed: ", e);
        }
    }
    
    // Clear the selection so the user can see the result
    selection.removeAllRanges();
    editor.focus();
}
