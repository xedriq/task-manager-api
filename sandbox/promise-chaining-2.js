require('../db/mongoose')

const Task = require('../models/task')

// Task.findByIdAndDelete('5d445fb5dc2d142aace50aa6')
//     .then((task) => {
//         console.log(task)
//         return Task.countDocuments({ completed: false })
//     })
//     .then((result) => {
//         console.log(result)
//     })
//     .catch((err) => {
//         console.log(err.message)
//     })

const deleteTaskAndCount = async (id) => {
    const itemToDelete = await Task.findByIdAndDelete(id)
    if (!itemToDelete) {
        throw new Error('No item with that id')
    }
    const count = await Task.countDocuments({ completed: false })
    return count
}

deleteTaskAndCount('5d450cee4780f3b9557daad6')
    .then((count) => {
        console.log('an item is removed from the db')
        console.log('incompleted taks: ', count)
    })
    .catch((e) => {
        console.log(e)
    })