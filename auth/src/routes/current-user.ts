import express from 'express'
import { currentUser, requireAuth } from '@rvticketing/common'
const router = express.Router();

router.get("/api/users/currentuser", currentUser, requireAuth, (req, res) => {

    res.send({ currentUser: req.currentUser || null })
})

export { router as currentUserRouter }