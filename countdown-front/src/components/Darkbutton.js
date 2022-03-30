import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const DarkMode = () => {
  const clickedClass = 'clicked';
  const { body } = document;
  const lightTheme = 'theme-light';
  const darkTheme = 'theme-dark';
  let theme;

  if (localStorage) {
    theme = localStorage.getItem('theme');
  }

  if (theme === lightTheme || theme === darkTheme) {
    body.classList.add(theme);
  } else {
    body.classList.add(lightTheme);
  }

  const switchTheme = e => {
    if (theme === darkTheme) {
      body.classList.replace(darkTheme, lightTheme);
      e.target.classList.remove(clickedClass);
      localStorage.setItem('theme', 'theme-light');
      theme = lightTheme;
    } else {
      body.classList.replace(lightTheme, darkTheme);
      e.target.classList.add(clickedClass);
      localStorage.setItem('theme', 'theme-dark');
      theme = darkTheme;
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <FormControlLabel
      control={
        <span
          className={`pointer p-2 text-center ms-2 chat-active-btn ${
            theme === 'dark' ? clickedClass : ''
          }`}
        >
          <i className="feather-moon font-xl text-current" />
        </span>
      }
      onClick={e => switchTheme(e)}
      label={` Dark Theme`}
    />
  );
};

export default DarkMode;
