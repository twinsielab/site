//
// Allow using <= => arrow keys to navigate between database pages
//
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


//
// Make Picutures clickable by having links on the captions
//
document.addEventListener('click', onClickPictureWithLink, {capture: false});
function onClickPictureWithLink(e) {
    let figure = e.target.closest('div[role="figure"]');
    if (figure) {
        let firstLink = figure.querySelector('div:nth-child(2) a:first-child');
        console.log('Clicking picture with link', firstLink);
        if (firstLink) {

            // prevent the image preview from opening
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.cancelBubble=true;
            
            firstLink.click();
            // location.href = firstLink.href;
            return false;

        }
    }
}


//
// Replace magic strings on Links
//
const replacements = [
    { re: /__CURRENT_URL__/g, replace: (url, link) => encodeURIComponent(location.href) }
];

document.addEventListener('mouseup', onClickLink, {capture:false});
function onClickLink(e) {
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

            // prevent the original url from opening
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.cancelBubble=true;
            
            window.open(url);
            // location.href = url;
        }
    }
}
