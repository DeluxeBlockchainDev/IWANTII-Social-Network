/*
 * Countdown Page Messages
 *
 * This contains all the text for the Countdown Page.
 */
import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.containers.Countdown';

export default defineMessages({
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Comments on Requests'
  },
  paperTitle: {
    id: `${scope}.paper.title`,
    defaultMessage: 'Comments'
  },
  paperSubtitle: {
    id: `${scope}.paper.subtitle`,
    defaultMessage:
      'You can fake comments, and edit / remove comments on requests here.'
  },
  content: {
    id: `${scope}.paper.content`,
    defaultMessage: 'Content'
  }
});
