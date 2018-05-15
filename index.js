//const fs = require('mz/fs');
const fs = require('fs');
const path = require('path')

const sys = require('sys')
const exec = require('child_process').exec;
function puts(error, stdout, stderr) { 
	console.log("=== STDOUT ===") 
	console.log(stdout)
	console.log("=== STDERR ===") 
	console.log(stderr) 
}
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

var dumpDir = '.'
  
  fs.readdir(dumpDir, function(err, items) {
    items.forEach(f => {
		if (path.extname(f) == '.dmp'){
			console.log(f)
			exec(`./minidump_stackwalk ${f} > ./output/${f}.txt`, puts);
		}
		
	})
});