import weiboAPIRequest from './weibo';
import { AutoSubscribeStore, autoSubscribe } from 'resub';
import {Comment} from '../Types';
import TimelineStore from './Timeline';

@AutoSubscribeStore
class MentionCommentStore extends TimelineStore<Comment> {

  async fetch(next?: boolean) {
    const query = !next ? null : {
      max_id: this._sinceId
    }

    const response = await weiboAPIRequest('/comments/mentions.json', {
      query
    });

    if (response.error) {
      return response;
    }

    if (response.comments.length === 0) return;

    const comments = response.comments;
    let commentsFiltered;

    if (!next) {
      this._maxId = comments[0];

      this.items = [];
      commentsFiltered = comments;
    } else {
      commentsFiltered = response.comments.slice(1);
    }

    this.addItems(commentsFiltered);

    return response;
  }

  @autoSubscribe
  getComments() {
    return this.items;
  }
  
}

export default new MentionCommentStore();