chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("test");
    if(message.action == "score"){
        console.log("Calling score()");
        score();
        sendResponse({"status":"score enabled"});
    }
    
    if(message.action == "calendar"){
        console.log("Calling calendar()");
        if (typeof calendar === 'function') {
            calendar();
            sendResponse({"status":"calendar opened"});
        } else {
            console.error("calendar function not found!");
            sendResponse({"status":"error", "message":"calendar function not found"});
        }
    }
    
    return true; // Keep message channel open for async response
});