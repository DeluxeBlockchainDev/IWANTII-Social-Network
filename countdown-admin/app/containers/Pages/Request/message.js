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
    defaultMessage: 'Edit Requests'
  },
  paperTitle: {
    id: `${scope}.paper.title`,
    defaultMessage: 'Requests'
  },
  paperSubtitle: {
    id: `${scope}.paper.subtitle`,
    defaultMessage: 'You can fake requests, and edit / remove reqeusts here.'
  },
  content: {
    id: `${scope}.paper.content`,
    defaultMessage: 'Content'
  }
});
