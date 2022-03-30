import moment from 'moment';
export default class CountdownDTO {
  constructor() {
    this.id = '';
    this.createdAt = moment();
    this.name = 'iwantii';
    this.winner = '';
    this.request = '';
    this.likes = 0;
    this.dislikes = 0;
  }
}
