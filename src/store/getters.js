const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  userId: state => state.user.userProfile.userId,
  avatar: state => state.user.userProfile.staffPhoto,
  username: state => state.user.userProfile.username,
  routes: state => state.user.routes
}
export default getters
