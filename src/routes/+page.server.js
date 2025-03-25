let tareas = [
    { id: 1, title: "Comprar leche", completed: false },
    { id: 2, title: "Estudiar Svelte", completed: true }
];

export function load() {
    return { tareas };
}

export const actions = {
    crear: async ({ request }) => {
        const data = await request.formData();
        const nuevaTarea = {
            id: Date.now(),
            title: data.get("tarea"),
            completed: false
        };
        tareas.push(nuevaTarea);
        return { success: true };
    },

    editar: async ({ request }) => {
        const data = await request.formData();
        const id = Number(data.get("id"));
        const tarea = tareas.find(t => t.id === id);
        if (tarea) {
            tarea.title = data.get("tarea");
            tarea.completed = data.get("completado") === 'on';
        }
        return { success: true };
    },

    eliminar: async ({ request }) => {
        const data = await request.formData();
        const id = Number(data.get("id"));
        tareas = tareas.filter(t => t.id !== id);
        return { success: true };
    },
    favorito: async ({ request }) => {
        const data = await request.formData();
        const id = Number(data.get("id"));
        const tarea = tareas.find(t => t.id === id);
        if (tarea) {
            tarea.favorito = !tarea.favorito;
        }
        return { success: true };
    }
};
