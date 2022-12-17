import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
  res
    .clearCookie('access_token')
    .status(200)
    .send({ message: 'Successfully signed out' });
});

export { router as signoutRouter };
