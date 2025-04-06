const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    
    // Créer le répertoire s'il n'existe pas
    await fs.mkdir(uploadDir, { recursive: true })
      .catch(error => console.error('Erreur création répertoire:', error));
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5Mo
  fileFilter: fileFilter
}).single('file'); // <-- Le nom du champ doit correspondre à Postman

module.exports = upload;