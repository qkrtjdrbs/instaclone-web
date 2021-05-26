import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { logUserOut } from "../apollo";
import Photo from "../components/feed/Photo";

const FEED_QUERY = gql`
  query seeFeed {
    seeFeed {
      id
      user {
        userName
        avatar
      }
      file
      caption
      likes
      comments
      createdAt
      isMine
      isLiked
    }
  }
`;

const Home = () => {
  const { data } = useQuery(FEED_QUERY);
  return (
    <div>
      {data?.seeFeed?.map((photo) => (
        <Photo key={photo.id} {...photo} />
      ))}
      <button onClick={() => logUserOut()}>Log Out now!</button>
    </div>
  );
};
export default Home;
