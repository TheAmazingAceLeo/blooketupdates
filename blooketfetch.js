const {
    parse
} = require('node-html-parser');
import("node-fetch");
const fs = require('fs');
const path = require("path");

function formatDate(date) {
    return date.toISOString().replace(/[:.]/g, '-');
}
async function getText(webfile, outfile) {
    let gethtml = await fetch(webfile);
    let html = await gethtml.text();
    let dir = path.dirname(outfile)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
            recursive: true
        });
    }
    fs.writeFileSync(outfile, html, (err) => {
        if (err) throw err;
    })
    //console.log(html);
}
if (!fs.readdirSync("last/")) {
    fs.mkdirSync("last/")
}
let filesindir = fs.readdirSync("last/")
console.log(filesindir)
const files = [
    "play.blooket.com",
    "dashboard.blooket.com",
    "goldquest.blooket.com"
]
for (let file of filesindir) {
    if (!fs.existsSync("lastold/")) {
        fs.mkdirSync("lastold/")
    }
    fs.renameSync("last/" + file, "lastold/" + file)
}
let filesinolddir = fs.readdirSync("lastold/")
let date = new Date;
let formatteddate = formatDate(date);
console.log(date.toString());
console.log(date.getUTCHours() + ":" + date.getUTCMinutes())
async function getScript() {
    for (let file of files) {
        await getText("https://" + file, "html/" + file + ".html")
    };
    fs.appendFileSync("jsFiles.txt", "\n" + formatteddate);
    files.forEach(file => {
        fs.readFile("html/" + file + ".html", (err, data) => {
            if (err) throw err;
            let blookethtml = parse(data);
            let scripttags = blookethtml.getElementsByTagName("script");
            let srcfiles = [];
            scripttags.forEach(script => {
                let src = script.getAttribute("src");
                let srcfile = src.replace("https://ac.blooket.com/", "");
                srcfile = srcfile.replace("/assets", "").replace("/", "");
                srcfiles.push(srcfile)
                getText(src, "assets/" + formatteddate + "/" + srcfile);
                getText(src, "last/" + srcfile);
                fs.appendFileSync("jsFiles.txt", "\n" + script.toString());
            });
        });
    })
}
getScript()
console.log(filesindir.toString())
console.log(filesinolddir.toString())
if (filesinolddir.toString() != filesindir.toString()) {
    console.log("blooket has been updated")
} else {
    console.log("blooket has not been updated")
}