var Post = React.createClass({
    getInitialState: function() {
        return {avatar: "img/genericPerson.png", fullname: ""};
    },
    componentDidMount: function () {
        var thisComponent = this;
        
        //console.log(this.props.post.username+":post"+this.props.post.id);
        Twister.getUser(this.props.post.username).doAvatar(function(avatar){
            thisComponent.setState({avatar: avatar});  
        });
        Twister.getUser(this.props.post.username).doProfile(function(profile){
            thisComponent.setState({fullname: profile.fullname});  
        });
    },
    render: function() {
        var post = this.props.post;
        return (
            <div className="post">
                <div className="post-avatar">
                    <img src={this.state.avatar}/>
                </div>
                <div className="post-bulk">
                    <div className="post-username">
                        <span className="post-fullname">{this.state.fullname} </span>
                        @{post.username} - {post.id}
                        {post.isRetwist && 
                            <span> retwisted by {post.retwistingUser}</span>
                        }
                    </div>
                    <div className="post-timestamp">{post.timestamp}</div>
                    <div className="post-content">{post.content}</div>
                </div>
                <hr/>
            </div>
        );
    }
});

var streamMethods = {
    
    addPost: function(post) {
        
        var postid = post.getUsername() + ":post" + post.getId();
        
        if (!this.state.postIdentifiers[postid] && this.verifyPost(post)) {
            
            this.setState(function(previousState, currentProps) {
        
                previousState.postIdentifiers[postid] = true;

                if (post.isRetwist()){
                
                    
                    var postdata = {
                        username: post.getRetwistedUser(),
                        retwistingUser: post.getUsername(),
                        content: post.getRetwistedContent(),
                        id: post.getRetwistedId(),
                        timestamp: post.getTimestamp(),
                        postid: postid,
                        isRetwist: true
                    }
                    
                } else {
                
                    var postdata = {
                        username: post.getUsername(),
                        content: post.getContent(),
                        id: post.getId(),
                        timestamp: post.getTimestamp(),
                        postid: postid,
                        isRetwist: false
                        
                    }
                    
                }
                
                previousState.data.push(postdata)

                var compare = function (a,b) {
                  if (a.timestamp < b.timestamp)
                     return 1;
                  if (a.timestamp > b.timestamp)
                    return -1;
                  return 0;
                }

                previousState.data.sort(compare);

                return {data: previousState.data, postIdentifiers: previousState.postIdentifiers };
            });
            
        } else {
            
            
        }
    }
}

var UserStream = React.createClass({
    
    mixins: [streamMethods],
    verifyPost: function (post) {
        return (post.getUsername()==this.state.username)
    },
    getInitialState: function() {
        return {data: [], postIdentifiers: {}, username: "tschaul", postrange:10};
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var username = React.findDOMNode(this.refs.username).value.trim();
        if (!username) {
          return;
        }
        this.setState({username: username, data: [], postIdentifiers: {}},function(){
            this.updatePosts(60);    
        });
        React.findDOMNode(this.refs.username).value = '';
        
    },
    updatePosts: function(outdatedLimit) {
        Twister.getUser(this.state.username).doLatestPosts(this.state.postrange,this.addPost,outdatedLimit);
    },
    componentDidMount: function() {
        this.updatePosts(60);
        setInterval(this.updatePosts, this.props.pollInterval);
    },
    render: function() {
        return (
            <div className="UserStream">
                <form onSubmit={this.handleSubmit}>
                    <input type="text" placeholder="put in a username" ref="username" />
                    <input type="submit" value="Post" />
                </form><br/>
                <h1>Posts by {this.state.username}</h1>
                <Postboard data={this.state.data}/>
            </div>
        );
  }
});

var Timeline = React.createClass({
    
    mixins: [streamMethods],
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
            postrange: ( Date.now()/1000 - 24*60*60 ),
            min_posts: 30
        };
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var username = React.findDOMNode(this.refs.username).value.trim();
        if (!username) {
          return;
        }
        
        var thisComponent = this;
        
        Twister.getUser(username).doFollowings(function(following){
            
            thisComponent.addUser(following);
        
        });
        
        //this.addUser(username);
        React.findDOMNode(this.refs.username).value = '';
        
    },
    addUser: function(username) {
        
        var thisComponent = this;
    
        this.setState(function(previousState, currentProps){
            
            previousState.usernames.push(username);
            
            return previousState;
            
        },function(){
        
            Twister.getUser(username).doPostsSince(thisComponent.state.postrange,thisComponent.addPost,60);
        
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
        
        for (var i = 0; i<this.state.usernames.length; i++) {
        
            var thisComponent = this;
            var thisUsername = this.state.usernames[i];
            
            Twister.getUser(this.state.usernames[i]).doPostsSince(this.state.postrange,function(post){
            
                if (post!==null) {
                    thisComponent.addPost(post);
                } else {
                    thisComponent.removeUser(thisUsername);
                }
            
            },outdatedLimit);
            
        }
    },
    componentDidMount: function() {
        this.updatePosts(60);
        setInterval(this.updatePosts, this.props.pollInterval);
    },
    render: function() {
        return (
            <div className="UserStream">
                <form onSubmit={this.handleSubmit}>
                    <input type="text" placeholder="put in a username" ref="username" />
                    <input type="submit" value="Post" />
                </form><br/>
                <h1>Posts by {this.state.username}</h1>
                <Postboard data={this.state.data}/>
            </div>
        );
  }
});


var Postboard = React.createClass({
  render: function() {
    var posts = this.props.data.map(function(post, index) {
      return (
        <Post post={post} key={post.postid} />
      );
    });
    return (
      <div className="Postboard">
        {posts}
      </div>
    );
  }
});

React.render(
  <Timeline pollInterval="60000"/>,
  document.getElementById('content')
);