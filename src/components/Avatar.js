import styled from "styled-components";

const SAvatar = styled.div`
  width: ${(props) => (props.lg ? "30px" : "28px")};
  height: ${(props) => (props.lg ? "30px" : "28px")};
  border-radius: 50%;
  background-color: #2c2c2c;
  overflow: hidden;
`;

const Img = styled.img`
  width: ${(props) => (props.lg ? "30px" : "28px")};
  height: ${(props) => (props.lg ? "30px" : "28px")};
  object-fit: cover;
`;

function Avatar({ url = "", lg = false }) {
  return <SAvatar lg={lg}>{url !== "" ? <Img lg src={url} /> : null}</SAvatar>;
}

export default Avatar;
