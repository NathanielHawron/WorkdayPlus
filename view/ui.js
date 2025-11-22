// calendar/view/calendar.js

// Constants for positioning, derived from the 1:1 ratio (1 minute = 1 pixel) in style.css
const PIXELS_PER_HOUR = 60; 

// Day mapping (Simplified for English output)
const DAY_MAP = { 'Mon': 'Mon', 'Tue': 'Tue', 'Wed': 'Wed', 'Thu': 'Thu', 'Fri': 'Fri' };
// Hours to display in the grid (0 to 23)
const DISPLAY_HOURS = Array.from({ length: 24 }, (_, i) => i); 


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


/**
 * Generates the HTML string for a single course cell, applying dynamic styling (position and color).
 */
function createCourseCellHTML(course) {
    // 1. Extract Subject Code for CSS color-coding (e.g., "COSC")
    const subjectCode = course.title.split(' ')[0].toUpperCase(); 
    const subjectClass = `subj-${subjectCode}`; 

    // 2. Calculate Position and Height
    const topOffset = calculatePixelOffset(course.startTime); 
    const heightInPixels = course.duration || 60; 

    // 3. Generate Inline Style (Crucial for absolute positioning)
    // -4px creates a small separation gap between cells and prevents overflow
    const inlineStyle = `top: ${topOffset}px; height: ${heightInPixels - 4}px; max-height: ${heightInPixels - 4}px;`; 

    return `
        <div class="course-cell ${subjectClass}" style="${inlineStyle}">
            <div class="course-code">${course.title.split(' - ')[0]}</div>
            <div class="course-location">${course.location}</div>
        </div>
    `;
}

/**
 * Generates the base HTML structure for the 24-hour weekly timetable grid.
 */
function createCalendarGridHTML() {
    const daysOfWeek = Object.keys(DAY_MAP); 

    let html = '<div class="term-tabs">';
    html += '<button id="term1-tab" class="active" data-term="term1">Term 1</button>';
    html += '<button id="term2-tab" data-term="term2">Term 2</button>';
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
            html += `<td class="day-cell" id="day-${day}"></td>`; 
        });
        html += '</tr>';
    });
    html += '</tbody></table>';
    
    return html;
}

/**
 * [EXPORTED]: Renders the timetable view by filtering courses based on the current week.
 * @param {Array<object>} courseData - Course data for the selected term.
 * @param {string} currentWeek - Current week type ('A' or 'B').
 */
export function renderCalendar(courseData, currentWeek) {
    const container = document.getElementById('enhanced-calendar-view');
    if (!container) return; 

    // 1. Clear and set up the base HTML structure
    container.innerHTML = createCalendarGridHTML();

    // 2. Insert filtered course cells
    if (courseData && courseData.length > 0) {
        courseData.forEach(course => {
            const courseWeek = course.week || 'All'; // Assume 'All' if week property is missing
            
            // A/B WEEK FILTERING LOGIC
            // Render only if the course is every week ('All') OR if the course week matches the current week
            if (courseWeek === 'All' || courseWeek === currentWeek) {
                const dayCellId = `day-${course.day}`; 
                const dayContainer = document.getElementById(dayCellId);
                
                if (dayContainer) {
                    const courseHTML = createCourseCellHTML(course);
                    dayContainer.innerHTML += courseHTML; 
                }
            }
        });
    }
}

/**
 * [EXPORTED]: Sets up the term tab buttons and connects the click event handler.
 */
export function setupTermTabs(onTabClick) {
    const term1Tab = document.getElementById('term1-tab');
    const term2Tab = document.getElementById('term2-tab');

    if (!term1Tab || !term2Tab) return; 

    function handleTabClick(event) {
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
}