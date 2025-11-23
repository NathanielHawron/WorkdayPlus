// iCalendar (.ics) Export Module - No API keys needed!

/**
 * Format date to iCalendar format (YYYYMMDDTHHMMSS)
 */
function formatICalDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

/**
 * Convert course to iCalendar event
 */
function courseToICalEvent(course, termStartDate, termEndDate) {
    const dayMap = {
        'Mon': 'MO', 'Tue': 'TU', 'Wed': 'WE', 'Thu': 'TH', 'Fri': 'FR'
    };
    
    const dayNumMap = {
        'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5
    };

    // Calculate first occurrence date
    const startDate = new Date(termStartDate);
    const targetDay = dayNumMap[course.day];
    const currentDay = startDate.getDay() || 7;
    const daysUntilTarget = (targetDay - currentDay + 7) % 7;
    startDate.setDate(startDate.getDate() + daysUntilTarget);

    // Parse time
    const [startHour, startMinute] = course.startTime.split(':').map(Number);
    const duration = course.duration || 60;
    const endHour = Math.floor((startHour * 60 + startMinute + duration) / 60);
    const endMinute = (startHour * 60 + startMinute + duration) % 60;

    // Create start datetime
    const eventStart = new Date(startDate);
    eventStart.setHours(startHour, startMinute, 0);

    // Create end datetime
    const eventEnd = new Date(startDate);
    eventEnd.setHours(endHour, endMinute, 0);

    // Format dates for iCalendar
    const dtStart = formatICalDate(eventStart);
    const dtEnd = formatICalDate(eventEnd);
    const untilDate = formatICalDate(new Date(termEndDate));

    // Create unique ID
    const uid = `${course.title.replace(/\s+/g, '-')}-${course.day}-${course.startTime}@workdayplus`;

    // Build iCalendar event
    let icalEvent = 'BEGIN:VEVENT\r\n';
    icalEvent += `UID:${uid}\r\n`;
    icalEvent += `DTSTAMP:${formatICalDate(new Date())}\r\n`;
    icalEvent += `DTSTART;TZID=America/Vancouver:${dtStart}\r\n`;
    icalEvent += `DTEND;TZID=America/Vancouver:${dtEnd}\r\n`;
    icalEvent += `RRULE:FREQ=WEEKLY;BYDAY=${dayMap[course.day]};UNTIL=${untilDate}\r\n`;
    icalEvent += `SUMMARY:${course.title}\r\n`;
    icalEvent += `LOCATION:${course.location || ''}\r\n`;
    icalEvent += `DESCRIPTION:${course.title}\\n`;
    if (course.section) icalEvent += `Section: ${course.section}\\n`;
    if (course.instructor) icalEvent += `Instructor: ${course.instructor}`;
    icalEvent += '\r\n';
    icalEvent += 'END:VEVENT\r\n';

    return icalEvent;
}

/**
 * Export courses to .ics file
 */
export function exportToICalendar(courses, termInfo) {
    const termStartDate = new Date(termInfo.startDate || '2024-09-01');
    const termEndDate = new Date(termInfo.endDate || '2024-12-31');

    // Build iCalendar file
    let icalContent = 'BEGIN:VCALENDAR\r\n';
    icalContent += 'VERSION:2.0\r\n';
    icalContent += 'PRODID:-//WorkdayPlus//Course Schedule//EN\r\n';
    icalContent += 'CALSCALE:GREGORIAN\r\n';
    icalContent += 'METHOD:PUBLISH\r\n';
    icalContent += 'X-WR-CALNAME:UBC Course Schedule\r\n';
    icalContent += 'X-WR-TIMEZONE:America/Vancouver\r\n';
    
    // Add timezone definition
    icalContent += 'BEGIN:VTIMEZONE\r\n';
    icalContent += 'TZID:America/Vancouver\r\n';
    icalContent += 'BEGIN:STANDARD\r\n';
    icalContent += 'DTSTART:19701101T020000\r\n';
    icalContent += 'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\r\n';
    icalContent += 'TZOFFSETFROM:-0700\r\n';
    icalContent += 'TZOFFSETTO:-0800\r\n';
    icalContent += 'END:STANDARD\r\n';
    icalContent += 'BEGIN:DAYLIGHT\r\n';
    icalContent += 'DTSTART:19700308T020000\r\n';
    icalContent += 'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\r\n';
    icalContent += 'TZOFFSETFROM:-0800\r\n';
    icalContent += 'TZOFFSETTO:-0700\r\n';
    icalContent += 'END:DAYLIGHT\r\n';
    icalContent += 'END:VTIMEZONE\r\n';

    // Add all course events
    courses.forEach(course => {
        icalContent += courseToICalEvent(course, termStartDate, termEndDate);
    });

    icalContent += 'END:VCALENDAR\r\n';

    // Create and download file
    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ubc-schedule-${termInfo.term || 'term'}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log(`Exported ${courses.length} courses to .ics file`);
    return { success: courses.length, failed: 0 };
}
