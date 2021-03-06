export default function rootReducer(
  state = {
    venues: [],
    currentVenues: [],
    currentDay: "",
    currentComments: [],
    userLocation: [],
    lastVenueSearched: [],
    isLoading: false
  },
  action
) {
  switch(action.type) {
    case "SET_VENUES":
      return ( Object.assign({}, state, {venues: action.payload}))
    case "SET_CURRENT_VENUES":
      return (Object.assign({}, state, {currentVenues: action.payload}))
    case "SET_CURRENT_DAY":
      return (Object.assign({}, state, {currentDay: action.payload}))
    case "SET_CURRENT_COMMENTS":
      return (Object.assign({}, state, {currentComments: action.payload}))
    case "SET_USER_LOCATION":
      return (Object.assign({}, state, {userLocation: action.payload}))
    case "SET_IS_LOADING":
      return (Object.assign({}, state, {isLoading: action.payload}))
    case "ADD_COMMENT":
      return (Object.assign({}, state, {currentComments: state.currentComments.concat(action.payload)}))
    case "LAST_VENUE_SEARCHED":
      return (Object.assign({}, state, {lastVenueSearched: action.payload}))
    case "ADD_VENUE":
      return (Object.assign({}, state, {venues: state.venues.concat(action.payload)}))
    case "EDIT_VENUE":
      return (Object.assign({}, state, {editVenue: action.payload}))
    default:
      return state;
  }
}
