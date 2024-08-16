const express = require("express");
const app = express();

/*app.get("/", (req, res) => {
    res.send(`
        <form action="/submit" method="get">
            <input id="date" type="date" name="date" min="2024-08-17">
            <p><button type="submit">Submit</button></p>
        </form>
    `);
});*/

app.get('/submit', (req, res) => {
    // Retrieve the date from the query parameters
    const date = req.query.date;

    // Do something with the date
    res.send(`You selected the date: ${date}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});