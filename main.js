document.addEventListener('DOMContentLoaded', function () {
    const messageForm = document.getElementById('messageForm');

    messageForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const message = document.getElementById('message').value;

        try {
            const response = await fetch('https://api.github.com/repos/YOUR_GITHUB_OWNER/YOUR_GITHUB_REPO/contents/pesan.txt', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer YOUR_GITHUB_TOKEN',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const currentContent = atob(data.content); // Decode base64 content.

                // Update file pesan.txt di repositori GitHub.
                const updateResult = await updateGitHubFile('YOUR_GITHUB_OWNER', 'YOUR_GITHUB_REPO', 'pesan.txt', currentContent + '\n' + message);

                if (updateResult) {
                    console.log('Pesan berhasil dikirim dan file pesan.txt berhasil diupdate!');
                    // Tambahkan logika tambahan di sini, misalnya membersihkan formulir atau memberikan pemberitahuan.
                } else {
                    console.error('Gagal mengupdate file pesan.txt di GitHub.');
                }
            } else {
                console.error('Gagal mengambil konten file pesan.txt dari GitHub.');
            }
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
        }
    });
});

async function updateGitHubFile(owner, repo, path, content) {
    const token = 'YOUR_GITHUB_TOKEN';

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

// ... (fungsi lainnya tetap sama seperti sebelumnya)
