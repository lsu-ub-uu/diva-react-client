import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.secondary};
    color: ${(props) => props.theme.text};
  }

  .marginBottom2em{
    margin-bottom:2em;
  }
`;

export default GlobalStyle;
