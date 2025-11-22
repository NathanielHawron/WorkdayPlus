console.log("calendar.js loaded successfully");
alert("WorkdayPlus: calendar.js loaded!");

function calendar(){
    console.log("=== CALENDAR FUNCTION CALLED ===");
    console.log("Running calendar - creating popup");
    
    try {
    
    // Check if popup already exists
    if (document.getElementById('wdp-calendar-popup')) {
        console.log("Calendar popup already open");
        return;
    }
    
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.id = 'wdp-calendar-popup';
    
    // Overlay styling (full screen, centered)
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '999999';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    
    // Create popup container
    const popup = document.createElement('div');
    popup.id = 'wdp-calendar-container';
    
    // Popup styling
    popup.style.width = '90%';
    popup.style.maxWidth = '1200px';
    popup.style.height = '85%';
    popup.style.backgroundColor = '#ffffff';
    popup.style.borderRadius = '8px';
    popup.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    popup.style.display = 'flex';
    popup.style.flexDirection = 'column';
    popup.style.overflow = 'hidden';
    
    // Create header with close button
    const header = document.createElement('div');
    header.style.padding = '16px 20px';
    header.style.borderBottom = '1px solid #e0e0e0';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.backgroundColor = '#f5f5f5';
    
    const title = document.createElement('h2');
    title.textContent = 'Weekly Calendar';
    title.style.margin = '0';
    title.style.fontSize = '20px';
    title.style.fontWeight = '600';
    title.style.color = '#333';
    
    const closeButton = document.createElement('button');
    closeButton.textContent = '✕';
    closeButton.style.border = 'none';
    closeButton.style.background = 'none';
    closeButton.style.fontSize = '24px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = '#666';
    closeButton.style.padding = '0';
    closeButton.style.width = '30px';
    closeButton.style.height = '30px';
    closeButton.style.borderRadius = '4px';
    closeButton.style.transition = 'background-color 0.2s';
    
    closeButton.onmouseover = () => {
        closeButton.style.backgroundColor = '#e0e0e0';
    };
    closeButton.onmouseout = () => {
        closeButton.style.backgroundColor = 'transparent';
    };
    closeButton.onclick = () => {
        document.body.removeChild(overlay);
        console.log("Calendar popup closed");
    };
    
    header.appendChild(title);
    header.appendChild(closeButton);
    
    // Create calendar content area
    const calendarContent = document.createElement('div');
    calendarContent.id = 'enhanced-calendar-view';
    calendarContent.style.flex = '1';
    calendarContent.style.overflow = 'auto';
    calendarContent.style.padding = '20px';
    calendarContent.style.backgroundColor = '#ffffff';
    
    // Assemble popup
    popup.appendChild(header);
    popup.appendChild(calendarContent);
    overlay.appendChild(popup);
    
    // Add to page
    document.body.appendChild(overlay);
    
    // Close on overlay click (but not popup click)
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
            console.log("Calendar popup closed");
        }
    };
    
    console.log("=== CALENDAR POPUP CREATED SUCCESSFULLY ===");
    
    // Load and inject the view CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = chrome.runtime.getURL('view/design.css');
    document.head.appendChild(cssLink);
    
    // Dynamically import and render the calendar view
    import(chrome.runtime.getURL('view/ui.js'))
        .then(module => {
            console.log("View module loaded successfully");
            
            // Sample course data for testing
            const sampleCourseData = [
                { title: 'COSC 101 - Intro to CS', location: 'ICCS 204', day: 'Mon', startTime: '09:00', duration: 90, week: 'All' },
                { title: 'MATH 200 - Calculus', location: 'Math 100', day: 'Mon', startTime: '11:00', duration: 60, week: 'All' },
                { title: 'COSC 221 - Data Structures', location: 'ICCS 204', day: 'Wed', startTime: '14:00', duration: 90, week: 'A' },
                { title: 'STAT 230 - Statistics', location: 'Math 105', day: 'Fri', startTime: '10:00', duration: 60, week: 'B' }
            ];
            
            // Current state
            let currentTerm = 'term1';
            let currentWeek = 'A';
            
            // Render the calendar with sample data
            module.renderCalendar(sampleCourseData, currentWeek);
            
            // Setup term tabs
            module.setupTermTabs((term) => {
                console.log("Term selected:", term);
                currentTerm = term;
                // Re-render with new term data (for now using same sample data)
                module.renderCalendar(sampleCourseData, currentWeek);
            });
        })
        .catch(error => {
            console.error("Error loading view module:", error);
            calendarContent.innerHTML = '<p style="color: red; padding: 20px;">Error loading calendar view</p>';
        });
    
    } catch (error) {
        console.error("Error creating calendar popup:", error);
    }
}