import express from 'express';
import path from 'path';
import { env } from 'process';
import fs from 'fs';

(async (): Promise<void> => {
  try {
    const app = express();
    const PORT = env.PORT || 8000;

    // serve up production assets
    app.use(express.static('../client/build'));

    const indexPath = path.resolve(
      __dirname,
      '..',
      'client',
      'build',
      'index.html'
    );
    app.get('/loot/:id', (req, res) => {
      const lootId = req.params.id;
      fs.readFile(indexPath, 'utf-8', (err, html) => {
        if (err) {
          console.error('Error during file reading', err);
          res.status(404).end();
        }
        html = html
          .replace(new RegExp('__TITLE__', 'g'), `LootGen #${lootId}`)
          .replace(
            new RegExp('__META_IMAGE__', 'g'),
            `https://lootgen-server.herokuapp.com/loot/${lootId}/image.png`
          );
        res.send(html);
      });
    });

    app.get('*', (req, res) => {
      fs.readFile(indexPath, 'utf-8', (err, html) => {
        if (err) {
          console.error('Error during file reading', err);
          res.status(404).end();
        }
        html = html
          .replace(new RegExp('__TITLE__', 'g'), 'LootGen')
          .replace(
            new RegExp('__META_IMAGE__', 'g'),
            'https://www.lootgen.party/lootgen_twitter.png'
          );
        res.send(html);
      });
    });

    const appServer = app.listen({ port: PORT });
    console.log(
      `💥 React web server ready at http://localhost:${
        appServer.address().port
      }/`
    );
  } catch (error) {
    console.error(error);
  }
})();
