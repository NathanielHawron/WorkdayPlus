// calendar/view/calendar.js

// Constants for positioning, derived from the 1:1 ratio (1 minute = 1 pixel) in style.css
const PIXELS_PER_HOUR = 60; 

// Day mapping (Simplified for English output)
const DAY_MAP = { 'Mon': 'Mon', 'Tue': 'Tue', 'Wed': 'Wed', 'Thu': 'Thu', 'Fri': 'Fri' };
// Hours to display in the grid (7am to 10pm)
const DISPLAY_HOURS = Array.from({ length: 16 }, (_, i) => i + 7); 


/**
 * Calculates the CSS 'top' pixel offset from midnight (00:00).
 * @param {string} timeStr - Course start time (HH:MM format, e.g., "08:30")
 * @returns {number} - The pixel value for the CSS 'top' property
 */
function calculatePixelOffset(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    // Total minutes elapsed since 00:00
    const totalMinutes = (hours * 60 + minutes); 
    
    // Convert total minutes to pixels (60 minutes = 60 pixels)
    const offsetInPixels = (totalMinutes / 60) * PIXELS_PER_HOUR;
    
    return offsetInPixels;
}


// Predefined colors for known subjects (matching CSS)
const KNOWN_SUBJECT_COLORS = {
    'COSC': { bg: '#e6f7ff', border: '#007bff' },
    'DATA': { bg: '#fff3e0', border: '#ff9800' },
    'MATH': { bg: '#f0fff0', border: '#4CAF50' },
    'STAT': { bg: '#e8f5e9', border: '#8bc34a' },
    'PHYS': { bg: '#fbe9e7', border: '#ff5722' },
    'CHEM': { bg: '#e0f7fa', border: '#00bcd4' },
    'BIOL': { bg: '#fce4ec', border: '#e91e63' },
    'ERTH': { bg: '#efebe9', border: '#8d6e63' },
    'ENVS': { bg: '#e0f2f1', border: '#26a69a' },
    'ASTR': { bg: '#e8eaf6', border: '#5c6bc0' },
    'CIVL': { bg: '#fff8e1', border: '#ffa726' },
    'ELEC': { bg: '#f3e5f5', border: '#9c27b0' },
    'MECH': { bg: '#e3f2fd', border: '#42a5f5' },
    'MANF': { bg: '#fce4ec', border: '#ec407a' },
    'APSC': { bg: '#f1f8e9', border: '#9ccc65' },
    'ENGR': { bg: '#ffe0e6', border: '#e91e63' },
    'PSYC': { bg: '#f3e5f5', border: '#ab47bc' },
    'PSYO': { bg: '#fafafa', border: '#9e9e9e' },
    'ECON': { bg: '#f3e5f5', border: '#673ab7' },
    'POLI': { bg: '#e1f5fe', border: '#29b6f6' },
    'HIST': { bg: '#fff3e0', border: '#ff9800' },
    'SOCI': { bg: '#f9fbe7', border: '#cddc39' },
    'PHIL': { bg: '#ede7f6', border: '#7e57c2' },
    'ANTH': { bg: '#fce4ec', border: '#f06292' },
    'GEOG': { bg: '#e8f5e9', border: '#66bb6a' },
    'MGMT': { bg: '#fffde7', border: '#ffeb3b' },
    'CRWR': { bg: '#fff9c4', border: '#fdd835' },
    'CULT': { bg: '#f1f8e9', border: '#aed581' },
    'ENGL': { bg: '#fbe0e6', border: '#f44336' },
    'ARTH': { bg: '#fce4ec', border: '#ec407a' },
    'VISA': { bg: '#e1bee7', border: '#ba68c8' },
    'MDST': { bg: '#e0f7fa', border: '#26c6da' },
    'NURS': { bg: '#ffebee', border: '#ef5350' },
    'SOCW': { bg: '#e8eaf6', border: '#5c6bc0' },
    'HKIN': { bg: '#e0f2f1', border: '#26a69a' },
    'EDUC': { bg: '#fff3e0', border: '#ffa726' }
};

// Color palette for random assignment (new subjects)
const RANDOM_COLOR_PALETTE = [
    { bg: '#e3f2fd', border: '#1976d2' },
    { bg: '#f3e5f5', border: '#7b1fa2' },
    { bg: '#e8f5e9', border: '#388e3c' },
    { bg: '#fff3e0', border: '#f57c00' },
    { bg: '#fce4ec', border: '#c2185b' },
    { bg: '#e0f2f1', border: '#00796b' },
    { bg: '#f1f8e9', border: '#689f38' },
    { bg: '#fff8e1', border: '#fbc02d' },
    { bg: '#ede7f6', border: '#512da8' },
    { bg: '#e8eaf6', border: '#303f9f' },
    { bg: '#e0f7fa', border: '#0097a7' },
    { bg: '#f9fbe7', border: '#afb42b' },
    { bg: '#efebe9', border: '#5d4037' },
    { bg: '#fbe9e7', border: '#d84315' },
    { bg: '#e1bee7', border: '#8e24aa' }
];

// Track assigned colors for new subjects
const newSubjectColorMap = new Map();
let colorIndex = 0;

/**
 * Extract base subject code (handles Lab, Seminar, Tutorial, etc.)
 * Examples: "COSC 101 Lab" -> "COSC", "DATA 301 Seminar" -> "DATA"
 */
function extractSubjectCode(title) {
    const parts = title.split(' ');
    return parts[0].toUpperCase();
}

/**
 * Get color for a subject (uses predefined colors or assigns random)
 */
function getSubjectColor(subjectCode) {
    // Check if it's a known subject
    if (KNOWN_SUBJECT_COLORS[subjectCode]) {
        return KNOWN_SUBJECT_COLORS[subjectCode];
    }
    
    // Assign random color for new subjects
    if (!newSubjectColorMap.has(subjectCode)) {
        const color = RANDOM_COLOR_PALETTE[colorIndex % RANDOM_COLOR_PALETTE.length];
        newSubjectColorMap.set(subjectCode, color);
        colorIndex++;
    }
    return newSubjectColorMap.get(subjectCode);
}

/**
 * Generates the HTML string for a single course cell, applying dynamic styling (position and color).
 * Flexible to handle various data formats from Workday parsing
 */
function createCourseCellHTML(course, offsetWithinHour = 0) {
    // 1. Extract Subject Code for CSS color-coding (e.g., "COSC" from "COSC 101 Lab")
    const title = course.title || course.name || 'Unknown Course';
    const subjectCode = extractSubjectCode(title);
    const subjectClass = `subj-${subjectCode}`; 

    // 2. Calculate Height
    const startTime = course.startTime || course.time || '09:00';
    const heightInPixels = course.duration || 60; 

    // 3. Get color for this subject (predefined or random)
    const color = getSubjectColor(subjectCode);

    // 4. Extract display information
    let displayTitle = title.split(' - ')[0]; // "COSC 101 - Intro to CS" -> "COSC 101"
    // Remove UBCO from title if present
    displayTitle = displayTitle.replace(/UBCO/gi, '');
    
    let rawLocation = course.location || course.room || '';
    
    // Remove "UBCO" from location (UBCOFIP 133 -> FIP 133)
    rawLocation = rawLocation.replace(/UBCO/gi, '');
    
    // Simplify location: "Engineering, Management and Education Building (EME) Room: 1151" -> "EME 1151"
    let shortLocation = rawLocation.trim();
    const buildingMatch = rawLocation.match(/\(([A-Z]+)\)\s*Room:\s*(\S+)/);
    if (buildingMatch) {
        shortLocation = `${buildingMatch[1]} ${buildingMatch[2]}`;
    }
    
    // Get instructional format (Lecture, Lab, Tutorial, etc.)
    let instructionalFormat = course.format || course.instructionalFormat || '';
    // Remove UBCO from format if present
    instructionalFormat = instructionalFormat.replace(/UBCO/gi, '');
    
    // Calculate end time
    const [startHour, startMin] = startTime.split(':').map(Number);
    const endMinutes = startHour * 60 + startMin + heightInPixels;
    const endHour = Math.floor(endMinutes / 60);
    const endMin = endMinutes % 60;
    const endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;
    const timeRange = `${startTime}-${endTime}`;

    // 5. Generate Inline Style (Crucial for absolute positioning)
    // Position within the hour cell (0-60 pixels based on minutes)
    const inlineStyle = `top: ${offsetWithinHour}px; height: ${heightInPixels}px; max-height: ${heightInPixels}px; background-color: ${color.bg}; border-left-color: ${color.border};`; 

    // Create tooltip with clean information
    const tooltipText = `${displayTitle}${instructionalFormat ? ' - ' + instructionalFormat : ''}\n${shortLocation}\n${timeRange}`;
    
    return `
        <div class="course-cell ${subjectClass}" style="${inlineStyle}" title="${tooltipText}">
            <div class="course-code">${displayTitle}</div>
            ${instructionalFormat ? `<div class="course-format">${instructionalFormat}</div>` : ''}
            <div class="course-location">${shortLocation}</div>
            <div class="course-time">${timeRange}</div>
        </div>
    `;
}

/**
 * Generates the base HTML structure for the 24-hour weekly timetable grid.
 */
function createCalendarGridHTML(activeTerm = 'term1') {
    const daysOfWeek = Object.keys(DAY_MAP); 

    let html = '<div class="calendar-header">';
    html += '<div class="term-tabs">';
    html += '<div class="tab-group">';
    html += `<button id="term1-tab" class="${activeTerm === 'term1' ? 'active' : ''}" data-term="term1">Term 1</button>`;
    html += `<button id="term2-tab" class="${activeTerm === 'term2' ? 'active' : ''}" data-term="term2">Term 2</button>`;
    html += '</div>';
    html += '<button id="export-to-google-btn" class="export-btn">📅 Export Calendar</button>';
    html += '</div>';
    html += '</div>';
    
    html += '<table class="calendar-grid"><tbody>';
    
    // 1. Day Header Row
    html += '<tr><th class="time-label-header">Time</th>';
    daysOfWeek.forEach(day => {
        html += `<th>${DAY_MAP[day]}</th>`;
    });
    html += '</tr>';

    // 2. Body Rows (24 rows, one for each hour)
    DISPLAY_HOURS.forEach(hour => {
        // Format as 2-digit hour (e.g., 00:00, 15:00)
        const formattedHour = String(hour).padStart(2, '0');
        const timeLabel = `${formattedHour}:00`;

        html += `<tr class="hour-row">`;
        html += `<td class="time-label">${timeLabel}</td>`; // Time label cell
        
        daysOfWeek.forEach(day => {
            // Container where courses are placed using absolute positioning.
            // Each cell has unique ID with day and hour
            html += `<td class="day-cell" id="day-${day}-${hour}" data-day="${day}" data-hour="${hour}"></td>`; 
        });
        html += '</tr>';
    });
    html += '</tbody></table>';
    
    return html;
}

/**
 * [EXPORTED]: Renders the timetable view by filtering courses based on the current week.
 * @param {Array<object>} courseData - Course data for the selected term.
 *   Expected format (flexible):
 *   {
 *     title: string (or name),        // e.g., "COSC 101 - Intro to CS" or "COSC 101 Lab"
 *     location: string (or room),     // e.g., "ICCS 204" or "Math 100"
 *     startTime: string (or time),    // e.g., "09:00" or "14:30"
 *     day: string,                    // e.g., "Mon", "Tue", "Wed", "Thu", "Fri"
 *     duration: number (optional),    // in minutes, defaults to 60
 *     week: string (optional)         // "A", "B", or "All"
 *   }
 * @param {string} currentWeek - Current week type ('A' or 'B').
 * @param {string} activeTerm - Currently active term ('term1' or 'term2').
 */
export function renderCalendar(courseData, currentWeek, activeTerm = 'term1') {
    console.log("renderCalendar called with:", courseData.length, "courses, week:", currentWeek, "term:", activeTerm);
    const container = document.getElementById('enhanced-calendar-view');
    if (!container) {
        console.error("Container 'enhanced-calendar-view' not found!");
        return;
    }

    // 1. Clear and set up the base HTML structure
    container.innerHTML = createCalendarGridHTML(activeTerm);

    // 2. Insert filtered course cells
    if (courseData && courseData.length > 0) {
        console.log("Rendering courses...");
        courseData.forEach(course => {
            const courseWeek = course.week || 'All';
            
            if (courseWeek === 'All' || courseWeek === currentWeek) {
                // Get the start hour for this course
                const startTime = course.startTime || course.time || '09:00';
                const [startHour, startMinutes] = startTime.split(':').map(Number);
                const duration = course.duration || 60;
                
                // Calculate how many hour cells this course spans
                const totalMinutes = startMinutes + duration;
                const hoursSpanned = Math.ceil(totalMinutes / 60);
                
                // For courses spanning multiple hours, we need to place them in the starting hour cell
                // but make them tall enough to extend into subsequent cells
                const dayCellId = `day-${course.day}-${startHour}`; 
                const dayContainer = document.getElementById(dayCellId);
                
                console.log(`Course: ${course.title}, Day: ${course.day}, Time: ${startTime}, Duration: ${duration}min, Spans: ${hoursSpanned} hours, Cell ID: ${dayCellId}, Found: ${!!dayContainer}`);
                
                if (dayContainer) {
                    // Calculate offset within the hour cell (0-60 pixels)
                    const offsetWithinHour = startMinutes;
                    const courseHTML = createCourseCellHTML(course, offsetWithinHour);
                    dayContainer.innerHTML += courseHTML; 
                } else {
                    console.error(`Day container not found for: ${dayCellId}`);
                }
            }
        });
    } else {
        console.error("No course data!");
    }
}

/**
 * [EXPORTED]: Sets up the term tab buttons and connects the click event handler.
 */
export function setupTermTabs(onTabClick) {
    console.log("setupTermTabs called");
    const term1Tab = document.getElementById('term1-tab');
    const term2Tab = document.getElementById('term2-tab');

    console.log("term1Tab:", term1Tab);
    console.log("term2Tab:", term2Tab);

    if (!term1Tab || !term2Tab) {
        console.error("Term tabs not found!");
        return;
    }

    function handleTabClick(event) {
        console.log("Tab clicked:", event.currentTarget.dataset.term);
        // Update UI styling
        term1Tab.classList.remove('active');
        term2Tab.classList.remove('active');
        event.currentTarget.classList.add('active');

        // Notify the partner's main script which term was clicked
        const selectedTerm = event.currentTarget.dataset.term; 
        onTabClick(selectedTerm); 
    }

    // Connect event listeners
    term1Tab.dataset.term = 'term1';
    term2Tab.dataset.term = 'term2';
    term1Tab.addEventListener('click', handleTabClick);
    term2Tab.addEventListener('click', handleTabClick);
    console.log("Event listeners attached to term tabs");
}

/**
 * [EXPORTED]: Sets up the Google Calendar export button
 */
export function setupGoogleCalendarExport(onExportClick) {
    console.log("setupGoogleCalendarExport called");
    const exportBtn = document.getElementById('export-to-google-btn');

    if (!exportBtn) {
        console.error("Export button not found!");
        return;
    }

    exportBtn.addEventListener('click', async () => {
        console.log("Export button clicked");
        exportBtn.disabled = true;
        exportBtn.textContent = '⏳ Exporting...';
        
        try {
            await onExportClick();
            exportBtn.textContent = '✅ Exported!';
            setTimeout(() => {
                exportBtn.textContent = '📅 Export Calendar';
                exportBtn.disabled = false;
            }, 3000);
        } catch (error) {
            console.error("Export failed:", error);
            exportBtn.textContent = '❌ Failed';
            setTimeout(() => {
                exportBtn.textContent = '📅 Export Calendar';
                exportBtn.disabled = false;
            }, 3000);
        }
    });
    console.log("Export button event listener attached");
}