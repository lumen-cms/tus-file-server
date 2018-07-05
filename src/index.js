const {Server, EVENTS, FileStore} = require('tus-node-server')

const server = new Server()

const fileNameFromUrl = (req) => {
    console.log(req)
    return req.url.replace(/\//g, '-')
}

server.datastore = new FileStore({
    path: '/files',
    namingFunction: fileNameFromUrl
})

// add google or s3 FileStore

server.on(EVENTS.EVENT_UPLOAD_COMPLETE, (event) => {
    console.log(`Upload complete for file `, JSON.stringify(event.file))
})

server.on(EVENTS.EVENT_FILE_CREATED, (event) => {
    console.log(`Upload file event created`, JSON.stringify(event.file))
})

server.on(EVENTS.EVENT_ENDPOINT_CREATED, (event) => {
    console.log(`Upload event endpoint created ${event.url}`)
})

const host = '127.0.0.1'
const port = 8000
server.listen({host, port}, () => {
    console.log(`[${new Date().toLocaleTimeString()}] tus server listening at http://${host}:${port}`)
})