import http from 'http';
import normalizePort from 'normalize-port-2';

import app from 'src/app';
import { server as serverConfig } from 'config/index';

// Obtenir le port de l'environnement et le stockez dans Express.
const port = normalizePort(serverConfig.port || '3000');
// app.set('port', port);

// Créer un serveur HTTP.
// const server = http.createServer(app)
//     .listen(port, () => {
//         console.log(`Server running: http://${serverConfig.host}:${port}.`);
//     });

app.listen(port, () => console.log(`App listening on port ${port}!`));
