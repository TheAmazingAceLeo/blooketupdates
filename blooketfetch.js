const {
    parse
} = require('node-html-parser');
import("node-fetch");
const fs = require("fs/promises")
const path = require("path");

function formatDate(date) {
    let month = date.getMonth().toString();
    let monthdate = date.getDate().toString();
    let year = date.getFullYear().toString();
    let zero = "0";
    let monthzero;
    let monthdatezero;
    if (month.length < 2) {
        monthzero = zero.concat(month)
    } else {
        monthzero = month
    }
    if (monthdate < 2) {
        monthdatezero = zero.concat(monthdate)
    } else {
        monthdatezero = monthdate
    }
    return (year + "-" + monthzero + "-" + monthdatezero)
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
        try {
            await fs.rename("last/" + file, "lastold/" + file)
        } catch (err) {}
    }
    let filesinolddir = await fs.readdir("lastold/")
    console.log(filesindir.toString())
    console.log(filesinolddir.toString())
    if (filesinolddir.toString() != filesindir.toString() && filesindir.toString() != null && filesinolddir.toString() != null) {
        console.log("blooket has been updated")
    } else {
        console.log("blooket has not been updated")
    }
    await getScript()
}


//copied from https://gist.github.com/farhad-taran/f487a07c16fd53ee08a12a90cdaea082 because im to lazy to do this by myself
function runAtSpecificTimeOfDay(hour, minutes, func) {
    const twentyFourHours = 86400000;
    const now = new Date();
    let eta_ms = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minutes, 0, 0).getTime() - now;
    if (eta_ms < 0) {
        eta_ms += twentyFourHours;
    }
    setTimeout(function() {
        //run once
        func();
        // run every 24 hours from now on
        setInterval(func, twentyFourHours);
    }, eta_ms);
}
runAtSpecificTimeOfDay(0, 0, main())