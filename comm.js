chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.action == "score"){
        score();
    }
    if(message.action == "calendar"){
        calendar();
    }

    sendResponse({"status":"success"});
});