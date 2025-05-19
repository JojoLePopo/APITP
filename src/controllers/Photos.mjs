import PhotoModel from '../models/photo.mjs';
import AlbumModel from '../models/Album.mjs';

const Photos = class Photos {
  constructor(app, connect) {
    this.app = app;
    this.PhotoModel = connect.model('Photo', PhotoModel);
    this.AlbumModel = connect.model('Album', AlbumModel);

    this.run();
  }

  getAllPhotos() {
    this.app.get('/album/:idalbum/photos', (req, res) => {
      try {
        this.PhotoModel.find({ album: req.params.idalbum }).populate('album').then((photos) => {
          res.status(200).json(photos || []);
        }).catch((err) => {
          console.error(`[ERROR] album/:idalbum/photos -> ${err}`);
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] album/:idalbum/photos -> ${err}`);
        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }


  getPhotoById() {
    this.app.get('/album/:idalbum/photo/:idphotos', (req, res) => {
      try {
        this.PhotoModel.findOne({
          album: req.params.idalbum,
          _id: req.params.idphotos
        }).populate('album').then((photo) => {
          res.status(200).json(photo || {});
        }).catch((err) => {
          console.error(`[ERROR] album/:idalbum/photo/:idphotos -> ${err}`);
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] album/:idalbum/photo/:idphotos -> ${err}`);
        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }


  createPhoto() {
    this.app.post('/album/:idalbum/photo', (req, res) => {
      try {
        const photoModel = new this.PhotoModel({ ...req.body, album: req.params.idalbum });

        photoModel.save().then((photo) => {
          this.AlbumModel.findByIdAndUpdate(req.params.idalbum, { $push: { photos: photo._id } }, { new: true }).populate('photos').then((album) => {
            res.status(201).json({ photo, album });
          }).catch((err) => {
            console.error(`[ERROR] album/:idalbum/photo -> ${err}`);
            res.status(500).json({
              code: 500,
              message: 'Internal Server error'
            });
          });
        }).catch((err) => {
          console.error(`[ERROR] album/:idalbum/photo -> ${err}`);
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] album/:idalbum/photo -> ${err}`);
        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }


  updatePhoto() {
    this.app.put('/album/:idalbum/photo/:idphotos', (req, res) => {
      try {
        this.PhotoModel.findOneAndUpdate(
          { album: req.params.idalbum, _id: req.params.idphotos },
          req.body,
          { new: true }
        ).then((photo) => {
          res.status(200).json(photo || {});
        }).catch((err) => {
          console.error(`[ERROR] album/:idalbum/photo/:idphotos -> ${err}`);
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] album/:idalbum/photo/:idphotos -> ${err}`);
        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }


  deletePhoto() {
    this.app.delete('/album/:idalbum/photo/:idphotos', (req, res) => {
      try {
        this.PhotoModel.findOneAndDelete({
          album: req.params.idalbum,
          _id: req.params.idphotos
        }).then(() => {
          this.AlbumModel.findByIdAndUpdate(req.params.idalbum, { $pull: { photos: req.params.idphotos } }, { new: true }).populate('photos').then((album) => {
            res.status(200).json({ message: 'Photo deleted', album });
          }).catch((err) => {
            console.error(`[ERROR] album/:idalbum/photo/:idphotos -> ${err}`);
            res.status(500).json({
              code: 500,
              message: 'Internal Server error'
            });
          });
        }).catch((err) => {
          console.error(`[ERROR] album/:idalbum/photo/:idphotos -> ${err}`);
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] album/:idalbum/photo/:idphotos -> ${err}`);
        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  
  run() {
    this.getAllPhotos();
    this.getPhotoById();
    this.createPhoto();
    this.updatePhoto();
    this.deletePhoto();
  }
};

export default Photos;