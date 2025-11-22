let score = document.getElementById("ScoreEnable");
let calendar = document.getElementById("CalendarEnable");

score.onclick = async ()=>{
    let [tab] = await chrome.tabs.query({active:true, currentWindow:true});
    chrome.tabs.sendMessage(tab.id, {action:"score"}, (res)=>{
        alert(res);
    })
}

calendar.onclick = async ()=>{
    let [tab] = await chrome.tabs.query({active:true, currentWindow:true});
    chrome.tabs.sendMessage(tab.id, {action:"calendar"}, (res)=>{
        alert(res);
    })
}