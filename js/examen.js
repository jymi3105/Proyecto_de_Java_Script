window.onload = codigo;
var claseOrigen, claseDestino, numPlagas;
var galeria;
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
                        if (cursor.value.aprendido != "si") {
                            insertarElementoControlLista(cursor.value);
                        }
                        cursor.continue(); //continue incrementa el cursor una posición
                    } else {
                        //TENGO QUE APLICAR ESTE METODO AQUI PORQUE SI LO PONGO AL FINAL DE LA 
                        //FUNCION, ME LO APLICA CUANDO AUN NO TIENE PARRAFOS
                        desordena();
                        hacerArrastrables();

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
}

//FUNCION PARA INSERTAR TODOS LOS ELEMENTOS EN LA WEB DEPENDIENDO DEL INDEXEDDB
function insertarElementoControlLista(plaga) {
    //INSERCCION DE LOS NOMBRE COMUNES
    var htmlTexto = plaga.nComun;
    var listaItem = document.createElement("p");
    listaItem.setAttribute("class", plaga.id);
    listaItem.setAttribute("id", plaga.id + "comun");
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

    //AHORA LAS IMAGENES DE LAS LARVAS
    var htmlFuente=plaga.imagenLarva;
    var imagenLarva=document.createElement("img");
    imagenLarva.setAttribute("class", plaga.id);
    imagenLarva.setAttribute("id", plaga.id + "iLarva");
    imagenLarva.setAttribute("src", htmlFuente);
    imagenLarva.setAttribute("alt", "Imagen de una larva");
    galeria=document.getElementById("imgLarvas");
    galeria.appendChild(imagenLarva);
    galeria.style.display="none";

    //AHORA LAS IMAGENES DE LAS ADULTOS
    htmlFuente=plaga.imagenAdulto;
    var imagenAdulto=document.createElement("img");
    imagenAdulto.setAttribute("class", plaga.id);
    imagenAdulto.setAttribute("id", plaga.id + "iAdulto");
    imagenAdulto.setAttribute("src", htmlFuente);
    imagenAdulto.setAttribute("alt", "Imagen de un adulto");
    galeria=document.getElementById("imgAdulto");
    galeria.appendChild(imagenAdulto);
    galeria.style.display="none";
}

function desordena() {
    var nodobody = document.getElementById("nComunes").getElementsByTagName("p");
    //AQUI METO TODOS LOS RESULTADOS DE LA BUSQUEDA
    var miArray = [];
    for (let i = 0; i < nodobody.length; i++) {
        miArray.push(nodobody[i]);
    }

    //y LUEGO LOS SACO DEL ARRAY Y LOS METO EN EL NODO DECLARADO Y HACIENDOLES DESAPARECER DEL ARRAY
    for (let i = 0; i < nodobody.length; i++) {
        let num = Math.floor(Math.random() * miArray.length);
        nodobody[i].parentNode.appendChild(miArray[num]);
        miArray.splice(num, 1);
    }
}
//FUNCION PARA ACTIVAR EL DRAG AND DROP
function hacerArrastrables() {
    var parrafosNcien = document.getElementsByClassName("nCientifico")[0].children;
    numPlagas=parrafosNcien.length;
    //console.log("numero de plagas: " + numPlagas);
    
    var nombresComunes = document.getElementById("nComunes").children;
    //AHORA TOCA HACER DRAGGABLES A LOS NOMBRES
    for (let i = 0; i < nombresComunes.length; i++) {
        nombresComunes[i].setAttribute("draggable", true);
        var clasePadreOrigen;
        //FASE 1
        nombresComunes[i].addEventListener("dragstart", function (pEvento) {
            pEvento.dataTransfer.setData("", pEvento.target.id);
            //Esto es para que cuando hagamos el drop, no aseguremos de que lo dejemos caer, sea una caja diferente
            //AUNQUE AHORA MISMO NO SE MUY BIEN PARA QUE ES UTIL REALMENTE
            clasePadreOrigen = pEvento.target.parentElement.getAttribute("class");
  
        });
        //FASE 2
        parrafosNcien[i].addEventListener("dragover", function (pEvento) {
            pEvento.preventDefault();
        });

    //FASE 3
    parrafosNcien[i].addEventListener("drop", function (pEvento) {
        //Esta instruccion es donde campuro los datos que he empezado a arrastrar en la fase 1
        claseDestino = pEvento.target.getAttribute("class");
        //Creo que la siguiente instruccion no tiene uso
        //clasePadreDestino = pEvento.target.parentElement.getAttribute("class");
        var datos = pEvento.dataTransfer.getData("");
        claseOrigen = document.getElementById(datos).getAttribute("class");

        if (claseDestino == claseOrigen) {
            //De aqui recojo el objeto que comienzo a arrastrar  
            parrafosNcien[i].appendChild(document.createTextNode(" -> " + document.getElementById(datos).textContent));
            //Lo hago desaparecer, porque cuando complete esta parte, las quiero volver a usar
            document.getElementById(datos).style.display = "none";
            numPlagas--;
            
        } else {
            console.log("No coincide las especies");
        }
        //Cuando ha unido todos los nombre cientificos con los comunes, que haga lo siguiente
        if (numPlagas == 0) {
            for (let j = 0; j < nombresComunes.length; j++) {
                console.log("N plagas: " + numPlagas);
                nombresComunes[j].style.display = "block";
            }
            //VUELVO A DAR VALOR AL NUMERO DE PLAGAS PARA COMENZAR DE NUEVO
            numPlagas = nombresComunes[i].length;
            document.getElementsByClassName("nCientifico")[0].style.display = "none";
            //DE MOMENTO LO DEJO DESACTIVADO, PORQUE NO TENGO LOS ARBOLES AÑADIDOS
            //ADEMAS PREFIERO AÑADIR PRIMERO LAS LARVAS
            galeria.style.display = "block";
        }
    });

    }
}
