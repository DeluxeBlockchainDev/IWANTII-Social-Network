import moment from 'moment';
export default class RequestCommentDTO {
  constructor() {
    this.id = '';
    this.time = moment().format('DD/MM/YYYY HH:mm:ss');
    this.request = '';
    this.comment = '';
    this.likes = 0;
    this.dislikes = 0;
    this.comments = 0;
  }
}
