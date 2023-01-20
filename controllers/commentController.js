const _ = require('lodash');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const Sequelize = require('sequelize-values')();

module.exports.addComment = async (req, res, next) => {
    const postId = req.body.postId;
    const userId = req.body.userId;
    const commentId = req.body.commentId;
    const context = req.body.context;
    // const post = await Post.findByPk(postId);
    // const comment = await Comment.findByPk(commentId);

    const query = {
        UserId: userId,
        PostId: postId,
        context: context,
        deleted: 'N'
    };
    if (await User.findByPk(userId) && await Post.findByPk(postId)) {
        let parent;
        if (commentId) {
            parent = await Comment.findByPk(commentId);
        }
        return await Comment
            .create(query)
            .then(async result => {
                // console.log(result.getValuesDedup());
                if (!result) {
                    return res.status(400).json({ message: 'Failed to create comment' });
                }
                if(parent){
                    await parent.addComment(result)
                    .then(async addedResult => {
                        // console.log(addedResult);
                        // console.log(Sequelize.getValues((await parent.getComments())));
                    });
                }
                return res.status(200).json({
                    CommentId: result.getValuesDedup().id,
                    message: 'Created comment successfull'
                });
            })
    }
    return res.status(400).json({ message: 'Failed to create comment' });
};