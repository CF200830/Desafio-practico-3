$(document).ready(function() {
    // Funcion para cargar los usuarios al cargar la página
    cargarUsuarios();


    // Funcion para obtener los usuarios y mostrarlos 
    function cargarUsuarios() {
        $.ajax({
            url: 'obtenerusuarios.php',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                let tabla = '<table class="table table-striped">';
                tabla += '<thead><tr><th>Nombre</th><th>Correo</th><th>Fecha Nacimiento</th><th>Acciones</th></tr></thead><tbody>';

                data.forEach(function(usuario) {
                    tabla += `
                        <tr>
                            <td>${usuario.nombre}</td>
                            <td>${usuario.correo}</td>
                            <td>${usuario.fecha_nacimiento}</td>
                            <td>
                                <button class="btn btn-sm btn-warning btn-editar" data-id="${usuario.id_usuario}">Editar</button>
                                <button type="button" class="btn btn-sm btn-danger btn-eliminar" data-id="${usuario.id_usuario}">Eliminar</button>
                            </td>
                        </tr>
                    `;
                });

                tabla += '</tbody></table>';
                $('#tablaUsuarios').html(tabla);
            },
            error: function() {
                $('#tablaUsuarios').html('<p>Error al cargar usuarios.</p>');
            }
        });
    }


    // evento para boton Eliminar
$('#tablaUsuarios').on('click', '.btn-eliminar', function() {
    const id = $(this).data('id');
    
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
        $.ajax({
            url: 'eliminar.php',
            type: 'POST',
            data: { id_usuario: id },
            success: function(response) {
                if (response === "success") {
                    mostrarMensaje("Usuario eliminado correctamente.", "success");
                    cargarUsuarios();
                } else {
                    mostrarMensaje(response, "danger"); // Muestra error del servidor
                }
            },
            error: function() {
                mostrarMensaje("Error en la conexión.", "danger");
            }
        });
    }
});




let modoEdicion = false;
let idEdicion = null;

// evento para boton Editar
$('#tablaUsuarios').on('click', '.btn-editar', function() {
    const fila = $(this).closest('tr');
    const nombre = fila.find('td:eq(0)').text();
    const correo = fila.find('td:eq(1)').text();
    const fecha = fila.find('td:eq(2)').text();
    idEdicion = $(this).data('id');

    // cargar los datos en el formulario
    $('#nombre').val(nombre);
    $('#correo').val(correo);
    $('#fecha').val(fecha);

    // cambiar estado
    modoEdicion = true;
    $('#btnSubmit').text('Actualizar Usuario');
});

// Envio del formulario (crear o editar)
$('#formRegistro').on('submit', function(e) {
    e.preventDefault();

    let nombre = $('#nombre').val().trim();
    let correo = $('#correo').val().trim();
    let password = $('#password').val().trim();
    let fecha = $('#fecha').val();

    if (nombre === '' || correo === '' || fecha === '') {
        alert('Por favor, completa todos los campos requeridos.');
        return;
    }

    if (!modoEdicion && password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres.');
        return;
    }

    let url = modoEdicion ? 'editar.php' : 'insertar.php';
    let datos = modoEdicion
        ? { id: idEdicion, nombre, correo, fecha }
        : { nombre, correo, password, fecha };

    $.ajax({
        url: url,
        type: 'POST',
        data: datos,
        success: function(response) {
            alert(response);
            $('#formRegistro')[0].reset();
            $('#btnSubmit').text('Registrar');
            modoEdicion = false;
            idEdicion = null;
            cargarUsuarios();
        },
        error: function() {
            alert('Error al procesar la solicitud.');
        }
    });
});
//validacion fecha
let fecha = $('#fecha').val();
if (new Date(fecha) > new Date()) {
    mostrarError('fecha', 'La fecha no puede ser futura.');
    return;
}

// Función para mostrar errores en el formulario
function mostrarError(campo, mensaje) {
    $(`#${campo}`).addClass('is-invalid');
    $(`#error-${campo}`).text(mensaje).show();
}

function mostrarMensaje(mensaje, tipo = 'success') {
    const toast = `
        <div class="toast show align-items-center text-white bg-${tipo} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">${mensaje}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    $('#toastContainer').append(toast);
    setTimeout(() => $('.toast').remove(), 3000);
}



});