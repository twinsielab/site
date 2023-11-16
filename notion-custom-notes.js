// ==UserScript==
// @name         Notion Local Notes Widget
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add notes to pages locally
// @author       Victornpb
// @match        https://www.tinymod.xyz/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const LOCALSTORAGE = 'LOCALNOTES_WIDGET';

    let lastUrl = location.href;
    let currentItemId = null;
    let isCollapsed = false;

    // Extract item ID from the URL
    const getItemId = () => {
        const url = new URL(window.location.href);
        const pParam = url.searchParams.get('p');
        return pParam || url.pathname.match(/([0-9a-f]{32})/)?.[1];
    };

    // Get the data object from local storage or create a new one
    const getData = () => {
        return JSON.parse(localStorage.getItem(LOCALSTORAGE)) || {};
    };

    // Update local storage
    const updateStorage = (checked) => {
        if (!currentItemId) return;

        const data = getData();
        data[currentItemId] = data[currentItemId] || { checked: false, note: '' };
        data[currentItemId].checked = checked;
        localStorage.setItem(LOCALSTORAGE, JSON.stringify(data));
        updateStatus();
    };

    // Update notes in local storage
    const updateNotes = () => {
        const notes = document.getElementById('itemNotes').value;
        const data = getData();
        data[currentItemId] = data[currentItemId] || { checked: false, note: '' };
        data[currentItemId].note = notes;
        localStorage.setItem(LOCALSTORAGE, JSON.stringify(data));
    };

   // Update status display and expand button icon
    const updateStatus = () => {
        currentItemId = getItemId();
        if (!currentItemId) {
            document.getElementById('statusDisplay').textContent = 'No item ID found';
            document.getElementById('expandButton').textContent = '🗒️'; // Default icon
            return;
        }

        const data = getData();
        const itemData = data[currentItemId] || { checked: false, note: '' };
        const checkBox = document.getElementById('checkItem');
        checkBox.checked = itemData.checked;
        document.getElementById('itemNotes').value = itemData.note;
        document.getElementById('statusDisplay').textContent = itemData.checked ? 'Checked' : 'Unchecked';

        // Update expandButton icon based on note presence or checked state
        const expandButton = document.getElementById('expandButton');
        if (itemData.note || itemData.checked) {
            expandButton.textContent = '📝'; // Icon when there's a note or checked
        } else {
            expandButton.textContent = '🗒️'; // Default icon
        }
    };




    // CSS styles for the widget
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        #itemTrackerWidget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #ffeb3b; /* Post-it yellow */
            padding: 8px;
            border-radius: 1px;
            box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.4);
            z-index: 1000;    
            color: black; /* Text color */
            font-family: sans-serif;
        }

        #itemTrackerWidget .content-collapsed {
            display: block; 
        }
        #itemTrackerWidget .content-opened {
            display: none; 
        }
        #itemTrackerWidget.active .content-collapsed {
            display: none; 
        }
        #itemTrackerWidget.active .content-opened {
            display: block; 
        }

        #expandButton {
            font-size: 16px;
        }

        #itemTrackerWidget .content-opened #collapseButton {
            float: right;
            width: 24px;
            height: 24px;
        }
        #itemTrackerWidget button {
            background: none;
            border: none;
            cursor: pointer;
        }
        #itemTrackerWidget input {
            width: 24px;
            height: 24px;
        }
        #itemTrackerWidget textarea {
            width: 100%;
            border: none;
            background: transparent;
            font-family: sans-serif;
        }

        #itemTrackerWidget small {
            opacity: 0.33;
        }
        `;
    document.head.appendChild(styleSheet);

    // Create the floating widget
    const widget = document.createElement('div');
    widget.id = 'itemTrackerWidget';
    widget.innerHTML = `
        <div class="content-collapsed">
            <button id="expandButton" title="View Notes">🗒️</button>
        </div>
        <div class="content-opened">
            <div>
                <textarea id="itemNotes" placeholder="Add notes about this page" rows="8" cols="20"></textarea>
            </div>
            <div>
                <label><input type="checkbox" id="checkItem"> Check <span id="statusDisplay"></span> </label>
            </div>
            <small>* notes are saved locally only on your browser</small>
            <button id="collapseButton" title="Collapse">▶️</button>
        </div>
    `;
    document.body.appendChild(widget);

    // Toggle UI collapse
    const toggleCollapse = () => {
        widget.classList.toggle('active');
    };

    // Event listeners
    widget.querySelector('#collapseButton').addEventListener('click', toggleCollapse);
    widget.querySelector('#expandButton').addEventListener('click', toggleCollapse);
    widget.querySelector('#checkItem').addEventListener('change', (e) => updateStorage(e.target.checked));
    widget.querySelector('#itemNotes').addEventListener('change', updateNotes);


    document.body.appendChild(widget);


    // Enhance item cards with UI elements

    // CSS styles as a template string
    const styleSheet2 = document.createElement("style");
    styleSheet2.type = "text/css";
    styleSheet2.innerText = `
        .custom-note-ui {
            position: absolute;
            top: 5px;
            right: 5px;
            display: flex;
            align-items: center;
            background: #fff17680;
            padding: 2px 5px;
            border-radius: 2px;
        }
        .custom-note-ui .note-icon {
            cursor: pointer;
        }
    `;
    document.head.appendChild(styleSheet2);

    const enhanceItemCards = () => {
        const data = getData();
        document.querySelectorAll('.notion-selectable.notion-page-block.notion-collection-item').forEach(card => {
            const link = card.querySelector('a');
            if (link) {
                const match = link.href.match(/([0-9a-f]{32})/);
                if (match) {
                    const itemId = match[0];
    
                    card.style.position = 'relative';
    
                    let ui = card.querySelector('.custom-note-ui');
                    if (ui) ui.parentElement.removeChild(ui);
    
                    // Determine the icon based on note presence or checked state
                    const itemData = data[itemId] || { checked: false, note: '' };
                    const iconText = itemData.note || itemData.checked ? '📝' : '🗒️';
    
                    // Create a temporary div
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = `
                        <div class="custom-note-ui">
                            <input type="checkbox" class="custom-checkbox" ${itemData.checked ? 'checked' : ''}>
                            <span class="note-icon">${iconText}</span>
                        </div>
                    `;
    
                    // Attach event listeners
                    const checkbox = tempDiv.querySelector('.custom-checkbox');
                    checkbox.addEventListener('change', (e) => {
                        updateStorageForCard(itemId, e.target.checked);
                    });
    
                    const icon = tempDiv.querySelector('.note-icon');
                    icon.title = itemData.note || 'No notes';
                    icon.addEventListener('click', () => {
                        alert(itemData.note); // Replace with a better UI like a modal
                    });
    
                    // Append the temporary div's contents to the card
                    card.appendChild(tempDiv.firstElementChild);
                }
            }
        });
    };
    

    // Function to update storage for a specific card
    const updateStorageForCard = (id, checked) => {
        const data = getData();
        data[id] = data[id] || { checked: false, note: '' };
        data[id].checked = checked;
        localStorage.setItem(LOCALSTORAGE, JSON.stringify(data));
    };



    // Check for URL changes
    setInterval(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            updateStatus();
            enhanceItemCards();
        }
    }, 500); // Checks every second, adjust as needed


    // Init
    setTimeout(()=> {

        lastUrl = '';

        // Initial update
        updateStatus();
        enhanceItemCards();

    }, 1000);

})();
