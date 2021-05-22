import styled from "styled-components";

const SFormError = styled.span`
  color: tomato;
  font-weight: 600;
`;

function FormError({ message }) {
  return <SFormError>{message}</SFormError>;
}

export default FormError;
