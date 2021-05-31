import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useHistory } from "react-router-dom";
import { logUserOut } from "../apollo";
import Photo from "../components/feed/Photo";
import PageTitle from "../components/PageTitle";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragment";

const FEED_QUERY = gql`
  query seeFeed {
    seeFeed {
      ...PhotoFragment
      user {
        userName
        avatar
      }
      caption
      comments {
        ...CommentFragment
      }
      createdAt
      isMine
    }
  }
  ${PHOTO_FRAGMENT}
  ${COMMENT_FRAGMENT}
`;

const Home = () => {
  const { data } = useQuery(FEED_QUERY);
  const history = useHistory();
  return (
    <div>
      <PageTitle title="Home" />
      {data?.seeFeed?.map((photo) => (
        <Photo key={photo.id} {...photo} />
      ))}
      <button onClick={() => logUserOut(history)}>Log Out now!</button>
    </div>
  );
};
export default Home;
