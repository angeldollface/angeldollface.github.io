window.easterEggCounter = 0;
function crackEgg(){
    window.easterEggCounter = window.easterEggCounter + 1;
    let easterEggDiv = document.getElementById("easterEgg");
    if (window.easterEggCounter === 6){
        easterEggDiv.style.height = '100vh';
        window.easterEggCounter = 0;
    }
    else {}
}
function assembleEgg(){
    let easterEggDiv = document.getElementById("easterEgg");
    easterEggDiv.style.height = '0vh';
    
}