(function () {
    'use strict';

    const LOCALSTORAGE = 'LOCALNOTES_WIDGET';

    let lastUrl = location.href;
    let currentItemId = null;

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
    const updateStatus = (checked) => {
        if (!currentItemId) return;

        const data = getData();
        data[currentItemId] = data[currentItemId] || { checked: false, note: '' };
        data[currentItemId].checked = checked;
        localStorage.setItem(LOCALSTORAGE, JSON.stringify(data));
    };

    // Update notes in local storage
    const updateNotes = () => {
        if (!currentItemId) return;

        const data = getData();
        const notes = document.getElementById('itemNotes').value;
        data[currentItemId] = data[currentItemId] || { checked: false, note: '' };
        data[currentItemId].note = notes;
        localStorage.setItem(LOCALSTORAGE, JSON.stringify(data));
    };

   // Update status display and expand button icon
    const updateWidget = () => {

        currentItemId = getItemId();
        const url = new URL(window.location.href);
        const isDatabaseIndex = url.searchParams.has('v') && !url.searchParams.has('p'); // page (has 'v=' but not 'p=')
    
        // Hide the widget if it's a database index or doesnt have id
        if (isDatabaseIndex || !currentItemId) {
            widget.style.display = 'none';
            return;
        } else {
            widget.style.display = 'block'; // Show widget for other pages
        }

        const data = getData();
        const itemData = data[currentItemId] || { checked: false, note: '' };
        const checkBox = document.getElementById('checkItem');
        checkBox.checked = itemData.checked;
        document.getElementById('itemNotes').value = itemData.note;
        document.getElementById('statusDisplay').textContent = itemData.checked ? 'Checked' : 'Unchecked';

        // Update expandButton icon based on note presence or checked state
        const expandButton = document.getElementById('expandButton');
        if (itemData.note) {
            expandButton.textContent = '📝'; // Icon when there's a note or checked
            expandButton.title = 'This page has notes, click to read them';
        } else {
            expandButton.textContent = '🗒️'; // Default icon
            expandButton.title = 'Click to add notes to this page';
        }

        if (itemData.note || itemData.checked) widget.classList.add('active'); // auto open if it has stuff
    };

    // CSS styles for the widget
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        #itemTrackerWidget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: rgba(255, 241, 118, 0.75); /* Post-it yellow */
            padding: 8px;
            border-radius: 1px;
            box-shadow: 3px 4px 5px rgba(128, 128, 128, 0.5);
            z-index: 1000;    
            color: black;
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
        #itemTrackerWidget input[type="checkbox"] {
            vertical-align: middle;
            width: 24px;
            height: 24px;
        }
        #itemTrackerWidget textarea {
            width: 100%;
            border: none;
            background: transparent;
            font-family: sans-serif;
        }

        #itemTrackerWidget footer {
            text-align: right;
        }
        
        #itemTrackerWidget footer small {
            opacity: 0.33;
            font-size: 9pt;
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
            <div style="display:flex; flex-direction: row;">
                <label><input type="checkbox" id="checkItem"><span id="statusDisplay" style="display:none;"></span></label>
                <textarea id="itemNotes" placeholder="Add notes to this page" rows="8" cols="20"></textarea>
            </div>
            <footer>
                <small>* Notes are saved locally on your browser</small>
                <button id="helpButton" title="Help"> ? </button>
                <button id="collapseButton" title="Hide"> 🔽 </button>
            </footer>
        </div>
    `;
    
    // Event listeners
    widget.querySelector('#checkItem').addEventListener('change', (e) => updateStatus(e.target.checked));
    widget.querySelector('#itemNotes').addEventListener('input', updateNotes);
    // Toggle UI collapse
    const toggleCollapse = () => widget.classList.toggle('active');
    widget.querySelector('#collapseButton').addEventListener('click', toggleCollapse);
    widget.querySelector('#expandButton').addEventListener('click', toggleCollapse);
    widget.querySelector('#helpButton').addEventListener('click', () => alert('You can use this widget to take notes about any information on this website, and you can use it for tracking items as you work on the project.\nIt Works on any page on the entire website.\nAll the information is only stored locally on your browser. Clearing your browser history deletes this data.'));


    document.body.appendChild(widget);


    // Enhance item cards with UI elements
    const styleSheet2 = document.createElement("style");
    styleSheet2.type = "text/css";
    styleSheet2.innerText = `
        .custom-note-ui {
            position: absolute;
            top: 5px;
            left: 5px;
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

    // Function to update storage for a specific card
    const updateStatusForCard = (id, checked) => {
        const data = getData();
        data[id] = data[id] || { checked: false, note: '' };
        data[id].checked = checked;
        localStorage.setItem(LOCALSTORAGE, JSON.stringify(data));
    };

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
    
                    // Create a temporary div
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = `
                        <div class="custom-note-ui">
                            <label>
                                <input type="checkbox" class="custom-checkbox" ${itemData.checked ? 'checked' : ''}>
                                <span class="note-icon" title="itemData.note ? 'This item has notes' : 'No notes'">${itemData.note ? '📝' : ''}</span>
                            </label>
                        </div>
                    `;
    
                    // Attach event listeners
                    const checkbox = tempDiv.querySelector('.custom-checkbox');
                    checkbox.addEventListener('change', (e) => {
                        updateStatusForCard(itemId, e.target.checked);
                    });
    
                    const icon = tempDiv.querySelector('.note-icon');
                    icon.title = itemData.note || 'No notes';
                    icon.addEventListener('click', () => {
                        //alert('Notes:\n' + itemData.note); // Replace with a better UI like a modal
                    });
    
                    // Append the temporary div's contents to the card
                    card.appendChild(tempDiv.firstElementChild);
                }
            }
        });
    };



    function openDataWindow() {
    const dataWindow = window.open('', '_blank', 'width=600,height=600');
    const data = getData();
    const dataString = JSON.stringify(data, null, 2);

    dataWindow.document.write('<pre>' + dataString + '</pre>');
    dataWindow.document.write('<button id="exportData">Export</button>');
    dataWindow.document.write('<input type="file" id="importData" style="display:none;" accept=".json"/>');
    dataWindow.document.write('<button id="importButton">Import</button>');
    dataWindow.document.close();

    // Export functionality
    dataWindow.document.getElementById('exportData').onclick = function() {
        const blob = new Blob([dataString], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = dataWindow.document.createElement('a');
        a.href = url;
        a.download = 'exported_data.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    // Import functionality
    const importInput = dataWindow.document.getElementById('importData');
    dataWindow.document.getElementById('importButton').onclick = function() {
        importInput.click();
    };

    importInput.onchange = e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    localStorage.setItem(LOCALSTORAGE, JSON.stringify(importedData));
                    alert('Data imported successfully.');
                    // Refresh data view
                    dataWindow.location.reload();
                } catch (error) {
                    alert('Error parsing the imported file. Please ensure it is a valid JSON file.');
                }
            };
            reader.readAsText(file);
        }
    };
}

// Add a button in the floating widget for managing data
const manageDataButton = document.createElement('button');
manageDataButton.textContent = 'Manage Data';
manageDataButton.addEventListener('click', openDataWindow);
widget.querySelector('.content-opened').appendChild(manageDataButton);



    // Check for URL changes
    setInterval(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            console.log('URL Changed! Refreshing notes.');
            updateWidget();
            enhanceItemCards();
        }
    }, 1000); // Checks every second, adjust as needed


    // Init when loading takes longer
    setTimeout(() => {
        lastUrl = '';
    }, 5000);

})();
