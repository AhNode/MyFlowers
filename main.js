document.addEventListener('DOMContentLoaded', function () {
    const messageForm = document.getElementById('messageForm');

    messageForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const message = document.getElementById('message').value;

        try {
            const response = await fetch('/submit-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (response.ok) {
                console.log('Pesan berhasil dikirim!');
                // Tambahkan logika tambahan di sini, misalnya membersihkan formulir atau memberikan pemberitahuan.
            } else {
                console.error('Gagal mengirim pesan.');
            }
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
        }
    });
});
