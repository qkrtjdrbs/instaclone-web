import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FatText } from "../shared";

const CommentContainer = styled.div``;

const CommentCapt = styled.span`
  margin-left: 10px;
  a {
    background-color: inherit;
    color: ${(props) => props.theme.accent};
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

function Comment({ author, payload }) {
  return (
    <CommentContainer>
      <FatText>{author}</FatText>
      <CommentCapt>
        {payload.split(" ").map((word, index) =>
          /#[\w]+/.test(`${word}`) ? (
            <React.Fragment>
              <Link key={index} to={`/hashtags/${word}`}>
                {word}
              </Link>{" "}
            </React.Fragment>
          ) : (
            <>
              <React.Fragment key={index}>{word}</React.Fragment>{" "}
            </>
          )
        )}
      </CommentCapt>
    </CommentContainer>
  );
}

Comment.propTypes = {
  author: PropTypes.string.isRequired,
  payload: PropTypes.string.isRequired,
};

export default Comment;
