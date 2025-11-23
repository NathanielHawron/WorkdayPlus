/**
 * Course Data Extraction Script
 * Extracts course information from Workday course list page and stores it in Chrome storage
 */

(function() {
    console.log('[Extract] ===== COURSE DATA EXTRACTION STARTED =====');

    /**
     * Extracts course data from the Workday page
     * @returns {Array<object>} Array of course objects
     */
    function extractCourseData() {
        console.log('[Extract] Searching for course elements...');
        
        const courses = [];
        
        // Find all elements with data-automation-id="promptOption"
        const promptOptions = document.querySelectorAll('[data-automation-id="promptOption"]');
        console.log(`[Extract] Found ${promptOptions.length} prompt options`);
        
        // Group by rows - each row can have multiple promptOptions (course, section, schedule, etc.)
        const rowMap = new Map();
        
        promptOptions.forEach(option => {
            const row = option.closest('tr');
            if (!row) return;
            
            const rowId = row.getAttribute('data-row-id') || row.innerHTML;
            if (!rowMap.has(rowId)) {
                rowMap.set(rowId, []);
            }
            rowMap.get(rowId).push(option);
        });
        
        console.log(`[Extract] Found ${rowMap.size} unique rows`);
        
        let courseIndex = 0;
        rowMap.forEach((options, rowId) => {
            try {
                courseIndex++;
                console.log(`[Extract] Processing row with ${options.length} options`);
                
                let courseCode = '';
                let courseName = '';
                let schedule = '';
                let location = '';
                let startDate = '';
                let endDate = '';
                
                // Extract data from each promptOption in the row
                options.forEach(option => {
                    const text = option.textContent.trim();
                    const label = option.getAttribute('data-automation-label') || text;
                    
                    // Check for course code pattern: "COSC_O 111 - Computer Programming I"
                    const courseMatch = label.match(/^([A-Z]+_[A-Z]\s+\d+(?:-[A-Z0-9]+)?)\s*-\s*(.+)$/);
                    if (courseMatch && !courseCode) {
                        courseCode = courseMatch[1];
                        courseName = courseMatch[2];
                        console.log(`[Extract] Found course: ${courseCode} - ${courseName}`);
                    }
                    
                    // Check for schedule pattern: "2025-09-02 - 2025-11-04 | Tue | 2:00 p.m. - 4:00 p.m. | ..."
                    if (label.includes('|') && (label.includes('p.m.') || label.includes('a.m.'))) {
                        schedule = label;
                        console.log(`[Extract] Found schedule: ${schedule.substring(0, 50)}...`);
                    }
                    
                    // Check for dates
                    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
                        if (!startDate) {
                            startDate = text;
                        } else if (!endDate) {
                            endDate = text;
                        }
                    }
                });
                
                // Skip if no course code found
                if (!courseCode) {
                    return;
                }
                
                // Parse schedule to extract location
                if (schedule) {
                    const parts = schedule.split('|').map(p => p.trim());
                    if (parts.length >= 5) {
                        const building = parts[4]; // "Science Building (SCI)"
                        const room = parts.length >= 7 ? parts[6].replace('Room: ', '') : '';
                        location = room ? `${building} Room: ${room}` : building;
                    }
                }
                
                // Normalize schedule to calendar format
                const normalizedSchedule = normalizeSchedule(schedule);
                
                const course = {
                    courseCode,
                    courseName,
                    schedule: normalizedSchedule,
                    location,
                    instructor: 'TBA',
                    startDate,
                    endDate
                };
                
                courses.push(course);
                console.log(`[Extract] ✓ Extracted course ${courseIndex}:`, courseCode, normalizedSchedule);
                
            } catch (error) {
                console.error(`[Extract] ❌ Error extracting course ${courseIndex}:`, error);
            }
        });
        
        return courses;
    }

    /**
     * Converts Workday schedule format to calendar format
     * Input: "Tue | 2:00 p.m. - 4:00 p.m." or "Wed Fri | 11:00 a.m. - 12:30 p.m."
     * Output: "TR 14:00-16:00" or "WF 11:00-12:30"
     */
    function normalizeSchedule(workdaySchedule) {
        if (!workdaySchedule || workdaySchedule === 'TBA') {
            return 'TBA';
        }
        
        try {
            // Day mapping
            const dayMap = {
                'Mon': 'M', 'Monday': 'M',
                'Tue': 'T', 'Tuesday': 'T',
                'Wed': 'W', 'Wednesday': 'W',
                'Thu': 'R', 'Thursday': 'R',
                'Fri': 'F', 'Friday': 'F'
            };
            
            // Extract days and time
            const parts = workdaySchedule.split('|').map(p => p.trim());
            if (parts.length < 2) {
                return workdaySchedule; // Return as-is if can't parse
            }
            
            const daysStr = parts[0]; // "Tue" or "Wed Fri"
            const timeStr = parts[1]; // "2:00 p.m. - 4:00 p.m."
            
            // Convert days
            const days = daysStr.split(/\s+/).map(day => dayMap[day] || day).join('');
            
            // Convert time from 12-hour to 24-hour format
            const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(a\.m\.|p\.m\.)\s*-\s*(\d{1,2}):(\d{2})\s*(a\.m\.|p\.m\.)/i);
            if (!timeMatch) {
                return `${days} ${timeStr}`; // Return with days if can't parse time
            }
            
            let startHour = parseInt(timeMatch[1]);
            const startMin = timeMatch[2];
            const startPeriod = timeMatch[3].toLowerCase();
            
            let endHour = parseInt(timeMatch[4]);
            const endMin = timeMatch[5];
            const endPeriod = timeMatch[6].toLowerCase();
            
            // Convert to 24-hour
            if (startPeriod.includes('p.m.') && startHour !== 12) startHour += 12;
            if (startPeriod.includes('a.m.') && startHour === 12) startHour = 0;
            if (endPeriod.includes('p.m.') && endHour !== 12) endHour += 12;
            if (endPeriod.includes('a.m.') && endHour === 12) endHour = 0;
            
            const startTime = `${String(startHour).padStart(2, '0')}:${startMin}`;
            const endTime = `${String(endHour).padStart(2, '0')}:${endMin}`;
            
            return `${days} ${startTime}-${endTime}`;
            
        } catch (error) {
            console.error('[Extract] Error normalizing schedule:', error);
            return workdaySchedule;
        }
    }

    /**
     * Splits courses into Term 1 and Term 2 based on start dates
     * @param {Array<object>} courses - Array of course objects
     * @returns {object} Object with term1 and term2 arrays
     */
    function splitIntoTerms(courses) {
        console.log('[Extract] Splitting courses into terms...');
        
        // Determine term boundary (typically end of December)
        const currentYear = new Date().getFullYear();
        const termBoundary = new Date(`${currentYear}-12-31`);
        
        const term1 = [];
        const term2 = [];
        
        courses.forEach(course => {
            if (course.startDate) {
                try {
                    const startDate = new Date(course.startDate);
                    
                    if (startDate <= termBoundary) {
                        term1.push(course);
                    } else {
                        term2.push(course);
                    }
                } catch (error) {
                    console.warn(`[Extract] ⚠️ Could not parse date for ${course.courseCode}, adding to Term 1`);
                    term1.push(course);
                }
            } else {
                // If no start date, default to Term 1
                term1.push(course);
            }
        });
        
        console.log(`[Extract] ✓ Term 1: ${term1.length} courses`);
        console.log(`[Extract] ✓ Term 2: ${term2.length} courses`);
        
        return { term1, term2 };
    }

    /**
     * Stores course data in Chrome storage
     * @param {object} data - Course data object with term1 and term2
     */
    function storeCourseData(data) {
        console.log('[Extract] Storing course data in Chrome storage...');
        
        const storageData = {
            ...data,
            metadata: {
                extractedAt: new Date().toISOString(),
                totalCourses: data.term1.length + data.term2.length,
                termBoundaryDate: `${new Date().getFullYear()}-12-31`
            }
        };
        
        chrome.storage.local.set({ workdayPlusCourseData: storageData }, () => {
            if (chrome.runtime.lastError) {
                console.error('[Extract] ❌ Error storing data:', chrome.runtime.lastError);
            } else {
                console.log('[Extract] ✅ Course data stored successfully!');
                console.log('[Extract] Data summary:', {
                    term1Courses: data.term1.length,
                    term2Courses: data.term2.length,
                    totalCourses: storageData.metadata.totalCourses
                });
            }
        });
    }

    /**
     * Main extraction function with retry logic
     */
    function extractAndStore() {
        console.log('[Extract] Starting course extraction...');
        
        let attempts = 0;
        const maxAttempts = 5;
        
        function tryExtract() {
            attempts++;
            console.log(`[Extract] Attempt ${attempts}/${maxAttempts}...`);
            
            const courses = extractCourseData();
            
            if (courses.length === 0 && attempts < maxAttempts) {
                console.log(`[Extract] No courses found yet, retrying in 2 seconds...`);
                setTimeout(tryExtract, 2000);
                return;
            }
            
            if (courses.length === 0) {
                console.warn('[Extract] ⚠️ No courses found on this page after multiple attempts');
                console.log('[Extract] This might not be the course list page, or the page structure has changed');
                console.log('[Extract] Please make sure you are on the Workday course list page');
                return;
            }
            
            const termData = splitIntoTerms(courses);
            storeCourseData(termData);
            
            console.log('[Extract] ===== EXTRACTION COMPLETE =====');
        }
        
        // Start first attempt after initial delay
        setTimeout(tryExtract, 3000); // Wait 3 seconds for page to load
    }

    // Run extraction when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', extractAndStore);
    } else {
        extractAndStore();
    }

    // Also expose a manual extraction function
    window.extractCourseData = function() {
        console.log('[Extract] Manual extraction triggered');
        extractAndStore();
    };

})();
