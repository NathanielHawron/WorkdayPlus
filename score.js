console.log("score.js")

function score(){
    let list = document.getElementById("wd-FacetedSearchResultList-6$8104").children[2].children[0].children;
    for(let li of list){
        let item = li.children[0].children;
        console.log(item);
    }
}