const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/submit-message', async (req, res) => {
    const message = req.body.message;

    try {
        const response = await createGitHubIssue('AhNode', 'MyFlowers', 'New Message', message);

        if (response.ok) {
            console.log('Pesan berhasil dikirim dan isu berhasil dibuat!');
            res.send('Pesan berhasil dikirim!');
        } else {
            console.error('Gagal membuat isu di GitHub.');
            res.status(500).send('Gagal mengirim pesan.');
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        res.status(500).send('Terjadi kesalahan.');
    }
});

app.listen(port, () => {
    console.log(Server berjalan di http://localhost:${port});
});

async function createGitHubIssue(owner, repo, title, body) {
    const token = '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';

    return fetch(https://api.github.com/repos/${owner}/${repo}/issues, {
        method: 'POST',
        headers: {
            'Authorization': Bearer ${token},
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, body }),
    });
}
