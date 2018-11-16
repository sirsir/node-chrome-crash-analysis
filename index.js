//const fs = require('mz/fs');
const fs = require('fs');
const path = require('path')

var Sugar = require('sugar');
Sugar.extend()

const sys = require('sys')

const util = require('util');
const exec = require('child_process').exec;
function puts(error, stdout, stderr) {
	//console.log("=== STDOUT ===")
	//console.log(stdout)
	//console.log("=== STDERR ===")
	//console.log(stderr)

	//console.log(this)
	//fns.getCatchFromFiles(this.filepath)
	fns.getCatchFromFiles(this.outFilepath)
}

//const exec = util.promisify(require('child_process').exec);
//async function execCommand(cmd,filepath) {
//  const { stdout, stderr } = await exec(cmd);
//	console.log("=== STDOUT ===")
//	console.log(stdout)
//	console.log("=== STDERR ===")
//	console.log(stderr)
//
//	fns.getCatchFromFiles(filepath)
//}
//exec("ls -la", puts);

//fs.readdir('./')
//.then(listing => {
//	listing.forEach(f => {
//		if (path.extname(f) == '.dmp'){
//
//		}
//
//	})
//})
//  .catch(err => console.error(err));

var dumpDir = path.join(__dirname, './dump_files')
var outputDir = path.join(__dirname, './out_files')

var crashObj = {
	crash2count:{},
	crashArr: [],
	crashpush: function(strIn){
		var str = strIn.trim()
		if(crashObj.crash2count[str]){
			crashObj.crash2count[str]++;
		}else{
			crashObj.crash2count[str] = 1;
		}
	},
	crashconcat: function(arr){
		arr.forEach(function(str){
			crashObj.crashpush(str)
		})
	}
}


const fns = {
	getCatchFromString: function(str){
		let re = /Crash reason:.*(?=\n)/ig
		let match = str.match(re)
		if (match){
			//console.log(match)
			crashObj.crashArr = crashObj.crashArr.concat(match)
			crashObj.crashconcat(match)
			//arr = arr.unique()
		}
	},
	getCatchFromFiles: function(filepath){

		fs.readFile(filepath, 'utf8', (err, data) => {
		  //console.log(data)

		  fns.getCatchFromString(data)
		});



	},
	last: function(){
		//crashObj.crashArr = crashObj.crashArr.unique()
		console.log(crashObj.crashArr)
		console.log(crashObj.crash2count)
	}
}

if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
}

fs.readdir(dumpDir, function(err, items) {
	items.forEach((f,idx) => {
		if (path.extname(f) == '.dmp'){
			var dmpFilepath = path.join(__dirname, './dump_files', f)
			var outFilepath = path.join( outputDir, f+ '.txt')
			//console.log(f)
			console.log(dmpFilepath)

			let cmd = `./minidump_stackwalk "${dmpFilepath}" > "${outFilepath}"`
			//this.outFilepath = outFilepath
			//exec(`./minidump_stackwalk "${dmpFilepath}" > "${outFilepath}"`, puts);
			//execCommand(cmd, outFilepath)

			exec(`./minidump_stackwalk "${dmpFilepath}" > "${outFilepath}"`, (error, stdout, stderr)=> {
				console.log("=== STDOUT ===")
				console.log(stdout)
				console.log("=== STDERR ===")
				console.log(stderr)

				//console.log(this)
				fns.getCatchFromFiles(outFilepath)
			})

			if (idx == items.length-1){
				setTimeout(fns.last,5000)
			}
		}

	})
});
