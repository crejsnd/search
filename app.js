const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const path = require('path')
const app = express()
const fs= require('fs');

app.use(express.json({extended:true}))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/link', require('./routes/link.routes'))
app.use('/t', require('./routes/redirect.routes'))
app.use('/api/post', require('./routes/postRouter'))
app.use('/', express.static(path.join(__dirname, 'client', 'build')))
app.post('/api/search-file', async (req, res) => {
	let result = []
	try {
		const scanDir = './to_scan'
		const files = await fs.promises.readdir(scanDir);	
	  
	  	for (const file of files) {
	  		console.log(file)
	  		let matches = []
		  	if (file.indexOf('.xls') >= 0) {
		  		matches = await parseExec(`${scanDir}/${file}`, req.body)
		  	} else {
		  		matches = await searchStream(`${scanDir}/${file}`, req.body)
		  	}
		  	matches.forEach(row => {
		  		result.push(row)
		  	})	
	  }
	} catch (err) {
	  console.error(err);
	}
	res.send(result)
})
const matchRow = (row, fields) => {
	let matches = 0,
		isMatches = {
			name: false,
			surname: false,
			birth: false,
			adres: false
		},
		lines = row.split(' ')
	if (fields.adres.length > 2 && row.indexOf(fields.adres) >= 0) {
		isMatches.adres = true
	}
	lines.forEach(line => {
		if (line == fields.name) {
			isMatches.name = true
		}
		if (line == fields.birth) {
			isMatches.birth = true
		}
		
		if (line == fields.surname) {
			isMatches.surname = true
		}
	})
	if (!isMatches.name || !isMatches.surname)  {
		return 0
	}
	if (!isMatches.adres || !isMatches.birth)  {
		return 0
	}

		console.log(isMatches)	
	for (const field of Object.keys(fields)) {
	  	const search = fields[field]
	  	if (search) { 
	  		if (row.toLowerCase().indexOf(search.toLowerCase()) >= 0) {
	  			matches++
    		}
	  	}
	}
	return matches
}
const parseExec = (file, fields) => {
	const XLSX = require('XLSX');
	const table = XLSX.readFile(file);
	const sheet = table.Sheets[table.SheetNames[0]];
	const range = XLSX.utils.decode_range(sheet['!ref']);
	let result = []
	for(var R = range.s.r; R <= range.e.r; ++R) {
		let rowString = ''
		for(var C = range.s.c; C <= range.e.c; ++C) {
			var cell_address = {c:C, r:R};
			var cell_ref = XLSX.utils.encode_cell(cell_address);
			if (sheet[cell_ref]) {
				rowString += sheet[cell_ref].v + ' '
			}
		}
    	let rowMatches = matchRow(rowString, fields)
    	if (rowMatches > 2) {
    		result.push(rowString)
    	}
	}
	return result
}
const searchStream = (filename, fields) => {
	const readline = require('readline');
	const stream = require('stream');
    return new Promise((resolve) => {
        const inStream = fs.createReadStream(filename);
        const outStream = new stream;
        const rl = readline.createInterface(inStream, outStream);
        let result = [];
        rl.on('line', function (line) {
        	let rowMatches = matchRow(line, fields)
	    	if (rowMatches > 2) {
	    		result.push(line)
	    	}
        });
        rl.on('close', function () {
            console.log('finished search', filename)
            resolve(result)
        });
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