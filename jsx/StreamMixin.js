module.exports = StreamMixin = {
    
    addPost: function(post) {
        
        var postid = post.getUsername() + ":post" + post.getId();
        
        if (!this.state.postIdentifiers[postid] && this.verifyPost(post)) {
            
            this.setStateSafe(function(previousState, currentProps) {
        
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