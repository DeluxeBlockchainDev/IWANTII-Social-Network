import moment from 'moment';
export default class UserDTO {
  constructor() {
    this.id = '';
    this.createdAt = moment();
    this.user = '';
    this.email = '';
    this.country = 'IL';
    this.ip = '';
    this.likes = 0;
    this.dislikes = 0;
    this.isReal = false;
    this.isLive = true;
  }
}
