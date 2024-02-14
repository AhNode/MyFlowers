document.getElementById('feedbackForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    // Menggunakan GitHub API untuk membuat commit dengan data formulir
    fetch('https://api.github.com/repos/AhNode/MyFlowers/contents/feedback.txt', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer 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'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Mendapatkan konten file feedback.txt
        console.log(data)
        const content = atob(data.content);

        // Menambahkan data formulir ke dalam konten
        formData.forEach((value, key) => {
            content += `${key}: ${value}\n`;
        });

        // Mengirim perubahan kembali ke repositori
        return fetch('https://api.github.com/repos/AhNode/MyFlowers/contents/feedback.txt', {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer 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',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Add new feedback',
                content: btoa(content),
                sha: data.sha
            })
        });
    })
    .then(response => response.json())
    .then(data => {
        console.log('Pesan terkirim:', data);
        // Tambahkan logika atau feedback visual di sini
    })
    .catch(error => {
        console.error('Gagal mengirim pesan:', error);
        // Tambahkan logika atau feedback visual di sini
    });
});
