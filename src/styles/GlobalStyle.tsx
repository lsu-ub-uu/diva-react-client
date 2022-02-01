import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.background};
    color: ${(props) => props.theme.text};
    font-family:Arial,sans-serif;
  }
  .gray{
    color:#6A6B6F;
  }

  .headingLink {
    font-size:1.4em;
    font-weight:bold;
    text-decoration:none;
    color: ${(props) => props.theme.text};
  }

  ul {
    list-style-type: none;
  }

  a:focus, button:focus, input[type=submit]:focus, input[type=checkbox]:focus, [tabindex]:focus,.card:focus {
    outline:2px solid ${(props) => props.theme.primary};
    outline-offset:0.25em;
}

`;

export default GlobalStyle;
