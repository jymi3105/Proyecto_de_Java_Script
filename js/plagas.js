function codigo() {
	var peticion, bd, transaccion, almacen;
	
	crearIndicesBD();
	function refrescarListaLibros() {
		if (window.indexedDB) {
			
			peticion = window.indexedDB.open("plagasBD");

			peticion.onsuccess = function (evento) {
				bd = evento.target.result;

				transaccion = bd.transaction(bd.objectStoreNames, "readwrite");
				almacen = transaccion.objectStore("plagas");

				document.getElementById("listaPlagas").innerHTML = "";

				var peticionCursor = almacen.openCursor();
				peticionCursor.onsuccess = function (evento) {
					var cursor = peticionCursor.result;

					if (cursor) {
						insertarElementoControlLista(cursor.value);

						cursor.continue(); //continue incrementa el cursor una posición
					} else {
						console.log("FIN");
					}
				}

				//bd.close();
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

		document.getElementById("botonCargar").disabled = true;
	}


	function insertarElementoControlLista(plagas) {
		//var htmlTexto = libro.isbn + "  <----->  " + libro.titulo;
		var htmlTexto = plagas.nComun;
		var listaItem = document.createElement("option");
		listaItem.setAttribute("value", plagas.id);
		listaItem.textContent = htmlTexto;

		var lista = document.getElementById("listaPlagas");
		lista.appendChild(listaItem);

		listaItem.onclick = function () {
			var id = lista.options[lista.selectedIndex].value;
			var transaccionEvento = bd.transaction(bd.objectStoreNames, "readwrite");
			var almacenEvento = transaccionEvento.objectStore("plagas");
			var registroEvento = almacenEvento.get(parseInt(id));
			var botones=document.getElementsByClassName("button");
			var imagenes=document.getElementsByClassName("imagenes")[0];
			botones[0].style.display="block";
			botones[1].style.display="block";
			function hacerVisible(params) {
				document.getElementById("modal_container").style.opacity="1";
			}
			imagenes.style.display="block";

			registroEvento.onsuccess = function (evento) {
				document.getElementById("id").value = registroEvento.result.id;
				document.getElementById("nComun").value = registroEvento.result.nComun;
				document.getElementById("nCientifico").value = registroEvento.result.nCientifico;
				document.getElementById("hospedante").value = registroEvento.result.hospedante;
				document.getElementById("oCuarentena").value = registroEvento.result.oCuarentena;
				document.getElementById("tFitosanitario").value = registroEvento.result.tFitosanitario;
				document.getElementById("imgAdulto").setAttribute("src", registroEvento.result.imagenAdulto);
				document.getElementById("imgLarva").setAttribute("src", registroEvento.result.imagenLarva);
			}
		}
	}

	document.getElementById("botonCargar").onclick = refrescarListaLibros;
}

function crearIndicesBD() {
	var peticion, bd, almacenPlagas;

	if (window.indexedDB) {
		//AQUI CREAMOS TAMBIEN LA BASE DE DATOS EN EL CASO DE NO EXISTIR
		peticion = window.indexedDB.open("plagasBD", 1);

		peticion.onsuccess = function (evento) {
		
			bd = peticion.result;
			var transaccion = bd.transaction(bd.objectStoreNames, "readwrite");

			almacenPlagas = transaccion.objectStore("plagas");
			almacenPlagas.put({ id: 1, nComun: "blanquilla del chopo", nCientifico: "Leucoma salicis", oCuarentena: "NO", 
			hospedante: "Populus", tFitosanitario: "AZUFRE 80%", imagenAdulto: "Material/Fotos_Adultos/Leucoma_adulto.jpg", 
			imagenLarva: "Material/fotos_Larvas/Leucoma_larva.jpg", aprendido: "no" });

			almacenPlagas.put({ id: 2, nComun: "longicornio del pino", nCientifico: "Monochamus galloprovincialis", 
			oCuarentena: "SI", hospedante: "Pinus", tFitosanitario: " OXIDO CUPROSO 50%", imagenAdulto: "Material/Fotos_Adultos/Monochamus_adulto.jpg", 
			imagenLarva: "Material/fotos_Larvas/Monochamus_Larvas.png", aprendido: "no" });

			almacenPlagas.put({ id: 3, nComun: "mosca sierra del pino", nCientifico: "Diprion pini", 
			oCuarentena: "NO", hospedante: "Pinus", tFitosanitario: " BENFLURALINA 18%", imagenAdulto: "Material/Fotos_Adultos/diprion_adulto.jpg", 
			imagenLarva: "Material/fotos_Larvas/Diprion_larva.jpg", aprendido: "no" });

			/*almacenPlagas.put({ id: 4, nComun: "piral del roble", nCientifico: "Tortrix viridiana", oCuarentena: "NO", 
			hospedante: "Quercus", tFitosanitario: "AZUFRE 80%", imagenAdulto: "Material/Fotos_Adultos/Tortrix_adulto.jpg",
			 imagenLarva: "Material/fotos_Larvas/Tortrix_larva.jpg", aprendido: "no" });

			almacenPlagas.put({ id: 5, nComun: "lagarta peluda", nCientifico: "Limantria dispar", oCuarentena: "NO", 
			hospedante: "Quercus", tFitosanitario: "Captan 80%", imagenAdulto: "Material/Fotos_Adultos/limantria_adulto.jpg", 
			imagenLarva: "Material/fotos_Larvas/limantria_larva.jpg", aprendido: "no" });

			almacenPlagas.put({ id: 6, nComun: "cochinilla de los pinos", nCientifico: "Leucaspis pini", oCuarentena: "NO", 
			hospedante: "Pinus", tFitosanitario: "FOSMET 20%", imagenAdulto: "Material/Fotos_Adultos/LeucaspisPini_adulto.jpg", 
			imagenLarva: "Material/fotos_Larvas/Leucaspis_larva.png", aprendido: "no" });

			almacenPlagas.put({ id: 7, nComun: "gran capricornio", nCientifico: "Cerambix cerdo", oCuarentena: "NO", 
			hospedante: "Quercus", tFitosanitario: "AZUFRE 80%", imagenAdulto: "Material/Fotos_Adultos/cerambixCerdo_adulto.jpg", 
			imagenLarva: "Material/fotos_Larvas/cerambyx_cerdo_larva.jpg", aprendido: "no" });

			almacenPlagas.put({ id: 8, nComun: "mariposa lagarta cola parda", nCientifico: "Euproctis chrysorrhoea", oCuarentena: "NO", 
			hospedante: "Salix", tFitosanitario: "METALDEHIDO 5%", imagenAdulto: "Material/Fotos_Adultos/Euproctis chrysorrhoea_adulto.jpg",
			 imagenLarva: "Material/fotos_Larvas/Euproctis chrysorrhoea_larva.jpg", aprendido: "no" });

			almacenPlagas.put({ id: 9, nComun: "procesionaria del pino", nCientifico: "Thaumetopoea pityocampa", oCuarentena: "NO", 
			hospedante: "Pinus", tFitosanitario: "METALDEHIDO 5%", imagenAdulto: "Material/Fotos_Adultos/procesionariaAdulto.jpg", 
			imagenLarva: "Material/fotos_Larvas/procesionaria1.png", aprendido: "no" });
			
			almacenPlagas.put({ id: 10, nComun: "chinche americana de las piñas", nCientifico: "Leptoglossus occidentalis", 
			oCuarentena: "SI", hospedante: "Pinus", tFitosanitario: "FOSMET 20%", imagenAdulto: "Material/Fotos_Adultos/Leptoglosus_adulto.jpg",
			 imagenLarva: "Material/fotos_Larvas/Leptoglosus_larva.jpg", aprendido: "no" });
			
			almacenPlagas.put({ id: 11, nComun: "escarabajo rojo del chopo", nCientifico: "Chrysomela populi", 
			oCuarentena: "NO", hospedante: "Populus", tFitosanitario: "Captan 80%", imagenAdulto: "Material/Fotos_Adultos/Chrysomela_adulto.jpg", 
			imagenLarva: "Material/fotos_Larvas/Chrysomela_larva.jpg", aprendido: "no" });

			almacenPlagas.put({ id: 12, nComun: "gorgojo perforador del chopo", nCientifico: "Cryptorhynchus lapathi", 
			oCuarentena: "NO", hospedante: "Populus", tFitosanitario: " OXIDO CUPROSO 50%", imagenAdulto: "Material/Fotos_Adultos/Chrysomela_adulto.jpg", 
			imagenLarva: "Material/fotos_Larvas/Cryptorhynchus_Larva.jpg", aprendido: "no" });
*/
		};


		peticion.onerror = function (evento) {
			alert("No se ha creado la base de datos: " + event.target.errorCode);
		};

		peticion.onupgradeneeded = function (evento) {
			bd = peticion.result;
			//CREO ALGO PARECIDO A LOS QUE SUELE SER LA CLAVE
			almacenPlagas = bd.createObjectStore("plagas", { keyPath: "id" });

			/*almacenPlagas.createIndex("por_ncom", "nComun", { unique: true });
			almacenPlagas.createIndex("por_ncien", "nCientifico", { unique: true });
			almacenPlagas.createIndex("por_huesped", "hospedante");*/

		};
	} else {
		console.log("IndexedDB no está soportado");
	}
}

window.onload = codigo;
function hacerVisible(params) {
	document.getElementById("modal_container").style.opacity="1";
	setTimeout(function () {
		document.getElementById("modal_container").style.opacity="0";
	}, 1000);
}

