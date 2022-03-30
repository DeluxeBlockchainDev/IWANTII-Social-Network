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
    defaultMessage: 'Users'
  },
  paperTitle: {
    id: `${scope}.paper.title`,
    defaultMessage: 'Users'
  },
  paperSubtitle: {
    id: `${scope}.paper.subtitle`,
    defaultMessage: 'You can fake users, and edit / remove users here.'
  },
  content: {
    id: `${scope}.paper.content`,
    defaultMessage: 'Content'
  }
});
