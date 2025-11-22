let scoreButton = document.getElementById("ScoreEnable");

scoreButton.onclick = ()=>{
    getDataRMP();
};


//THE YEAR, TERM, Subject, Level, Section will be provided by nathan
function getDataUBCGRADES(Year, Term, Subject, Level, Section){ 
        fetch('heeps://ubcgrades.com/api/v3/grades/UBCO/' + Year + Term + '/' + Subject + '/' + Level + '/' + Section)
        .then(response => response.json()) // Parse the response body as JSON
        .then(data => {
            // Data is now available as a JavaScript object
            console.log(data);
            alert(JSON.stringify(data));
             // Call a function to display the data
        })
        .catch(error => console.error('Error fetching data:', error));
}



