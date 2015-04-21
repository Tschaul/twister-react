
var ReactBootstrap = require('react-bootstrap')
  , NavItem = ReactBootstrap.NavItem
  , Nav = ReactBootstrap.Nav
  , ListGroup = ReactBootstrap.ListGroup
  , Panel = ReactBootstrap.Panel


var React = require('react');

var Postboard = require("./Postboard.js");
var SetIntervalMixin = require("./SetIntervalMixin.js");
var StreamMixin = require("./StreamMixin.js");

module.exports = Timeline = React.createClass({displayName: "Timeline",
    
    mixins: [StreamMixin,SetIntervalMixin],
    contextTypes: {
      router: React.PropTypes.func
    },
    verifyPost: function (post) {
        
        var verified = false;

        for (var i = 0; i<this.state.usernames.length; i++) {

            if (post.getUsername()==this.state.usernames[i]) { verified = true }

        }

        return verified;
            
    },
    getInitialState: function() {
        return {
            data: [], 
            postIdentifiers: {}, 
            usernames: [], 
            timelineUser: [], 
            postrange: ( Date.now()/1000 - 24*60*60 ),
            min_posts: 30
        };
    },
    addUser: function(username) {
        
        
        var thisComponent = this;

        this.setState(function(previousState, currentProps){

            previousState.usernames.push(username);

            return previousState;

        },function(){

            Twister.getUser(username).doLatestPostsUntil(function(post){
                if (post.getTimestamp()<thisComponent.state.postrange) {
                    return false
                } else {
                    thisComponent.addPost(post)
                }
            },{outdatedLimit: 60*60*24});

        });
        
    },
    removeUser: function(username) {
        
        this.setState(function(previousState, currentProps){
            
            var newusers = [];
            
            for (var i = 0; i<previousState.usernames.length; i++) {
                if (previousState.usernames[i]!=username) {
                    newusers.push(previousState.usernames[i]);
                }
            }
            
            previousState.usernames = newusers;
            
            var newdata = [];
            
            for (var i = 0; i<previousState.data.length; i++) {
                if (previousState.data[i].username!=username) {
                    newusers.push(previousState.data[i]);
                } else {
                    previousState.postIdentifiers[previousState.data[i].postid]=false;
                }
            }
            
            previousState.data = newdata;
            
            return previousState;
            
        });
    },
    updatePosts: function(outdatedLimit) {
		
        if (!outdatedLimit) {outdatedLimit=30;}
      
        for (var i = 0; i<this.state.usernames.length; i++) {
        
            var thisComponent = this;
            var thisUsername = this.state.usernames[i];
			
            Twister.getUser(thisUsername).doLatestPostsUntil(function(post){
            
                if (post!==null) {
					if(post.getTimestamp()<thisComponent.state.postrange) {
						return false;
					} else {
                    	thisComponent.addPost(post); 
					}
                } else {
                    thisComponent.removeUser(thisUsername);
					return false;
                }
            
            },{outdatedLimit: outdatedLimit});
            
        }
    },
    componentDidMount: function() {
                        
        var thisComponent = this;
        
        var username=this.context.router.getCurrentParams().timelineUser;
        
        Twister.getAccount(username).activateTorrents(function(){
        
            Twister.getUser(username).doFollowings(function(followings){

                for(var i in followings){

                    
                    thisComponent.addUser(followings[i].getUsername());
                    

                }
              
                thisComponent.updatePosts(60);

            });
        
        });
      
        this.setInterval(this.updatePosts, this.props.pollInterval);
        
    },
    render: function() {
        return (
          React.createElement("div", null, 
            React.createElement("h3", null, 'Timeline of '+this.context.router.getCurrentParams().timelineUser), 
            React.createElement(Postboard, {data: this.state.data})
            )
        );
  }
});