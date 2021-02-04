var parrafosN = document.getElementsByClassName("nCientifico");
var parrafosNc = document.getElementsByClassName("nComun");
var fotosLarvas = document.getElementById("larvas").getElementsByTagName("figure");
var fotosAdultos = document.getElementsByClassName("adultos");
var fotosCiclos = document.getElementsByClassName("ciclos");
var fotosPuestas = document.getElementsByClassName("puestas");
var fotosDanios = document.getElementsByClassName("danios");
var arboles = document.getElementById("arboles");
var larvas = document.getElementById("larvas");
var claseOrigen, claseDestino;
var aleatorio, visibilidades = [];


//Lo voy metiendo en un array para tener siempre los mismos elementos visibles
for (let i = 0; i < parrafosN[0].children.length; i++) {
    aleatorio = Math.floor(Math.random() * 3);
    visibilidades.push(aleatorio);

}
//Borro  algunos de modo aleatorio
for (let i = 0, t = 0; i < visibilidades.length; i++, t++) {
    if (visibilidades[i] == 0) {
        parrafosN[0].children[t].remove();
        parrafosNc[0].children[t].remove();
        //Le sumo uno, porque esta el h3 al principio como titulo
        fotosAdultos[0].children[t + 1].remove();
        fotosCiclos[0].children[t + 1].remove();
        fotosPuestas[0].children[t + 1].remove();
        fotosDanios[0].children[t + 1].remove();
        t--;
    }
}

//borro fotos de larvas
for (let i = 0, t = 0; i < visibilidades.length; i++, t++) {
    if (visibilidades[i] == 0) {
        fotosLarvas[t].remove();
        //fotosLarvas.removeChild(fotosLarvas.childNodes[t + 1]);
        t--;
    }
}

desordena();

var numPlagas = parrafosN[0].children.length;

for (let i = 0; i < parrafosN[0].children.length; i++) {

    parrafosN[0].children[i].setAttribute("draggable", true);
    var clasePadreOrigen, idOrigen;

    //FASE 1
    parrafosN[0].children[i].addEventListener("dragstart", function (pEvento) {
        pEvento.dataTransfer.setData("", pEvento.target.id);
        //Esto es para que cuando hagamos el drop, no aseguremos de que lo dejemos caer, sea una caja diferente
        clasePadreOrigen = pEvento.target.parentElement.getAttribute("class");
    });

    //FASE 2
    parrafosNc[0].children[i].addEventListener("dragover", function (pEvento) {
        pEvento.preventDefault();
    });

    //FASE 3
    parrafosNc[0].children[i].addEventListener("drop", function (pEvento) {
        //Esta instruccion es donde campuro los datos que he empezado a arrastrar en la fase 1
        claseDestino = pEvento.target.getAttribute("class");
        //Creo que la siguiente instruccion no tiene uso
        //clasePadreDestino = pEvento.target.parentElement.getAttribute("class");
        var datos = pEvento.dataTransfer.getData("");
        claseOrigen = document.getElementById(datos).getAttribute("class");

        if (claseDestino == claseOrigen) {
            //De aqui recojo el objeto que comienzo a arrastrar  
            parrafosNc[0].children[i].appendChild(document.createTextNode(" -> " + document.getElementById(datos).textContent));
            //Lo hago desaparecer, porque cuando complete esta parte, las quiero volver a usar
            document.getElementById(datos).style.display = "none";
            numPlagas--;
        } else {
            console.log("No coincide las especies");
        }
        //Cuando ha unido todos los nombre cientificos con los comunes, que haga lo siguiente
        if (numPlagas == 0) {
            for (let j = 0; j < parrafosN[0].children.length; j++) {
                parrafosN[0].children[j].style.display = "block";
            }
            numPlagas = parrafosN[0].children.length;
            document.getElementsByClassName("nComun")[0].style.display = "none";
            document.getElementsByClassName("arboles")[0].style.display = "block";
        }
    });
}

//Le añadimos las propiedades a las imagenes de los arboles
for (let i = 0; i < arboles.children.length; i++) {
    //FASE 2
    arboles.children[i].addEventListener("dragover", function (pEvento) {
        pEvento.preventDefault();
    });
    //FASE 3
    arboles.children[i].addEventListener("drop", function (pEvento) {
        var datos = pEvento.dataTransfer.getData("");
        var figC = document.createElement("figcaption");
        var texto = document.createTextNode(document.getElementById(datos).textContent);
        //Aqui le añado el comentario en el pie de foto de las plagas que le puede afectar
        figC.appendChild(texto);
        claseOrigen = document.getElementById(datos).getAttribute("class");
        //Si la foto contiene la clase origen, pues que haga eso
        if (arboles.children[i].classList.contains(claseOrigen)) {
            arboles.children[i].appendChild(figC);
            document.getElementById(datos).style.display = "none";
            numPlagas--;
        }
        //Una vez que he asignado todas las plagas a arboles, visibilizo e invisibilizo
        if (numPlagas == 0) {
            for (let j = 0; j < parrafosN[0].children.length; j++) {
                parrafosN[0].children[j].style.display = "block";
            }
            numPlagas = parrafosN[0].children.length;
            document.getElementsByClassName("larvas")[0].style.display = "block";
            // document.getElementsByClassName("adultos")[0].style.display = "block";
            document.getElementsByClassName("arboles")[0].style.display = "none";
            //Esto es para recargar la pagina
            //location.reload(); 
        }
    });
}

//le añadimos las propiedades a las imagenes de las larvas
for (let i = 0; i < larvas.children.length; i++) {
    //FASE 2
    larvas.children[i].addEventListener("dragover", function (pEvento) {
        pEvento.preventDefault();
    });
    //FASE 3
    larvas.children[i].addEventListener("drop", function (pEvento) {
        claseDestino = pEvento.target.getAttribute("class");
        var datos = pEvento.dataTransfer.getData("");
        claseOrigen = document.getElementById(datos).getAttribute("class");

        if (claseDestino == claseOrigen) {
            let p = document.createElement("figcaption");
            p.appendChild(document.createTextNode(document.getElementById(datos).textContent));
            //De aqui recojo el objeto que comienzo a arrastrar  
            larvas.children[i].appendChild(p);
            //Lo hago desaparecer, porque cuando complete esta parte, las quiero volver a usar
            document.getElementById(datos).style.display = "none";
            numPlagas--;
            if (numPlagas == 0) {
                document.getElementsByClassName("nombres")[0].remove();
                document.getElementsByClassName("adultos")[0].style.display = "block";
                fotosLarvas = document.getElementById("larvas").getElementsByTagName("figure");
                //hacemos arrastrable a las larvas con el comentario
                for (let i = 0; i < fotosLarvas.length; i++) {
                    console.log(fotosLarvas[i]);
                    //Antes tengo que quitarle a la imagen, el atributo de arrastrable, porque 
                    //sino me lo cogerá antes a la imagen, que el figure si comienzo pinchando en 
                    //la imagen
                    fotosLarvas[i].children[0].setAttribute("draggable", false);
                    fotosLarvas[i].setAttribute("draggable", true);

                    //FASE1

                    fotosLarvas[i].addEventListener("dragstart", function (pEvento) {
                        pEvento.dataTransfer.setData("", pEvento.target.id);
                        //Esto es para que cuando hagamos el drop, no aseguremos de que lo dejemos caer, sea una caja diferente

                        console.log(pEvento.target.id);
                    });

                }

            }
        } else {
            console.log("No coincide las especies");
        }


    });
}


