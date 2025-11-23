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
    
    // Inject CSS directly as inline style
    const style = document.createElement('style');
    style.textContent = `
        .calendar-header { margin-bottom: 0; }
        .term-tabs { display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; border-bottom: 2px solid #eee; z-index: 100; gap: 8px; padding: 0 20px; }
        .tab-group { display: flex; gap: 8px; flex: 1; justify-content: center; }
        .term-tabs button { background: none; border: none; padding: 10px 20px; cursor: pointer; font-weight: 600; font-size: 16px; color: #666; transition: all 0.2s ease; border-radius: 6px 6px 0 0; position: relative; z-index: 101; }
        .term-tabs button:hover:not(.export-btn) { background-color: #f5f5f5; }
        .term-tabs button.active { color: #007bff !important; border-bottom: 3px solid #007bff !important; }
        .export-btn { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important; color: white !important; border: none !important; padding: 10px 24px !important; border-radius: 8px !important; font-weight: 600 !important; font-size: 14px !important; cursor: pointer !important; transition: all 0.3s ease !important; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4) !important; white-space: nowrap !important; border-bottom: none !important; }
        .export-btn:hover:not(:disabled) { transform: translateY(-2px) !important; box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6) !important; background: linear-gradient(135deg, #764ba2 0%, #667eea 100%) !important; }
        .export-btn:disabled { opacity: 0.6 !important; cursor: not-allowed !important; transform: none !important; }
        .calendar-grid { width: 100%; border-collapse: collapse; table-layout: fixed; position: relative; }
        .calendar-grid th, .calendar-grid td { border: 1px solid #ddd; height: 60px; padding: 0; vertical-align: middle; }
        .calendar-grid th { background-color: #f8f9fa; color: #333; text-align: center; padding: 16px 0; font-size: 18px; font-weight: 700; border-right: 2px solid #ddd; }
        .time-label { width: 100px; padding: 0; background-color: #f8f9fa; font-weight: 700; text-align: center; vertical-align: middle; font-size: 14px; color: #333; border-right: 2px solid #ddd; }
        .day-cell { position: relative; height: 60px; overflow: visible; border-right: 1px solid #e0e0e0; }
        .course-cell { position: absolute; width: calc(100% - 6px); left: 3px; z-index: 10; padding: 6px 8px; border-radius: 4px; border-left: 4px solid; box-shadow: 0 1px 3px rgba(0,0,0,0.15); color: #333; cursor: pointer; box-sizing: border-box; }
        .course-cell:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
        .course-code { font-weight: 700; font-size: 13px; margin-bottom: 2px; }
        .course-location { font-size: 11px; color: #666; }
        .subj-COSC { background-color: #e6f7ff; border-left-color: #007bff; }
        .subj-DATA { background-color: #fff3e0; border-left-color: #ff9800; }
        .subj-MATH { background-color: #f0fff0; border-left-color: #4CAF50; }
        .subj-STAT { background-color: #e8f5e9; border-left-color: #8bc34a; }
        .subj-PHYS { background-color: #fbe9e7; border-left-color: #ff5722; }
        .subj-CHEM { background-color: #e0f7fa; border-left-color: #00bcd4; }
        .subj-BIOL { background-color: #fce4ec; border-left-color: #e91e63; }
        .subj-ERTH { background-color: #efebe9; border-left-color: #8d6e63; }
        .subj-ENVS { background-color: #e0f2f1; border-left-color: #26a69a; }
        .subj-ASTR { background-color: #e8eaf6; border-left-color: #5c6bc0; }
        .subj-CIVL { background-color: #fff8e1; border-left-color: #ffa726; }
        .subj-ELEC { background-color: #f3e5f5; border-left-color: #9c27b0; }
        .subj-MECH { background-color: #e3f2fd; border-left-color: #42a5f5; }
        .subj-MANF { background-color: #fce4ec; border-left-color: #ec407a; }
        .subj-APSC { background-color: #f1f8e9; border-left-color: #9ccc65; }
        .subj-ENGR { background-color: #ffe0e6; border-left-color: #e91e63; }
        .subj-PSYC { background-color: #f3e5f5; border-left-color: #ab47bc; }
        .subj-PSYO { background-color: #fafafa; border-left-color: #9e9e9e; }
        .subj-ECON { background-color: #f3e5f5; border-left-color: #673ab7; }
        .subj-POLI { background-color: #e1f5fe; border-left-color: #29b6f6; }
        .subj-HIST { background-color: #fff3e0; border-left-color: #ff9800; }
        .subj-SOCI { background-color: #f9fbe7; border-left-color: #cddc39; }
        .subj-PHIL { background-color: #ede7f6; border-left-color: #7e57c2; }
        .subj-ANTH { background-color: #fce4ec; border-left-color: #f06292; }
        .subj-GEOG { background-color: #e8f5e9; border-left-color: #66bb6a; }
        .subj-MGMT { background-color: #fffde7; border-left-color: #ffeb3b; }
        .subj-CRWR { background-color: #fff9c4; border-left-color: #fdd835; }
        .subj-CULT { background-color: #f1f8e9; border-left-color: #aed581; }
        .subj-ENGL { background-color: #fbe0e6; border-left-color: #f44336; }
        .subj-ARTH { background-color: #fce4ec; border-left-color: #ec407a; }
        .subj-VISA { background-color: #e1bee7; border-left-color: #ba68c8; }
        .subj-MDST { background-color: #e0f7fa; border-left-color: #26c6da; }
        .subj-NURS { background-color: #ffebee; border-left-color: #ef5350; }
        .subj-SOCW { background-color: #e8eaf6; border-left-color: #5c6bc0; }
        .subj-HKIN { background-color: #e0f2f1; border-left-color: #26a69a; }
        .subj-EDUC { background-color: #fff3e0; border-left-color: #ffa726; }
    `;
    document.head.appendChild(style);
    
    // Dynamically import and render the calendar view
    Promise.all([
        import(chrome.runtime.getURL('view/ui.js')),
        import(chrome.runtime.getURL('view/googleCalendar.js'))
    ]).then(([uiModule, icalModule]) => {
            console.log("View module loaded successfully");
            
            // Sample course data for Term 1
            const term1Data = [
                { title: 'COSC 101 - Intro to CS', location: 'ICCS 204', day: 'Mon', startTime: '09:00', duration: 90, week: 'All' },
                { title: 'MATH 200 - Calculus I', location: 'Math 100', day: 'Mon', startTime: '11:00', duration: 60, week: 'All' },
                { title: 'PHYS 111 - Physics I', location: 'Hennings 201', day: 'Tue', startTime: '10:00', duration: 90, week: 'All' },
                { title: 'STAT 230 - Statistics', location: 'Math 105', day: 'Tue', startTime: '14:00', duration: 60, week: 'All' },
                { title: 'COSC 221 - Data Structures', location: 'ICCS 204', day: 'Wed', startTime: '09:00', duration: 90, week: 'All' },
                { title: 'ENGR 101 - Engineering Design', location: 'MCML 166', day: 'Thu', startTime: '13:00', duration: 120, week: 'All' },
                { title: 'MATH 200 - Tutorial', location: 'Math 102', day: 'Fri', startTime: '10:00', duration: 60, week: 'All' }
            ];
            
            // Sample course data for Term 2
            const term2Data = [
                { title: 'COSC 222 - Algorithms', location: 'ICCS 204', day: 'Mon', startTime: '10:00', duration: 90, week: 'All' },
                { title: 'DATA 301 - Data Science', location: 'ICCS 206', day: 'Mon', startTime: '14:00', duration: 90, week: 'All' },
                { title: 'MATH 221 - Calculus II', location: 'Math 100', day: 'Tue', startTime: '09:00', duration: 60, week: 'All' },
                { title: 'CHEM 121 - Chemistry', location: 'Chem D200', day: 'Wed', startTime: '11:00', duration: 90, week: 'All' },
                { title: 'STAT 231 - Statistics II', location: 'Math 105', day: 'Thu', startTime: '10:00', duration: 60, week: 'All' },
                { title: 'ENGR 202 - Engineering', location: 'MCML 166', day: 'Thu', startTime: '14:00', duration: 120, week: 'All' },
                { title: 'DATA 301 - Lab', location: 'ICCS 208', day: 'Fri', startTime: '13:00', duration: 90, week: 'All' }
            ];
            
            // Current state
            let currentTerm = 'term1';
            let currentWeek = 'A';
            
            // Get current term data
            function getCurrentData() {
                return currentTerm === 'term1' ? term1Data : term2Data;
            }
            
            // Render the calendar with initial data
            uiModule.renderCalendar(getCurrentData(), currentWeek, currentTerm);
            
            // Function to setup tabs (will be called after each render)
            function setupTabs() {
                console.log("Setting up term tabs...");
                uiModule.setupTermTabs((term) => {
                    console.log("Term selected:", term);
                    currentTerm = term;
                    // Re-render with new term data
                    uiModule.renderCalendar(getCurrentData(), currentWeek, currentTerm);
                    // Re-attach event listeners after re-render
                    setTimeout(setupTabs, 50);
                    setTimeout(setupExport, 50);
                });
                console.log("Term tabs setup complete");
            }
            
            // Function to setup calendar export
            function setupExport() {
                console.log("Setting up calendar export...");
                uiModule.setupGoogleCalendarExport(async () => {
                    try {
                        // Get term info (adjust dates as needed)
                        const termInfo = {
                            term: currentTerm,
                            startDate: currentTerm === 'term1' ? '2024-09-01' : '2025-01-01',
                            endDate: currentTerm === 'term1' ? '2024-12-31' : '2025-04-30'
                        };
                        
                        const results = icalModule.exportToICalendar(getCurrentData(), termInfo);
                        
                        alert(`✅ Downloaded ${results.success} courses!\n\nImport the .ics file to:\n• Google Calendar\n• Apple Calendar\n• Outlook\n• Any calendar app`);
                    } catch (error) {
                        console.error("Export error:", error);
                        alert('❌ Failed to export calendar. Please check console for details.');
                    }
                });
                console.log("Calendar export setup complete");
            }
            
            // Initial setup
            setTimeout(setupTabs, 100);
            setTimeout(setupExport, 100);
        })
        .catch(error => {
            console.error("Error loading view module:", error);
            calendarContent.innerHTML = '<p style="color: red; padding: 20px;">Error loading calendar view</p>';
        });
    
    } catch (error) {
        console.error("Error creating calendar popup:", error);
    }
}