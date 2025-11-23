function score(){
    let list = document.getElementById("wd-FacetedSearchResultList-6$8104").children[2].children[0].children;
    for(let li of list){
        /*
            STATES:
            0 - Get Average
            1 - W
            2 - S
            3 - Not found
        */
        let state = 0;
        let item = li.children[0].children;
        let button = document.createElement("button");
        button.innerText = "Get Average";

        let display = document.createElement("p");

        let dataStringW = "";
        let dataStringS = "";

        let title = item[0].children[0].children[0].children[0].children[0].children[0].children[0];
        title.appendChild(button);
        button.onclick = () =>{
            switch(state){
                case 0:{
                    let string = title.children[1].innerText;
                    let faculty = string.split(" ")[0];
                    faculty = faculty.substring(0,faculty.length-2);
                    let section = string.split(" ")[1];
                    let code = section.substring(0,section.indexOf("-"));
                    section = section.substring(section.indexOf("-")+1,section.length);
                    if(section.length < 3){
                        section = "OVERALL";
                    }
                    
                    console.log(faculty, code, section);
                    
                    let data = getLatestUBCGRADES(faculty, code, section);
                    if(data.error == "Not Found"){
                        data = null;
                    }
                    // getDataUBCGRADES(year-2 + "", "S", faculty, code, section);
        
                    console.log(data);
        
                    dataStringS = "Summer data string";
                    dataStringW = "Winter data string";
        
                    if(data.summer != null){
                        button.innerText = "S";
                        display.innerText = dataStringS;
                        state = 2;
                        title.appendChild(display);
                    }else if(data.winter != null){
                        button.innerText = "W";
                        display.innerText = dataStringW.
                        state = 1;
                        title.appendChild(display);
                    }else{
                        button.innerText = "Data not available"
                        state = 3;
                    }
                }break;
                case 1:{
                    button.innerText = "S";
                    display.innerText = dataStringS;
                    state = 2;
                }break;
                case 2:{
                    button.innerText = "W";
                    display.innerText = dataStringW.
                    state = 1;
                }break;
                default:{
                }break;
            }
        }
    }
};

// Example URL: https://ubcgrades.com/api/v3/grades/UBCO/2022S/MATH/100/OVERALL
async function getDataUBCGRADES(year, term, subject, code, section){
    let res;
    await fetch('https://ubcgrades.com/api/v3/grades/UBCO/' + year + term + '/' + subject + '/' + code + '/' + section)
    .then(response => response.json()) // Parse the response body as JSON
    .then(data => {
        res = data;
    })
    .catch(error => console.error('Error fetching data:', error));

    return res;
}

// Find latest summer and winter course data in last 5 years. If one is found, search up to one more year for the other.
function getLatestUBCGRADES(subject, code, section){
    let res = {
        "winter":null,
        "summer":null
    };

    return res;
}