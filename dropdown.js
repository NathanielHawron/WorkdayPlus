let score = document.getElementById("ScoreEnable");
let calendar = document.getElementById("CalendarEnable");
let registrationGuide = document.getElementById("RegistrationGuideEnable");

score.onclick = async ()=>{
    let [tab] = await chrome.tabs.query({active:true, currentWindow:true});
    chrome.tabs.sendMessage(tab.id, {action:"score"}, (res)=>{
        alert(res);
    })
}

calendar.onclick = async ()=>{
    let [tab] = await chrome.tabs.query({active:true, currentWindow:true});
    chrome.tabs.sendMessage(tab.id, {action:"calendar"}, (res)=>{
        if(res && res.status){
            console.log("Calendar opened:", res.status);
        }
    })
}

registrationGuide.onclick = async ()=>{
    let [tab] = await chrome.tabs.query({active:true, currentWindow:true});
    chrome.tabs.sendMessage(tab.id, {action:"registrationGuide"}, (res)=>{
        if(res && res.status){
            console.log("Registration guide opened:", res.status);
        }
    })
}