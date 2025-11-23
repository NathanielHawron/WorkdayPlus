/**
 * Integration Validation Script
 * This script validates that all integration points are correctly implemented
 */

console.log('=== Calendar Integration Validation ===\n');

// Validation checks
const validations = [];

// 1. Check if calendar function exists
function validateCalendarFunction() {
    if (typeof calendar === 'function') {
        validations.push({ name: 'calendar() function', status: 'PASS', message: 'Function exists' });
        return true;
    } else {
        validations.push({ name: 'calendar() function', status: 'FAIL', message: 'Function not found' });
        return false;
    }
}

// 2. Check if helper functions exist
function validateHelperFunctions() {
    const functions = [
        'injectCalendarCSS',
        'loadCalendarModule',
        'getStoredCourseData',
        'parseSchedule',
        'calculateDuration',
        'extractDayOfWeek',
        'mapWeekFormat',
        'transformCourseData',
        'handleTermSwitch',
        'initializeCalendar'
    ];
    
    functions.forEach(funcName => {
        if (typeof window[funcName] === 'function' || typeof eval(funcName) === 'function') {
            validations.push({ name: `${funcName}()`, status: 'PASS', message: 'Function exists' });
        } else {
            validations.push({ name: `${funcName}()`, status: 'FAIL', message: 'Function not found' });
        }
    });
}

// 3. Validate parseSchedule function
function validateParseSchedule() {
    console.log('\n--- Testing parseSchedule() ---');
    
    const testCases = [
        { input: 'MWF 10:00-11:00', expected: 3, description: 'Consecutive days format' },
        { input: 'TR 14:00-15:30', expected: 2, description: 'Two days format' },
        { input: 'Mon/Wed/Fri 09:00-10:00', expected: 3, description: 'Separated days format' },
        { input: '', expected: 0, description: 'Empty string' },
        { input: null, expected: 0, description: 'Null value' },
        { input: 'Invalid', expected: 0, description: 'Invalid format' }
    ];
    
    testCases.forEach(test => {
        try {
            const result = parseSchedule(test.input);
            const pass = result.length === test.expected;
            validations.push({
                name: `parseSchedule("${test.input}")`,
                status: pass ? 'PASS' : 'FAIL',
                message: `${test.description}: Expected ${test.expected} entries, got ${result.length}`
            });
        } catch (error) {
            validations.push({
                name: `parseSchedule("${test.input}")`,
                status: 'ERROR',
                message: `${test.description}: ${error.message}`
            });
        }
    });
}

// 4. Validate calculateDuration function
function validateCalculateDuration() {
    console.log('\n--- Testing calculateDuration() ---');
    
    const testCases = [
        { start: '10:00', end: '11:00', expected: 60 },
        { start: '14:00', end: '15:30', expected: 90 },
        { start: '09:00', end: '10:00', expected: 60 },
        { start: '08:30', end: '10:00', expected: 90 }
    ];
    
    testCases.forEach(test => {
        try {
            const result = calculateDuration(test.start, test.end);
            const pass = result === test.expected;
            validations.push({
                name: `calculateDuration("${test.start}", "${test.end}")`,
                status: pass ? 'PASS' : 'FAIL',
                message: `Expected ${test.expected} minutes, got ${result}`
            });
        } catch (error) {
            validations.push({
                name: `calculateDuration("${test.start}", "${test.end}")`,
                status: 'ERROR',
                message: error.message
            });
        }
    });
}

// 5. Validate transformCourseData function
function validateTransformCourseData() {
    console.log('\n--- Testing transformCourseData() ---');
    
    const testData = {
        term1: [
            {
                courseName: "Test Course",
                courseCode: "TEST 101",
                location: "Room 101",
                schedule: "MWF 10:00-11:00"
            }
        ],
        term2: []
    };
    
    try {
        const result = transformCourseData(testData, 'term1');
        const pass = result.length === 3; // Should create 3 entries (M, W, F)
        validations.push({
            name: 'transformCourseData()',
            status: pass ? 'PASS' : 'FAIL',
            message: `Expected 3 course entries (MWF), got ${result.length}`
        });
        
        if (result.length > 0) {
            const firstEntry = result[0];
            const hasRequiredFields = 
                firstEntry.title &&
                firstEntry.day &&
                firstEntry.startTime &&
                firstEntry.duration &&
                firstEntry.location &&
                firstEntry.week;
            
            validations.push({
                name: 'transformCourseData() - output format',
                status: hasRequiredFields ? 'PASS' : 'FAIL',
                message: hasRequiredFields ? 'All required fields present' : 'Missing required fields'
            });
        }
    } catch (error) {
        validations.push({
            name: 'transformCourseData()',
            status: 'ERROR',
            message: error.message
        });
    }
}

// 6. Validate manifest.json configuration
function validateManifest() {
    console.log('\n--- Validating manifest.json ---');
    
    // This would need to be loaded separately in a real test
    // For now, we'll just note that it should be checked
    validations.push({
        name: 'manifest.json - web_accessible_resources',
        status: 'INFO',
        message: 'Manually verify view/design.css and view/ui.js are listed'
    });
}

// Run all validations
function runValidations() {
    console.log('Starting validation...\n');
    
    validateCalendarFunction();
    validateHelperFunctions();
    validateParseSchedule();
    validateCalculateDuration();
    validateTransformCourseData();
    validateManifest();
    
    // Print results
    console.log('\n=== Validation Results ===\n');
    
    let passCount = 0;
    let failCount = 0;
    let errorCount = 0;
    let infoCount = 0;
    
    validations.forEach(v => {
        const icon = v.status === 'PASS' ? '✅' : 
                     v.status === 'FAIL' ? '❌' : 
                     v.status === 'ERROR' ? '⚠️' : 'ℹ️';
        
        console.log(`${icon} ${v.name}: ${v.message}`);
        
        if (v.status === 'PASS') passCount++;
        else if (v.status === 'FAIL') failCount++;
        else if (v.status === 'ERROR') errorCount++;
        else infoCount++;
    });
    
    console.log('\n=== Summary ===');
    console.log(`Total: ${validations.length}`);
    console.log(`✅ Passed: ${passCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`⚠️ Errors: ${errorCount}`);
    console.log(`ℹ️ Info: ${infoCount}`);
    
    const allPassed = failCount === 0 && errorCount === 0;
    console.log(`\nOverall Status: ${allPassed ? '✅ ALL VALIDATIONS PASSED' : '❌ SOME VALIDATIONS FAILED'}`);
    
    return allPassed;
}

// Export for use in test environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runValidations };
}

// Auto-run if loaded in browser
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        console.log('Validation script loaded. Call runValidations() to start.');
    });
}
