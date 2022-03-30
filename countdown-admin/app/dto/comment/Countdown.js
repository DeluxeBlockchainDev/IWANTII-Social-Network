import moment from 'moment';
export default class CountdownCommentDTO {
  constructor() {
    this.id = '';
    this.time = moment().format('DD/MM/YYYY HH:mm:ss');
    this.countdown = '';
    this.comment = '';
    this.likes = 0;
    this.dislikes = 0;
    this.comments = 0;
  }
}
