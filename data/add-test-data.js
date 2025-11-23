/**
 * Quick script to add test data to Chrome storage
 * Run this in the console on any Workday page to add test course data
 */

console.log('Adding test course data...');

chrome.storage.local.set({
    workdayPlusCourseData: {
        term1: [
            {
                courseName: "Introduction to Computer Science",
                courseCode: "COSC 101",
                schedule: "MWF 10:00-11:00",
                location: "ICCS 204",
                instructor: "Dr. Smith",
                startDate: "2024-09-03",
                endDate: "2024-12-15"
            },
            {
                courseName: "Calculus I",
                courseCode: "MATH 100",
                schedule: "TR 14:00-15:30",
                location: "Math 100",
                instructor: "Dr. Johnson",
                startDate: "2024-09-03",
                endDate: "2024-12-15"
            },
            {
                courseName: "Data Structures",
                courseCode: "DATA 201",
                schedule: "MWF 09:00-10:00",
                location: "Lab 305",
                instructor: "Dr. Williams",
                startDate: "2024-09-03",
                endDate: "2024-12-15"
            }
        ],
        term2: [
            {
                courseName: "Algorithms",
                courseCode: "COSC 301",
                schedule: "MWF 11:00-12:00",
                location: "ICCS 204",
                instructor: "Dr. Brown",
                startDate: "2025-01-06",
                endDate: "2025-04-15"
            },
            {
                courseName: "Linear Algebra",
                courseCode: "MATH 221",
                schedule: "TR 10:00-11:30",
                location: "Math 105",
                instructor: "Dr. Davis",
                startDate: "2025-01-06",
                endDate: "2025-04-15"
            }
        ],
        metadata: {
            extractedAt: new Date().toISOString(),
            totalCourses: 5,
            termBoundaryDate: "2024-12-31"
        }
    }
}, () => {
    if (chrome.runtime.lastError) {
        console.error('❌ Error adding test data:', chrome.runtime.lastError);
    } else {
        console.log('✅ Test data added successfully!');
        console.log('Now click the Calendar button to see your courses.');
    }
});
