# Quick Start Guide - Get Your Calendar Working

## 🚀 3 Simple Steps

### Step 1: Reload the Extension (30 seconds)

1. Open Chrome and go to: `chrome://extensions/`
2. Find "WorkdayPlus" in the list
3. Click the **reload icon** (🔄 circular arrow)

### Step 2: Visit Your Workday Course List (1 minute)

1. Go to your Workday student portal
2. Navigate to your **course list** or **schedule** page
3. Open the console (Press **F12**)
4. Wait for these messages:
   ```
   [Extract] ===== COURSE DATA EXTRACTION STARTED =====
   [Extract] ✓ Extracted course 1: COSC 101
   [Extract] ✓ Extracted course 2: MATH 100
   [Extract] ✅ Course data stored successfully!
   ```

### Step 3: Open the Calendar (10 seconds)

1. Click the WorkdayPlus extension icon in Chrome toolbar
2. Click the **"Calendar"** button
3. 🎉 Your calendar should appear with your courses!

---

## ✅ What Should Happen

When everything works:

1. **Console shows extraction logs** with your course codes
2. **Calendar popup opens** with a styled weekly grid
3. **Your courses appear** at the correct times
4. **You can switch** between Term 1 and Term 2

---

## ❌ If It Doesn't Work

### Problem: "No courses found on this page"

**Solution**: The extraction script needs to be customized for your Workday page.

**Quick Fix**: Use test data for now
1. Open console (F12) on any Workday page
2. Paste this code:
```javascript
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
            }
        ],
        term2: [
            {
                courseName: "Data Structures",
                courseCode: "COSC 221",
                schedule: "MWF 11:00-12:00",
                location: "ICCS 204",
                instructor: "Dr. Williams",
                startDate: "2025-01-06",
                endDate: "2025-04-15"
            }
        ],
        metadata: {
            extractedAt: new Date().toISOString(),
            totalCourses: 3,
            termBoundaryDate: "2024-12-31"
        }
    }
}, () => console.log('✅ Test data loaded!'));
```
3. Now try opening the calendar - it should work!

**Long-term Fix**: See `EXTRACTION-SETUP.md` for how to customize the extraction script

### Problem: Calendar button does nothing

**Solution**: 
1. Make sure you're on a Workday page (`https://wd10.myworkday.com/ubc/d/*`)
2. Reload the extension
3. Refresh the Workday page
4. Check console for errors

### Problem: "No Course Data Found"

**Solution**: Data extraction didn't work or you haven't visited the course list yet
1. Use the test data code above
2. Or visit your course list page and wait for extraction
3. Or see `EXTRACTION-SETUP.md` to customize extraction

---

## 📚 More Help

- **`EXTRACTION-SETUP.md`** - Detailed guide for customizing data extraction
- **`DEBUG-CALENDAR-BUTTON.md`** - Troubleshooting the calendar button
- **`TESTING-GUIDE.md`** - How to run the test suite

---

## 🎯 Expected Result

When working correctly, your calendar should look like this:

```
┌─────────────────────────────────────────┐
│  Weekly Calendar        [Term 1] [Term 2] │
├─────┬─────┬─────┬─────┬─────┬─────┬─────┤
│Time │ Mon │ Tue │ Wed │ Thu │ Fri │     │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│09:00│     │     │     │     │     │     │
│10:00│COSC │     │COSC │     │COSC │     │
│     │ 101 │     │ 101 │     │ 101 │     │
│11:00│     │     │     │     │     │     │
│     │     │     │     │     │     │     │
│14:00│     │MATH │     │MATH │     │     │
│     │     │ 100 │     │ 100 │     │     │
└─────┴─────┴─────┴─────┴─────┴─────┴─────┘
```

With colored course cells showing:
- Course code (e.g., "COSC 101")
- Location (e.g., "ICCS 204")
- Positioned at the correct time
- Color-coded by subject

---

**Ready? Start with Step 1!** 🚀
