document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('eventForm');
    const eventListings = document.getElementById('eventListings');
    const noEventsMsg = document.getElementById('noEventsMsg');

    // --- 1. Cargar eventos al inicio ---
    loadEvents();

    // --- 2. Manejar el envío del formulario ---
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fecha = document.getElementById('fechaEvento').value;
        const hora = document.getElementById('horaEvento').value || "Sin Hora";
        const titulo = document.getElementById('tituloEvento').value;
        const descripcion = document.getElementById('descripcionEvento').value;

        const newEvent = {
            id: Date.now(), // ID único basado en el tiempo actual
            fecha: fecha,
            hora: hora,
            titulo: titulo,
            descripcion: descripcion
        };

        // Guardar el evento
        saveEvent(newEvent);

        // Limpiar y actualizar la vista
        form.reset();
        document.getElementById('fechaEvento').value = '2026-12-25'; // Resetea a 2026
        loadEvents();
    });

    /**
     * Guarda el evento en localStorage del navegador.
     * @param {Object} eventData - Los datos del nuevo evento.
     */
    function saveEvent(eventData) {
        // Obtener los eventos existentes o inicializar un array vacío
        const events = JSON.parse(localStorage.getItem('events')) || [];
        events.push(eventData);

        // Guardar el array actualizado
        localStorage.setItem('events', JSON.stringify(events));
        console.log("Evento guardado exitosamente en LocalStorage.");
    }

    /**
     * Carga y muestra todos los eventos del localStorage.
     */
    function loadEvents() {
        const events = JSON.parse(localStorage.getItem('events')) || [];
        eventListings.innerHTML = ''; // Limpiamos la lista antes de volver a renderizar

        if (events.length === 0) {
            noEventsMsg.style.display = 'block';
            return;
        } else {
            noEventsMsg.style.display = 'none';
        }


        // Mostrar los eventos en el orden cronológico más cercano al presente
        // (Aquí simplificamos y solo los mostramos, sin lógica de comparación de fechas compleja)
        events.forEach(event => {
            const eventCard = createEventElement(event);
            eventListings.appendChild(eventCard);
        });

        // Llamar a la función de notificación después de cargar para que el usuario vea la simulación
        setTimeout(() => simulateNotificationCheck(), 500); 
    }


    /**
     * Crea y devuelve el elemento DOM (HTML) para un evento específico.
     */
    function createEventElement(event) {
        const card = document.createElement('div');
        card.className = 'event-card';

        // Contenido HTML del evento
        card.innerHTML = `
            <h4>${event.titulo}</h4>
            <span class="event-meta">📅 ${new Date(event.fecha).toLocaleDateString("es-ES")}</span>
            <span class="event-meta">${event.hora} - ${new Date(event.fecha).getFullYear()}</span>
            <p>${event.descripcion}</p>
            <button class="btn-delete" data-id="${event.id}">🗑️</button>
        `;

        // Añadir listener para eliminar el evento (el botón delete)
        card.querySelector('.btn-delete').addEventListener('click', function() {
            deleteEvent(parseInt(this.getAttribute('data-id')));
        });

        return card;
    }

    /**
     * Elimina un evento específico usando su ID.
     */
    function deleteEvent(id) {
        let events = JSON.parse(localStorage.getItem('events')) || [];
        // Filtrar y mantener solo los eventos cuyos IDs NO coincidan con el eliminado
        const updatedEvents = events.filter(event => event.id !== id);

        localStorage.setItem('events', JSON.stringify(updatedEvents));
        alert("Evento eliminado exitosamente.");
        loadEvents(); // Volver a cargar la lista sin el evento eliminado
    }


    /**
     * SIMULACIÓN DE NOTIFICACIÓN: 
     * Esta función simula que se verifica si hay recordatorios cercanos y muestra una alerta.
     */
    function simulateNotificationCheck() {
        const events = JSON.parse(localStorage.getItem('events')) || [];

        if (events.length > 0) {
            // En un entorno real, aquí haríamos cálculos de diferencia de tiempo con la fecha actual.
            console.log("Verificando recordatorios...");
            alert(`🔔 ¡Recordatorio activado! He detectado ${events.length} eventos en el calendario. (En una versión real, recibirías notificaciones push reales).`);
        } else {
             // Este mensaje es informativo para que el usuario sepa lo que está viendo
            console.log("No hay recordatorios pendientes.");
        }

    }

}); // Fin del DOMContentLoaded
