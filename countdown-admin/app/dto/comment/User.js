import moment from 'moment';
export default class UserCommentDTO {
  constructor() {
    this.id = '';
    this.time = moment().format('DD/MM/YYYY HH:mm:ss');
    this.user = '';
    this.comment = '';
    this.likes = 0;
    this.dislikes = 0;
    this.comments = 0;
  }
}
