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

    // Update status display
    const updateStatus = () => {
        currentItemId = getItemId();
        if (!currentItemId) {
            document.getElementById('statusDisplay').textContent = 'No item ID found';
            return;
        }

        const data = getData();
        const itemData = data[currentItemId] || { checked: false, note: '' };
        const checkBox = document.getElementById('checkItem');
        checkBox.checked = itemData.checked;
        document.getElementById('itemNotes').value = itemData.note;
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
        }
        #itemTrackerWidget button {
            background: none;
            border: none;
            cursor: pointer;
        }
        #itemTrackerWidget textarea {
            width: 100%;
            border: 1px solid #ccc;
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
                📝 Page Notes <button id="collapseButton" title="Collapse">▶️</button>
            </div>
            <div>
                <label><input type="checkbox" id="checkItem"> Check <span id="statusDisplay"></span> </label>
            </div>
            <div>
                <textarea id="itemNotes" placeholder="Notes about this page" rows="8" cols="20"></textarea>
            </div>
            <small>* notes are saved only locally on your browser</small>
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
    widget.querySelector('#itemNotes').addEventListener('input', updateNotes);


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
            background: grey;
            padding: 2px 5px;
            border-radius: 2px;
        }
        .custom-note-ui .note-icon {
            cursor: help;
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

                    // Create a temporary div
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = `
                    <div class="custom-note-ui">
                        <input type="checkbox" class="custom-checkbox" ${data[itemId]?.checked ? 'checked' : ''}>
                        <span class="note-icon">📝</span>
                    </div>
                `;

                    // Attach event listeners
                    const checkbox = tempDiv.querySelector('.custom-checkbox');
                    checkbox.addEventListener('change', (e) => {
                        updateStorageForCard(itemId, e.target.checked);
                    });

                    const icon = tempDiv.querySelector('.note-icon');
                    icon.title = data[itemId]?.note || 'No notes';
                    icon.addEventListener('click', () => {
                        alert(data[itemId].note); // Replace with a better UI like a modal
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

    // Initial update
    updateStatus();
    enhanceItemCards();

})();
