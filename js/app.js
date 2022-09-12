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
}