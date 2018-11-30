const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const sub = require('subtitle-data-parser')
const fs = require('fs')

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
    const outName = req.file.originalname.replace('.srt','')
    subOutput = sub.Parser('./temp/'+req.file.originalname)
    fs.writeFile('temp/' + outName + '.json',JSON.stringify(subOutput),'utf8',() => {})
    sub.ToCSV(subOutput.subs,subOutput.greatLineNumber,'temp/' + outName)
    //res.send(subOutput)
})

app.post('/api/:file(*)',(req,res) => {
    console.log('in')
    console.log(req.params.file)
    res.download('/temp/' + req.params.file)
})

app.post('/api/csv',(req,res) => {
    console.log(req.body.file_name)
    res.download('temp/' + req.body.file_name + '.csv')
})

app.listen(port, () =>
    console.log('listening to the server')
)