const {
    parse
} = require('node-html-parser');
import("node-fetch");
const fs = require('fs').promises;
const path = require("path");
let date = new Date
date.get

function formatDate(date) {
    return (date.getDate().toString() + "-" +
        +date.getMonth().toString() + "-" +
        +date.getFullYear().toString())
}
async function getText(webfile, outfile) {
    let gethtml = await fetch(webfile);
    let html = await gethtml.text();
    let dir = path.dirname(outfile)
    try {
        await fs.access(dir);
    } catch (err) {
        await fs.mkdir(dir, {
            recursive: true
        });
    }

    await fs.writeFile(outfile, html, (err) => {
        if (err) throw err;
    })
    //console.log(html);
}
async function getScript() {
    const files = [
        "play.blooket.com",
        "dashboard.blooket.com",
        "goldquest.blooket.com"
    ]
    for (let file of files) {
        await getText("https://" + file, "html/" + file + ".html")
    }
    let date = new Date;
    let formatteddate = formatDate(date);
    console.log(date.toString());
    console.log(date.getUTCHours() + ":" + date.getUTCMinutes())
    fs.appendFile("jsFiles.txt", "\n" + formatteddate);
    for (let file of files) {
        let data = await fs.readFile("html/" + file + ".html")
        let blookethtml = parse(data);
        let scripttags = blookethtml.getElementsByTagName("script");
        let srcfiles = [];
        for (let script of scripttags) {
            let src = script.getAttribute("src");
            let srcfile = src.replace("https://ac.blooket.com/", "").replace("/assets", "").replace("/", "");
            srcfiles.push(srcfile)
            console.log(formatteddate)
            await getText(src, "assets/" + formatteddate + "/" + srcfile);
            await getText(src, "last/" + srcfile);
            await fs.appendFile("jsFiles.txt", "\n" + script.toString());
        };
    }
}
async function main() {
    try {
        await fs.access("last/");
    } catch (err) {
        await fs.mkdir("last/");
    }
    let filesindir = await fs.readdir("last/")
    console.log(filesindir)

    try {
        await fs.access("lastold/");
    } catch (err) {
        await fs.mkdir("lastold/");
    }

    for (let file of filesindir) {
        await fs.rename("last/" + file, "lastold/" + file)
    }
    let filesinolddir = await fs.readdir("lastold/")
    console.log(filesindir.toString())
    console.log(filesinolddir.toString())
    if (filesinolddir.toString() != filesindir.toString()) {
        console.log("blooket has been updated")
    } else {
        console.log("blooket has not been updated")
    }
    await getScript()
}

main().catch(console.error)