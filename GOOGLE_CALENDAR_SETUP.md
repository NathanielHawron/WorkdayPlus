# Calendar Export Guide

WorkdayPlus allows you to download your course schedule as a .ics file and import it into any calendar app!

## 🎯 Features

- ✅ **No Setup Required** - Works instantly without API keys or login
- ✅ **Universal Compatibility** - Works with Google, Apple, Outlook, and all calendar apps
- ✅ **Automatic Recurring Events** - Repeats weekly until end of term
- ✅ **Timezone Support** - Automatically set to UBC timezone (America/Vancouver)
- ✅ **Color-Coded by Subject** - Each department gets a unique color

## 📥 How to Use

### Step 1: Download .ics File

1. Open the extension on your Workday calendar page
2. Select the desired term tab (Term 1 or Term 2)
3. Click **"📥 Download Calendar (.ics)"** button
4. The `ubc-schedule-term1.ics` file will be downloaded

### Step 2: Import to Your Calendar App

#### 🔵 Google Calendar

1. Go to [Google Calendar](https://calendar.google.com/)
2. Click the ⚙️ Settings icon in the top right
3. Select **"Import & export"** from the left menu
4. Click **"Select file from your computer"**
5. Choose the downloaded `.ics` file
6. Select which calendar to add to (recommend creating a new one)
7. Click **"Import"**
8. Done! 🎉

#### 🍎 Apple Calendar

1. Double-click the downloaded `.ics` file
2. Calendar app will open automatically
3. Select which calendar to add to
4. Click **"OK"**
5. Done! 🎉

#### 📧 Outlook

1. Open Outlook web or app
2. Click the 📅 Calendar icon in the bottom left
3. Select **"Add" > "Import from file"** from the top menu
4. Choose the downloaded `.ics` file
5. Done! 🎉

#### 📱 Mobile (iPhone/Android)

**Method 1: Email**
1. Email the `.ics` file to yourself
2. Open the email on your mobile device
3. Tap the attachment
4. Select "Add to Calendar"

**Method 2: Cloud Sync**
- If you import to Google/Apple Calendar, it will automatically sync to your mobile device

## ⚙️ Customizing Term Dates (Optional)

To modify the default term dates, edit the `calendar.js` file:

```javascript
const termInfo = {
    term: currentTerm,
    startDate: currentTerm === 'term1' ? '2024-09-01' : '2025-01-01',
    endDate: currentTerm === 'term1' ? '2024-12-31' : '2025-04-30'
};
```

Update with actual UBC term dates:
- **Term 1 (Fall)**: Early September ~ Mid December
- **Term 2 (Winter)**: Early January ~ End of April

## 🎨 Subject Color Coding

Once imported, courses are automatically color-coded by department:

### Sciences 🔬
- �  COSC (Computer Science) - Blue
- � DNATA (Data Science) - Orange
- 🟢 MATH (Mathematics) - Green
- 🟡 STAT (Statistics) - Light Green
- � PPHYS (Physics) - Red
- 🔵 CHEM (Chemistry) - Cyan
- 🩷 BIOL (Biology) - Pink
- 🟤 ERTH (Earth Sciences) - Brown
- 🔵 ENVS (Environmental Sciences) - Teal
- 🔵 ASTR (Astronomy) - Indigo

### Engineering ⚙️
- 🟠 CIVL (Civil Engineering) - Orange
- 🟣 ELEC (Electrical Engineering) - Purple
- 🔵 MECH (Mechanical Engineering) - Blue
- 🩷 MANF (Manufacturing Engineering) - Pink
- 🟢 APSC (Engineering Physics) - Light Green
- 🩷 ENGR (Engineering) - Pink

### Humanities & Social Sciences 🗣️
- 🟣 PSYC/PSYO (Psychology) - Purple
- 🟣 ECON (Economics) - Purple
- 🔵 POLI (Political Science) - Blue
- 🟠 HIST (History) - Orange
- 🟡 SOCI (Sociology) - Lime
- 🟣 PHIL (Philosophy) - Purple
- 🩷 ANTH (Anthropology) - Pink
- 🟢 GEOG (Geography) - Green

### Business 💰
- � MGMT r(Management) - Yellow

### Arts & Media 🎨
- � CRWR  (Creative Writing) - Yellow
- 🟢 CULT (Cultural Studies) - Light Green
- 🔴 ENGL (English) - Red
- 🩷 ARTH (Art History) - Pink
- 🟣 VISA (Visual Arts) - Purple
- 🔵 MDST (Media Studies) - Cyan

### Health & Social Development ⚕️
- 🔴 NURS (Nursing) - Red
- 🔵 SOCW (Social Work) - Indigo
- 🔵 HKIN (Health and Exercise Sciences) - Teal
- 🟠 EDUC (Education) - Orange

## ❓ Troubleshooting

### Download not working
- Check browser popup blocker settings
- Verify download folder permissions

### Events not showing in calendar
- Confirm you selected the correct calendar
- Refresh your calendar app
- Check date range (events start from term start date)

### Times are incorrect
- Verify timezone is set to `America/Vancouver`
- Check your calendar app's timezone settings

### Duplicate events
- Importing the same file multiple times creates duplicates
- Delete existing events before re-importing

## 🚀 Future Improvements

- ✅ Term tab switching
- ✅ Week A/B filtering
- 🔄 Real Workday data parsing
- 🔄 Instructor information
- 🔄 Classroom map links
- 🔄 Assignment/exam dates

---

Questions? Feel free to ask! 🎓
