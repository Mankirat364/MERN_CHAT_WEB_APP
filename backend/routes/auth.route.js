import express from 'express'
import { checkRoute, deleteRoute, loginRoute, signupRoute, updateRoute } from '../controllers/auth.controller.js'
import { protectedRoute } from '../middleware/auth.middleware.js'

const router = express.Router()
router.post('/signup',signupRoute)
router.post('/login',loginRoute)
router.delete('/logout',deleteRoute)
router.put("/update-profile",protectedRoute,updateRoute)
router.get("/check",protectedRoute,checkRoute)
export default router   