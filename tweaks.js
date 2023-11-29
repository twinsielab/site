document.addEventListener('keydown', function(event) {
    const prevButton = document.querySelector('#notion-app .notion-overlay-container div[data-overlay="true"] [role="region"] > div:nth-child(2) > div > div [role=button]:nth-child(4)');
    const nextButton = document.querySelector('#notion-app .notion-overlay-container div[data-overlay="true"] [role="region"] > div:nth-child(2) > div > div [role=button]:nth-child(5)');

    const isEditing = (element) => {
        return element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.isContentEditable;
    };

    // Only proceed if the focus is not on editable elements
    if (!isEditing(document.activeElement)) {
        // Check if the left arrow key is pressed
        if (event.key === 'ArrowLeft') {
            // If the prevButton exists, simulate a click
            if (prevButton) {
                prevButton.click();
            }
        }

        // Check if the right arrow key is pressed
        if (event.key === 'ArrowRight') {
            // If the nextButton exists, simulate a click
            if (nextButton) {
                nextButton.click();
            }
        }
    }
});
