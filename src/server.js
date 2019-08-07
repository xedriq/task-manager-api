const express = require('express')
require('./db/mongoose')

// Load user router
const userRouter = require('./router/user')

// Load task router
const taskRouter = require('./router/task')

const app = express()
const port = process.env.PORT || 3000

// Blocks all incoming requests
// app.use((req, res, next) => {
//     if (req.method) {
//         res.status(504).send('Site under maintenace')
//     }
// })

// Set app to read/accept JSON
app.use(express.json())

// Set app to use user router
app.use(userRouter)

// Set app to use task router
app.use(taskRouter)

app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`)
})