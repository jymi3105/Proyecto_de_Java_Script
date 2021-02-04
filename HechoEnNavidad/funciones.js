function desordena() {
    var nodobody = document.getElementsByClassName("nCientifico")[0].getElementsByTagName("p");
    var nodoFig = document.getElementsByClassName("larvas")[0].getElementsByTagName("figure");
    var miArray = [], miArrayFig = [];
    for (let i = 0; i < nodobody.length; i++) {
        miArray.push(nodobody[i]);
        miArrayFig.push(nodoFig[i]);
    }

    for (let i = 0; i < nodobody.length; i++) {
        num = Math.floor(Math.random() * miArray.length);
        nodobody[i].parentNode.appendChild(miArray[num]);
        nodoFig[i].parentNode.appendChild(miArrayFig[num]);
        miArray.splice(num, 1);
        miArrayFig.splice(num, 1);
    }
}