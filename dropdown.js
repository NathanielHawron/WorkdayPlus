let score = document.getElementById("ScoreEnable");
let calendar = document.getElementById("CalendarEnable");

score.onclick = async ()=>{
    score.disabled = true;
    let [tab] = await chrome.tabs.query({active:true, currentWindow:true});
    chrome.tabs.sendMessage(tab.id, {action:"score"}, (res)=>{
    })
}

calendar.onclick = async ()=>{
    calendar.disabled = true;
    let [tab] = await chrome.tabs.query({active:true, currentWindow:true});
    chrome.tabs.sendMessage(tab.id, {action:"calendar"}, (res)=>{
    })
}