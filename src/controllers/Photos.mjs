import PhotoModel from '../models/Photo.mjs';

const Photos = class Photos {
  constructor(app, connect) {
    this.app = app;
    this.PhotoModel = connect.model('Photo', PhotoModel);
    this.run();
  }

  // Créer une nouvelle photo et l’associer à un album
  create() {
    this.app.post('/album/:idalbum/photo', async (req, res) => {
      try {
        const { title, url } = req.body;
        const albumId = req.params.idalbum;
        const photo = new this.PhotoModel({ title, url, album: albumId });
        const savedPhoto = await photo.save();
        res.status(201).json(savedPhoto);
      } catch (err) {
        console.error(`[ERROR] POST /album/:idalbum/photo -> ${err}`);
        res.status(400).json({ code: 400, message: 'Bad Request' });
      }
    });
  }

  run() {
    this.create();
  }
};

export default Photos;
