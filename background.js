// Background script to handle API calls and avoid CORS issues

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fetchCourseInfo") {
        fetchCourseInfo(message.faculty, message.major)
            .then(data => sendResponse({success: true, data: data}))
            .catch(error => sendResponse({success: false, error: error.message}));
        return true; // Keep channel open for async response
    }
    
    if (message.action === "callNova") {
        callNovaAPI(message.prompt, message.context)
            .then(response => sendResponse({success: true, response: response}))
            .catch(error => sendResponse({success: false, error: error.message}));
        return true;
    }
});

async function fetchCourseInfo(faculty, major) {
    // Map faculty names to URL-friendly slugs (actual UBC Okanagan structure)
    const facultySlugMap = {
        "Faculty of Applied Science": "faculty-applied-science",
        "School of Engineering": "school-engineering",
        "Faculty of Arts and Social Sciences": "faculty-arts-and-social-sciences",
        "Faculty of Creative and Critical Studies": "faculty-creative-and-critical-studies",
        "Faculty of Education": "faculty-education",
        "Okanagan School of Education": "faculty-education",
        "Faculty of Health and Social Development": "faculty-health-and-social-development",
        "School of Health and Exercise Sciences": "school-health-and-exercise-sciences",
        "School of Nursing": "school-nursing",
        "School of Social Work": "school-social-work",
        "Faculty of Management": "faculty-management",
        "Faculty of Science": "faculty-science"
    };
    
    // Map specific majors to their correct URL slugs
    const majorSlugMap = {
        // Science majors (BSc)
        "Computer Science": "computer-science-bsc",
        "Data Science": "data-science",
        "Mathematics": "mathematics",
        "Physics": "physics",
        "Chemistry": "chemistry",
        "Biology": "biology",
        "Biochemistry and Molecular Biology": "biochemistry-and-molecular-biology",
        "Earth and Environmental Sciences": "earth-and-environmental-sciences",
        "Microbiology": "microbiology",
        "Statistics": "statistics",
        "Zoology": "zoology",
        // Arts majors (BA)
        "Psychology": "psychology",
        "Economics": "economics",
        "Anthropology": "anthropology",
        "English": "english",
        "History": "history",
        "Philosophy": "philosophy",
        "Political Science": "political-science",
        "Sociology": "sociology",
        "French": "french",
        "Spanish": "spanish",
        "Geography": "geography",
        "Gender and Women's Studies": "gender-and-womens-studies",
        "Indigenous Studies": "indigenous-studies",
        "International Relations": "international-relations",
        "Classical Studies": "classical-studies",
        "Latin American Studies": "latin-american-studies",
        // Creative and Critical Studies
        "Art History and Visual Culture": "art-history-and-visual-culture",
        "Creative Writing": "creative-writing",
        "Cultural Studies": "cultural-studies",
        "Digital Arts": "digital-arts",
        "Media Studies": "media-studies",
        "Music": "music",
        "Theatre": "theatre",
        "Visual Arts": "visual-arts",
        // Management majors (concentrations)
        "Accounting": "accounting",
        "Finance": "finance",
        "Marketing": "marketing",
        "Management": "general-management",
        "Business Analytics": "business-analytics",
        "Entrepreneurship": "entrepreneurship",
        "Human Resources Management": "human-resources-management",
        "International Business": "international-business",
        "Operations and Logistics": "operations-and-logistics",
        "Real Estate": "real-estate",
        "General Management": "general-management",
        // Health majors
        "Nursing": "nursing",
        "Social Work": "social-work",
        "Health and Exercise Sciences": "health-and-exercise-sciences",
        "Human Kinetics": "human-kinetics",
        // Engineering majors (BASc)
        "Civil Engineering": "civil-engineering",
        "Electrical Engineering": "electrical-engineering",
        "Mechanical Engineering": "mechanical-engineering",
        "Manufacturing Engineering": "manufacturing-engineering",
        // Education
        "Education (Elementary)": "education-elementary",
        "Education (Secondary)": "education-secondary"
    };
    
    // Get major slug
    const majorSlug = majorSlugMap[major] || major.toLowerCase()
        .replace(/\s+and\s+/g, '-and-')
        .replace(/\s+/g, '-')
        .replace(/[()]/g, '');
    
    const facultySlug = facultySlugMap[faculty] || faculty.toLowerCase().replace(/\s+/g, '-');
    
    // Determine degree program type and URL patterns based on faculty
    let urlPatterns = [];
    
    if (faculty.includes("Science")) {
        // Science faculty structure
        urlPatterns = [
            `https://okanagan.calendar.ubc.ca/faculties-schools-and-colleges/${facultySlug}/bachelor-science-programs/major-programs/${majorSlug}`,
            `https://okanagan.calendar.ubc.ca/faculties-schools-and-colleges/${facultySlug}/bachelor-science-programs/${majorSlug}`
        ];
    } else if (faculty.includes("Arts")) {
        // Arts faculty structure
        urlPatterns = [
            `https://okanagan.calendar.ubc.ca/faculties-schools-and-colleges/${facultySlug}/bachelor-arts-programs/${majorSlug}`,
            `https://okanagan.calendar.ubc.ca/faculties-schools-and-colleges/${facultySlug}/bachelor-arts-programs/major-programs/${majorSlug}`
        ];
    } else if (faculty.includes("Management")) {
        // Management faculty uses "concentrations" instead of majors
        urlPatterns = [
            `https://okanagan.calendar.ubc.ca/faculties-schools-and-colleges/${facultySlug}/bachelor-commerce-program-students-entering-program-20262027-or-later/concentrations/${majorSlug}`,
            `https://okanagan.calendar.ubc.ca/faculties-schools-and-colleges/${facultySlug}/bachelor-management-programs/${majorSlug}`
        ];
    } else if (faculty.includes("Applied Science") || faculty.includes("Engineering")) {
        // Engineering faculty structure
        urlPatterns = [
            `https://okanagan.calendar.ubc.ca/faculties-schools-and-colleges/${facultySlug}/bachelor-applied-science-program/${majorSlug}`,
            `https://okanagan.calendar.ubc.ca/faculties-schools-and-colleges/${facultySlug}/bachelor-applied-science-programs/${majorSlug}`
        ];
    } else if (faculty.includes("Health")) {
        // Health faculty structure
        urlPatterns = [
            `https://okanagan.calendar.ubc.ca/faculties-schools-and-colleges/${facultySlug}/bachelor-programs/${majorSlug}`,
            `https://okanagan.calendar.ubc.ca/faculties-schools-and-colleges/${facultySlug}/${majorSlug}`
        ];
    } else if (faculty.includes("Education")) {
        // Education faculty structure
        urlPatterns = [
            `https://okanagan.calendar.ubc.ca/faculties-schools-and-colleges/${facultySlug}/bachelor-education-programs/${majorSlug}`,
            `https://okanagan.calendar.ubc.ca/faculties-schools-and-colleges/${facultySlug}/${majorSlug}`
        ];
    } else if (faculty.includes("Creative")) {
        // Creative and Critical Studies
        urlPatterns = [
            `https://okanagan.calendar.ubc.ca/faculties-schools-and-colleges/${facultySlug}/bachelor-arts-programs/${majorSlug}`,
            `https://okanagan.calendar.ubc.ca/faculties-schools-and-colleges/${facultySlug}/bachelor-fine-arts-programs/${majorSlug}`
        ];
    } else {
        // Generic fallback patterns
        urlPatterns = [
            `https://okanagan.calendar.ubc.ca/faculties-schools-and-colleges/${facultySlug}/bachelor-programs/${majorSlug}`,
            `https://okanagan.calendar.ubc.ca/faculties-schools-and-colleges/${facultySlug}/${majorSlug}`
        ];
    }
    
    console.log("Trying URLs:", urlPatterns);
    
    // Try each URL pattern
    for (const url of urlPatterns) {
        try {
            console.log("Fetching from:", url);
            const response = await fetch(url);
            
            if (response.ok) {
                const html = await response.text();
                console.log("Successfully fetched from:", url);
                console.log("HTML length:", html.length);
                
                return {
                    url: url,
                    html: html,
                    faculty: faculty,
                    major: major
                };
            } else {
                console.log(`Failed with status ${response.status}:`, url);
            }
        } catch (error) {
            console.error("Error fetching from", url, ":", error);
        }
    }
    
    // If all URLs fail, throw error
    throw new Error("Could not fetch course information from any URL pattern");
}

async function callNovaAPI(prompt, context) {
    // TODO: Replace with actual Amazon Nova API credentials and endpoint
    // This is a placeholder for the Nova API integration
    
    const NOVA_API_ENDPOINT = "YOUR_NOVA_API_ENDPOINT";
    const NOVA_API_KEY = "YOUR_NOVA_API_KEY";
    
    // For now, return a mock response
    // In production, you would call the actual Nova API here
    
    console.log("Calling Nova API with prompt:", prompt);
    console.log("Context:", context);
    
    // Mock response - replace with actual API call
    return {
        message: "I'll help you plan your courses year by year based on the program requirements.",
        needsRealAPI: true
    };
    
    /* Actual implementation would look like:
    try {
        const response = await fetch(NOVA_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${NOVA_API_KEY}`
            },
            body: JSON.stringify({
                prompt: prompt,
                context: context,
                model: "amazon.nova-pro-v1:0" // or appropriate model
            })
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error calling Nova API:", error);
        throw error;
    }
    */
}
