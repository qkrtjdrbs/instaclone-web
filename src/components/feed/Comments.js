import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import useUser from "../../hooks/useUser";
import Comment from "./Comment";

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($photoId: Int!, $payload: String!) {
    createComment(photoId: $photoId, payload: $payload) {
      ok
      id
      error
    }
  }
`;

const CommentsContainer = styled.div`
  margin-top: 15px;
`;

const CommentCount = styled.span`
  opacity: 0.7;
  margin: 10px 0px;
  display: block;
  font-size: 12px;
  font-weight: 600;
`;

function Comments({ photoId, author, caption, commentNumber, comments }) {
  const { data: userData } = useUser();
  const createCommentUpdate = (cache, result) => {
    const { payload } = getValues();
    setValue("payload", "");
    const {
      data: {
        createComment: { ok, id },
      },
    } = result;
    if (ok && userData?.me) {
      //for real time comment update
      //Comments in the photo's fields also need to be updated, so it goes through step 3.

      //step 1. Create an arbitrary object containing new comment information.
      const newComment = {
        __typename: "Comment",
        createdAt: Date.now() + "",
        id,
        isMine: true,
        payload,
        user: {
          ...userData.me,
        },
      };
      //step 2. Write comment inside of the cache with the object defined above..
      const newCacheComment = cache.writeFragment({
        data: newComment,
        fragment: gql`
          fragment ABC on Comment {
            id
            createdAt
            isMine
            payload
            user {
              userName
              avatar
            }
          }
        `,
      });
      //step 3. Comment inside of the cache is added to comments in photo's fields. Also number of comments is modified.
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          comments(prev) {
            //previous comments + new comment
            return [...prev, newCacheComment];
          },
          commentNumber(prev) {
            return prev + 1;
          },
        },
      });
    }
  };
  const [createCommentMutation, { loading }] = useMutation(
    CREATE_COMMENT_MUTATION,
    {
      update: createCommentUpdate,
    }
  );
  const { register, handleSubmit, setValue, getValues } = useForm();
  const onVaild = (data) => {
    const { payload } = data;
    if (loading) {
      return;
    }
    createCommentMutation({
      variables: {
        photoId,
        payload,
      },
    });
  };
  return (
    <CommentsContainer>
      <Comment author={author} payload={caption} />
      <CommentCount>
        {commentNumber === 1 ? "1 comment" : `${commentNumber} comments`}
      </CommentCount>
      {comments?.map((comment) => (
        <Comment
          key={comment.id}
          photoId={photoId}
          id={comment.id}
          author={comment.user.userName}
          payload={comment.payload}
          isMine={comment.isMine}
        />
      ))}
      <div>
        <form onSubmit={handleSubmit(onVaild)}>
          <input
            name="payload"
            ref={register({ required: true })}
            type="text"
            placeholder="Write a comment..."
          />
        </form>
      </div>
    </CommentsContainer>
  );
}

Comments.propTypes = {
  photoId: PropTypes.number.isRequired,
  author: PropTypes.string.isRequired,
  caption: PropTypes.string,
};

export default Comments;
