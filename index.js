const date = new URLSearchParams(window.location.search).get("date");
if (date) {
    window.location.href = `./assets/${date}`;
}