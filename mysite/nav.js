function handleNav(
    navElemID, 
    buttonElemID, 
    closeText, 
    openText
){
    let navElement = document.getElementById(navElemID);
    let buttonElem = document.getElementById(buttonElemID);
    if (navElement.style.width === '0vw'){
        navElement.style.width = '100vw';
        buttonElem.innerHTML = closeText;
    }
    else {
        navElement.style.width = '0vw';
        buttonElem.innerHTML = openText;
    }
}