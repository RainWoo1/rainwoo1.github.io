function loading() {
    location.reload();
}

/*/!* modal open *!/
const body = document.querySelector('body');
const modal = document.querySelector('.modal');
const btnOpenPopup = document.querySelector('.btn-open-popup');
const btnOpenPopup1 = document.querySelector('.btn-open-popup1');*/

var modals = document.getElementsByClassName("modal")
var btns = document.getElementsByClassName("btn1");
var spanes = document.getElementsByClassName("close");
var funcs = [];

function Modal(num) {
    return function () {
        btns[num].onclick = function () {
            modals[num].style.display = "block";
            console.log(num);
        };

        spanes[num].onclick = function () {
            modals[num].style.display = "none";
        };
    };
}

for (var i = 0; i < btns.length; i++) {
    funcs[i] = Modal(i);
}

for (var j = 0; j < btns.length; j++) {
    funcs[j]();
}

window.onclick = function (event) {
    if (event.target.className == "modal") {
        event.target.style.display = "none";
    }
};

/*
btnOpenPopup.addEventListener('click', () => {
    modal.classList.toggle('show');

    if (modal.classList.contains('show')) {
        body.style.overflow = 'hidden';
    }
});

btnOpenPopup1.addEventListener('click', () => {
    modal.classList.toggle('show');

    if (modal.classList.contains('show')) {
        body.style.overflow = 'hidden';
    }
});

modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.classList.toggle('show');

        if (!modal.classList.contains('show')) {
            body.style.overflow = 'auto';
        }
    }
});

*/
