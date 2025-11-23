function score(){
    let year = new Date().getYear() + 1900;

    let list = document.getElementById("wd-FacetedSearchResultList-6$8104").children[2].children[0].children;
    for(let li of list){
        let item = li.children[0].children;
        let button = document.createElement("button");
        button.innerText = "Get Average";

        let title = item[0].children[0].children[0].children[0].children[0].children[0].children[0];
        title.appendChild(button);
        button.onclick = async () =>{
            let string = title.children[1].innerText;
            let faculty = string.split(" ")[0];
            faculty = faculty.substring(0,faculty.length-2);
            let section = string.split(" ")[1];
            let code = section.substring(0,section.indexOf("-"));
            section = section.substring(section.indexOf("-")+1,section.length);
            if(section.length < 3){
                section = "OVERALL";
            }
            console.log(year + "", "W", faculty, code, section);
            console.log( await getLatestUBCGRADES(faculty,code,section));
        }
    }
};

// Example URL: https://ubcgrades.com/api/v3/grades/UBCO/2022S/MATH/100/OVERALL
async function getDataUBCGRADES(year, term, faculty, code, section){
    let res;
    await fetch('https://ubcgrades.com/api/v3/grades/UBCO/' + year + term + '/' + faculty + '/' + code + '/' + section)
    .then(response => response.json()) // Parse the response body as JSON
    .then(data => {
        res = data;
    })
    .catch(error => console.error('Error fetching data:', error));

    return res;
}

// Find latest summer and winter course data in last 5 years. If one is found, search up to one more year for the other.
async function getLatestUBCGRADES(faculty, code, section){
    let year = new Date().getYear() + 1899;
    let res = {
        "winter":null,
        "summer":null
    };
    for (let i = year;  i >= year-5; --i){
        if(res.winter == null && res.summer == null){
            let dataS = await getDataUBCGRADES(i,'S',faculty,code,section);
            let dataW = await getDataUBCGRADES(i,'W',faculty,code,section);
            if(dataS.error != "Not Found"){
                res.summer = dataS;
            }
            if(dataW.error != "Not Found"){
                res.winter = dataW;
            }
            // both null
        }else if(res.summer == null && res.winter != null){
            //only summer null
            let dataS = await getDataUBCGRADES(i-1,'S',faculty,code,section);
            if(dataS.error != "Not Found"){
                res.summer = dataS;
            }
            else{
                break;
            }
        }else if(res.winter == null && res.summer != null){
            let dataW = await getDataUBCGRADES(i-1,'W',faculty,code,section);
            if(dataW.error != "Not Found"){
                res.winter = dataW;
            }
            else{break;}
            //only winyer nnull
        }else{ 
            break;
        }
    }

    return res;
}