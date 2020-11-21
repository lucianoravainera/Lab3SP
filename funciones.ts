namespace SegundoParcial {
    var listaVehiculos: Array<Vehiculo> = new Array<Vehiculo>();
    function CalcularId() {
        var id: number = 1;
        if (listaVehiculos.length != 0) {
            id = listaVehiculos.reduce((idActual, idMayor) => idActual > idMayor ? idMayor = idActual : idMayor).getId() + 1;
        }
        return id;
    }

    window.onload = function () {
        document.getElementById("btnAlta")?.addEventListener("click", SegundoParcial.PopUp);
        document.getElementById("btnAgregar")?.addEventListener("click", SegundoParcial.Guardar);
        document.getElementById("btnCerrar")?.addEventListener("click", SegundoParcial.CloseUp);
        document.getElementById("tipo")?.addEventListener("change", SegundoParcial.MostrarAtributosPropios);
        document.getElementById("filtro")?.addEventListener("change", SegundoParcial.SwapTables);
        document.getElementById("btnProm")?.addEventListener("click", SegundoParcial.CalcularPromedio);
    }

    export function PopUp() {
        (<HTMLInputElement>document.getElementById("contenedorAlta")).hidden = false;
    }

    export function CloseUp() {
        (<HTMLInputElement>document.getElementById("contenedorAlta")).hidden = true;
    }

    export function MostrarAtributosPropios() {
        var tipo = (<HTMLInputElement>document.getElementById("tipo")).value;
        if (tipo == "Auto") {
            (<HTMLInputElement>document.getElementById("divCamioneta")).hidden = true;
            (<HTMLInputElement>document.getElementById("divAuto")).hidden = false;
        }
        else if (tipo == "Camioneta") {
            (<HTMLInputElement>document.getElementById("divCamioneta")).hidden = false;
            (<HTMLInputElement>document.getElementById("divAuto")).hidden = true;
        }

    }

    export function Guardar() {

        var marca: string = (<HTMLInputElement>document.getElementById("txtMarca")).value;
        var modelo: string = (<HTMLInputElement>document.getElementById("txtModelo")).value;
        var precioStr: string = (<HTMLInputElement>document.getElementById("txtPrecio")).value;
        var tipo: string = (<HTMLInputElement>document.getElementById("tipo")).value;
        var cantPuertStr: string = (<HTMLInputElement>document.getElementById("txtCantPuertas")).value;
        var esCuatroXcuatro: boolean = (<HTMLInputElement>document.getElementById("4x4ChkBox")).checked;
        var precioNum: number = parseInt(precioStr);
        var cantPuertNum: number = parseInt(cantPuertStr);


        var p = new Promise((resolve, reject) => {
            if (precioNum.toString() != "NaN") {
                if (tipo == "Auto") {
                    if (cantPuertNum.toString() != "NaN") {
                        resolve(new Auto(CalcularId(), marca, modelo, precioNum, cantPuertNum))
                    }
                    else {
                        reject("Cantidad de puertas invalido")
                    }
                }
                else if (tipo == "Camioneta") {
                    resolve(new Camioneta(CalcularId(), marca, modelo, precioNum, esCuatroXcuatro))
                }
            }
            else {
                reject("Precio invalido")
            }
        });

        p.then((Vehiculo) => {
            listaVehiculos.push(<Vehiculo>Vehiculo);
            var tablaVehiculos = (<HTMLTableElement>document.getElementById("tablaVehiculos"));
            ConstruirFila(tablaVehiculos, (<Vehiculo>Vehiculo).getId(), (<Vehiculo>Vehiculo).getMarca(),
                (<Vehiculo>Vehiculo).getModelo(), (<Vehiculo>Vehiculo).getPrecio(), cantPuertNum, esCuatroXcuatro,1);
        }).catch((error) => {
            alert("Error: " + error)
        })
    }

    export function BuscarVehiculo() {
        var tipoABuscar = (<HTMLInputElement>document.getElementById("filtro")).value;
        return new Promise((resolve, reject) => {
            var coincidencias = listaVehiculos.filter(vehiculo => vehiculo.constructor.name == tipoABuscar);
            resolve(coincidencias);
        });
    }

    export function SwapTables() {
        var tablaVehiculos = (<HTMLTableElement>document.getElementById("tablaVehiculos"));
        var tablaFiltrados = (<HTMLTableElement>document.getElementById("tablaFiltrados"));
        if ((<HTMLInputElement>document.getElementById("filtro")).value != "") {
            tablaVehiculos.hidden = true;
            tablaFiltrados.innerHTML = "";
            BuscarVehiculo().then((listaFiltrada) => {
                (<Array<Vehiculo>>listaFiltrada).forEach(Vehiculo => {
                    var cantPuertas: number = 0;
                    var esCuatroXcuatro: boolean = false;
                    if (Vehiculo instanceof Auto) {
                        cantPuertas = (<Auto>Vehiculo).getCantidadPuertas();
                    }
                    if (Vehiculo instanceof Camioneta) {
                        esCuatroXcuatro = (<Camioneta>Vehiculo).getCuatroXcuatro();
                    }
                    ConstruirFila(tablaFiltrados, (<Vehiculo>Vehiculo).getId(), (<Vehiculo>Vehiculo).getMarca(),
                        (<Vehiculo>Vehiculo).getModelo(), (<Vehiculo>Vehiculo).getPrecio(), cantPuertas, esCuatroXcuatro, 0);
                });
            });
            tablaFiltrados.hidden = false;
        }
        else {
            tablaVehiculos.hidden = false;
            tablaFiltrados.hidden = true;
        }
    }

    export function CalcularPromedio() {
        BuscarVehiculo().then((listaCoincidencias) => {
            var list = <Array<Vehiculo>>listaCoincidencias;
            var valorTotal: number = 0;
            if (list.length > 0) {
                valorTotal = list.reduce(((total, veh) => total += veh.getPrecio()), 0);
                (<HTMLInputElement>document.getElementById("promedio")).value = (valorTotal / list.length).toString();
            }
            else {
                valorTotal = listaVehiculos.reduce(((total, veh) => total += veh.getPrecio()), 0);
                (<HTMLInputElement>document.getElementById("promedio")).value = (valorTotal / list.length).toString();
            }if(listaVehiculos.length > 0){
            (<HTMLInputElement>document.getElementById("promedio")).value = (valorTotal / listaVehiculos.length).toString();
            }else {
                (<HTMLInputElement>document.getElementById("promedio")).value = " ";
            }
        });
    }

    export function ConstruirFila(tabla: HTMLTableElement, id: number, marca: string,
        modelo: string, precio: number, cantPuert: number, esCuatroXcuatro: boolean,accion?: number): void {
        var tr = document.createElement("tr");

        var td = document.createElement("td");
        td.appendChild(document.createTextNode(id.toString()));
        tr.appendChild(td);

        var td2 = document.createElement("td");
        td2.appendChild(document.createTextNode(marca));
        tr.appendChild(td2);

        var td3 = document.createElement("td");
        td3.appendChild(document.createTextNode(modelo));
        tr.appendChild(td3);

        var td4 = document.createElement("td");
        td4.appendChild(document.createTextNode(precio.toString()));
        tr.appendChild(td4);
        
        if(accion == 1){
        var td5 = document.createElement("td");
        var btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.addEventListener('click', SegundoParcial.Eliminar);
        td5.appendChild(btnEliminar);
        tr.appendChild(td5);
        }
        tabla.appendChild(tr);
    }

    export function Eliminar(tr: any) {
        var trToDelete = tr.target.parentNode.parentNode;
        var idToDelete = trToDelete.childNodes[0].innerHTML
        var listaId = listaVehiculos.filter(Vehiculo => Vehiculo.getId() == idToDelete);
        if (listaId.length > 0) {
            listaVehiculos.splice(idToDelete, 1);
            var tablaVehiculos = (<HTMLTableElement>document.getElementById("tablaVehiculos"));

            tablaVehiculos.childNodes.forEach(element => {
                if (element.nodeName == "TR") {
                    if (element.childNodes[2].textContent == idToDelete) {
                        element.remove();
                        return;
                    }
                }
                trToDelete.remove();
            });
        }
    }
}