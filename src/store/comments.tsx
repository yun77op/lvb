import weiboAPIRequest from './weibo';
import { StoreBase, AutoSubscribeStore, autoSubscribe } from 'resub';
import {Comment} from '../Types';

@AutoSubscribeStore
class CommentStore extends StoreBase {
  private _commentsByStatusId: Map<string, Comment[]> = new Map<string, Comment[]>();
  private _fetching = false;

  addComments(id: string, comments: Comment[]) {
    const commentsByStatusId = this._commentsByStatusId.get(id);

    comments = comments.map((comment) => {
      return {
        ...comment,
        status: null,
        statusId: comment.status.idstr
      }
    });

    const newCommentsByStatusId = (commentsByStatusId || []).concat(comments);

    this._commentsByStatusId = new Map(this._commentsByStatusId);
    this._commentsByStatusId.set(id, newCommentsByStatusId);

    this.trigger();
  }


  async addReply(query: {
    comment: string;
    id: string;
    comment_ori: '1'|'0';
    cid: string;
  }) {

    const response = await weiboAPIRequest('/comments/reply.json', {
      query
    });

    return response;
  }

  async addComment(query: {
    comment: string;
    id: string;
    comment_ori: '1'|'0';
  }) {

    const response = await weiboAPIRequest('/comments/create.json', {
      query,
      method: 'POST'
    });

    return response;
  }

  async destroy(query: {
    cid: string;
  }) {
    const response = await weiboAPIRequest('/comments/destroy.json', {
      query,
      method: 'POST'
    });

    return response;
  }

  async fetch(options: {
    maxId: string;
    id: string;
  }) {

    if (this._fetching) return;

    this._fetching = true;

    const query = {
      max_id: options.maxId,
      id: options.id
    };


    const response = await weiboAPIRequest('/comments/show.json', {
      query
    });

    let comments = response.comments;

    if (query.max_id === '0') {
      this._commentsByStatusId.set(query.id, []);
    } else {
      comments = comments.slice(1);
    }

    this.addComments(query.id, comments);

    this._fetching = false;
  }

  @autoSubscribe
  getComments(id: string) {
    return this._commentsByStatusId.get(id)
  }
}

export default new CommentStore();