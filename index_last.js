let fs = require("fs")
async function getfiles() {
    try {
        let files = fs.readdir("/")
        console.log(files)
    } catch (err) {
        throw err
    }

}