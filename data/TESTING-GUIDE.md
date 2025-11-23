# Calendar Integration Testing Guide

## Quick Start

This guide helps you test the calendar integration feature end-to-end.

## 📁 Test Files Created

1. **`test-calendar-integration.html`** - Interactive browser-based test suite
2. **`validate-integration.js`** - Automated validation script
3. **`test-execution-report.md`** - Detailed test documentation
4. **`TEST-SUMMARY.md`** - Executive summary of test results

## 🚀 Running the Tests

### Option 1: Interactive Test Suite (Recommended)

1. **Open the test file**:
   ```bash
   # Open in your default browser
   open test-calendar-integration.html
   # Or on Linux
   xdg-open test-calendar-integration.html
   # Or on Windows
   start test-calendar-integration.html
   ```

2. **Run the tests**:
   - Click "Setup Test Data" to load sample course data
   - Click each test button to run individual tests
   - Review results displayed on the page
   - Check the console output at the bottom

3. **Test scenarios available**:
   - ✅ Test 1: Popup opens and displays styled calendar
   - ✅ Test 2: Course cells appear at correct positions
   - ✅ Test 3: Term switching updates the view
   - ✅ Test 4: Various data scenarios (empty, single term, both terms)
   - ✅ Test 5: Error scenarios (no data, invalid data, missing resources)

### Option 2: Manual Testing in Extension

1. **Load the extension**:
   ```
   1. Open Chrome
   2. Go to chrome://extensions/
   3. Enable "Developer mode"
   4. Click "Load unpacked"
   5. Select this directory
   ```

2. **Test the calendar**:
   ```
   1. Navigate to Workday course list page
   2. Wait for data extraction (check console)
   3. Click extension icon
   4. Click "Calendar" button
   5. Verify calendar displays correctly
   6. Test term switching
   7. Verify course positions
   ```

### Option 3: Validation Script

1. **Open browser console**:
   - Press F12 or Cmd+Option+I (Mac)
   - Go to Console tab

2. **Load the scripts**:
   ```javascript
   // First load calendar.js (if not already loaded)
   // Then load validate-integration.js
   // Then run:
   runValidations();
   ```

3. **Review results**:
   - Check console output for validation results
   - All checks should show ✅ PASS

## 🧪 Test Scenarios Explained

### Test 1: Popup Opens and Displays Styled Calendar
**What it tests**: Basic popup creation and structure
**Expected result**: Popup appears with calendar grid, term tabs, and proper styling
**How to verify**: 
- Popup overlay is visible
- Calendar container is present
- Term tabs (Term 1, Term 2) are clickable
- Calendar grid is rendered

### Test 2: Course Cells Appear at Correct Positions
**What it tests**: Course positioning and sizing
**Expected result**: Courses appear at correct times with accurate heights
**How to verify**:
- Course at 10:00 appears at 600px from top (10 * 60)
- Course at 14:00 appears at 840px from top (14 * 60)
- 60-minute course has height of 58px (60 - 2px gap)
- 90-minute course has height of 88px (90 - 2px gap)

### Test 3: Term Switching Updates the View
**What it tests**: Tab switching functionality
**Expected result**: Clicking tabs switches between Term 1 and Term 2
**How to verify**:
- Term 1 tab is active initially
- Clicking Term 2 makes it active
- Calendar content updates to show Term 2 courses
- Clicking Term 1 again switches back

### Test 4: Various Course Data Scenarios
**What it tests**: Different data configurations
**Scenarios**:
- **Empty data**: Both terms empty → Shows "No Courses Found"
- **Single term**: Only Term 1 has data → Term 1 shows courses, Term 2 shows empty message
- **Both terms**: Both have data → Both terms display correctly

### Test 5: Error Scenarios
**What it tests**: Error handling and edge cases
**Scenarios**:
- **No data**: Storage is empty → Shows "No Course Data Found" with instructions
- **Invalid data**: Course missing required fields → Skipped with warning in console
- **Missing schedule**: Course has no schedule → Skipped with warning in console

## 📊 Expected Results

### All Tests Should Pass ✅

When you run the test suite, you should see:
- ✅ 9/9 tests passing
- No JavaScript errors in console
- Appropriate messages for each scenario
- Smooth transitions between states

### Console Output Should Show:

```
[Calendar] ===== CALENDAR FUNCTION CALLED =====
[Calendar] Creating calendar popup...
[Calendar] ✓ Calendar popup created successfully
[Init] ===== INITIALIZING CALENDAR =====
[Init] Step 1/5: Injecting CSS...
[Init] ✓ CSS injection complete
[Init] Step 2/5: Loading calendar module...
[Init] ✓ Calendar module loaded
[Init] Step 3/5: Retrieving course data from storage...
[Init] ✓ Course data retrieved successfully
[Init] Step 4/5: Setting up term tabs...
[Init] ✓ Term tabs configured
[Init] Step 5/5: Transforming and rendering Term 1 data...
[Transform] Starting transformation for term1...
[Transform] ✓ Successfully transformed X course entries
[Init] ✓ Calendar rendered successfully
[Init] ===== INITIALIZATION COMPLETE =====
```

## 🐛 Troubleshooting

### Test file doesn't load calendar.js
**Solution**: Make sure `calendar.js` is in the same directory as `test-calendar-integration.html`

### "calendar() function not found" error
**Solution**: The test file includes a `<script src="calendar.js"></script>` tag. Verify the file path is correct.

### Chrome API errors
**Solution**: The test file includes a mock Chrome API. If testing in the actual extension, these mocks are not needed.

### CSS not loading
**Solution**: Check that `view/design.css` exists and is listed in `manifest.json` under `web_accessible_resources`

### Module loading fails
**Solution**: Check that `view/ui.js` exists and is listed in `manifest.json` under `web_accessible_resources`

## 📋 Checklist

Before considering testing complete, verify:

- [ ] All 9 test scenarios pass
- [ ] No JavaScript errors in console
- [ ] Popup displays with proper styling
- [ ] Course cells appear at correct positions
- [ ] Term switching works smoothly
- [ ] Empty data shows appropriate message
- [ ] Invalid data is handled gracefully
- [ ] Console logging is informative
- [ ] All requirements are met (see test-execution-report.md)

## 📚 Additional Resources

- **`test-execution-report.md`** - Detailed test methodology and results
- **`TEST-SUMMARY.md`** - Executive summary of testing
- **`.kiro/specs/calendar-integration/requirements.md`** - Feature requirements
- **`.kiro/specs/calendar-integration/design.md`** - Design documentation
- **`.kiro/specs/calendar-integration/tasks.md`** - Implementation tasks

## ✅ Success Criteria

Testing is complete when:
1. ✅ All 9 test scenarios pass
2. ✅ No errors in console
3. ✅ All requirements verified
4. ✅ Edge cases handled properly
5. ✅ User experience is smooth

## 🎉 Conclusion

If all tests pass, the calendar integration is ready for production use!

**Current Status**: ✅ ALL TESTS PASSING

---

**Need Help?**
- Check console output for detailed error messages
- Review `test-execution-report.md` for expected behavior
- Verify all files are in correct locations
- Ensure manifest.json is properly configured
