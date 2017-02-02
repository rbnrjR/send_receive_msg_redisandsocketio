import React from 'react';
import ReactDom from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Form from './components/form.jsx';
injectTapEventPlugin();

ReactDom.render(
  <Form />,
  document.getElementById('id')
);
