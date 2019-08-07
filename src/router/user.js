const express = require('express')
const multer = require('multer') //package for file upload
const router = new express.Router()
const auth = require('../middleware/auth') // returns logged in user's user object

const User = require('../models/user')

// @route POST /users
// @desc  Create user
// @access public
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    }
    catch (err) {
        res.status(400).json(err)
    }

})

// @route POST /users/login
// @desc User log in
// @access public
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send('Login failed.')
    }
})

// @route POST /users/logout
// @desc User log out
// @access Private
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send('Your are logged out.')
    } catch (error) {
        res.status(500).json(error)
    }
})

// @route POST /users/logout-all
// @desc User log out on all device
// @access Private 
router.post('/users/logout-all', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send('Your are logged out.')
    } catch (error) {
        res.status(500).json(error)
    }
})

// @route GET /users
// @desc  Fetch user profile
// @access Private
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// @route PATCH /users/me
// @desc  Update loggin user
// @access Private
router.patch('/users/me', auth, async (req, res) => {

    // Check for invalid fields.
    const updates = Object.keys(req.body)
    const allowedUpdate = ['name', 'email', 'age', 'password']
    const isValidFields = updates.every((update) => allowedUpdate.includes(update))

    if (!isValidFields) {
        return res.status(400).send({ error: 'You are trying to update an invalid field/s' })
    }


    try {
        // Find user to be updated
        // const user = await User.findById(req.params.id)

        // if (!user) {
        //     res.status(404).send()
        // }

        // Loop through the fields the user is trying to update. This is done for middleware to work.
        updates.forEach(update => req.user[update] = req.body[update])

        // Here password hashing happens
        // Save the updated user
        req.user.save()

        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        res.send(req.user)
    } catch (err) {
        res.status(400).send(err.message)
    }
})

// @route DELETE /users/:id
// @desc Detele current logged in user
// @access Private
router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // if (!user) {
        //     return res.status(404).send({ error: 'No user with that id' })
        // }
        await req.user.remove()
        res.send({ message: 'user deleted' })
    } catch (error) {
        return res.status(500).send()
    }

})

// Instantiate multer
const upload = multer({
    dest: 'img/avatar',
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload .jpg, .jpeg or .png only.'))
        }

        cb(undefined, true)
    }
})

// @route POST /user/me/avatar
// @desc Upload user avatar
// @access Private
router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
    res.send()
})

module.exports = router