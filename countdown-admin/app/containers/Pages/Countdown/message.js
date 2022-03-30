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
    defaultMessage: 'Edit Countdowns'
  },
  paperTitle: {
    id: `${scope}.paper.title`,
    defaultMessage: 'Countdowns'
  },
  paperSubtitle: {
    id: `${scope}.paper.subtitle`,
    defaultMessage:
      'You can fake countdowns, and edit / remove countdowns here.'
  },
  content: {
    id: `${scope}.paper.content`,
    defaultMessage: 'Content'
  }
});
