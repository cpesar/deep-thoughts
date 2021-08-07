import React from 'react';
import { Redirect, useParams } from 'react-router-dom';

import Auth from '../utils/auth';

import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';
import ThoughtForm from '../components/ThoughtForm';

import { useQuery, useMutation } from '@apollo/react-hooks';
// import{ QUERY_USER } from '../utils/queries';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { ADD_FRIEND } from '../utils/mutations';


const Profile = () => {
  const { username: userParam } = useParams();

  // Destructure the mutation function from ADD_FRIEND so that we can use it in the click function
  const [addFriend] = useMutation(ADD_FRIEND);

  //USE_QUERY hook
  // If there's a value in userParam from the URL bar, we'll use that to run QUERY_USER query
  // If there's NO value in userParam, execute QUERY_ME instead 
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam }
  });

  const user = data?.me || data?.user || {};
  // Redirect to personal profile page if username is the logged in user's
  if(Auth.loggedIn() && Auth.getProfile().data.username === userParam){
    return <Redirect to="/profile" />;
  }

  if(loading){
    return <div>Loading...</div>;
  }

  if(!user?.username){
    return(
      <h4>
        You need to be logged in to see this page. Use the navigation links above to sign up or log in!
      </h4>
    );
  }

  // Declare a handleClick function to utilize the addFriend()
  const handleClick = async () => {
    try{
      await addFriend({
        variables: { id: user._id }
      });
    } catch (e) {
      console.error(e);
    }
  }


  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          Viewing {userParam ? `${user.username}'s` : 'your'} profile.
        </h2>

      {userParam && (
        <button className="btn ml-auto" onClick={handleClick}>
          Add Friend
        </button>
      )}
        
      </div>

      

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
          <ThoughtList thoughts={user.thoughts} title={`${user.username}'s thoughts...`} />
        </div>

        <div className="col-12 col-lg-3 mb-3">
          <FriendList
            username={user.username}
            friendCount={user.friendCount}
            friends={user.friends}
          />
        </div>
      </div>
      <div className="mb-3">{!userParam && <ThoughtForm />}</div>
    </div>
  );
};

export default Profile;
