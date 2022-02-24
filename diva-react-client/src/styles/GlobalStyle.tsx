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
    margin: 0;
    padding: 0;
  }

  a:focus, button:focus, input[type=submit]:focus, input[type=checkbox]:focus, [tabindex]:focus,.card:focus {
    outline:2px solid ${(props) => props.theme.primary};
    outline-offset:0.25em;
  }

  a {
    color: ${(props) => props.theme.primary};
    text-decoration: none;
  
  }
  a:hover {
    text-decoration: underline;
  }
  
  a:visited {
    color: ${(props) => props.theme.primaryAccent};
    text-decoration: none;
  }

  h1, h2 {
    margin: 0;
  }

  p {
    margin: 0;
  }

`;

export default GlobalStyle;
