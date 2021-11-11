const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth.middleware')
const Post = require('../models/Post')

router.get('/', auth, async (req, res) => {
    try{
        const posts = await Post.find({owner: req.user.userId})
        res.json(posts)
        
    } catch(err) {
        res.status(500).json({message: "Something wrong try again"})
    }
})


router.post('/', auth, async (req, res) => {
    try{
        const {title, text} = req.body
        if(title.trim() && text.trim()){
        const post = new Post({title, text, owner: req.user.userId})
        await post.save()
        res.status(201).json({message: 'The Post has been created' })}else{res.status(201).json({message: 'The post can not be empty'})}
        
    } catch(err) {
        res.status(500).json({message: "Something wrong try again"})
    }
})



router.delete('/:id', auth, async (req, res) => {
    try{
        await Post.remove({_id: req.params.id})
        res.status(200).json({
            message: 'post have been deleted'
        })
        
    } catch(err) {
        res.status(500).json({message: "Something wrong try again"})
    }
})






module.exports = router