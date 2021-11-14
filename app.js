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
app.post('/api/search-file', async (req, res) => {
	const fs= require('fs');
	let result = []
	try {
	  const files = await fs.promises.readdir('./to_scan');	
	  
	  for (const file of files) {
	  	let content = await scan('./to_scan/' + file)
	  	if (!content) {
	  		console.log("no content")
	  		continue
	  	}
		for (const field of Object.keys(req.body)) {
		  	const search = req.body[field]
		  	console.log(search)
		  	if (search) { 
		  		if (content.toLowerCase().indexOf(search.toLowerCase()) >= 0) {
		  			result.push(file)
	    			console.log(`${search} found in ${file}`);
	    		}
		  	}
		}
	  }
	} catch (err) {
	  console.error(err);
	}
	res.send(result)
})
const scan = async (file) => {
	const textract = require('textract');
	return new Promise ((resolve, reject) => {
		textract.fromFileWithPath(file, function( error, content ) {
			resolve(content)		
		})
	})
}
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