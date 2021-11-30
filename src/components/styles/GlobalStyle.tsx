import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.secondary};
    color: ${(props) => props.theme.primary};
  }
`;

export default GlobalStyle;
