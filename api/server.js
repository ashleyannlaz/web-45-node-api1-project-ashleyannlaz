// BUILD YOUR SERVER HERE
const express = require('express')
const server = express();
const User = require('./users/model.js')

// SCHEMA
// {
//     id: "a_unique_id", // String, required
//     name: "Jane Doe",  // String, required
//     bio: "Having fun", // String, required
// }

server.use(express.json())

// POST - Creates a user using the information sent inside the request body
// 201 - New User
server.post('/api/users', (req,res) => {
    //res.status(201).json({ message: 'Creates a user with information inside the request body' })
    const newUser = req.body
    User.insert(newUser)
    .then(user => {
        if(!user.name || !user.bio){
            res.status(400).json({message: 'Please provide name and bio for the user' })
        }
        else { res.status(201).json(user)}
    })
    .catch((err) => {
        console.log(err)
        res.status(500).json({ message: 'There was an error while saving the user to the database' })
        //res.status(400).json({ message: 'Please provide name and bio for the user' })
    })
})
// GET - Returns an array users
server.get('/api/users', (req,res) => {
    User.find()
    .then(dogs => {
        res.status(200).json(dogs)
    })    
    .catch(err => {
        console.log(err)
        res.status(500).json({ message: err.message })
    })
    //res.status(200).json({ message: 'Returns an array of users' })
})

// GET - Returns the user object with the specified 'id'
server.get('/api/users/:id', (req,res) => {
    User.findById(req.params.id)
    .then(dog => {
        if(dog) {
            res.status(201).json(dog)
        } else {
            res.status(404).json({ message: 'The user with the specified ID does not exist' })
        }})
    .catch(err => {
        res.status(500).json({ message: err.message })
    })
    //res.status(200).json({ message: 'Returns the user object with the specified id' })
})

// DELETE - Removes the user with the specified id and returns the deleted user
server.delete('/api/users/:id', async (req,res) => {
    //res.status(200).json({ message: 'Delete this user' })
    const remUser = await User.findById(req.params.id)
        if (!remUser) {
            res.status(404).json({message:'The user with the specified ID does not exist'})
        } else { 
            const deletedUser = await User.remove(remUser.id)
            res.status(200).json(deletedUser)}
})

// PUT - Updates the user with the specified id using data from the request body
server.put('/api/users/:id', async (req,res) => {
    //res.status(200).json({ message: 'Updates the user' })
    try {
        const possibleUser = await User.findById(req.params.id)
        if (!possibleUser) {
            res.status(404).json({
                message: 'The user with the specified ID does not exist',
            })
        } else { 
         if(!req.body.name || !req.body.bio) {
            res.status(400).json({
                message: 'Please provide name and bio for the user',
            })
            } else {
            const updatedUser = await User.update(
                req.params.id, 
                req.body,
                )
            res.status(200).json(updatedUser)
        }
    }
} catch(err) {
    res.status(500).json({
        message: 'error updating user',
        err: err.message,
        stack: err.stack,
    })
    }
})



// const { id } = req.params
// const changes = req.body
// try { const result = await Dog.update(id,changes)
//         res.status(200).json(result)
//     } catch (err) { 
//         console.log(err)
//         res.status(500).json({ message: err.message })
// }

module.exports = server; // EXPORT YOUR SERVER instead of {}
