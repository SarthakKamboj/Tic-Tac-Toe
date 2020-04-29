
let Box = (box, grid, id, checkBoxesCallback, gameOverCallBack, isTiedCallBack) => {
    let row = Math.floor(id / 3);
    let col = id % 3;
    let coord = [row,col]
    let innerTextBox = box.querySelector(".move")

    const _onClick = () => {
        if (innerTextBox.innerText === ""){
            innerTextBox.innerText = grid.getCurrentPlayer();
            innerTextBox.classList.add("moveMade")
            grid.updatePlayer()
        }
    }
    
    const _boxListener = () => {
        box.addEventListener("click",()=>{ 
            if (!gameOverCallBack()) {
                _onClick();
                checkBoxesCallback();
                isTiedCallBack();
            }
        })
    }

    _boxListener();

    const getMove = () => box.innerText
    const getCoord = () => coord

    return {
        getCoord,
        getMove,
        innerTextBox,
    }

}

let gameManager = (() => {

    let gameOver = false;
    let winner = "";
    let tied = false;

    let grid = (()=>{

        const player1 = "X", player2 = "O";
        let curPlayer = player1;
    
        const updatePlayer = () => {
            (curPlayer === player1) ? curPlayer = player2 : curPlayer = player1;
        }
    
        const getCurrentPlayer = () => {
            return curPlayer;
        };
    
        return {
            updatePlayer,
            getCurrentPlayer,
        };
    })();

    let boxes = [...document.querySelectorAll(".box")]

    let _resetBoxes = () => {
        boxes.forEach(box=>{
            box.innerTextBox.innerText = ""
            box.innerTextBox.classList.remove("moveMade")
        })
    }

    let _resetGame = () => {
        let resetBtn = document.querySelector(".reset");
        gameOver = false;
        resetBtn.classList.add("hidden");
        _resetBoxes();
        document.querySelector(".winner").innerText = ""
        winner = ""
    }

    (()=>{
        let resetBtn = document.querySelector(".reset");
        console.log(resetBtn)
        resetBtn.addEventListener("click",()=>{
            _resetGame()
        })
    })();

    const _resetBtn = () => {
        let resetBtn = document.querySelector(".reset")
        resetBtn.classList.remove("hidden")
    }

    const _getWinner = () => {
        if (!tied){
            winner = (grid.getCurrentPlayer() === "X") ? "Player 2" : "Player 1";
        } else {
            winner = "Tied!"
        }
    }

    const _setWinner = () => {
        let winnerText = document.querySelector(".winner")
        winnerText.innerText = winner;
    }

    const _gameStatus = () => gameOver;

    const _gameOver = () => {
        gameOver = true;
        _getWinner()
        _setWinner()
        _resetBtn()
    };

    const _checkBoxesHorizontally = (boxes,box) => {
        let curIndex = boxes.indexOf(box)
        let curText = box.innerTextBox.innerText;
        let textToTheRight = boxes[curIndex+1].innerTextBox.innerText;
        let textAtEnd = boxes[curIndex+2].innerTextBox.innerText;
        if (curText === textToTheRight && curText === textAtEnd) {
            _gameOver()
        }
    }

    const _checkBoxesVertically = (boxes,box) => {
        let curIndex = boxes.indexOf(box)
        let curText = box.innerTextBox.innerText;
        let textToTheRight = boxes[curIndex+3].innerTextBox.innerText;
        let textAtEnd = boxes[curIndex+6].innerTextBox.innerText;
        if (curText === textToTheRight && curText === textAtEnd) {
            _gameOver()
        }
    }

    const _checkBoxesDiagonallyToTheRight = (boxes,box) => {
        let curIndex = boxes.indexOf(box)
        let curText = box.innerTextBox.innerText;
        let textToTheRight = boxes[curIndex+4].innerTextBox.innerText;
        let textAtEnd = boxes[curIndex+8].innerTextBox.innerText;
        if (curText === textToTheRight && curText === textAtEnd) {
            _gameOver()
        }
    }

    const _checkBoxesDiagonallyToTheLeft = (boxes,box) => {
        let curIndex = boxes.indexOf(box)
        let curText = box.innerTextBox.innerText;
        let textToTheRight = boxes[curIndex+2].innerTextBox.innerText;
        let textAtEnd = boxes[curIndex+4].innerTextBox.innerText;
        if (curText === textToTheRight && curText === textAtEnd) {
            _gameOver()
        }
    }

    const _checkBoxes = () => {
        boxes.forEach(box=>{
            let boxCoord = box.getCoord();
            if (box.innerTextBox.innerText !== "" && boxCoord[0] === 0) {
                _checkBoxesVertically(boxes,box)
                if (boxCoord[1] == 0) {
                    _checkBoxesDiagonallyToTheRight(boxes,box)
                } else if (boxCoord[1] == 2){
                    _checkBoxesDiagonallyToTheLeft(boxes,box)
                }
            }
            if (box.innerTextBox.innerText !== "" && boxCoord[1] === 0) {
                _checkBoxesHorizontally(boxes,box)
            }
        })

        console.log(_gameStatus())
    }

    let _checkIfTied = () => {
        let allBoxesPlayed = true;
        for (let i = 0; i < boxes.length; i++) {
            if (boxes[i].innerTextBox.innerText === "") {
                allBoxesPlayed = false;
                break
            }
        }
        // boxes.forEach(box=>{
        //     if (box.innerTextBox.innerText === "") {
        //         allBoxesPlayed = false;
        //         break
        //     }
        // })
        tied = allBoxesPlayed;

        (tied) ? _gameOver() : false 
    }

    for (let i = 0; i < boxes.length; i++) {
        boxes[i] = Box(boxes[i],grid,i, _checkBoxes, _gameStatus, _checkIfTied)
    }

})();

