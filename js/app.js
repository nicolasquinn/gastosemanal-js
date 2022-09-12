// Variables
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul')


// Events
eventListeners()
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}

// Classes

class Presupuesto {

    constructor ( presupuesto ) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    agregarGasto (gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante () {
        const gastado = this.gastos.reduce( (total, item) => total + item.cantidad, 0 );
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto (id) {
        this.gastos = this.gastos.filter( item => item.id !== id );
        this.calcularRestante();
    }

}

class UI {

    insertarPresupuesto( cantidad ) {
        const { presupuesto, restante } = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    mostrarAlerta(mensaje, tipo) {

        const divAlerta = document.createElement('DIV');
        divAlerta.classList.add('text-center', 'alert');
        divAlerta.textContent = mensaje;

        if (tipo === 'error') {
            divAlerta.classList.add('alert-danger');
        } else {
            divAlerta.classList.add('alert-success');
        }

        document.querySelector('.primario').insertBefore( divAlerta, formulario );

        setTimeout(() => {
            divAlerta.remove();
        }, 3000);

    }

    mostrarGastos (gastos) {

        this.limpiarHTML();
        
        // Itero sobre array gastos p crear HTML
        gastos.forEach( (item) => {

            const {cantidad, nombre, id} = item;

            const li = document.createElement('LI');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.dataset.id = id;
            li.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $${cantidad} </span>`

            const btnBorrar = document.createElement('BUTTON');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.textContent = 'Borrar';
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }

            li.appendChild(btnBorrar)
            gastoListado.appendChild(li);

        })

    }

    limpiarHTML () {
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante (restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto (presupuestoObj) {

        const {presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');

        // Comprobar restante para cambiarlo de color
        if ( (presupuesto / 4) > restante ) { // 75%
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if ( (presupuesto / 2) > restante ) { // 50%
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning')
            restanteDiv.classList.add('alert-success');
        }

        // Comprobar si el restante es 0 o menor p deshabilitar gastos
        if (restante <= 0) {
            ui.mostrarAlerta('El presupuesto se agotó', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }

    }

}


const ui = new UI();
let presupuesto;


// Functions

function preguntarPresupuesto () {
    const presupuestoUsuario = prompt('¿Cuál es tu presupuesto?')

    if (presupuestoUsuario === '' || presupuestoUsuario == null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0 ) {
        window.location.reload();
    }

    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.insertarPresupuesto(presupuesto)

}

function agregarGasto (e) {
    e.preventDefault();

    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    if (nombre === '' || cantidad === '') {
        ui.mostrarAlerta('Ambos campos son obligatorios', 'error');
        return;
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.mostrarAlerta('Cantidad no válida', 'error');
        return;
    }

    // Creo objeto con el gasto y lo agrego
    const gasto = { nombre, cantidad, id: Date.now() }
    presupuesto.agregarGasto(gasto);

    // Muestro alerta y reset form.
    ui.mostrarAlerta('Gasto agregado exitosamente');
    formulario.reset();

    // Imprimir los gastos
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

}

function eliminarGasto (id) {

    presupuesto.eliminarGasto(id);

    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

}
