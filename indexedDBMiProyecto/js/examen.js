window.onload = codigo;

function codigo() {
    var peticion, bd, transaccion, almacen;
    refrescarListaPlagas();

    function refrescarListaPlagas() {
        if (window.indexedDB) {
            peticion = window.indexedDB.open("plagasBD");

            peticion.onsuccess = function (evento) {
                bd = evento.target.result;

                transaccion = bd.transaction(bd.objectStoreNames, "readwrite");
                almacen = transaccion.objectStore("plagas");

                document.getElementById("nComunes").innerHTML = "";

                var peticionCursor = almacen.openCursor();
                peticionCursor.onsuccess = function () {
                    var cursor = peticionCursor.result;
                    //ESTO LO PUEDO USAR PARA CONTROLAR SI SE LO SABE O NO
                    if (cursor)
                        console.log(cursor.value.aprendido);
                    if (cursor) {
                        if (!cursor.value.aprendido) {
                            insertarElementoControlLista(cursor.value);
                        }
                        cursor.continue(); //continue incrementa el cursor una posición
                    } else {
                        console.log("FIN");
                        //TENGO QUE APLICAR ESTE METODO AQUI PORQUE SI LO PONGO AL FINAL DE LA 
                        //FUNCION, ME LO APLICA CUANDO AUN NO TIENE PARRAFOS
                        desordena();
                    }
                }
            };

            peticion.onerror = function (evento) {
                alert("No se ha creado la base de datos: " + event.target.errorCode);
            };


            peticion.onupgradeneeded = function (evento) {
                console.log("Upgradeneeded");
            };

        } else {
            console.log("IndexedDB no está soportado");
        }
    }

    function insertarElementoControlLista(plaga) {
        //INSERCCION DE LOS NOMBRE COMUNES
        var htmlTexto = plaga.nComun;
        var listaItem = document.createElement("p");
        listaItem.setAttribute("class", plaga.id);
        listaItem.textContent = htmlTexto;
        var lista = document.getElementById("nComunes");
        lista.appendChild(listaItem);

        //AHORA LOS NOMBRES CIENTIFICOS
        htmlTexto = plaga.nCientifico;
        listaItem = document.createElement("p");
        listaItem.setAttribute("class", plaga.id);
        listaItem.textContent = htmlTexto;
        lista = document.getElementById("nCientifico");
        lista.appendChild(listaItem);
    }

}


function desordena() {
    var nodobody = document.getElementById("nComunes").getElementsByTagName("p");
    var miArray = [];
    for (let i = 0; i < nodobody.length; i++) {
        miArray.push(nodobody[i]);

    }

    for (let i = 0; i < nodobody.length; i++) {
        let num = Math.floor(Math.random() * miArray.length);
        nodobody[i].parentNode.appendChild(miArray[num]);
        miArray.splice(num, 1);
    }
}