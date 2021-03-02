window.onload = codigo;
var claseOrigen, claseDestino, numPlagas, numFallos;
var galeria;

function codigo() {

    //PONER COOKIE EN EL CASO DE QUE NO LA HAYA
    if (leerCookie("puntuacion") == "") {
        ponerUnaCookie("puntuacion", 0, 7);
    }
    //REFLEJO LA PUNTUACION EN PANTALLA
    document.getElementById("puntuacion").innerText = "Puntuacion: " + leerCookie("puntuacion");
    var peticion, bd, transaccion, almacen;
    numFallos = 0;
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
                        if (cursor.value.aprendido == "no") {
                            if(numAle(6)!=1){
                                insertarElementoControlLista(cursor.value);
                            }
                        }else if(cursor.value.aprendido == "SI0"){
                            if(numAle(6)!=1){
                                insertarElementoControlLista(cursor.value);
                            }
                        }
                        else if(cursor.value.aprendido == "SI1"){
                            if(numAle(5)!=1){
                                insertarElementoControlLista(cursor.value);
                            }
                        }else if(cursor.value.aprendido == "SI2"){
                            if(numAle(4)!=1){
                                insertarElementoControlLista(cursor.value);
                            }
                        }else if(cursor.value.aprendido == "SI3"){
                            if(numAle(3)!=1){
                                insertarElementoControlLista(cursor.value);
                            }
                        }else if(cursor.value.aprendido == "SI4"){
                            if(numAle(2)!=1){
                                insertarElementoControlLista(cursor.value);
                            }
                        }else if(cursor.value.aprendido == "SI"){
                            if(numAle(2)==1){
                                insertarElementoControlLista(cursor.value);
                            }
                        }
                        cursor.continue(); //continue incrementa el cursor una posición
                    } else {
                        //TENGO QUE APLICAR ESTE METODO AQUI PORQUE SI LO PONGO AL FINAL DE LA 
                        //FUNCION, ME LO APLICA CUANDO AUN NO TIENE PARRAFOS
                        desordena();
                        hacerArrastrables();
                        fJquery();
                        mensajeIni("Tienes que arrastrar desde los nombres comunes hacia los nombres científicos", "De izquierda", "A derecha", 800, "green");
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
    var htmlTexto = plaga.nComun.toUpperCase();
    var listaItem = document.createElement("p");
    listaItem.setAttribute("class", plaga.id);
    listaItem.setAttribute("id", plaga.id + "comun");
    listaItem.textContent = htmlTexto;
    var lista = document.getElementById("nComunes");
    lista.appendChild(listaItem);

    //AHORA LOS NOMBRES CIENTIFICOS
    htmlTexto = plaga.nCientifico.toUpperCase();
    listaItem = document.createElement("p");
    listaItem.setAttribute("class", plaga.id);
    listaItem.textContent = htmlTexto;
    lista = document.getElementById("nCientifico");
    lista.appendChild(listaItem);

    //AHORA LAS IMAGENES DE LAS LARVAS
    var htmlFuente = plaga.imagenLarva;
    var figureLarva = document.createElement("figure");
    var imagenLarva = document.createElement("img");
    figureLarva.setAttribute("class", plaga.id);
    figureLarva.setAttribute("id", plaga.id + "iLarva");
    imagenLarva.setAttribute("class", plaga.id);
    imagenLarva.setAttribute("src", htmlFuente);
    imagenLarva.setAttribute("alt", "Imagen de una larva");
    figureLarva.appendChild(imagenLarva);
    galeria = document.getElementById("imgLarvas");
    galeria.appendChild(figureLarva);
    galeria.style.display = "none";

    //AHORA LAS IMAGENES DE LAS ADULTOS
    htmlFuente = plaga.imagenAdulto;
    var imagenAdulto = document.createElement("img");
    imagenAdulto.setAttribute("class", plaga.id);
    imagenAdulto.setAttribute("id", plaga.id + "iAdulto");
    imagenAdulto.setAttribute("src", htmlFuente);
    imagenAdulto.setAttribute("alt", "Imagen de un adulto");
    galeria = document.getElementById("imgAdulto");
    galeria.appendChild(imagenAdulto);
    galeria.style.display = "none";

    //AHORA TOCA PONER LAS IMAGENES DE LAS PUESTAS
    htmlFuente = plaga.imgPuesta;
    var imagenPuesta = document.createElement("img");
    imagenPuesta.setAttribute("class", plaga.id);
    imagenPuesta.setAttribute("id", plaga.id + "iPuesta");
    imagenPuesta.setAttribute("src", htmlFuente);
    imagenPuesta.setAttribute("alt", "Imagen de una puesta");
    galeria = document.getElementById("imgPuesta");
    galeria.appendChild(imagenPuesta);
    galeria.style.display = "none";

    //INSERTAMOS LAS IMAGENES DE DAÑOS
    htmlFuente = plaga.imgDanio;
    var imagenDanio = document.createElement("img");
    imagenDanio.setAttribute("class", plaga.id);
    imagenDanio.setAttribute("id", plaga.id + "iDanio");
    imagenDanio.setAttribute("src", htmlFuente);
    imagenDanio.setAttribute("alt", "Imagen de los daños provocados");
    galeria = document.getElementById("imgDanios");
    galeria.appendChild(imagenDanio);
    galeria.style.display = "none";

    //AHORA INSERTAMOS LOS TRATAMIENTOS FITOSANITARIOS 
    htmlTexto = plaga.tFitosanitario.toUpperCase();
    listaItem = document.createElement("p");
    listaItem.setAttribute("class", plaga.id);
    listaItem.setAttribute("id", plaga.id + "tf");
    listaItem.textContent = htmlTexto;
    lista = document.getElementById("tFitosanitario");
    lista.appendChild(listaItem);

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

    var nodobodytf = document.getElementById("tFitosanitario").getElementsByTagName("p");
    //AQUI METO TODOS LOS RESULTADOS DE LA BUSQUEDA
    var miArraytf = [];
    for (let i = 0; i < nodobodytf.length; i++) {
        miArraytf.push(nodobodytf[i]);
    }

    //y LUEGO LOS SACO DEL ARRAY Y LOS METO EN EL NODO DECLARADO Y HACIENDOLES DESAPARECER DEL ARRAY
    for (let i = 0; i < nodobodytf.length; i++) {
        let num = Math.floor(Math.random() * miArraytf.length);
        nodobodytf[i].parentNode.appendChild(miArraytf[num]);
        miArraytf.splice(num, 1);
    }
}
//FUNCION PARA ACTIVAR EL DRAG AND DROP
function hacerArrastrables() {
    var parrafosNcien = document.getElementsByClassName("nCientifico")[0].children;
    numPlagas = parrafosNcien.length;
    var nombresComunes = document.getElementById("nComunes").children;

    //AHORA TOCA HACER DRAGGABLES A LOS NOMBRES
    for (let i = 0; i < nombresComunes.length; i++) {
        nombresComunes[i].setAttribute("draggable", true);

        //FASE 1
        nombresComunes[i].addEventListener("dragstart", function (pEvento) {
            pEvento.dataTransfer.setData("", pEvento.target.id);
            //Esto es para que cuando hagamos el drop, no aseguremos de que lo dejemos caer, sea una caja diferente
            //AUNQUE AHORA MISMO NO SE MUY BIEN PARA QUE ES UTIL REALMENTE
            //clasePadreOrigen = pEvento.target.parentElement.getAttribute("class");

        });

        //FASE 2
        parrafosNcien[i].addEventListener("dragover", function (pEvento) {
            pEvento.preventDefault();
            //jquery para wsaber enpcima de cual estoy encima de donde lo quiero dejar
            $("#nCientifico > p").animate(function (v, i) {
                return '{fontSize: "15px", borderWidth:"1px"}, 200)';

            });
            $(parrafosNcien[i]).animate({ fontSize: "20px", borderWidth: "5px" }, 200);
        });

        //FASE 3
        parrafosNcien[i].addEventListener("drop", function (pEvento) {
            //Esta instruccion es donde campuro los datos que he empezado a arrastrar en la fase 1
            claseDestino = pEvento.target.getAttribute("class");

            var datos = pEvento.dataTransfer.getData("");
            claseOrigen = document.getElementById(datos).getAttribute("class");
            //LE HAGO VOLVER A SU SER
            $("#nCientifico > p").animate({ fontSize: "15px", borderWidth: "1px" }, 200);
            if (claseDestino == claseOrigen) {
                //De aqui recojo el objeto que comienzo a arrastrar  
                parrafosNcien[i].appendChild(document.createTextNode(" -> " + document.getElementById(datos).textContent));
                modificarCookie("puntuacion", 1);
                mensaje("Buen trabajo", 800, "blue");
                $(parrafosNcien[i]).css("backgroundColor", "greenyellow");
                //Lo hago desaparecer, porque cuando complete esta parte, las quiero volver a usar
                $("#" + datos).hide("slow");
                numPlagas--;
                cambiarIndexed(claseDestino, "SI0");
            } else {
                cambiarIndexed(claseDestino, "no");
                numFallos++;
                modificarCookie("puntuacion", -2);
                if (numFallos > 2) {
                    redireccionar();
                } else {
                    mensaje("INCORRECTO!! Has fallado " + numFallos + " veces", 800, "red");
                }
            }
            //Cuando ha unido todos los nombre cientificos con los comunes, que haga lo siguiente
            if (numPlagas == 0) {
                for (let j = 0; j < nombresComunes.length; j++) {
                    //console.log("N plagas: " + numPlagas);
                    /**MEDIANTE JQUERY */
                    $("#nComunes > p:eq(" + j + ")").show(2000);
                    //nombresComunes[j].style.display = "block";
                }
                //VUELVO A DAR VALOR AL NUMERO DE PLAGAS PARA COMENZAR DE NUEVO

                $(".nCientifico").hide("slow");
                $("#imgLarvas").delay(1500).show(2000, function () {
                    mensajeImg("Ahora coloca los nombres sobre las imagenes correctas", "De izquierda", "A derecha", 2000, "green");
                });
                //TENGO QUE DARLE VALOR DESPUES DE QUE APAREZCAN
                numPlagas = document.getElementById("imgLarvas").children.length;
                hacerArrastrablesImg();
                agrandaImagenes();
            }
        });
    }
}

function hacerArrastrablesImg() {
    var fotosLarvas = document.getElementById("imgLarvas").children;
    for (let i = 0; i < fotosLarvas.length; i++) {

        //FASE 2 PARA LAS FOTOS DE LARVAS
        fotosLarvas[i].addEventListener("dragover", function (pEvento) {
            pEvento.preventDefault();

        });

        //FASE 3 PARA LAS FOTOS DE LARVAS
        fotosLarvas[i].addEventListener("drop", function (pEvento) {
            //Esta instruccion es donde campuro los datos que he empezado a arrastrar en la fase 1
            claseDestino = pEvento.target.parentElement.getAttribute("class");
            var datos = pEvento.dataTransfer.getData("");
            claseOrigen = document.getElementById(datos).getAttribute("class");

            /****************ESTE CONSOLE ES PARA USAR COMO CONTROL*************************
             * *************MAS ABAJO LO ESTOY APLICANDO*************** */
            //console.log(document.getElementById(datos).parentElement.classList.value);
            var clasePadre = document.getElementById(datos).parentElement.classList.value;

            if (document.getElementById(datos).parentElement.classList.value == "nComunes") {
                if (claseDestino == claseOrigen) {
                    //De aqui recojo el objeto que comienzo a arrastrar  
                    var texto = document.createTextNode(document.getElementById(datos).textContent);
                    var elemento = document.createElement("figcaption");
                    elemento.appendChild(texto);
                    //ESTO ES PARA PONERLO EN LA CABECERA
                    fotosLarvas[i].insertBefore(elemento, fotosLarvas[i].childNodes[0]);
                    $("#" + datos).hide("slow");
                    $("." + claseDestino).css("backgroundColor", "greenyellow");
                    modificarCookie("puntuacion", 1);
                    mensaje("Buen trabajo", 800, "blue");
                    numPlagas--;
                    cambiarIndexed(claseDestino, "SI1");
                } else {
                    cambiarIndexed(claseDestino, "SI0");
                    numFallos++;
                    modificarCookie("puntuacion", -2);
                    if (numFallos > 3) {
                        redireccionar();
                    } else {
                        mensaje("INCORRECTO!! Has fallado " + numFallos + " veces", 800, "red");
                    }
                }
            } else if (document.getElementById(datos).parentElement.classList.value == "imgAdulto") {
                if (claseDestino == claseOrigen) {
                    document.getElementById(datos).style.border = "none";
                    fotosLarvas[i].appendChild(document.getElementById(datos));
                    modificarCookie("puntuacion", 1);
                    mensaje("Buen trabajo", 800, "green");
                    numPlagas--;
                    //console.log(fotosLarvas[i].innerHTML);
                    cambiarIndexed(claseDestino, "SI2");
                } else {
                    cambiarIndexed(claseDestino, "SI1");
                    numFallos++;
                    modificarCookie("puntuacion", -2);
                    if (numFallos > 5) {
                        redireccionar();
                    } else {
                        mensaje("INCORRECTO!! Has fallado " + numFallos + " veces", 800, "red");
                    }
                }
            } else if (document.getElementById(datos).parentElement.classList.value == "imgPuesta") {
                //console.log("clase origen:" + claseOrigen + " clase destino: " + claseDestino);
                if (claseDestino == claseOrigen) {
                    document.getElementById(datos).style.border = "none";
                    fotosLarvas[i].appendChild(document.getElementById(datos));
                    modificarCookie("puntuacion", 1);
                    mensaje("Buen trabajo", 800, "blue");
                    numPlagas--;
                    cambiarIndexed(claseDestino, "SI3");
                } else {
                    cambiarIndexed(claseDestino, "SI2");
                    numFallos++;
                    modificarCookie("puntuacion", -2);
                    if (numFallos > 7) {
                        redireccionar();
                    } else {
                        mensaje("INCORRECTO!! Has fallado " + numFallos + " veces", 800, "red");
                    }
                }
            } else if (document.getElementById(datos).parentElement.classList.value == "imgDanios") {
                if (claseDestino == claseOrigen) {
                    document.getElementById(datos).style.border = "none";
                    fotosLarvas[i].appendChild(document.getElementById(datos));
                    modificarCookie("puntuacion", 1);
                    mensaje("Buen trabajo", 800, "blue");
                    numPlagas--;
                    cambiarIndexed(claseDestino, "SI4");
                } else {
                    cambiarIndexed(claseDestino, "SI3");
                    numFallos++;
                    modificarCookie("puntuacion", -2);
                    if (numFallos > 9) {
                        redireccionar();
                    } else {
                        mensaje("INCORRECTO!! Has fallado " + numFallos + " veces", 800, "red");
                    }
                }
            } else if (document.getElementById(datos).parentElement.classList.value == "tFitosanitario") {

                if (claseDestino == claseOrigen) {
                    $("." + claseDestino).hide(1000);
                    modificarCookie("puntuacion", 1);
                    mensaje("Buen trabajo", 800, "blue");
                    numPlagas--;
                    console.log("clase origen: " + claseOrigen + " num: " + numPlagas + ", " + fotosLarvas[i].innerHTML);
                    cambiarIndexed(claseDestino, "SI");
                    if (numPlagas == 0) {
                        redireccionarFin();
                    }
                } else {
                    cambiarIndexed(claseDestino, "SI4");
                    numFallos++;
                    modificarCookie("puntuacion", -2);
                    if (numFallos > 10) {
                        redireccionar();
                    } else {
                        mensaje("INCORRECTO!! Has fallado " + numFallos + " veces", 800, "red");
                    }
                }
            }
            //UNA VEZ QUE HEMOS ACABADO CON LAS PLAGAS, UNA PARTE LA HACEMOS DESAPARECER Y OTRA QUE APAREZCA
            if (numPlagas == 0) {
                //console.log("clasePadre:" + clasePadre);
                if (clasePadre == "nComunes") {
                    document.getElementById(datos).parentElement.style.display = "none";
                    $("." + claseDestino).parent().css("float", "left");
                    $("#imgAdulto").css("float", "right");
                    $("#imgAdulto").delay(1000).show(2500, function () {
                        mensajeImgL("Ahora coloca las fotos de los adultos sobre las larvas", "De derecha", "A izquierda", 2000, "green");
                    });
                    hacerArrastrablesadultos();
                } else if (clasePadre == "imgAdulto") {
                    document.getElementsByClassName(clasePadre)[0].style.display = "none";
                    $("#imgPuesta").show("slow").css("float", "right");
                    $("#imgPuesta").delay(1000).show(2500, function () {
                        mensajeImgL("Ahora coloca las fotos de sus puestas", "De derecha", "A izquierda", 2000, "purple");
                    });
                    hacerArrastrablesPuestas();
                } else if (clasePadre == "imgPuesta") {
                    document.getElementsByClassName(clasePadre)[0].style.display = "none";
                    $("#imgDanios").show("slow").css("float", "right");
                    $("#imgDanios").delay(1000).show(2500, function () {
                        mensajeImgL("Ahora coloca las fotos de los daños", "De derecha", "A izquierda", 2000, "purple");
                    });
                    hacerArrastrablesDanios();
                } else if (clasePadre == "imgDanios") {
                    document.getElementsByClassName(clasePadre)[0].style.display = "none";
                    $("#tFitosanitario").show("slow").css("float", "right");
                    $("#tFitosanitario").delay(1000).show(2500, function () {
                        mensajeImgL("Ahora coloca los tratamientos fitosanitarios", "De derecha", "A izquierda", 1000, "purple");
                    });
                    hacerArrastrablesTFito();

                }
            }
        });
    }
}
/***************AHORA HAREMOS ARRASTRABLES A LOS ADULTOS*********************************** */
function hacerArrastrablesadultos() {
    var imgAdultos = document.getElementById("imgAdulto").children;
    //var imgLarvas = document.getElementById("imgLarvas").children;
    numPlagas = imgAdultos.length;
  
    for (let i = 0; i < imgAdultos.length; i++) {
        imgAdultos[i].setAttribute("draggable", true);
        //FASE 1
        imgAdultos[i].addEventListener("dragstart", function (pEvento) {
            pEvento.dataTransfer.setData("", pEvento.target.id);
            console.log(pEvento.target.id);

            // alert(imgAdultos[i].parentElement.classList);
        });
    }
}

/***************TENEMOS QUE HACER ARRASTRABLES LAS IMAGENES DE LAS PUESTAS**************************************************** */
function hacerArrastrablesPuestas() {
    var imgPuesta = document.getElementById("imgPuesta").children;
    numPlagas = imgPuesta.length;
    for (let i = 0; i < imgPuesta.length; i++) {
        imgPuesta[i].setAttribute("draggable", true);
        //FASE 1
        imgPuesta[i].addEventListener("dragstart", function (pEvento) {
            pEvento.dataTransfer.setData("", pEvento.target.id);
            console.log(pEvento.target.id);
        });
    }
}

/***************AHORA HAREMOS ARRASTRABLES A LOS DAÑOS*********************************** */
function hacerArrastrablesDanios() {
    var imgDanios = document.getElementById("imgDanios").children;
    //var imgLarvas = document.getElementById("imgLarvas").children;
    numPlagas = imgDanios.length;
    //AHORA TOCA HACER DRAGGABLES A LAS IMAGENES
    for (let i = 0; i < imgDanios.length; i++) {
        imgDanios[i].setAttribute("draggable", true);
        //FASE 1
        imgDanios[i].addEventListener("dragstart", function (pEvento) {
            pEvento.dataTransfer.setData("", pEvento.target.id);

            // console.log(imgDanios[i].parentElement.classList);
        });
    }
}

/*************AHORA TOCA HACER ARRASTRABLES LOS TRATAMIENTOS FITOSANITARIOS********************************* */
function hacerArrastrablesTFito() {
    var nombresTFito = document.getElementById("tFitosanitario").children;
    numPlagas = nombresTFito.length;
    for (let i = 0; i < nombresTFito.length; i++) {

        nombresTFito[i].setAttribute("draggable", true);

        nombresTFito[i].addEventListener("dragstart", function (pEvento) {
            pEvento.dataTransfer.setData("", pEvento.target.id);
            //console.log("fito: " + pEvento.target.id);
        });
    }
}


/*****************MODIFICO EL INDEXED******************************************************** */
function cambiarIndexed(id, arg) {
    var peticion, bd, transaccion, almacen;
    var nComun, nCientifico, oCuarentena, hospedante, aprendido, tFitosanitario, imagenAdulto,
        imagenHospedante, imagenLarva, imgDanio, imgPuesta;
    //function abrirPlagas() {
    if (window.indexedDB) {
        peticion = window.indexedDB.open("plagasBD");
        peticion.onsuccess = function (evento) {
            bd = evento.target.result;
            transaccion = bd.transaction(bd.objectStoreNames, "readwrite");
            almacen = transaccion.objectStore("plagas");
            var registroEvento = almacen.get(parseInt(id));
            registroEvento.onsuccess = function (evento) {
                console.log(registroEvento.result);
                id = registroEvento.result.id;
                nCientifico = registroEvento.result.nCientifico;
                nComun = registroEvento.result.nComun;
                oCuarentena = registroEvento.result.oCuarentena;
                hospedante = registroEvento.result.hospedante;
                //aprendido = registroEvento.result.aprendido;
                tFitosanitario = registroEvento.result.tFitosanitario;
                imagenAdulto = registroEvento.result.imagenAdulto;
                imagenHospedante = registroEvento.result.imagenHospedante;
                imagenLarva = registroEvento.result.imagenLarva;
                imgDanio = registroEvento.result.imgDanio;
                imgPuesta = registroEvento.result.imgPuesta;

                /*****************AHORA VOY A TRATAR DE MODIFICARLO*************** */
                var transaccionModificar = bd.transaction(bd.objectStoreNames, "readwrite");
                var almacenModificar = transaccionModificar.objectStore("plagas");
                var nuevaPlaga = {};

                nuevaPlaga.id = id;
                nuevaPlaga.nCientifico = nCientifico;
                nuevaPlaga.nComun = nComun;
                nuevaPlaga.oCuarentena = oCuarentena;
                nuevaPlaga.hospedante = hospedante;
                nuevaPlaga.aprendido = arg;
                nuevaPlaga.tFitosanitario = tFitosanitario;
                nuevaPlaga.imagenAdulto = imagenAdulto;
                nuevaPlaga.imagenHospedante = imagenHospedante;
                nuevaPlaga.imagenAdulto = imagenAdulto;
                nuevaPlaga.imagenLarva = imagenLarva;
                nuevaPlaga.imgDanio = imgDanio;
                nuevaPlaga.imgPuesta = imgPuesta;
                almacenModificar.put(nuevaPlaga);
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
    // }
}


/*****************VAMOS A METERLE UN POCO DE JQUERY*********************** */
function fJquery() {

    $(".nComunes > p, .tFitosanitario > p").hover(function () {
        $(this).css("backgroundColor", "red");
        $(this).animate({ fontSize: "22px", borderWidth: "5px" }, 200)
    }, function () {
        $(".nComunes > p, .tFitosanitario > p").css("backgroundColor", "white");
        $(this).animate({ fontSize: "16px", borderWidth: "1px" }, 200)
    });

}

function mensaje(mensaje, tiempo, color) {
    $(".men").show();
    $(".mensaje").css("color", color);
    $(".mensaje").text(mensaje);
    $(".mensaje").fadeIn(tiempo, function () {
        $(".mensaje").animate({ fontSize: "75px" }, tiempo / 2);
        $(".mensaje").animate({ fontSize: "50px" }, tiempo / 2);
        $(".mensaje").fadeOut(tiempo);
        $(".men").hide();
    });
}
function mensajeIni(mensajeP, mensaje1, mensaje2, tiempo, color) {
    $(".men").show();
    $(".mensaje").css("color", color);
    $(".mensaje").text(mensajeP);
    $(".mensaje").fadeIn(tiempo * 2, function () {
        $(".mensaje").text(mensaje1);
        $(".mensaje").animate({ left: "5%", right: "65%", top: "10%" }, tiempo, function () {
            $(".mensaje").text(mensaje2);
        });
        $(".mensaje").animate({ left: "60%", right: "10%", top: "10%" }, tiempo / 2);
        $(".mensaje").fadeOut(tiempo * 2);
        //VUELVE A SU SITIO
        $(".mensaje").animate({ left: "10%", right: "10%", top: "40%" }, tiempo / 2, function () {
            $(".men").hide();
        });
    });
}

function mensajeImgL(mensajeP, mensaje1, mensaje2, tiempo, color) {
    $(".men").show();
    $(".mensaje").css("color", color);
    $(".mensaje").text(mensajeP);
    $(".mensaje").fadeIn(tiempo * 2, function () {
        $(".mensaje").text(mensaje1);
        $(".mensaje").animate({ left: "65%", right: "5%", top: "10%" }, tiempo, function () {
            $(".mensaje").text(mensaje2);
        });
        $(".mensaje").animate({ left: "5%", right: "65%", top: "10%" }, tiempo / 2);
        $(".mensaje").fadeOut(tiempo * 2);
        //VUELVE A SU SITIO
        $(".mensaje").animate({ left: "10%", right: "10%", top: "40%" }, tiempo / 4, function () {
            $(".men").hide();
        });
    });
}


function mensajeImg(mensajeP, mensaje1, mensaje2, tiempo, color) {
    $(".men").show();
    $(".mensaje").css("color", color).text(mensajeP).fadeIn(tiempo * 2, function () {
        $(".mensaje").text(mensaje1).animate({ left: "5%", right: "65%", top: "10%" }, tiempo, function () {
            $(".mensaje").text(mensaje2);
        }).animate({ left: "60%", right: "10%", top: "10%" }, tiempo / 2).fadeOut(tiempo * 2).animate({ left: "10%", right: "10%", top: "40%" }, tiempo / 2, function () {
            $(".men").hide();
        });
    });
}

function agrandaImagenes() {
    $("img").css("width", '200px').css("height", '80px');
    $("img").click(function () {
        $(this).animate({ width: '425px', height: '250px' }, 600);
    });
    $("img").dblclick(function () {
        $(this).animate({ width: '200px', height: '80px' }, 600);
    });
}

/*************** REDIRECCIONAMOS EN CASO DE MUCHOS FALLOS ***************************************** */

function redireccionar() {
    var tiempo = 1200;
    $(".men").show(tiempo);
    $(".mensaje").css("color", "red");
    $(".mensaje").text("Has fallado muchas veces, necesitaras estudia más.");
    $(".mensaje").fadeIn(tiempo, function () {
        $(".mensaje").animate({ fontSize: "60px" }, tiempo / 2).animate({ fontSize: "50px" }, tiempo / 2).fadeOut(tiempo / 2, function () {
            window.location = "index.html";
        });
        $("*").hide(tiempo*2);
    });
}

function redireccionarFin() {
    var tiempo = 2000;
    $(".men").show(tiempo);
    $(".mensaje").css("color", "red");
    $(".mensaje").text("Has finalizado con exito!!");
    $(".mensaje").fadeIn(tiempo, function () {
        $(".mensaje").animate({ fontSize: "100px" }, tiempo / 2);
        $(".mensaje").animate({ fontSize: "50px" }, tiempo / 2);
        $("*").hide(tiempo * 4);
        $(".mensaje").fadeOut(tiempo / 2, function () {
            window.location = "index.html";
        });
    });
}

/*************************FUNCIONES PARA TRABAJAR  CON LAS COOKIES  ***************************** */

function ponerUnaCookie(clave, valor, dias = 0) {
    var miCookie = "";
    if (dias > 0) {
        //Con el new Date vacio, le estamos dando la fecha del momento
        var fecha = new Date();
        fecha.setTime(fecha.getTime() + (dias * 24 * 60 * 60 * 1000));

        var expires = "expires=" + fecha.toUTCString();

        miCookie = clave + "=" + valor + ";" + expires; //PERMANENTE
    } else {
        miCookie = clave + "=" + valor; //SESIÓN
    }
    document.cookie = miCookie;
}

function leerCookie(clave) {
    var resultado = "";
    //Como el formato siempre tiene que llevar entre la clave y el valor, un =, pues ta se lo añadimos aqui
    var busqueda = clave + "=";
    var listCookies = document.cookie.split(';');
    var par = "";
    for (var i = 0; i < listCookies.length; i++) {
        par = listCookies[i]; //Cada elemento del array de cookies: nombre de la cookie y carácter =
        while (par.charAt(0) == ' ') {
            par = par.substring(1);
        }
        if (par.indexOf(busqueda) == 0) {
            resultado = par.substring(busqueda.length, par.length);
        }
    }
    return resultado;
}

function modificarCookie(cookie, num) {
    document.cookie = cookie + "=" + (parseInt(leerCookie(cookie)) + num);
    document.getElementById("puntuacion").innerText = "Puntuacion: " + leerCookie("puntuacion");
}
/********************* FUNCION PARA PARA USAR A LA HORA DE INSERTAR DEPNDIENDO SI ESTA APRENDIDO O NO  ************************************************************************* */
function numAle(i) {
    var ale=Math.floor(Math.random()*i);
    return ale;    
}
