import moment from 'moment';
export default class RequestDTO {
  constructor() {
    this.id = '';
    this.createdAt = moment();
    this.countdown = '';
    this.user = '';
    this.text = '';
    this.likes = 0;
    this.dislikes = 0;
  }
}
