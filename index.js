console.log('Inicializando socket server');

const porta = 5000;

/**
 * Inicialização e configuração do socket
 */
let express = require('express'),
    app = express(),
    http = require('http').Server(app),
    serveIndex = require('serve-index')
    io = require('socket.io')(http);

const logger = require('simple-node-logger').createRollingFileLogger({
    logDirectory: __dirname + '/logs', // NOTE: folder must exist and be writable...
    fileNamePattern:'<DATE>.log',
    dateFormat:'YYYY-MM-DD'
});

app.use('/logs', express.static(__dirname + '/logs'), serveIndex(__dirname + '/logs', { icons: true }));

http.listen(porta, () => {
    console.log('Escutando na porta ' + porta);
});

let statusSensores = {
    leds: [
        {
            id: 1,
            status: 1,
            usuarioUltimaAlteracao: 'gus.antoniassi@gmail.com',
            dataUltimaAlteracao: new Date()
        },
        {
            id: 2,
            status: 0,
            usuarioUltimaAlteracao: 'macoto.junior@gmail.com',
            dataUltimaAlteracao: new Date()
        },
        {
            id: 3,
            status: 1,
            usuarioUltimaAlteracao: 'gus.antoniassi@gmail.com',
            dataUltimaAlteracao: new Date()
        },
    ],
    porta: {
        status: 1, // fechado
        usuarioUltimaAlteracao: 'gus.antoniassi@gmail.com',
        dataUltimaAlteracao: new Date()
    },
    ar: {
        status: 1,
        temperatura: 18,
        usuarioUltimaAlteracao: 'gus.antoniassi@gmail.com',
        dataUltimaAlteracao: new Date()
    }
}

io.on('connection', (socket) => {
    console.log('Client conectado');
    socket.emit('statusSensores', statusSensores);

    socket.on('message', (msg) => {
        console.log('Mensagem recebida');
        socket.broadcast.emit('message', msg);

        // Gravar log do acesso
        logger.info('Mensagem recebida');
        logger.info(msg);
        // @TODO: Atualizar a variável statusSensores, vai ser essa
        // aplicação que vai atualizar ou o Raspi vai tratar a mensagem,
        // atuar nos componentes e retornar o status de tudo?
    });
});
