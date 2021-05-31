import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FatText } from "../shared";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      ok
    }
  }
`;

const DeleteButton = styled.button`
  border: none;
  background-color: rgba(0, 0, 0, 0);
  padding: 5px;
  &:hover {
    cursor: pointer;
  }
`;

const CommentContainer = styled.div`
  margin-bottom: 7px;
`;

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

function Comment({ photoId, id, author, payload, isMine }) {
  const updateDeleteComment = (cache, result) => {
    const {
      data: {
        deleteComment: { ok },
      },
    } = result;
    if (ok) {
      //delete comment from cache.
      cache.evict({ id: `Comment:${id}` });
      //modify comment number.
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          commentNumber(prev) {
            return prev - 1;
          },
        },
      });
    }
  };
  const [deleteCommentMutation] = useMutation(DELETE_COMMENT_MUTATION, {
    variables: {
      id,
    },
    update: updateDeleteComment,
  });
  const onDeleteClick = () => {
    deleteCommentMutation();
  };
  return (
    <CommentContainer>
      <Link to={`/users/${author}`}>
        <FatText>{author}</FatText>
      </Link>
      <CommentCapt>
        {payload.split(" ").map((word, index) =>
          /#[\w]+/.test(`${word}`) ? (
            <React.Fragment key={index}>
              <Link to={`/hashtags/${word}`}>{word}</Link>{" "}
            </React.Fragment>
          ) : (
            <React.Fragment key={index}>{word} </React.Fragment>
          )
        )}
      </CommentCapt>
      {isMine ? <DeleteButton onClick={onDeleteClick}>❌</DeleteButton> : null}
    </CommentContainer>
  );
}

Comment.propTypes = {
  id: PropTypes.number,
  photoId: PropTypes.number,
  author: PropTypes.string.isRequired,
  payload: PropTypes.string.isRequired,
  isMine: PropTypes.bool,
};

export default Comment;
