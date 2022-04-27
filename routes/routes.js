const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const Users = require('../models/model')
require("../config/passport")
router.get('/users', async(req, res) => {
    try {
        const users = await Users.find({})
        res.status(200).json({users})
    } catch (error) {
        res.status(500).json({msg:error})
    }
})

router.get('/user', async(req, res) => {
    try {
        const user = req.user
        res.status(200).json({user})
    } catch (error) {
        res.status(500).json({msg:error})
    }
})

// router.get('/user/lists/:listID', async(req, res) => {
//     try {
//         const {id:listID} = req.params
//         const lists = req.user.Lists
//         const list = await lists.filter(function(item){
//             return item._id = {id:listID}
//         })
//         res.status(200).json({list})
//     } catch (error) {
//         res.status(500).json({msg:error})
//     }
// })

router.post('/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt()
        const password = req.body.password
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = {Username: req.body.username, Email: req.body.email, Password: hashedPassword}
        await Users.create( user )
        res.status(200).json({user})
    } catch (error) {
        res.status(500).json({msg:error})
    }
})

router.get('/logout', function(req, res) {
    req.session.destroy();
})
router.get('/auth/google', 
    passport.authenticate('google', {scope: ['email', 'profile'] })
)
router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "http://localhost:3000/login",
      successRedirect: "http://localhost:3000/profile",
      failureFlash: true,
    //   successFlash: "Successfully logged in!",
    })
  );

router.post('/users/:id/user/newList', async(req, res) => {
    try {
        const {id:userID} = req.params
        const user = Users.findOne({_id:userID})
        const newList = {$push:{Lists:{ListName:req.body.listname}}}
        await user.updateOne(newList)
        res.status(200).json({newList})
    } catch (error) {
        res.status(500).json({msg:error})
    }
})

router.get('/users/:id/user/lists/:id1/list', async(req, res) => {
    try {
        const {id:userID} = req.params
        const {id1:listID} = req.params
        const list = await Users.findOne({_id:userID}, {Lists:{$elemMatch:{_id:listID}}})
        const List = await list.Lists[0]
        res.status(200).json(List)
    } catch (error) {
        res.status(500).json({msg:error})
    }
})
router.post('/users/:id/user/lists/delete/:id1/list', async(req, res) => {
    try {
        const {id:userID} = req.params
        const {id1:listID} = req.params
        const deleteList = await Users.updateOne(
            {_id:userID},
            {$pull:{"Lists":{"_id": listID}}}
        )
        res.status(200).json({deleteList})
    } catch (error) {
        res.status(500).json({msg:error})
    }
})
router.post('/users/:id/user/lists/:id1/list/delete/:id2', async(req, res) => {
        try {
            const {id:userID} = req.params
            const {id1:listID} = req.params
            const {id2:songID} = req.params
            const deletedListSong = await Users.updateOne(
                {_id:userID},
                {$pull:
                    {"Lists.$[elem].Songs":
                        {
                            "_id": songID
                        }
                    }
                },
                {arrayFilters:[{"elem._id": listID}]} 
            )
            res.status(200).json({deletedListSong})
        } catch (error) {
            res.status(500).json({msg:error})
        }
})
router.post('/users/:id/user/lists/:id1/list/addSong', async(req, res) => {
    try {
        const {id:userID} = req.params
        const {id1:listID} = req.params
        const songAdded = await Users.findOneAndUpdate(
            {_id:userID},
            {$push:
                {"Lists.$[elem].Songs":
                    {
                    SongName: req.body.songname, 
                    SongLink: req.body.link,
                    SongImg: req.body.img
                    }
                }
            }, 
            {arrayFilters:[{"elem._id": listID}]}
        )
        res.status(200).json({songAdded})
    } catch (error) {
        res.status(500).json({msg:error})
    }
    
})

module.exports = router