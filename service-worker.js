const CACHE_NAME = 'resistenzia-manager-v2'; // Incrementa la versión de la caché para forzar la actualización
const urlsToCache = [
    './', // Caches the root HTML file (index.html)
    './index.html', // Explicitly cache index.html
    'https://cdn.tailwindcss.com', // Cacha la CDN de Tailwind
    'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap', // Cacha la fuente de Google Fonts
    'https://i.imgur.com/fuK5gOa.png', // Cacha el logotipo (icono de la app)
    'https://i.imgur.com/0pnWy8A.jpeg', // Cacha la imagen de la galería
    // Incluye aquí cualquier otra imagen, CSS o JS local si tuvieras más archivos
    'https://placehold.co/400x300/e0e0e0/555555?text=Fiesta+1',
    'https://placehold.co/400x300/d0d0d0/444444?text=Evento+de+Verano',
    'https://placehold.co/400x300/c0c0c0/333333?text=Reunión+Anual',
    'https://placehold.co/400x300/b0b0b0/222222?text=Celebración',
    'https://placehold.co/400x300/a0a0a0/111111?text=Amigos',
    'https://placehold.co/400x300/909090/000000?text=Grupo'
];

// Evento 'install': Se activa cuando el service worker se instala por primera vez.
// Aquí es donde precargamos los recursos en la caché.
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caché abierta');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Service Worker: Fallo al añadir URLs a la caché:', error);
            })
    );
});

// Evento 'fetch': Se activa cada vez que la página intenta obtener un recurso (p. ej., un archivo HTML, CSS, imagen).
// Intercepta las peticiones y sirve los recursos desde la caché si están disponibles.
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Si el recurso está en caché, lo devuelve.
                if (response) {
                    return response;
                }
                // Si no, intenta obtenerlo de la red.
                return fetch(event.request);
            })
            .catch(error => {
                console.error('Service Worker: Fallo en la petición fetch:', error);
                // Aquí podrías servir una página offline si la petición de red falla
                // return caches.match('/offline.html');
            })
    );
});

// Evento 'activate': Se activa cuando el service worker se activa.
// Aquí es donde puedes limpiar cachés antiguas.
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME]; // Lista de cachés que queremos conservar
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Elimina cualquier caché que no esté en la lista blanca
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Service Worker: Eliminando caché antigua:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
