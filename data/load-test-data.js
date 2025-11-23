// This script adds test data when loaded as a content script
// It will run automatically when you visit a Workday page

console.log('[TestData] Loading test course data...');

chrome.storage.local.set({
    workdayPlusCourseData: {
        term1: [
            {
                courseName: "Computer Programming I",
                courseCode: "COSC_O 111",
                schedule: "T 14:00-16:00",
                location: "Science Building (SCI) Room: 126",
                instructor: "Abdallah Mohamed",
                startDate: "2025-09-02",
                endDate: "2025-12-05"
            },
            {
                courseName: "Engineering Project Management",
                courseCode: "ENGR_O 303",
                schedule: "WF 11:00-12:30",
                location: "The Commons (COM) Room: 201",
                instructor: "Kasun Hewage",
                startDate: "2025-09-03",
                endDate: "2025-12-05"
            },
            {
                courseName: "Microelectronics I",
                courseCode: "ENGR_O 351",
                schedule: "WF 14:00-15:30",
                location: "Engineering, Management and Education Building (EME)",
                instructor: "Stephen O'Leary",
                startDate: "2025-09-03",
                endDate: "2025-12-05"
            },
            {
                courseName: "Semiconductor Devices",
                courseCode: "ENGR_O 353",
                schedule: "WF 09:30-11:00",
                location: "Library (LIB) Room: 312",
                instructor: "Stephen O'Leary",
                startDate: "2025-09-03",
                endDate: "2025-12-05"
            }
        ],
        term2: [],
        metadata: {
            extractedAt: new Date().toISOString(),
            totalCourses: 4,
            termBoundaryDate: "2025-12-31"
        }
    }
}, () => {
    if (chrome.runtime.lastError) {
        console.error('[TestData] ❌ Error:', chrome.runtime.lastError);
    } else {
        console.log('[TestData] ✅ Test course data loaded successfully!');
        console.log('[TestData] You can now click the Calendar button to see your courses.');
    }
});
