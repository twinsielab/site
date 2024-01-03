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
                console.log('Arrow Left, click Previous button');
                prevButton.click();
            }
        }

        // Check if the right arrow key is pressed
        if (event.key === 'ArrowRight') {
            // If the nextButton exists, simulate a click
            if (nextButton) {
                console.log('Arrow Right, click Next button');
                nextButton.click();
            }
        }
    }
});


document.addEventListener('mouseup', onClickPictureWithLink, {capture: true});
function onClickPictureWithLink(event) {
    let targetElement = event.target.closest('div[role="figure"]');
    if (targetElement) {
        let firstLink = targetElement.querySelector('div:nth-child(2) a:first-child');
        console.log('Clicking picture with link', firstLink);
        if (firstLink) {
            event.preventDefault();
            event.stopPropagation();
            firstLink.click();
            // location.href = firstLink.href;
            return false;

        }
    }
}



const replacements = [
    { re: /__CURRENT_URL__/g, replace: (url, link) => encodeURIComponent(location.href) }
];

document.addEventListener('mouseup', onClickLink, {capture:true});
function onClickLink(event) {
    let targetElement = event.target.closest('a[href]');
    if (targetElement) {
        let url = targetElement.href;
        let isReplaced = false;

        for (const replacement of replacements) {
            if (replacement.re.test(url)) {
                url = url.replace(replacement.re, replacement.replace(url, targetElement));
                isReplaced = true;
            }
        }

        if (isReplaced) {
            console.log('Clicked link with special var', targetElement, url);
            event.preventDefault();
            event.stopPropagation();
            window.open(url);
        }
    }
}
