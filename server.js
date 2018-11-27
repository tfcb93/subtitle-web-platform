const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const sub = require('subtitle-data-parser')

const app = express()
const port = process.env.PORT || 5000 //Define a porta do servidor

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// na rota /api/hello do método get ele retorna o que é enviado
app.get('/api/hello', (req,res) => {
    res.send({ express: 'Hello from express' }) // o get retorna este JSON ao cliente
})

// na rota /api/world deve ser postado algo, e quando postado é enviado esse troço
app.post('/api/world', (req, res) => {
    console.log(req.body)
    res.send('Recebido o coco de pássaro')
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'temp/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })
let subOutput = {}
app.post('/api/submit-file', upload.single('file'),(req,res) => {
    //console.log(req.file)
    //console.log(req.file.originalname)
    subOutput = sub.Parser('./temp/'+req.file.originalname)
    res.send(subOutput)
})

app.listen(port, () =>
    console.log('listening to the server bitch')
)