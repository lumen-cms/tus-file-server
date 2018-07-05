const {Server, EVENTS, FileStore, S3Store} = require('tus-node-server')
require('dotenv').config()
const isProduction = process.env.NODE_ENV === 'production'

const server = new Server()
const port = 8000
const host = '127.0.0.1'

if (isProduction) {
    server.datastore = new S3Store({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        bucket: process.env.AWS_BUCKET,
        region: process.env.AWS_REGION,
        partSize: 8 * 1024 * 1024, // each uploaded part will have ~8MB,
        tmpDirPrefix: 'tus-s3-store',
        path: '/files'
    })
} else {
    server.datastore = new FileStore({
        path: '/files'
        // namingFunction: fileNameFromUrl
    })
}


server.on(EVENTS.EVENT_UPLOAD_COMPLETE, (event) => {
    console.log(`Upload complete for file `, JSON.stringify(event.file))
})

server.on(EVENTS.EVENT_FILE_CREATED, (event) => {
    console.log(`Upload file event created`, JSON.stringify(event.file))
})

server.on(EVENTS.EVENT_ENDPOINT_CREATED, (event) => {
    console.log(`Upload event endpoint created ${event.url}`)
})

server.listen({host, port}, () => {
    console.log(`[${new Date().toLocaleTimeString()}] tus server listening at http://${host}:${port}`)
})