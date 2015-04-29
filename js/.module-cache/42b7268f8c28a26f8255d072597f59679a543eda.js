module.exports = ProfileMixin = {
  getInitialState: function() {
    
    var username = (this.context.router.getCurrentParams().username ? this.context.router.getCurrentParams().username : this.props.activeAccount);
    
    var state = {
      username: username,
      avatar: "img/genericPerson.png", 
      fullname: "", 
      bio: "", 
      location: "", 
      url: ""
    };
    
    var profile = Twister.getUser(username).getProfile();
    
    if (profile.inCache()) {
    
      state.fullname = profile.getField("fullname");
      state.bio = profile.getField("bio");
      state.location = profile.getField("location");
      state.url = profile.getField("url");
    
    }
    
    var avatar = Twister.getUser(username).getAvatar();
    
    if (avatar.inCache()) {
    
      state.avatar = profile.getUrl();
    
    }
    
    return state;
    
    
  },
  updateProfile: function () {
    
    var thisComponent = this;

    Twister.getUser(this.state.username).doAvatar(function(avatar){
      if (avatar.getUrl()) {
        thisComponent.setStateSafe({avatar: avatar.getUrl()});  
      }
    });
    
    Twister.getUser(this.state.username).doProfile(function(profile){
      thisComponent.setStateSafe({
        fullname: profile.getField("fullname"),
        bio: profile.getField("bio"),
        location: profile.getField("location"),
        url: profile.getField("url"),
      });  
    });
  
  },
  componentDidMount: function () {
    
    this.updateProfile();
    
    this.setInterval(this.updateProfile,this.props.pollIntervalProfile*1000);
    
  }
};