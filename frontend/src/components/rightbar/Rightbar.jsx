import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@mui/icons-material";

export default function Rightbar({ user }) {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);

  let currentUserControl =
    Array.isArray(currentUser?.user.followings) &&
    currentUser?.user.followings.includes(user?._id);

  const [followed, setFollowed] = useState(currentUserControl);

  useEffect(() => {
    if (currentUserControl) {
      setFollowed(true);
    } else {
      setFollowed(false);
    }
  }, [currentUserControl]);

  useEffect(() => {
    const getFriends = async () => {
      if (user?._id) {
        // user._id var mı kontrol et
        try {
          const friendList = await axios.get(`/api/users/friends/${user._id}`);
          setFriends(friendList.data);
        } catch (err) {
          console.log("Friend fetch error: ", err);
        }
      } else {
        console.log("User ID is missing");
      }
    };

    if (user) {
      getFriends();
    }
  }, [user]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(`/api/users/${user._id}/unfollow`, {
          userId: currentUser?.user._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`/api/users/${user._id}/follow`, {
          userId: currentUser?.user._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
    } catch (err) {
      console.log("Follow/Unfollow error: ", err);
    }
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src="assets/gift.png" alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birthday today.
          </span>
        </div>
        <img className="rightbarAd" src="assets/ad.png" alt="" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {Users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user?.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbarTitle">User Information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user?.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user?.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">
              {user?.relationship === 1
                ? "Single"
                : user?.relationship === 2
                ? "Married"
                : "-"}
            </span>
          </div>
        </div>
        <h4 className="rightbarTitle">User Friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
              key={friend._id}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    friend.profilePicture
                      ? PF + friend.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}

/*import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@mui/icons-material";

const Rightbar = ({ user }) => {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [isFollowing, setIsFollowing] = useState(
    currentUser.user.followings.includes(user?._id)
  );

  console.log(currentUser.user);
  console.log(user);
  console.log("takip ediyor mu değeri", isFollowing);
  console.log(
    "içeriyormu değeri",
    currentUser.user.followings.includes(user?._id)
  );
  console.log(friends);

  useEffect(() => {
    if (user && user._id) {
      const getFriends = async () => {
        try {
          const friendlist = await axios.get("/api/users/friends/" + user._id);
          setFriends(friendlist.data);
        } catch (error) {
          console.log("Error fetching friends:", error.response || error);
        }
      };
      getFriends();
    }
  }, [user, currentUser.user]);

  useEffect(() => {
    if (user && currentUser && currentUser.user) {
      setIsFollowing(currentUser.user.followings.includes(user._id));
    }
  }, [user, currentUser.user]);

  const handleClick = async () => {
    try {
      if (isFollowing) {
        await axios.put(`/api/users/${user._id}/unfollow`, {
          userId: currentUser.user._id,
        });
        console.log("Unfollowed the user!");
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`/api/users/${user._id}/follow`, {
          userId: currentUser.user._id,
        });
        console.log("Followed the user!");
        dispatch({ type: "FOLLOW", payload: user._id });
      }

      setIsFollowing(!isFollowing);

      const updatedCurrentUser = await axios.get(
        `/api/users/${currentUser.user._id}`
      );
      dispatch({ type: "UPDATE_USER", payload: updatedCurrentUser.data });

      const updatedUser = await axios.get(`/api/users/${user._id}`);
      setFriends(updatedUser.data.followers);
    } catch (error) {
      console.log("Error following/unfollowing user:", error.response || error);
    }
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src={PF + "gift.png"} alt="Birthday" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birthday today.
          </span>
        </div>
        <img className="rightbarAd" src={PF + "ad.png"} alt="Advertisement" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {Users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {isFollowing ? "Unfollow" : "Follow"}{" "}
            {isFollowing ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbarTitle">User Information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">
              {user.relationship === 0
                ? "Single"
                : user.relationship === 1
                ? "Married"
                : "-"}
            </span>
          </div>
        </div>
        <h4 className="rightbarTitle">User Friends</h4>
        <div className="rightbarFollowings">
          {friends &&
            friends.map((friend, index) => (
              <Link to={`/profile/${friend.username}`} key={index}>
                <div className="rightbarFollowing">
                  <img
                    src={
                      friend.profilePicture
                        ? PF + friend.profilePicture
                        : PF + "person/noAvatar.png"
                    }
                    alt={friend.username}
                    className="rightbarFollowingImg"
                  />
                  <span className="rightbarFollowingName">
                    {friend.username}
                  </span>
                </div>
              </Link>
            ))}
        </div>
      </>
    );
  };

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
};

export default Rightbar;*/
