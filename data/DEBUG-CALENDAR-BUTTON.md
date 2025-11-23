# Debugging: Calendar Button Not Working

## Quick Diagnostic Steps

Follow these steps to find out why the calendar button isn't working:

### Step 1: Check if you're on the right page

The extension only works on Workday pages matching:
```
https://wd10.myworkday.com/ubc/d/*
```

**Action**: Make sure you're on a Workday page (like the course list page)

### Step 2: Open Browser Console

1. Press **F12** (or **Cmd+Option+I** on Mac)
2. Go to the **Console** tab
3. Keep it open while testing

### Step 3: Reload the Extension

1. Go to `chrome://extensions/`
2. Find "WorkdayPlus"
3. Click the **reload icon** (circular arrow)
4. Go back to your Workday page
5. **Refresh the Workday page** (important!)

### Step 4: Click the Calendar Button

1. Click the extension icon in Chrome toolbar
2. Click the "Calendar" button
3. Watch the console for messages

### Step 5: Check Console Messages

You should see messages like:
```
=== MESSAGE RECEIVED === {action: "calendar"}
Calling calendar()
[Calendar] ===== CALENDAR FUNCTION CALLED =====
[Calendar] Creating calendar popup...
```

## Common Issues & Fixes

### Issue 1: "calendar function not found"

**Console shows**: `calendar function not found!`

**Fix**:
1. Go to `chrome://extensions/`
2. Click reload on WorkdayPlus
3. Refresh your Workday page
4. Try again

### Issue 2: No console messages at all

**Console shows**: Nothing when you click the button

**Fix**:
1. Make sure you're on a Workday page (`https://wd10.myworkday.com/ubc/d/*`)
2. The extension only injects scripts on Workday pages
3. Check if the page URL matches the pattern

### Issue 3: "Cannot read property 'id' of undefined"

**Console shows**: Error about `tab.id`

**Fix**:
1. Make sure you have an active Workday tab open
2. Click the extension while on the Workday page (not on a different tab)

### Issue 4: Module loading errors

**Console shows**: Errors about loading `view/ui.js` or `view/design.css`

**Fix**:
1. Check that these files exist:
   - `view/ui.js`
   - `view/design.css`
2. Reload the extension
3. Refresh the Workday page

### Issue 5: No course data

**Popup shows**: "No Course Data Found"

**Fix**:
1. This is actually working correctly!
2. You need to visit your Workday course list page first
3. The extension will extract course data automatically
4. Then try opening the calendar again

## Detailed Debugging

### Check 1: Verify Scripts Are Loaded

In the console, type:
```javascript
typeof calendar
```

**Expected**: Should return `"function"`
**If it returns** `"undefined"`: Scripts aren't loaded properly

### Check 2: Verify Chrome Storage

In the console, type:
```javascript
chrome.storage.local.get('workdayPlusCourseData', (result) => {
    console.log('Stored data:', result);
});
```

**Expected**: Should show course data if you've visited the course list
**If empty**: You need to visit the course list page first

### Check 3: Manually Test Calendar Function

In the console, type:
```javascript
calendar();
```

**Expected**: Calendar popup should open
**If error**: Check the error message for details

### Check 4: Check Message Listener

In the console, type:
```javascript
chrome.runtime.onMessage.hasListeners()
```

**Expected**: Should return `true`
**If false**: Message listener isn't set up

## Step-by-Step Test Procedure

1. **Reload everything**:
   ```
   1. Go to chrome://extensions/
   2. Reload WorkdayPlus extension
   3. Go to Workday course list page
   4. Hard refresh (Cmd+Shift+R or Ctrl+Shift+F5)
   ```

2. **Open console** (F12)

3. **Check if scripts loaded**:
   ```javascript
   console.log('calendar function:', typeof calendar);
   console.log('score function:', typeof score);
   ```
   Both should say "function"

4. **Click extension icon** → Click "Calendar" button

5. **Check console output**:
   - Should see: `=== MESSAGE RECEIVED ===`
   - Should see: `Calling calendar()`
   - Should see: `[Calendar] ===== CALENDAR FUNCTION CALLED =====`

6. **If popup doesn't appear**, check for errors in red

## What Should Happen

When working correctly:

1. You click "Calendar" button
2. Console shows:
   ```
   === MESSAGE RECEIVED === {action: "calendar"}
   Calling calendar()
   [Calendar] ===== CALENDAR FUNCTION CALLED =====
   [Calendar] Creating calendar popup...
   [Init] ===== INITIALIZING CALENDAR =====
   [Init] Step 1/5: Injecting CSS...
   [Init] ✓ CSS injection complete
   [Init] Step 2/5: Loading calendar module...
   [Init] ✓ Calendar module loaded
   [Init] Step 3/5: Retrieving course data...
   ```
3. Calendar popup appears on the page

## Still Not Working?

If you've tried all the above and it still doesn't work, please share:

1. **Console output** (copy/paste any errors)
2. **Current page URL** (are you on a Workday page?)
3. **What happens** when you click the button (nothing? error? something else?)
4. **Browser version** (Chrome version number)

Then I can help you debug further!

## Quick Fix Checklist

- [ ] I'm on a Workday page (`https://wd10.myworkday.com/ubc/d/*`)
- [ ] I've reloaded the extension at `chrome://extensions/`
- [ ] I've refreshed the Workday page
- [ ] Console is open (F12)
- [ ] I see "=== MESSAGE RECEIVED ===" when I click the button
- [ ] Files `view/ui.js` and `view/design.css` exist
- [ ] No red errors in console

If all checked and still not working, share the console output!
