chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("test");
    if(message.action == "score"){
        score();
    }
    if(message.action == "calendar"){
        calendar();
    }

    sendResponse({"status":"success"});
});