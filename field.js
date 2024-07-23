"use strict"
let fieldArr= []

constructFieldArr(6,6)


let bombCoord = [];
let bombInRow = [];
let rowsNumbers = new Set;
let button = document.querySelector("#NewGame");
button.addEventListener("click", newGame)
let bombNumbers;
//
function constructFieldArr (rows, cells){ //багует на строке 127
    fieldArr = [];

    for(let row = 0; row < rows; row++){
        let arrRow = []
        for(let cell = 0; cell < cells; cell++){
            arrRow.push(0)
        }
        fieldArr.push(arrRow)
    }


}

function newGame() {
    bombCoord = [];
    bombInRow = [];
    let rows = document.querySelector("#rowsNumber").value == "" ? document.querySelector("#rowsNumber").getAttribute(`placeholder`) : document.querySelector("#rowsNumber").value ;
    let cells = document.querySelector("#cellNumber")?.value == "" ?document.querySelector("#cellNumber").getAttribute(`placeholder`):  document.querySelector("#cellNumber").value;
    let bombsNumber= document.querySelector("#bombsNumber")?.value == "" ?document.querySelector("#bombsNumber").getAttribute(`placeholder`):  document.querySelector("#bombsNumber").value ;
    document.querySelector("#bombQuan").innerHTML = bombsNumber
    rows > 25 ? rows = 25 : rows=rows;
    cells > 25 ? cells = 25 : cells=cells;
    if(bombsNumber > rows*cells/2.5){
        bombsNumber = Math.ceil(rows*cells/2.5)
        document.querySelector("#bombsNumber").value = document.querySelector("#bombQuan").innerHTML=  bombsNumber
    }
    console.log(bombsNumber)
    constructFieldArr(+rows, +cells)
    bombSpawn(bombsNumber)
    fieldTable()
}
function bombSpawn (bombsNumber){
    bombNumbers = bombsNumber

    quantityBomb(bombsNumber);
}


function quantityBomb(x){//заполняем массив с кол-во бомб в ряду
    let bombCounter = x;

    while (bombCounter > 0){

        let bombQuantity;
        bombQuantity = Math.ceil(Math.random()*(bombCounter));
        if(bombQuantity >= fieldArr[0].length/2){
            bombQuantity = Math.round(bombQuantity/3)
        };
        if(fieldArr.length - bombInRow.length === 1){ //защита чтоб не было больше строк с бомбами чем есть на поле
            bombQuantity = bombCounter
            bombCounter = 0
        };
        if(bombQuantity >= fieldArr[0].length){
            bombQuantity = fieldArr[0].length
        }
        bombInRow.push(bombQuantity);
        bombCounter -= bombQuantity;
    }
    takeRow();
}


function takeRow() {// рандомно выбираем ряд

    let iteration = 0
    while (rowsNumbers.size != fieldArr.length) {
        let rowNumber = Math.round(Math.random() * (fieldArr.length-1) + 1);
        rowsNumbers.add(rowNumber);
        if(iteration > 20){
            for(let i = 1; i < fieldArr.length+1; i++){
                rowsNumbers.add(i);
            }
        }
        iteration++
    }

    bombSpawnRow();
}


function bombSpawnRow(){// раскидываем бомбы  в рандомно выбранном ряду

    while(rowsNumbers.size != 0 || bombInRow.length != 0){
        let value = rowsNumbers.values().next().value;

        if(rowsNumbers.size == 1){
            break
        };

        for(let cell of rowsNumbers){
            if(cell == undefined){
                break
            }
            let bombQuan = bombInRow[bombInRow.length-1]
            while(bombQuan) {

                fieldArr[cell - 1].forEach(function (item, index, arr) {
                    while (bombQuan) {

                        let bombIsHere = Math.floor(Math.random()*1.5) > 0;
                        if (item == "x" || !bombQuan) {
                            break;
                        }

                        if (bombIsHere) {

                            item = "x";
                            let itemArrNum = 0
                            fieldArr[cell - 1].splice(index, 1, "x")

                            fieldArr.forEach(function (item, index){

                                if(item == arr){
                                    itemArrNum = index;
                                    return;
                                };
                            });
                            bombCoord.push([itemArrNum, index])
                            bombQuan--;
                        } else {
                            break;
                        }
                    }

                })
            }

            bombInRow.pop();
            rowsNumbers.delete(cell);
        }
        bombCoord.sort((a, b) =>  {
            let result =  a[0]-b[0];
            if(result === 0){
                result = a[1]-b[1]
            }
            return result

        })
        rowsNumbers.delete(value);
    };

    bombNeighbour();
}




function bombNeighbour(){

    bombCoord.forEach(function (item,index, array){

        if(fieldArr?.[item[0]-1]?.[item[1]-1] != undefined){//topLeftNeighbour
            if(fieldArr[item[0]-1][item[1]-1] != "x") {
                fieldArr[item[0]-1][item[1]-1]++;
            }
        };

        if(fieldArr?.[item[0]-1]?.[item[1]]!= undefined){//topNeighbour
            if(fieldArr[item[0]-1][item[1]] != "x"){
                fieldArr[item[0]-1][item[1]]++;
            }
        };

        if(fieldArr?.[item[0]-1]?.[item[1]+1] != undefined){//topRightNeighbour
            if(fieldArr[item[0]-1][item[1]+1] != "x"){
                fieldArr[item[0]-1][item[1]+1]++;
            }
        };

        if(fieldArr?.[item[0]]?.[item[1]-1] != undefined){//leftNeighbour
            if(fieldArr[item[0]][item[1]-1] != "x") {
                fieldArr[item[0]][item[1] - 1]++;
            }
        };

        if(fieldArr?.[item[0]]?.[item[1]+1] != undefined){//RightNeighbour
            if(fieldArr[item[0]][item[1]+1] != "x"){
                fieldArr[item[0]][item[1]+1]++;
            }
        };

        if(fieldArr?.[item[0]+1]?.[item[1]-1] != undefined){//bottomLeftNeighbour
            if(fieldArr[item[0]+1][item[1]-1] != "x") {
                fieldArr[item[0]+1][item[1] - 1]++;
            }
        };

        if(fieldArr?.[item[0]+1]?.[item[1]] != undefined){//bottomNeighbour
            if(fieldArr[item[0]+1][item[1]] != "x") {
                fieldArr[item[0]+1][item[1]]++;
            }
        };

        if(fieldArr?.[item[0]+1]?.[item[1]+1] != undefined){//bottomRightNeighbour
            if(fieldArr[item[0]+1][item[1]+1] != "x") {
                fieldArr[item[0]+1][item[1]+1]++;
            }
        };

    })

}

function fieldTable() {
    if(document.querySelector("table")){
        document.querySelector("table").remove()
    }
    let tableField = document.createElement("table")
    for (let i = 0; i < fieldArr.length; i++) {
        let row = tableField.insertRow()
        row.id = i;
        for (let i = 0; i < fieldArr[0].length; i++) {
            let cell = row.insertCell()
            cell.id = `${row.id},${i}`
            cell.className = "cell"
        }
    }
    if(document.querySelector("table")){
        document.querySelector("table").replaceWith(tableField)
        tableField.addEventListener("click", checkBomb);
        return
    }
    document.querySelector("#field").insertAdjacentElement("afterbegin", tableField)
    tableField.addEventListener("click", checkBomb);
    tableField.addEventListener("contextmenu", rightClick);
    console.log(fieldArr)
}

function checkBomb(event){
    if(event.target.classList.contains("opened") || event.target.tagName != "TD"){
        return;
    }
    let cellId = event.target.id.split(","),
        cellValue = fieldArr?.[cellId[0]]?.[cellId[1]]
    console.log("x")
    event.target.classList.add("opened")
    event.target.innerText = cellValue

    if(cellValue === 0){
        checkNeighbour(event.target)
    }
    valueColor(cellValue, event.target);

    setTimeout(function (){
        if(cellValue == "x"){

            alert("Вы проиграли")
            for (let i = 0; i < fieldArr.length; i++) {
                let row = i;
                for (let i = 0; i < fieldArr[0].length; i++) {
                    let cellId = `${row},${i}`
                    let cellValue =  fieldArr?.[row]?.[i];
                    let cell =  document.getElementById(`${cellId}`)
                    cell.classList.add("opened")
                    cell.style.boxShadow = "0px 0px 0px 0px rgba(0, 0, 0, 0.5)"
                    cell.innerText = cellValue;
                    cell.style.backgroundColor = "rgb(360, 360, 360)"
                    valueColor(cellValue, cell);
                }
            }
            return
        }
    }, 300)
    checkWin()

}
function rightClick(event){
    if(event.target.tagName != "TD"){
        return;
    }
    event.preventDefault()
    if(event.target.innerText === "?"){
        event.target.innerText = ""
        checkQuanBomb()
        return
    }
    event.target.innerText = "?"
    event.target.style.color = "black"
    checkQuanBomb()
}
function checkQuanBomb(){
    let TD = document.querySelectorAll("TD")
    TD = Array.from(TD)
    let question = TD.filter(function (item,index){
        if(item.innerText === "?") {
            return item
        }
    })
    let bombQuanElem = document.querySelector("#bombQuan")
    
    bombQuanElem.innerText = (document.querySelector("#bombsNumber").value == 0 ? document.querySelector("#bombsNumber").placeholder : document.querySelector("#bombsNumber").value) - question.length

}
function valueColor(cellValue, target){
    switch (cellValue) {
        case 0: {
            target.style.color = "rgb(0, 128, 0)"
            break;
        }
        case 1: {
            target.style.color = "rgb(0, 143, 252)"
            break;
        }
        case 2: {
            target.style.color = "rgb(34, 0, 255)"
            break;
        }
        case 3: {
            target.style.color = "rgb(183, 255, 0)"
            break;
        }
        case 4: {
            target.style.color = "rgb(255, 183, 0)"
            break;
        }
        case "x": {
            target.style.color = "rgb(102, 0, 2)"
            break;
        }
        default: {
            target.style.color = "rgb(128, 128, 0)"
        }
    }
}
function checkNeighbour(target){
    if(!target){
        return
    }

    let targetCoord = target.id.split(",")//3.3

    let topLeftNeighbour = fieldArr?.[targetCoord[0]-1]?.[targetCoord[1]-1];
    let topNeighbour = fieldArr?.[targetCoord[0]-1]?.[targetCoord[1]];
    let topRightNeighbour = fieldArr?.[targetCoord[0]-1]?.[+targetCoord[1]+1];
    let leftNeighbour = fieldArr?.[targetCoord[0]]?.[targetCoord[1]-1];
    let rightNeighbour = fieldArr?.[targetCoord[0]]?.[+targetCoord[1] +1];
    let bottomLeftNeighbour = fieldArr?.[+targetCoord[0]+1]?.[targetCoord[1]-1];
    let bottomNeighbour = fieldArr?.[+targetCoord[0]+1]?.[targetCoord[1]];
    let bottomRightNeighbour = fieldArr?.[+targetCoord[0]+1]?.[+targetCoord[1]+1];


    if(topLeftNeighbour != "x" && topLeftNeighbour != undefined){//topLeftNeighbour
        let neighbourElem = document.getElementById(`${[targetCoord[0]-1]},${[targetCoord[1]-1]}`);
        if(!neighbourElem.classList.contains("opened")){
            neighbourElem.innerText == topLeftNeighbour
            neighbourElem.classList.add("opened")
            neighbourElem.style.boxShadow = "0px 0px 0px 0px rgba(0, 0, 0, 0.5)"
            neighbourElem.innerText = topLeftNeighbour;
            neighbourElem.style.backgroundColor = "rgb(360, 360, 360)"
            valueColor(topLeftNeighbour, neighbourElem);
            if(topLeftNeighbour === 0){
                setTimeout(function (){
                    checkNeighbour(neighbourElem)
                },0)
            }
        }

    };

    if(topNeighbour != undefined && topNeighbour != "x" ){//topNeighbour
        let neighbourElem = document.getElementById(`${[targetCoord[0]-1]},${[targetCoord[1]]}`);
        if(!neighbourElem.classList.contains("opened")){
            neighbourElem.innerText == topNeighbour
            neighbourElem.classList.add("opened")
            neighbourElem.style.boxShadow = "0px 0px 0px 0px rgba(0, 0, 0, 0.5)"
            neighbourElem.innerText = topNeighbour;
            neighbourElem.style.backgroundColor = "rgb(360, 360, 360)"
            valueColor(topNeighbour, neighbourElem);
            if(topNeighbour === 0){
                setTimeout(function (){
                    checkNeighbour(neighbourElem)
                },0)
            }
        }

    };

    if(topRightNeighbour != undefined && topRightNeighbour != "x"){//topRightNeighbour
        let neighbourElem = document.getElementById(`${[targetCoord[0]-1]},${[+targetCoord[1]+1]}`);
        if(!neighbourElem.classList.contains("opened")){
            neighbourElem.innerText == topRightNeighbour
            neighbourElem.classList.add("opened")
            neighbourElem.style.boxShadow = "0px 0px 0px 0px rgba(0, 0, 0, 0.5)"
            neighbourElem.innerText = topRightNeighbour;
            neighbourElem.style.backgroundColor = "rgb(360, 360, 360)"
            valueColor(topRightNeighbour, neighbourElem);
            if(topRightNeighbour === 0){
                setTimeout(function (){
                    checkNeighbour(neighbourElem)
                },0)
            }
        }

    };

    if(leftNeighbour != undefined && leftNeighbour != "x"){//leftNeighbour
        let neighbourElem = document.getElementById(`${[targetCoord[0]]},${[targetCoord[1]-1]}`);
        if(!neighbourElem.classList.contains("opened")){
            neighbourElem.innerText == leftNeighbour
            neighbourElem.classList.add("opened")
            neighbourElem.style.boxShadow = "0px 0px 0px 0px rgba(0, 0, 0, 0.5)"
            neighbourElem.innerText = leftNeighbour;
            neighbourElem.style.backgroundColor = "rgb(360, 360, 360)"
            valueColor(leftNeighbour, neighbourElem);
            if(leftNeighbour === 0){
                setTimeout(function (){
                    checkNeighbour(neighbourElem)
                },0)
            }
        }
    };

    if(rightNeighbour != undefined && rightNeighbour != "x"){//rightNeighbour
        let neighbourElem = document.getElementById(`${[targetCoord[0]]},${[+targetCoord[1]+1]}`);
        if(!neighbourElem.classList.contains("opened")){
            neighbourElem.innerText == rightNeighbour
            neighbourElem.classList.add("opened")
            neighbourElem.style.boxShadow = "0px 0px 0px 0px rgba(0, 0, 0, 0.5)"
            neighbourElem.innerText = rightNeighbour;
            neighbourElem.style.backgroundColor = "rgb(360, 360, 360)"
            valueColor(rightNeighbour, neighbourElem);
            if(rightNeighbour === 0){
                setTimeout(function (){
                    checkNeighbour(neighbourElem)
                },0)
            }
        }
    };

    if(bottomLeftNeighbour != undefined && bottomLeftNeighbour != "x"){//bottomLeftNeighbour
        let neighbourElem = document.getElementById(`${[+targetCoord[0]+1]},${[targetCoord[1]-1]}`);
        if(!neighbourElem.classList.contains("opened")){
            neighbourElem.innerText == bottomLeftNeighbour
            neighbourElem.classList.add("opened")
            neighbourElem.style.boxShadow = "0px 0px 0px 0px rgba(0, 0, 0, 0.5)"
            neighbourElem.innerText = bottomLeftNeighbour;
            neighbourElem.style.backgroundColor = "rgb(360, 360, 360)"
            valueColor(bottomLeftNeighbour, neighbourElem);
            if(bottomLeftNeighbour === 0){
                setTimeout(function (){
                    checkNeighbour(neighbourElem)
                },0)
            };
        }
    };

    if(bottomNeighbour != undefined && bottomNeighbour != "x"){//bottomNeighbour
        let neighbourElem = document.getElementById(`${[+targetCoord[0]+1]},${[targetCoord[1]]}`);
        if(!neighbourElem.classList.contains("opened")){
            neighbourElem.innerText == bottomNeighbour
            neighbourElem.classList.add("opened")
            neighbourElem.style.boxShadow = "0px 0px 0px 0px rgba(0, 0, 0, 0.5)"
            neighbourElem.innerText = bottomNeighbour;
            neighbourElem.style.backgroundColor = "rgb(360, 360, 360)"
            valueColor(bottomNeighbour, neighbourElem);
            if(bottomNeighbour === 0){
                setTimeout(function (){
                    checkNeighbour(neighbourElem)
                },0)
            }
        }

    };

    if(bottomRightNeighbour != undefined && bottomRightNeighbour != "x"){//bottomRightNeighbour
        let neighbourElem = document.getElementById(`${[+targetCoord[0]+1]},${[+targetCoord[1]+1]}`);
        if(!neighbourElem.classList.contains("opened")){
            neighbourElem.innerText == bottomRightNeighbour
            neighbourElem.classList.add("opened")
            neighbourElem.style.boxShadow = "0px 0px 0px 0px rgba(0, 0, 0, 0.5)"
            neighbourElem.innerText = bottomRightNeighbour;
            neighbourElem.style.backgroundColor = "rgb(360, 360, 360)"
            valueColor(bottomRightNeighbour, neighbourElem);
            if(bottomRightNeighbour === 0){
                setTimeout(function (){
                    checkNeighbour(neighbourElem)
                },0)
            }
        }
    };
    checkWin()
}

function checkWin(){
    let allNotOpenedCell = (fieldArr.length*fieldArr[0].length)-document.querySelectorAll(".opened").length;
    if(allNotOpenedCell == bombNumbers){
        alert("Вы Выиграли")
        for (let i = 0; i < fieldArr.length; i++) {
            let row = i;
            for (let i = 0; i < fieldArr[0].length; i++) {
                let cellId = `${row},${i}`
                let cellValue =  fieldArr?.[row]?.[i];
                let cell =  document.getElementById(`${cellId}`)
                if(cell.classList.contains("opened")) {
                    return;
                }
                cell.classList.add("opened")
                cell.style.boxShadow = "0px 0px 0px 0px rgba(0, 0, 0, 0.5)"
                cell.innerText = cellValue;
                cell.style.backgroundColor = "rgb(360, 360, 360)"
                valueColor(cellValue, cell);
            }
        }
        return
    }
}

// constructFieldArr(5,5)
document.querySelector("#bombQuan").innerHTML = document.querySelector("#bombsNumber").getAttribute(`placeholder`)
bombSpawn(document.querySelector("#bombsNumber").getAttribute(`placeholder`));
fieldTable();

