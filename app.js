const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const path = require('path')
const app = express()
app.use(express.json({extended:true}))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/link', require('./routes/link.routes'))
app.use('/t', require('./routes/redirect.routes'))
app.use('/api/post', require('./routes/postRouter'))
app.use('/', express.static(path.join(__dirname, 'client', 'build')))
app.get('*', (req, res)=>{
res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
})
const PORT = config.get('port') || 5000

async function start(){

    try{
       await mongoose.connect(config.get('mongoUri'), {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, console.log('mongo connected'))
       app.listen(PORT, () => console.log(`Server has been started on port ${PORT}...`))
    }catch(err){
        console.log('Server Error', err.message)
        process.exit(1)
    }
}
start()