import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.secondary};
    color: ${(props) => props.theme.text};
    font-family:Arial,sans-serif;
  }

  .marginBottom2em{
    margin-bottom:2em;
  }

  .headingLink {
    font-size:1.4em;
    font-weight:bold;
    text-decoration:none;
    color: ${(props) => props.theme.primary};
  }

  a:focus, button:focus, input[type=submit]:focus, input[type=checkbox]:focus, ´[tabindex]:focus,.card:focus {
    outline:2px solid #0065bd;
    outline-offset:0.25em;
}

`;

export default GlobalStyle;
