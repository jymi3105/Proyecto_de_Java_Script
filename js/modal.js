var dale = document.getElementsByTagName("button");
var imagenes_modal = document.getElementById('imagenes-modal');
var close = document.getElementById('close');
alert(dale);
dale[0].addEventListener('click', function () {
    imagenes_modal.classList.add('show');
    alert(dale);
});

/*dale.addEventListener('click', () => {
    imagenes_modal.classList.remove('show');
});*/

