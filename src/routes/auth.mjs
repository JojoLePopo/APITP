import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default function authRoutes(app) {
    console.log('/login route loaded');
  app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin') {
      const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '2h' });
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Identifiants invalides' });
    }
  });
}
