import { validate } from 'better-validator';

export function validateAlbum(req, res, next) {
  const result = validate({
    title: req.body.title,
    description: req.body.description
  })
    .required('title')
    .isString('title')
    .optional('description')
    .isString('description');

  if (!result.valid) {
    return res.status(400).json({ errors: result.errors });
  }

  next();
}
