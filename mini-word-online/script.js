let editor;
let wordCountDisplay;

window.onload = () => {
    editor = document.getElementById('editor');
    wordCountDisplay = document.getElementById('wordCount');

    // Robust Word Counter
    editor.addEventListener('input', () => {
        const text = editor.innerText || "";
        const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        wordCountDisplay.innerText = words;
    });
};

function formatDoc(cmd, value = null) {
    if (!cmd) return;
    document.execCommand(cmd, false, value);
    editor.focus();
}

/**
 * FIXED: Exact Font Size Function
 * This version wraps the selected text in a <span> with the exact PX size.
 */
function changeFontSize(size) {
    if (!size) return;
    
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    // 1. Create a span with the custom size
    const span = document.createElement("span");
    span.style.fontSize = size + "px";
    span.style.lineHeight = "1.2"; // Ensures text doesn't overlap

    // 2. Get the selected text range
    const range = selection.getRangeAt(0);

    try {
        // 3. Wrap the selection in our new styled span
        // Note: This works best when highlighting text within a single paragraph
        range.surroundContents(span);
    } catch (e) {
        // Fallback: If selection is complex (crosses multiple tags), 
        // we use the older execCommand trick but with a more specific selector
        document.execCommand("fontSize", false, "7");
        const fontTags = editor.querySelectorAll('font[size="7"]');
        fontTags.forEach(tag => {
            tag.removeAttribute("size");
            tag.style.fontSize = size + "px";
        });
    }

    editor.focus();
}
