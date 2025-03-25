<script>
    import { enhance } from '$app/forms';
    import { onMount } from 'svelte';
  
    export let data;
    let editando = null;
    let tarea = "", completado = false;
    let tareas = [];
    let nuevaTarea = "";

    const obtenerTareas = async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/users/1/todos');
      const tareasData = await res.json();
      tareas = tareasData.map(t => ({ ...t, favorito: false })); 
    };
  
    onMount(() => {
      obtenerTareas();
    });

    function setEditar(tareaSeleccionada) {
      editando = tareaSeleccionada.id;
      nuevaTarea = tareaSeleccionada.title;
      completado = tareaSeleccionada.completed;
    }

    async function agregarTarea() {
      const res = await fetch('https://jsonplaceholder.typicode.com/users/1/todos', {
        method: 'POST',
        body: JSON.stringify({
          title: nuevaTarea,
          completed: completado,
          userId: 1
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const newTask = await res.json();
 
      tareas.unshift({ ...newTask, favorito: false });  
      nuevaTarea = "";  
      editando = null;  
    }

    async function eliminarTarea(id) {
      const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        tareas = tareas.filter(t => t.id !== id); 
      }
    }

    async function editarTarea() {
      const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${editando}`, {
        method: 'PUT',
        body: JSON.stringify({
          id: editando,
          title: nuevaTarea,
          completed: completado,
          userId: 1
        }),
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (res.ok) {
        const tareaEditada = await res.json();
        const index = tareas.findIndex(t => t.id === tareaEditada.id);
        if (index !== -1) {
          tareas[index] = tareaEditada;
        }
        editando = null; 
        nuevaTarea = "";  
      }
    }
  
    function toggleFavorito(id) {
      const tareaActualizada = tareas.find(t => t.id === id);
      if (tareaActualizada) {
        tareaActualizada.favorito = !tareaActualizada.favorito;
        if (tareaActualizada.favorito) {
          tareas = [tareaActualizada, ...tareas.filter(t => t.id !== id)];
        } else {
          tareas = tareas.filter(t => t.id !== id); 
          tareas.push(tareaActualizada); 
        }
      }
    }
  </script>
  
  <h1 class="text-center mb-4 text-white bg-primary py-3">Gestión de Tareas</h1>
  
  <div class="container">
    <div class="tareas-container shadow-lg rounded-lg p-4">
      <div class="text-center mb-4">
        <button class="btn btn-dark btn-lg" on:click={() => editando = 'nuevo'}>Agregar Tarea</button>
      </div>
 
      {#if editando === 'nuevo'}
        <div class="mb-3">
          <input type="text" bind:value={nuevaTarea} class="form-control" placeholder="Nueva tarea" required>
          <label for="completado">Completado</label>
          <input type="checkbox" bind:checked={completado} class="form-check-input mb-2">
          <button class="btn btn-success" on:click={agregarTarea}>Agregar</button>
          <button class="btn btn-secondary" on:click={() => editando = null}>Cancelar</button>
        </div>
      {/if}
  
      {#if editando !== 'nuevo' && editando !== null}
        <div class="mb-3">
          <input type="text" bind:value={nuevaTarea} class="form-control" placeholder="Editar tarea" required>
          <label for="completado">Completado</label>
          <input type="checkbox" bind:checked={completado} class="form-check-input mb-2">
          <button class="btn btn-primary" on:click={editarTarea}>Guardar Cambios</button>
          <button class="btn btn-secondary" on:click={() => editando = null}>Cancelar</button>
        </div>
      {/if}
 
      <div class="row">
        <div class="col-md-12">
          <ul class="list-group">
            {#each tareas as tarea}
              <li class="list-group-item d-flex justify-content-between align-items-center mb-3 bg-light border rounded shadow-sm">
                {#if editando === tarea.id}
                {:else}
                  <div class="d-flex justify-content-between align-items-center w-100">
                    <div>
                      <strong>{tarea.title}</strong>
                      <div>Completado: {tarea.completed ? 'Sí' : 'No'}</div>
                    </div>
                    <div class="d-flex align-items-center">
                      <i class="fas fa-edit text-warning" on:click={() => setEditar(tarea)}></i>
                      <i class="fas fa-trash text-danger ms-3" on:click={() => eliminarTarea(tarea.id)}></i>
                      <i class={`fas fa-star ms-3 ${tarea.favorito ? 'text-warning' : 'text-muted'}`} on:click={() => toggleFavorito(tarea.id)}></i>
                    </div>
                  </div>
                {/if}
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
  </div>
  
  <style>
    h1 {
      background-color: #1E3A8A;
    }
  
    .tareas-container {
      background-color: #E0F7FF; 
      border: 1px solid #B0E0E6; 
      border-radius: 12px;
    }
  
    .btn-dark {
      background-color: #1D4ED8;
      color: white;
      border-radius: 8px;
    }
  
    .btn-lg {
      padding: 12px 24px;
    }
  
    .list-group-item {
      background-color: #F0F8FF; 
      border-left: 5px solid #1D4ED8; 
    }
  
    .list-group-item:hover {
      background-color: #BEE3F8; 
    }
  
    .btn-warning {
      background-color: #F59E0B; 
    }
  
    .btn-danger {
      background-color: #DC2626; 
    }
  
    .form-control, .form-select {
      border-radius: 8px;
    }
  
    .btn {
      border-radius: 8px;
      font-weight: bold;
    }
  
    .fa-star {
      cursor: pointer;
      transition: color 0.3s;
    }
  
    .fa-star:hover {
      color: #FFD700;
    }
  </style>
  