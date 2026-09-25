const GlobalReducer = (state = {
  authuser: null,
  toastModal: {
    show: false,
    title: '',
    subtitle: '',
    description: '',
    icon: '',
    iconcolor: ''
  },
  chosencity: null,
  cart: null,
  hideCartBadge: false,
  favoriteOverrides: {},
}, action) => {
  switch (action.type) {
    case 'TOAST': {
      state = {
        ...state,
        toastModal: { ...action.payload }
      };
      break;
    }
    case 'SETAUTHUSER': {
      state = {
        ...state,
        authuser: action.payload
      };
      break;
    }
    case 'SETCITY': {
      state = {
        ...state,
        chosencity: action.payload || null
      };
      break;
    }
    case 'SETCART': {
      state = {
        ...state,
        cart: action.payload
      };
      break;
    }
    case 'BADGEHIDE': {
      state = {
        ...state,
        hideCartBadge: action.payload
      };
      break;
    }
    case 'SET_FAVORITE_STATUS': {
      const productId = Math.abs(action.payload?.product_id);
      if (!productId) break;
      state = {
        ...state,
        favoriteOverrides: {
          ...state.favoriteOverrides,
          [productId]: action.payload.is_favorite ? 1 : 0,
        },
      };
      break;
    }
    default:
      return state;
  }
  return state;
};

export default GlobalReducer;
