const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        isFetching: true,
        error: false,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isFetching: false,
        error: false,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        isFetching: false,
        error: true,
      };
      case "FOLLOW":
        return {
          ...state,
          user: {
            ...state.user,
            followings: Array.isArray(state.user.followings)
              ? [...state.user.followings, action.payload] // currentUser followings eklemek
              : [action.payload], // Eğer currentUser followings dizisi yoksa, yeni bir dizi oluştur
          },
        };
      
      case "UNFOLLOW":
        return {
          ...state,
          user: {
            ...state.user,
            followings: Array.isArray(state.user.followings)
              ? state.user.followings.filter(
                  (following) => following !== action.payload
                ) // Eğer currentUser followings dizisinde var ise, onu çıkar
              : [], // Eğer currentUser followings dizisi yoksa, boş dizi döndür
          },
        };

    default:
      return state;
  }
};

export default AuthReducer;
