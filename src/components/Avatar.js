import styled from "styled-components";

const SAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 15px;
  background-color: #2c2c2c;
  overflow: hidden;
`;

const Img = styled.img`
  width: 28px;
  height: 28px;
  object-fit: cover;
`;

function Avatar({ url = "" }) {
  return <SAvatar>{url !== "" ? <Img src={url} /> : null}</SAvatar>;
}

export default Avatar;
