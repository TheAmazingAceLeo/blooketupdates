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
const files = [
    "play.blooket.com",
    "dashboard.blooket.com",
    "goldquest.blooket.com"
]
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
                srcfile = srcfile.replace("/assets", "");
                srcfiles.push(srcfile)
                getText(src, "assets/" + formatteddate + srcfile);
                getText(src, "last_" + srcfile);
                if (!fs.existsSync("srcs.txt")) {
                    fs.writeFileSync("srcs.txt", "");
                };
                let srcs = fs.readFileSync("srcs.txt", "utf8").toString()
                if (!srcs.includes(srcfile)) {
                    console.log(script.toString());
                };
                fs.appendFileSync("jsFiles.txt", "\n" + script.toString());
            });
            if (srcfiles.length > 3) {
                fs.writeFileSync("srcs.txt", );
            };
        });
    })
}
getScript()