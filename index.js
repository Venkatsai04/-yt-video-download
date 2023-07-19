const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();
const port = 2003;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("Server is running!");
});

app.post("/download", async (req, res) => {
  const { url, quality } = req.body;

  try {
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality });

    res.header('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp4"`);
    ytdl(url, { quality: format.itag }).pipe(res);

  } catch (error) {
    console.error('Error occurred during the video download:', error);
    res.status(500).send('Error occurred during the video download.');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
