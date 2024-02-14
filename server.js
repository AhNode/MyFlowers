const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const fs = require('fs').promises;
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/submit-message', async (req, res) => {
    const message = req.body.message;

    try {
        // Ambil isi file pesan.txt dari repositori GitHub.
        const currentContent = await getGitHubFileContent('AhNode', 'MyFlowers', 'pesan.txt');

        // Tambahkan pesan baru.
        const newContent = currentContent + '\n' + message;

        // Update file pesan.txt di repositori GitHub.
        const updateResult = await updateGitHubFile('AhNode', 'MyFlowers', 'pesan.txt', newContent);

        if (updateResult) {
            console.log('Pesan berhasil dikirim dan file pesan.txt berhasil diupdate!');
            res.send('Pesan berhasil dikirim!');
        } else {
            console.error('Gagal mengupdate file pesan.txt di GitHub.');
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

async function getGitHubFileContent(owner, repo, path) {
    const response = await fetch(https://api.github.com/repos/${owner}/${repo}/contents/${path});
    const data = await response.json();

    // Decode base64 content.
    return Buffer.from(data.content, 'base64').toString('utf-8');
}

async function updateGitHubFile(owner, repo, path, content) {
    const token = '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';

    // Get the latest commit SHA for the file.
    const latestCommitSHA = await getLatestCommitSHA(owner, repo, path);

    // Create a new branch name (e.g., timestamp).
    const branchName = new Date().toISOString().replace(/\D/g, '');

    // Create a new branch based on the latest commit.
    await createBranch(owner, repo, branchName, latestCommitSHA);

    // Update the file in the new branch.
    const updateResult = await updateFileInBranch(owner, repo, branchName, path, content, token);

    if (updateResult) {
        // Create a pull request to merge the changes.
        await createPullRequest(owner, repo, path, branchName);
    }

    return updateResult;
}

async function getLatestCommitSHA(owner, repo, path) {
    const response = await fetch(https://api.github.com/repos/${owner}/${repo}/commits?path=${path}&per_page=1);
    const data = await response.json();
    return data[0].sha;
}

async function createBranch(owner, repo, branchName, baseSHA) {
    const response = await fetch(https://api.github.com/repos/${owner}/${repo}/git/refs, {
        method: 'POST',
        headers: {
            'Authorization': Bearer ${token},
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ref: refs/heads/${branchName},
            sha: baseSHA,
        }),
    });

    return response.ok;
}

async function updateFileInBranch(owner, repo, branchName, path, content, token) {
    const latestCommitSHA = await getLatestCommitSHA(owner, repo, path);

    const response = await fetch(https://api.github.com/repos/${owner}/${repo}/contents/${path}, {
        method: 'PUT',
        headers: {
            'Authorization': Bearer ${token},
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: 'Update pesan.txt',
            content: Buffer.from(content).toString('base64'),
            sha: latestCommitSHA,
            branch: branchName,
        }),
    });

    return response.ok;
}

async function createPullRequest(owner, repo, path, branchName) {
    const response = await fetch(https://api.github.com/repos/${owner}/${repo}/pulls, {
        method: 'POST',
        headers: {
            'Authorization': Bearer ${token},
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: Update ${path},
            head: branchName,
            base: 'main', // Adjust this based on your default branch name.
        }),
    });

    return response.ok;
}
