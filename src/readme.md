
  // Event listener for the Delete Button (New logic)
  const deleteButton = card.querySelector('.delete-art-btn');
    if (deleteButton) {
        deleteButton.addEventListener('click', async (e) => {
            e.stopPropagation(); // Mencegah klik tombol memicu showArtDetail
            const artTitle = deleteButton.dataset.artTitle;
            if (confirm(`Are you sure you want to delete the art titled "${artTitle}"?`)) {
                try {
                    const response = await fetch('/delete-art', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ title: artTitle })
                    });

                    if (response.ok) {
                        console.log(`Art titled "${artTitle}" deleted successfully.`);
                        card.remove(); // Hapus card dari tampilan
                    } else {
                        console.error(`Failed to delete art titled "${artTitle}".`);
                    }
                } catch (error) {
                    console.error('Error deleting art:', error);
                }
            }
        });
    }

    //Route POST delete-art//
app.delete('/delete-art', express.json(), (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).send('Invalid data');
  }
  const indexToDelete = arts.findIndex(art => art.title === title);
  if (indexToDelete === -1) {
    return res.status(404).send('Art not found');
  }
  arts.splice(indexToDelete, 1);
  saveArts();
  res.status(200).send('OK');
});