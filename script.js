var levels = {
    'Easy': 0,
    'Normal': 1,
    'Hard': 2,
    'God': 3,
}

revealed = 1
scoresByLevel = [[0, 0, 0, 0],
                 [0, 0, 0, 0],
                 [0, 0, 0, 0],
                 [0, 0, 0, 0]]

function manageDisplay(ids_on, ids_off){
    ids_on.map((item) => document.getElementById(item).classList.remove('hidden'))
    ids_off.map((item) => document.getElementById(item).classList.add('hidden'))

    
}

function handleInput(input, range){
    if (input < range[0] || input > range[1]){
        alert(`User input invalid! Type just values between ${range[0]} e ${range[1]}`)
        return false
    }

    else{
        return true
    }
}

function createTable(){
    
    tabDim = document.getElementById("dim").value;
    var level = document.getElementById("level").value;
    if (handleInput(tabDim, [10,15])){
        manageDisplay(['table', 'game', 'gameInfo'], ['menuStart'])
        table = document.getElementById('table');
        table.style.gridTemplateColumns = `repeat(${tabDim}, 1fr)`
        gameInfo = document.getElementById('gameInfo')
        var levelSpan = document.createElement('span')
        levelSpan.innerHTML = `Level ${level}`
        var dimSpan = document.createElement('span')
        dimSpan.innerHTML = `Shape ${tabDim} x ${tabDim}`
        var scoreSpan = document.createElement('span')
        scoreSpan.id = 'scores'
        scoreSpan.innerHTML = `Score 0`

        gameInfo.appendChild(levelSpan)
        gameInfo.appendChild(dimSpan)
        gameInfo.appendChild(scoreSpan)
        divs = [];
        for (let i=0; i<tabDim; i++){
            var array = [];
            for (let j=0; j<tabDim; j++){
                var div = document.createElement("div");
                div.id = `cell-${i}-${j}`
                table.appendChild(div)
                
                div.classList.add('cell')
                div.addEventListener("click", showCell)
                array.push(div)
            }
            divs.push(array)
        }
    setBombs(table, tabDim, level, divs)}
}


function setBombs(table, tabDim, level, divs){
    level = levels[level]
    nBombs = 0;
    switch(level){
        case 0:
            nBombs = Math.round(0.1 * Math.pow(tabDim, 2))
            break
        case 1:
            nBombs = Math.round(0.3 * Math.pow(tabDim, 2))
            break
        case 2:
            nBombs = Math.round(0.5 * Math.pow(tabDim, 2))
            break
        case 3:
            nBombs = Math.round(0.8 * Math.pow(tabDim, 2))
            break
    }
    var cont = 0;
    bombs = [];
    while (cont < nBombs){
        let randintX = Math.trunc(Math.random() * tabDim)
        let randintY = Math.trunc(Math.random() * tabDim)
        let item = divs[randintX][randintY]
        if (!bombs.includes(item)){
            bombs.push(item)
            cont++
            }
        }

    score = 1000
    document.getElementById('scores').innerHTML = `Score ${score}`
    calcAdjBombs(tabDim, divs, bombs)
    }
    
function calcAdjBombs(tabDim, divs, bombs){
    let nRows = tabDim;
    let nCols = tabDim;
    for (let i=0; i<nRows; i++){
        for (let j=0; j<nCols; j++){
            if (!bombs.includes(divs[i][j])){
                let adjBombs = 0;
                let matriz = [[[i - 1, j - 1], [i - 1, j], [i - 1, j + 1]],
                            [[i, j - 1], [i, j], [i, j + 1]],
                            [[i + 1, j - 1], [i + 1, j], [i + 1, j + 1]]]
                for (let row in matriz){
                    for (let col in matriz[row]){
                        var [x, y] = matriz[row][col]
                        if ((x >= 0 && x < tabDim) && (y >= 0 && y < tabDim)){
                            if (bombs.includes(divs[x][y])){
                                adjBombs += 1
                            }
                        }
                    }
                }
                divs[i][j].value = adjBombs
                /*divs[i][j].innerHTML = `${adjBombs}`*/

            }

            else{
                divs[i][j].value = ''
            }
        }
    }         
}



function showCell(){
    if ((document.getElementById('gameover').classList.contains('hidden')) && (!this.classList.contains('revealed'))){
    let i = Number(this.id.split('-')[1])
    let j = Number(this.id.split('-')[2])
    score -= 5
    document.getElementById('scores').innerHTML = `Score ${score}`
    checkAdjBombs(i, j)
      }}



function checkAdjBombs(i, j){
    divs[i][j].innerHTML = divs[i][j].value
    if (bombs.includes(divs[i][j])){
        for (let cell of bombs.values()){
            cell.classList.add('bomb')
        }
        gameOver()
        return
    }

    else if(revealed == (Math.pow(tabDim, 2) - nBombs)){
        win()
        return
    }
    
    if (( divs[i][j].value != 0) && ((!divs[i][j].classList.contains('revealed')))){
        divs[i][j].style.background = 'rgb(255, 238, 81)'
        divs[i][j].innerHTML = divs[i][j].value
        divs[i][j].classList.add('revealed')
        revealed++
        return
        
    }
    var matriz = [[[i - 1, j - 1], [i - 1, j], [i - 1, j + 1]],
                [[i, j - 1], [i, j], [i, j + 1]],
                [[i + 1, j - 1], [i + 1, j], [i + 1, j + 1]]]

    for (let row in matriz){
        for (let col in matriz[row]){
            var [x, y] = matriz[row][col]
            
            if ((x >= 0 && x < tabDim) && (y >= 0 && y < tabDim)) {
              
                if ((divs[x][y].value == 0) && (!divs[x][y].classList.contains('revealed'))){
                    console.log(divs[x][y].innerHTML)
                    divs[x][y].style.background = 'rgb(211, 198, 101)'
                    divs[x][y].classList.add('revealed')
                    revealed++
                    divs[x][y].innerHTML = divs[x][y].value
                    checkAdjBombs(x, y)
                }

                else if((divs[x][y].value != 0) && (!divs[x][y].classList.contains('revealed'))){
                    divs[x][y].classList.add('revealed')
                    revealed++
                    divs[x][y].style.background = 'rgb(255, 238, 81)'
                    divs[x][y].innerHTML = divs[x][y].value

        
                }

            }
        }
    }
    
}
   

function gameOver(){
    let gameover = document.getElementById('gameover')
    let msg = document.querySelector("div#gameover h2")
    msg.innerHTML = `Game Over. Try again!`
    gameover.classList.remove('hidden')
    
    
}


function win(){
    let win = document.getElementById('win')
    let scores = document.getElementById('scoreWin')
    scores.innerHTML = `Congratulations, you're rock! Your winning score is ${score}`
    let nodelist = Array.from(document.querySelectorAll('div#menuScores ol li'))
    var level = document.getElementById("level").value;
    let arr = scoresByLevel[levels[level]]
    arr.push(score)
    arr.sort(function(a, b){return b-a})
    arr.pop()
    for (let i in nodelist){
        nodelist[i].innerHTML = arr[i]
    }
    win.classList.remove('hidden')
}

function handleScoresSel(){
    let scoreSel = document.getElementById('scoreSel')
    selected = levels[scoreSel.value]
    let nodelist = Array.from(document.querySelectorAll('div#menuScores ol li'))
    for (let i in nodelist){
        nodelist[i].innerHTML = scoresByLevel[selected][i]
    }
    
}

function clearScreen(){
    manageDisplay(['menu'], ['game', 'gameInfo', 'table', 'gameover', 'win'])
    table.innerHTML = ''
    gameInfo.innerHTML = ''
    score = 0
    revealed = 1
}