module.exports = StreamMixin = {
    
  addPost: function(post) {

    var postid = post.getUsername() + ":post" + post.getId();

    if (!this.state.postIdentifiers[postid]) {

      this.setStateSafe(function(previousState, currentProps) {

        previousState.postIdentifiers[postid] = true;

        var postdata = {
            username: post.getUsername(),
            id: post.getId(),
            timestamp: post.getTimestamp(),
            postid: postid
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