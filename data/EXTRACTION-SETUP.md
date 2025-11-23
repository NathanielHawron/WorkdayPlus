# Course Data Extraction Setup Guide

## What Was Created

I've created `extract-courses.js` which automatically extracts course data from your Workday course list page and stores it for the calendar.

## How to Use

### Step 1: Reload the Extension

1. Go to `chrome://extensions/`
2. Find "WorkdayPlus"
3. Click the **reload** button (circular arrow)

### Step 2: Visit Your Course List Page

1. Go to your Workday student portal
2. Navigate to your **course list** or **schedule** page
3. The extraction will run automatically after 2 seconds

### Step 3: Check the Console

1. Press **F12** to open console
2. Look for messages like:
   ```
   [Extract] ===== COURSE DATA EXTRACTION STARTED =====
   [Extract] Searching for course elements...
   [Extract] Found X potential course rows
   [Extract] ✓ Extracted course 1: COSC 101
   [Extract] ✓ Term 1: X courses
   [Extract] ✓ Term 2: Y courses
   [Extract] ✅ Course data stored successfully!
   [Extract] ===== EXTRACTION COMPLETE =====
   ```

### Step 4: Open the Calendar

1. Click the extension icon
2. Click "Calendar" button
3. You should now see your courses!

## If No Courses Are Found

The extraction script uses generic selectors that might not match your Workday page structure. Here's how to customize it:

### Find the Right Selectors

1. **Open your Workday course list page**
2. **Right-click on a course name** → "Inspect"
3. **Look at the HTML structure** in DevTools
4. **Find the selectors** for:
   - Course code (e.g., "COSC 101")
   - Course name (e.g., "Introduction to Computer Science")
   - Schedule (e.g., "MWF 10:00-11:00")
   - Location (e.g., "ICCS 204")
   - Instructor name
   - Start/end dates

### Example: Finding Selectors

In the DevTools Elements tab, you might see something like:

```html
<div class="course-row">
  <span data-automation-id="course-code">COSC 101</span>
  <span data-automation-id="course-name">Intro to CS</span>
  <span data-automation-id="schedule">MWF 10:00-11:00</span>
  <span data-automation-id="location">ICCS 204</span>
</div>
```

### Update the Selectors

If the default selectors don't work, you'll need to update `extract-courses.js`:

1. Open `extract-courses.js`
2. Find the `extractCourseData()` function
3. Update the selectors on lines ~20-40 to match your page

For example, if your course code is in a `<td class="course-code-cell">`:
```javascript
const courseCodeElement = row.querySelector('td.course-code-cell');
```

## Manual Extraction

If automatic extraction doesn't work, you can trigger it manually:

1. Open console (F12) on the Workday course list page
2. Type: `extractCourseData()`
3. Press Enter

## Verify Data Was Stored

Check if data was stored successfully:

```javascript
chrome.storage.local.get('workdayPlusCourseData', (result) => {
    console.log('Stored data:', result);
});
```

You should see your courses organized into `term1` and `term2`.

## Troubleshooting

### "No courses found on this page"

**Cause**: The selectors don't match your Workday page structure

**Fix**: 
1. Inspect the page to find the correct selectors
2. Update `extract-courses.js` with the correct selectors
3. Reload the extension
4. Refresh the Workday page

### Courses extracted but schedule is "TBA"

**Cause**: The schedule selector doesn't match

**Fix**:
1. Inspect a course row to find where the schedule is
2. Update the `scheduleElement` selector in `extract-courses.js`
3. Reload and try again

### All courses go to Term 1

**Cause**: Start dates aren't being extracted

**Fix**:
1. Find where start dates are displayed on the page
2. Update the `startDateElement` selector
3. Make sure dates are in a parseable format (YYYY-MM-DD or similar)

### Need Help?

If you're having trouble finding the right selectors:

1. Take a screenshot of your Workday course list page
2. Share the HTML structure from DevTools (right-click a course → Inspect)
3. I can help you create the correct selectors

## Alternative: Manual Data Entry

If extraction is too complex, you can manually add data using the console:

```javascript
chrome.storage.local.set({
    workdayPlusCourseData: {
        term1: [
            {
                courseName: "Your Course Name",
                courseCode: "COSC 101",
                schedule: "MWF 10:00-11:00",
                location: "Room 204",
                instructor: "Dr. Smith",
                startDate: "2024-09-03",
                endDate: "2024-12-15"
            }
            // Add more courses...
        ],
        term2: [],
        metadata: {
            extractedAt: new Date().toISOString(),
            totalCourses: 1,
            termBoundaryDate: "2024-12-31"
        }
    }
});
```

## Expected Data Format

Each course should have:
- `courseCode` (required): e.g., "COSC 101"
- `courseName` (required): e.g., "Introduction to Computer Science"
- `schedule` (required): e.g., "MWF 10:00-11:00" or "TR 14:00-15:30"
- `location` (optional): e.g., "ICCS 204"
- `instructor` (optional): e.g., "Dr. Smith"
- `startDate` (optional): e.g., "2024-09-03"
- `endDate` (optional): e.g., "2024-12-15"

The `schedule` format is important:
- Days: M, T, W, R (Thursday), F
- Time: HH:MM-HH:MM (24-hour format)
- Examples: "MWF 10:00-11:00", "TR 14:00-15:30"

## Success!

Once extraction works, you should:
1. See extraction logs in console
2. Be able to open the calendar
3. See your courses displayed at the correct times
4. Be able to switch between Term 1 and Term 2

Good luck! 🎉
