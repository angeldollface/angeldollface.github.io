/*
DOLL FACE by Alexander Abraham, a.k.a. "Angel Dollface".
Licensed under the MIT license.
*/

export function openNav(){
    let navElement: any = document.getElementById('nav');
    navElement.style.width = '100vw';
    navElement.style.height = '100vh';
}

export function closeNav(){
    let navElement: any = document.getElementById('nav');
    navElement.style.width = '0vw';
    navElement.style.height = '0vh';
}

export default {
    openNav,
    closeNav
};