document.addEventListener('DOMContentLoaded', function() {
    fetch('./')
        .then(response => response.json())
        .then(data => {
            const directoryList = document.getElementById('directory-list');
            data.files.forEach(file => {
                const fileElement = document.createElement('div');
                fileElement.textContent = file;
                directoryList.appendChild(fileElement);
            });
        })
        .catch(error => console.error('Error fetching directory contents:', error));
});