console.log("registrationGuide.js loaded successfully");

// Add a floating button on the Workday page for easy access
function addRegistrationGuideButton() {
    // Check if button already exists
    if (document.getElementById('wdp-floating-guide-btn')) {
        return;
    }
    
    const floatingBtn = document.createElement('button');
    floatingBtn.id = 'wdp-floating-guide-btn';
    floatingBtn.textContent = '📚 Course Guide';
    floatingBtn.style.position = 'fixed';
    floatingBtn.style.bottom = '20px';
    floatingBtn.style.right = '20px';
    floatingBtn.style.zIndex = '999998';
    floatingBtn.style.padding = '12px 20px';
    floatingBtn.style.backgroundColor = '#0055b7';
    floatingBtn.style.color = '#ffffff';
    floatingBtn.style.border = 'none';
    floatingBtn.style.borderRadius = '25px';
    floatingBtn.style.fontSize = '14px';
    floatingBtn.style.fontWeight = '600';
    floatingBtn.style.cursor = 'pointer';
    floatingBtn.style.boxShadow = '0 4px 12px rgba(0, 85, 183, 0.4)';
    floatingBtn.style.transition = 'all 0.3s ease';
    
    floatingBtn.onmouseover = () => {
        floatingBtn.style.backgroundColor = '#003d82';
        floatingBtn.style.transform = 'scale(1.05)';
        floatingBtn.style.boxShadow = '0 6px 16px rgba(0, 85, 183, 0.5)';
    };
    
    floatingBtn.onmouseout = () => {
        floatingBtn.style.backgroundColor = '#0055b7';
        floatingBtn.style.transform = 'scale(1)';
        floatingBtn.style.boxShadow = '0 4px 12px rgba(0, 85, 183, 0.4)';
    };
    
    floatingBtn.onclick = () => {
        registrationGuide();
    };
    
    document.body.appendChild(floatingBtn);
    console.log("Floating registration guide button added");
}

// Add the button when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addRegistrationGuideButton);
} else {
    addRegistrationGuideButton();
}

// Global variables to track current selection
let currentFaculty = null;
let currentMajor = null;

// Save current progress to Chrome storage
function saveCurrentProgress() {
    if (currentFaculty || currentMajor) {
        const progress = {
            faculty: currentFaculty,
            major: currentMajor,
            timestamp: Date.now()
        };
        chrome.storage.local.set({ guideProgress: progress }, () => {
            console.log("Progress saved:", progress);
        });
    }
}

// Clear saved progress
function clearProgress() {
    currentFaculty = null;
    currentMajor = null;
    chrome.storage.local.remove('guideProgress', () => {
        console.log("Progress cleared");
    });
}

function registrationGuide() {
    console.log("=== REGISTRATION GUIDE FUNCTION CALLED ===");
    
    // Check if popup already exists
    if (document.getElementById('wdp-guide-popup')) {
        console.log("Registration guide popup already open");
        return;
    }
    
    // Load saved progress
    chrome.storage.local.get(['guideProgress'], (result) => {
        const savedProgress = result.guideProgress || null;
        console.log("Loaded saved progress:", savedProgress);
        createGuidePopup(savedProgress);
    });
}

function createGuidePopup(savedProgress) {
    try {
        // Create popup overlay
        const overlay = document.createElement('div');
        overlay.id = 'wdp-guide-popup';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '999999';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        
        // Create chat container - larger size for better readability
        const chatBox = document.createElement('div');
        chatBox.id = 'wdp-guide-container';
        chatBox.style.width = '650px';
        chatBox.style.height = '750px';
        chatBox.style.backgroundColor = '#ffffff';
        chatBox.style.borderRadius = '12px';
        chatBox.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        chatBox.style.display = 'flex';
        chatBox.style.flexDirection = 'column';
        chatBox.style.overflow = 'hidden';
        
        // Create header
        const header = document.createElement('div');
        header.style.padding = '16px 20px';
        header.style.borderBottom = '1px solid #e0e0e0';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.backgroundColor = '#0055b7';
        
        const title = document.createElement('h2');
        title.textContent = '📚 UBC Course Registration Guide';
        title.style.margin = '0';
        title.style.fontSize = '19px';
        title.style.fontWeight = '600';
        title.style.color = '#ffffff';
        
        const closeButton = document.createElement('button');
        closeButton.textContent = '✕';
        closeButton.style.border = 'none';
        closeButton.style.background = 'none';
        closeButton.style.fontSize = '24px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = '#ffffff';
        closeButton.style.padding = '0';
        closeButton.style.width = '30px';
        closeButton.style.height = '30px';
        closeButton.style.borderRadius = '4px';
        closeButton.style.transition = 'background-color 0.2s';
        
        closeButton.onmouseover = () => {
            closeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        };
        closeButton.onmouseout = () => {
            closeButton.style.backgroundColor = 'transparent';
        };
        closeButton.onclick = () => {
            saveCurrentProgress();
            document.body.removeChild(overlay);
            console.log("Registration guide popup closed");
        };
        
        header.appendChild(title);
        header.appendChild(closeButton);
        
        // Create chat messages area
        const messagesArea = document.createElement('div');
        messagesArea.id = 'wdp-guide-messages';
        messagesArea.style.flex = '1';
        messagesArea.style.overflowY = 'auto';
        messagesArea.style.padding = '20px';
        messagesArea.style.backgroundColor = '#f9f9f9';
        
        // Assemble chat box
        chatBox.appendChild(header);
        chatBox.appendChild(messagesArea);
        overlay.appendChild(chatBox);
        
        // Add to page
        document.body.appendChild(overlay);
        
        // Close on overlay click
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                saveCurrentProgress();
                document.body.removeChild(overlay);
                console.log("Registration guide popup closed");
            }
        };
        
        console.log("=== REGISTRATION GUIDE POPUP CREATED ===");
        
        // Start the conversation - check if we have saved progress
        if (savedProgress && savedProgress.faculty && savedProgress.major) {
            // Resume from saved progress
            console.log("Resuming from saved progress");
            addBotMessage(messagesArea, "Welcome back! I see you were looking at course requirements.");
            addBotMessage(messagesArea, `Faculty: ${savedProgress.faculty}`);
            addUserMessage(messagesArea, savedProgress.faculty);
            addBotMessage(messagesArea, `Major: ${savedProgress.major}`);
            addUserMessage(messagesArea, savedProgress.major);
            
            // Add a button to view the course plan again or start over
            const resumeContainer = document.createElement('div');
            resumeContainer.style.display = 'flex';
            resumeContainer.style.flexDirection = 'column';
            resumeContainer.style.gap = '8px';
            resumeContainer.style.marginTop = '10px';
            
            const viewAgainBtn = document.createElement('button');
            viewAgainBtn.textContent = 'View Course Plan Again';
            viewAgainBtn.style.padding = '12px 16px';
            viewAgainBtn.style.backgroundColor = '#0055b7';
            viewAgainBtn.style.color = '#ffffff';
            viewAgainBtn.style.border = 'none';
            viewAgainBtn.style.borderRadius = '8px';
            viewAgainBtn.style.cursor = 'pointer';
            viewAgainBtn.style.fontSize = '14px';
            viewAgainBtn.style.fontWeight = '600';
            viewAgainBtn.style.transition = 'background-color 0.2s';
            
            viewAgainBtn.onmouseover = () => {
                viewAgainBtn.style.backgroundColor = '#003d82';
            };
            viewAgainBtn.onmouseout = () => {
                viewAgainBtn.style.backgroundColor = '#0055b7';
            };
            
            viewAgainBtn.onclick = () => {
                resumeContainer.remove();
                // Fetch and display the course info again
                setTimeout(() => {
                    fetchAndDisplayCourseInfo(messagesArea, savedProgress.faculty, savedProgress.major);
                }, 300);
            };
            
            const startOverBtn = document.createElement('button');
            startOverBtn.textContent = 'Start Over';
            startOverBtn.style.padding = '12px 16px';
            startOverBtn.style.backgroundColor = '#ffffff';
            startOverBtn.style.color = '#0055b7';
            startOverBtn.style.border = '1px solid #0055b7';
            startOverBtn.style.borderRadius = '8px';
            startOverBtn.style.cursor = 'pointer';
            startOverBtn.style.fontSize = '14px';
            startOverBtn.style.transition = 'all 0.2s';
            
            startOverBtn.onmouseover = () => {
                startOverBtn.style.backgroundColor = '#f0f0f0';
            };
            startOverBtn.onmouseout = () => {
                startOverBtn.style.backgroundColor = '#ffffff';
            };
            
            startOverBtn.onclick = () => {
                resumeContainer.remove();
                clearProgress();
                showFacultySelection(messagesArea);
            };
            
            resumeContainer.appendChild(viewAgainBtn);
            resumeContainer.appendChild(startOverBtn);
            messagesArea.appendChild(resumeContainer);
        } else {
            // Start fresh
            showFacultySelection(messagesArea);
        }
        
    } catch (error) {
        console.error("Error creating registration guide popup:", error);
    }
}

function showFacultySelection(messagesArea) {
    // Add bot message
    addBotMessage(messagesArea, "Welcome! I'm here to help guide you through course registration. Let's start by selecting your faculty:");
    
    // Faculty options
    const faculties = [
        "Faculty of Applied Science",
        "School of Engineering",
        "Faculty of Arts and Social Sciences",
        "Faculty of Creative and Critical Studies",
        "Faculty of Education",
        "Okanagan School of Education",
        "College of Graduate Studies",
        "Faculty of Health and Social Development",
        "School of Health and Exercise Sciences",
        "School of Nursing",
        "School of Social Work",
        "Faculty of Management",
        "Faculty of Science"
    ];
    
    // Create faculty selection buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';
    buttonContainer.style.gap = '8px';
    buttonContainer.style.marginTop = '10px';
    
    faculties.forEach(faculty => {
        const button = document.createElement('button');
        button.textContent = faculty;
        button.style.padding = '12px 16px';
        button.style.backgroundColor = '#ffffff';
        button.style.border = '1px solid #0055b7';
        button.style.borderRadius = '8px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.color = '#0055b7';
        button.style.textAlign = 'left';
        button.style.transition = 'all 0.2s';
        
        button.onmouseover = () => {
            button.style.backgroundColor = '#0055b7';
            button.style.color = '#ffffff';
        };
        button.onmouseout = () => {
            button.style.backgroundColor = '#ffffff';
            button.style.color = '#0055b7';
        };
        
        button.onclick = () => {
            // Save faculty selection
            currentFaculty = faculty;
            saveCurrentProgress();
            
            // Remove all buttons
            buttonContainer.remove();
            
            // Show user selection
            addUserMessage(messagesArea, faculty);
            
            // Ask for major
            setTimeout(() => {
                showMajorSelection(messagesArea, faculty);
            }, 500);
        };
        
        buttonContainer.appendChild(button);
    });
    
    messagesArea.appendChild(buttonContainer);
}

function addBotMessage(messagesArea, text) {
    const messageDiv = document.createElement('div');
    messageDiv.style.display = 'flex';
    messageDiv.style.justifyContent = 'flex-start';
    messageDiv.style.marginBottom = '12px';
    
    const bubble = document.createElement('div');
    bubble.textContent = text;
    bubble.style.backgroundColor = '#ffffff';
    bubble.style.color = '#333';
    bubble.style.padding = '14px 18px';
    bubble.style.borderRadius = '18px';
    bubble.style.maxWidth = '85%';
    bubble.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.1)';
    bubble.style.fontSize = '15px';
    bubble.style.lineHeight = '1.6';
    bubble.style.whiteSpace = 'pre-wrap';
    bubble.style.wordBreak = 'break-word';
    
    messageDiv.appendChild(bubble);
    messagesArea.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

function addUserMessage(messagesArea, text) {
    const messageDiv = document.createElement('div');
    messageDiv.style.display = 'flex';
    messageDiv.style.justifyContent = 'flex-end';
    messageDiv.style.marginBottom = '12px';
    
    const bubble = document.createElement('div');
    bubble.textContent = text;
    bubble.style.backgroundColor = '#0055b7';
    bubble.style.color = '#ffffff';
    bubble.style.padding = '12px 16px';
    bubble.style.borderRadius = '18px';
    bubble.style.maxWidth = '80%';
    bubble.style.fontSize = '14px';
    bubble.style.lineHeight = '1.4';
    
    messageDiv.appendChild(bubble);
    messagesArea.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

function showMajorSelection(messagesArea, faculty) {
    addBotMessage(messagesArea, "Great! Now please enter your major:");
    
    // Comprehensive list of UBC Okanagan undergraduate majors
    const majorsByFaculty = {
        "Faculty of Applied Science": [
            "Civil Engineering",
            "Electrical Engineering",
            "Mechanical Engineering"
        ],
        "School of Engineering": [
            "Civil Engineering",
            "Electrical Engineering",
            "Mechanical Engineering",
            "Manufacturing Engineering"
        ],
        "Faculty of Arts and Social Sciences": [
            "Anthropology",
            "Classical Studies",
            "Economics",
            "English",
            "French",
            "Gender and Women's Studies",
            "Geography",
            "History",
            "Indigenous Studies",
            "International Relations",
            "Latin American Studies",
            "Philosophy",
            "Political Science",
            "Psychology",
            "Sociology",
            "Spanish"
        ],
        "Faculty of Creative and Critical Studies": [
            "Art History and Visual Culture",
            "Creative Writing",
            "Cultural Studies",
            "Digital Arts",
            "Media Studies",
            "Music",
            "Theatre",
            "Visual Arts"
        ],
        "Faculty of Education": [
            "Education (Elementary)",
            "Education (Secondary)",
            "Human Kinetics"
        ],
        "Okanagan School of Education": [
            "Education (Elementary)",
            "Education (Secondary)"
        ],
        "College of Graduate Studies": [
            "Graduate Studies (Various Programs)"
        ],
        "Faculty of Health and Social Development": [
            "Health and Exercise Sciences",
            "Human Kinetics",
            "Nursing",
            "Social Work"
        ],
        "School of Health and Exercise Sciences": [
            "Health and Exercise Sciences",
            "Human Kinetics"
        ],
        "School of Nursing": [
            "Nursing"
        ],
        "School of Social Work": [
            "Social Work"
        ],
        "Faculty of Management": [
            "Accounting",
            "Business Analytics",
            "Entrepreneurship",
            "Finance",
            "General Management",
            "Human Resources Management",
            "International Business",
            "Marketing",
            "Operations and Logistics",
            "Real Estate"
        ],
        "Faculty of Science": [
            "Biochemistry and Molecular Biology",
            "Biology",
            "Chemistry",
            "Computer Science",
            "Data Science",
            "Earth and Environmental Sciences",
            "Mathematics",
            "Microbiology",
            "Physics",
            "Statistics",
            "Zoology"
        ]
    };
    
    const majors = majorsByFaculty[faculty] || [];
    
    // Create input field and dropdown
    const inputContainer = document.createElement('div');
    inputContainer.style.marginTop = '10px';
    inputContainer.style.display = 'flex';
    inputContainer.style.flexDirection = 'column';
    inputContainer.style.gap = '8px';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Type your major...';
    input.style.padding = '12px';
    input.style.border = '1px solid #ccc';
    input.style.borderRadius = '8px';
    input.style.fontSize = '14px';
    input.style.width = '100%';
    input.style.boxSizing = 'border-box';
    
    const suggestionsList = document.createElement('div');
    suggestionsList.style.display = 'none';
    suggestionsList.style.flexDirection = 'column';
    suggestionsList.style.gap = '4px';
    suggestionsList.style.maxHeight = '200px';
    suggestionsList.style.overflowY = 'auto';
    suggestionsList.style.backgroundColor = '#ffffff';
    suggestionsList.style.border = '1px solid #ccc';
    suggestionsList.style.borderRadius = '8px';
    suggestionsList.style.padding = '4px';
    
    // Filter and show suggestions
    input.oninput = () => {
        const value = input.value.toLowerCase();
        suggestionsList.innerHTML = '';
        
        if (value.length > 0) {
            const filtered = majors.filter(m => m.toLowerCase().includes(value));
            
            if (filtered.length > 0) {
                suggestionsList.style.display = 'flex';
                filtered.forEach(major => {
                    const suggestion = document.createElement('div');
                    suggestion.textContent = major;
                    suggestion.style.padding = '8px 12px';
                    suggestion.style.cursor = 'pointer';
                    suggestion.style.borderRadius = '4px';
                    suggestion.style.fontSize = '14px';
                    
                    suggestion.onmouseover = () => {
                        suggestion.style.backgroundColor = '#f0f0f0';
                    };
                    suggestion.onmouseout = () => {
                        suggestion.style.backgroundColor = 'transparent';
                    };
                    suggestion.onclick = () => {
                        selectMajor(messagesArea, major, inputContainer, faculty);
                    };
                    
                    suggestionsList.appendChild(suggestion);
                });
            } else {
                suggestionsList.style.display = 'none';
            }
        } else {
            suggestionsList.style.display = 'none';
        }
    };
    
    // Submit on Enter
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && input.value.trim()) {
            selectMajor(messagesArea, input.value.trim(), inputContainer, faculty);
        }
    });
    
    inputContainer.appendChild(input);
    inputContainer.appendChild(suggestionsList);
    messagesArea.appendChild(inputContainer);
    
    // Focus input
    input.focus();
    
    // Scroll to bottom
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

function selectMajor(messagesArea, major, inputContainer, faculty) {
    // Save major selection
    currentMajor = major;
    saveCurrentProgress();
    
    // Remove input container
    inputContainer.remove();
    
    // Show user selection
    addUserMessage(messagesArea, major);
    
    // Show loading message
    setTimeout(() => {
        fetchAndDisplayCourseInfo(messagesArea, faculty, major);
    }, 500);
}

function fetchAndDisplayCourseInfo(messagesArea, faculty, major) {
    addBotMessage(messagesArea, `Perfect! Fetching course requirements for ${major}...`);
        
        // Fetch course information from UBC calendar
        chrome.runtime.sendMessage(
            {action: "fetchCourseInfo", faculty: faculty, major: major},
            (response) => {
                console.log("Fetch response:", response);
                
                if (response && response.success) {
                    console.log("Course info fetched successfully from:", response.data.url);
                    
                    // Parse the HTML to extract course requirements
                    const courseData = parseCourseRequirements(response.data.html);
                    console.log("Parsed course data:", courseData);
                    
                    // Call Nova to generate year-by-year recommendations
                    const prompt = `Based on the following program requirements for ${major} in ${faculty} at UBC Okanagan, create a detailed year-by-year course plan for a student. Break it down by Year 1, Year 2, Year 3, and Year 4, listing specific courses for each year.`;
                    
                    const context = {
                        faculty: faculty,
                        major: major,
                        url: response.data.url,
                        courseRequirements: courseData
                    };
                    
                    chrome.runtime.sendMessage(
                        {action: "callNova", prompt: prompt, context: context},
                        (novaResponse) => {
                            if (novaResponse && novaResponse.success) {
                                if (novaResponse.response.needsRealAPI) {
                                    // Fallback: Generate basic recommendations from parsed data
                                    generateCourseRecommendations(messagesArea, courseData, faculty, major);
                                } else {
                                    addBotMessage(messagesArea, novaResponse.response.message);
                                }
                            } else {
                                addBotMessage(messagesArea, "I encountered an issue connecting to the AI service. Let me provide you with the program requirements I found:");
                                generateCourseRecommendations(messagesArea, courseData, faculty, major);
                            }
                        }
                    );
                } else {
                    console.error("Failed to fetch course info:", response);
                    addBotMessage(messagesArea, `I couldn't fetch the specific course requirements. Error: ${response?.error || 'Unknown error'}`);
                    addBotMessage(messagesArea, "You can view them at: https://okanagan.calendar.ubc.ca/");
                }
            }
        );
}

function parseCourseRequirements(html) {
    // Create a temporary DOM element to parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extract course codes with multiple patterns
    const coursePattern1 = /\b[A-Z]{3,4}_O\s+\d{3}[A-Z]?\b/g;
    const coursePattern2 = /\b[A-Z]{3,4}\s+\d{3}[A-Z]?\b/g;
    
    const text = doc.body.textContent || "";
    console.log("Parsing HTML, text length:", text.length);
    
    // Try to find tables in the HTML (UBC uses tables for course requirements)
    const tables = doc.querySelectorAll('table');
    console.log("Found", tables.length, "tables in HTML");
    
    const yearSections = {
        year1: [],
        year2: [],
        year3: [],
        year4: [],
        year3and4: []
    };
    
    let currentYear = null;
    
    // Parse tables looking for year headers and course rows
    tables.forEach((table, tableIndex) => {
        const rows = table.querySelectorAll('tr');
        console.log(`Table ${tableIndex}: ${rows.length} rows`);
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td, th');
            const rowText = row.textContent.trim();
            const lowerRowText = rowText.toLowerCase();
            
            // Check if this row is a year header (be more flexible with matching)
            if (lowerRowText.match(/first\s*year/i) && !lowerRowText.includes('third') && !lowerRowText.includes('fourth')) {
                currentYear = 'year1';
                console.log("Found Year 1 header in table:", rowText.substring(0, 50));
            } else if (lowerRowText.match(/second\s*year/i)) {
                currentYear = 'year2';
                console.log("Found Year 2 header in table:", rowText.substring(0, 50));
            } else if (lowerRowText.match(/third\s+and\s+fourth\s+years?/i)) {
                currentYear = 'year3and4';
                console.log("Found Year 3&4 header in table:", rowText.substring(0, 50));
            } else if (lowerRowText.match(/third\s*year/i) && !lowerRowText.includes('fourth')) {
                currentYear = 'year3';
                console.log("Found Year 3 header in table:", rowText.substring(0, 50));
            } else if (lowerRowText.match(/fourth\s*year/i) && !lowerRowText.includes('third')) {
                currentYear = 'year4';
                console.log("Found Year 4 header in table:", rowText.substring(0, 50));
            }
            
            // Don't reset on "Minimum credits" - keep parsing until end of table
            // Only reset if we see a clear section break
            if (lowerRowText.match(/^minimum\s+credits\s+for\s+degree/i)) {
                currentYear = null;
                console.log("Reached end of program requirements");
            }
            
            // Extract courses from this row
            if (currentYear) {
                const courses1 = (rowText.match(coursePattern1) || []).map(c => c.replace('_O', ''));
                const courses2 = rowText.match(coursePattern2) || [];
                const allCourses = [...courses1, ...courses2].filter(c => c.match(/^[A-Z]{3,4}\s+\d{3}[A-Z]?$/));
                
                if (allCourses.length > 0) {
                    console.log(`Adding to ${currentYear}:`, allCourses.join(', '), `from: "${rowText.substring(0, 80)}..."`);
                    yearSections[currentYear].push(...allCourses);
                }
            }
        });
    });
    
    // If no tables found or no courses extracted, fall back to text parsing
    if (Object.values(yearSections).every(arr => arr.length === 0)) {
        console.log("No courses found in tables, falling back to text parsing");
        
        const lines = text.split('\n');
        currentYear = null;
        
        lines.forEach(line => {
            const trimmedLine = line.trim();
            const lowerLine = trimmedLine.toLowerCase();
            
            if (lowerLine.match(/first\s*year/i) && !lowerLine.includes('third') && !lowerLine.includes('fourth')) {
                currentYear = 'year1';
                console.log("Text: Detected Year 1:", trimmedLine.substring(0, 50));
            } else if (lowerLine.match(/second\s*year/i)) {
                currentYear = 'year2';
                console.log("Text: Detected Year 2:", trimmedLine.substring(0, 50));
            } else if (lowerLine.match(/third\s+and\s+fourth\s+years?/i)) {
                currentYear = 'year3and4';
                console.log("Text: Detected Year 3&4:", trimmedLine.substring(0, 50));
            } else if (lowerLine.match(/third\s*year/i) && !lowerLine.includes('fourth')) {
                currentYear = 'year3';
                console.log("Text: Detected Year 3:", trimmedLine.substring(0, 50));
            } else if (lowerLine.match(/fourth\s*year/i) && !lowerLine.includes('third')) {
                currentYear = 'year4';
                console.log("Text: Detected Year 4:", trimmedLine.substring(0, 50));
            }
            
            // Only reset at the very end
            if (lowerLine.match(/^minimum\s+credits\s+for\s+degree/i)) {
                currentYear = null;
            }
            
            if (currentYear) {
                const courses1 = (line.match(coursePattern1) || []).map(c => c.replace('_O', ''));
                const courses2 = line.match(coursePattern2) || [];
                const allCourses = [...courses1, ...courses2].filter(c => c.match(/^[A-Z]{3,4}\s+\d{3}[A-Z]?$/));
                
                if (allCourses.length > 0) {
                    yearSections[currentYear].push(...allCourses);
                }
            }
        });
    }
    
    // Remove duplicates
    Object.keys(yearSections).forEach(year => {
        yearSections[year] = [...new Set(yearSections[year])];
    });
    
    // Collect all unique courses
    const allCourses = [...new Set([
        ...yearSections.year1,
        ...yearSections.year2,
        ...yearSections.year3,
        ...yearSections.year4,
        ...yearSections.year3and4
    ])];
    
    console.log("Final year sections:", yearSections);
    console.log("Total unique courses:", allCourses.length);
    
    return {
        allCourses: allCourses,
        byYear: yearSections,
        rawText: text.substring(0, 2000)
    };
}

function generateCourseRecommendations(messagesArea, courseData, faculty, major) {
    console.log("Course data:", courseData);
    
    addBotMessage(messagesArea, `Here's a year-by-year course plan for ${major}:`);
    
    // Special handling for Computer Science to show correct structure
    if (major === "Computer Science") {
        console.log("Using Computer Science specific formatting");
        
        addBotMessage(messagesArea, `📚 Year 1 (30 credits):\n• COSC 111 or 123 (3 credits)\n• COSC 121 (3 credits)\n• ENGL 109, or two of 112, 113, 114, 150, 151, 153, 154, 155, 156, 203, CORH 203, CORH 205, APSC 176, APSC 201 (6 credits)\n• MATH 100 (3 credits)\n• MATH 101 or 103 (3 credits)\n• PHYS 111 or 112 (3 credits)\n• Electives (9 credits)`);
        
        addBotMessage(messagesArea, `📚 Year 2 (30 credits):\n• COSC 211, 221, 222 (9 credits)\n• MATH 221 (3 credits)\n• STAT 230 or STAT 205 (3 credits)\n• Electives (15 credits)`);
        
        addBotMessage(messagesArea, `📚 Years 3 & 4 (60 credits):\n• COSC 320 (3 credits)\n• COSC 304, 310, 341 (9 credits) - Must take in Year 3\n• COSC 499 (6 credits) - Must take in Year 4\n• PHIL 331 (3 credits)\n• Upper-level Computer Science electives (18 credits)\n• Upper-level electives (3 credits)\n• Electives (18 credits)`);
        
        addBotMessage(messagesArea, "💡 Important Notes:\n• COSC 304, 310, 341 must be taken in third year (prerequisites for COSC 499)\n• COSC 499 must be taken in fourth year\n• At least 12 of the 45 elective credits must be Science courses\n• Students entering 2024+ need 9 credits non-science + 3 credits from INDG 100 or ENGL 114");
        
        addBotMessage(messagesArea, "📖 Total: 120 credits for degree");
        return;
    }
    
    // Check if we have any courses at all
    if (!courseData.allCourses || courseData.allCourses.length === 0) {
        addBotMessage(messagesArea, `I couldn't extract specific course codes from the calendar page. Please visit the UBC Okanagan calendar directly for detailed course requirements.`);
        addBotMessage(messagesArea, `For ${major} in ${faculty}, typical courses include foundational courses in your first year, core major courses in years 2-3, and specialized electives in year 4.`);
        return;
    }
    
    // Check if this is a Management concentration (only has years 3-4)
    const isManagementConcentration = faculty.includes("Management") && 
                                      courseData.byYear.year1.length === 0 && 
                                      courseData.byYear.year2.length === 0 &&
                                      (courseData.byYear.year3.length > 0 || courseData.byYear.year4.length > 0 || courseData.byYear.year3and4.length > 0);
    
    if (isManagementConcentration) {
        addBotMessage(messagesArea, `📚 Years 1-2: Complete the common Bachelor of Management core courses`);
        addBotMessage(messagesArea, `Then specialize in ${major} concentration:`);
    }
    
    // If we have year-specific data, use it
    const hasYearData = courseData.byYear.year1.length > 0 || 
                        courseData.byYear.year2.length > 0 || 
                        courseData.byYear.year3.length > 0 || 
                        courseData.byYear.year4.length > 0 ||
                        courseData.byYear.year3and4.length > 0;
    
    if (hasYearData) {
        if (courseData.byYear.year1.length > 0) {
            const year1Courses = [...new Set(courseData.byYear.year1)];
            addBotMessage(messagesArea, `📚 Year 1:\n• ${year1Courses.join('\n• ')}`);
        }
        if (courseData.byYear.year2.length > 0) {
            const year2Courses = [...new Set(courseData.byYear.year2)];
            addBotMessage(messagesArea, `📚 Year 2:\n• ${year2Courses.join('\n• ')}`);
        }
        
        // Handle combined third and fourth years section
        if (courseData.byYear.year3and4.length > 0) {
            // Separate 300-level and 400-level courses
            const year3Courses = courseData.byYear.year3and4.filter(c => {
                const level = parseInt(c.match(/\d{3}/)?.[0] || '0');
                return level >= 300 && level < 400;
            });
            const year4Courses = courseData.byYear.year3and4.filter(c => {
                const level = parseInt(c.match(/\d{3}/)?.[0] || '0');
                return level >= 400;
            });
            
            // Add any explicitly marked year 3/4 courses
            if (courseData.byYear.year3.length > 0) {
                year3Courses.push(...courseData.byYear.year3);
            }
            if (courseData.byYear.year4.length > 0) {
                year4Courses.push(...courseData.byYear.year4);
            }
            
            if (year3Courses.length > 0 || year4Courses.length > 0) {
                const allYear34 = [...new Set([...year3Courses, ...year4Courses])];
                addBotMessage(messagesArea, `📚 Years 3 & 4:\n• ${allYear34.join('\n• ')}`);
            }
        } else {
            // No combined section, show year 3 and 4 separately if they exist
            if (courseData.byYear.year3.length > 0) {
                const year3Courses = [...new Set(courseData.byYear.year3)];
                addBotMessage(messagesArea, `📚 Year 3:\n• ${year3Courses.join('\n• ')}`);
            }
            if (courseData.byYear.year4.length > 0) {
                const year4Courses = [...new Set(courseData.byYear.year4)];
                addBotMessage(messagesArea, `📚 Year 4:\n• ${year4Courses.join('\n• ')}`);
            }
        }
    } else {
        // Fallback: show all courses found, distributed across years
        addBotMessage(messagesArea, `Found ${courseData.allCourses.length} courses in the program:`);
        
        const coursesPerYear = Math.ceil(courseData.allCourses.length / 4);
        for (let i = 0; i < 4; i++) {
            const yearCourses = courseData.allCourses.slice(i * coursesPerYear, (i + 1) * coursesPerYear);
            if (yearCourses.length > 0) {
                addBotMessage(messagesArea, `📚 Year ${i + 1}: ${yearCourses.join(', ')}`);
            }
        }
    }
    
    addBotMessage(messagesArea, "💡 Tip: Always check prerequisites and consult with an academic advisor to ensure you're on track!");
}
