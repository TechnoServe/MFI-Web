const express = require('express');
const _ = require('lodash');

/**
 * Comment Controller
 */
class CommentController {
  // Creates a new comment for a given cycle, category, and company
  /**
   * @param {any} req
   * @param {Response} res
   */
  static async create(req, res) {
    const {store, body, user} = req;
    const result = await store.comments.addComment(user, {
      cycle: body.cycle,
      content: body.content,
      parent: body.parent,
      owner: {id: body.category_id},
      companyId: body.company_id
    });
    res.json({result});
  }

  // Retrieves all comments created by the authenticated user
  /**
   * @param {any} req
   * @param {Response} res
   */
  static async forAuthUser(req, res) {
    const {store, user} = req;
    const result = await store.comments.getCommentsForUser(user.id);
    res.json({result});
  }

  // Retrieves all comments for a given category, company, and cycle, and attaches user details to each comment
  /**
   * @param {any} req
   * @param {Response} res
   */
  static async forCategory(req, res) {
    const {
      store,
      params: {id: categoryId},
      query: {company_id: companyId, cycle_id: cycleId}
    } = req;
    const result = await store.comments.getCommentsForCategory(companyId, categoryId, cycleId);
    const userIds = Array.from(new Set(result.map((c) => c.user_id)).values());

    // Aggregate users with their companies relationship
    const users = await store.aggregateUsersWithCompaniesByUserIds(userIds);
    const usersGroupedById = _.keyBy(users, 'id');

    res.json(result.map((comment) => {
      comment.user = usersGroupedById[comment.user_id] || null;
      return comment;
    }));
  }

  // Deletes a comment by ID if the requesting user is the owner
  /**
   * @param {any} req
   * @param {Response} res
   */
  static async delete(req, res) {
    const {store, params, user} = req;
    const comment = await store.comments.getById(params.id);

    if (!comment) return res.status(404).json({message: 'Resource not found.'});
    if (comment.user_id !== user.id) return res.status(403).json({message: 'Unauthorized'});

    await store.comments.removeComment(user, comment.id);
    res.json({result: 'ok'});
  }
}

const commentRouter = new express.Router();
commentRouter.get('/list/me', CommentController.forAuthUser);
commentRouter.get('/list/category/:id', CommentController.forCategory);
commentRouter.post('/', CommentController.create);
commentRouter.delete('/:id', CommentController.delete);

module.exports.commentRouter = commentRouter;
