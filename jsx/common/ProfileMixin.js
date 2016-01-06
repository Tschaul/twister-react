
var AppSettingsMixin = require('../common/AppSettingsMixin.js');
var EventListenerMixin = require('../common/EventListenerMixin.js');

module.exports = ProfileMixin = {
  mixins: [
    AppSettingsMixin,
    EventListenerMixin('profileupdatebyuser'),
    EventListenerMixin('avatarupdatebyuser'),
  ],
  onprofileupdatebyuser: function(event){
    //console.log("catched event",this.state.username,event.detail)
    var profile =event.detail;
    if(profile.getUsername()==this.state.username){
      this.setState(function(state){
        state.fullname = profile.getField("fullname");
        state.bio = profile.getField("bio");
        state.location = profile.getField("location");
        state.url = profile.getField("url");
        return state;
      })
    }
  },
  onavatarupdatebyuser: function(event){
    //console.log("catched event",this.state.username,event.detail)
    var avatar =event.detail;
    if(avatar.getUsername()==this.state.username){
      this.setState(function(state){
        state.avatar = avatar.getUrl();
        return state;
      })
    }
  },
  getInitialState: function() {
    
    var username = this.props.username;
    
    if (!username) {
    
      username = (this.context.router.getCurrentParams().username ? this.context.router.getCurrentParams().username : this.props.activeAccount);
      
    }
    
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
    
      state.avatar = avatar.getUrl();
    
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
    
    this.setInterval(this.updateProfile,this.state.appSettings.pollIntervalProfile*1000);
    
  }
};