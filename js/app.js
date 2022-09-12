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

    agregarGastoListado (gastos) {

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
            li.appendChild(btnBorrar)

            gastoListado.appendChild(li);
            console.log(gastoListado)


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
    ui.agregarGastoListado(gastos);
    ui.actualizarRestante(restante);

    
}