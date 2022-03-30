import React, { Component } from 'react';
import { InlineShareButtons } from 'sharethis-reactjs';
import { Button } from '@material-ui/core';
import ShareIcon from '@material-ui/icons/Share';

export default class Sharethis extends Component {
  constructor() {
    super();
    this.state = {
      show: false
    };
  }

  render() {
    const { show } = this.state;
    return (
      <React.Fragment>
        {show && (
          <div className="mt-4 mb-4">
            <InlineShareButtons
              config={{
                alignment: 'center', // alignment of buttons (left, center, right)
                color: 'social', // set the color of buttons (social, white)
                enabled: true, // show/hide buttons (true, false)
                font_size: 16, // font size for the buttons
                language: 'en', // which language to use (see LANGUAGES)
                networks: [
                  // which networks to include (see SHARING NETWORKS)
                  'whatsapp',
                  'linkedin',
                  'messenger',
                  'facebook',
                  'twitter'
                ],
                padding: 12, // padding within buttons (INTEGER)
                radius: 25, // the corner radius on each button (INTEGER)
                show_total: true,
                size: 40, // the size of each button (INTEGER)

                // OPTIONAL PARAMETERS
                url: window.location.href,
                image: 'https://bit.ly/2CMhCMC',
                description: 'IWANTII', // (defaults to og:description or twitter:description)
                title: 'IWANTII', // (defaults to og:title or twitter:title)
                message: 'IWANTII', // (only for email sharing)
                subject: 'IWANTII', // (only for email sharing)
                username: 'IWANTII' // (only for twitter sharing)
              }}
            />
          </div>
        )}
        <Button
          onClick={() =>
            this.setState(prevState => ({
              ...prevState,
              show: !prevState.show
            }))
          }
          variant="contained"
          className="mt-4"
          style={{ backgroundColor: '#95d03a', color: '#fff' }}
          startIcon={<ShareIcon />}
        >
          Share
        </Button>
      </React.Fragment>
    );
  }
}
