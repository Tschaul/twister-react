
var React = require('react');
var PostContentHelper = require('../common/PostContentHelper.js');

module.exports = Post = React.createClass({
  
  render: function() {
    
    var parsedContent = PostContentHelper.parseContent(this.props.content);
        
    //console.log(parsedContent)
    
    var ret = parsedContent.map(function(item,index){
      //console.log(item.raw)
      switch(item.type) {
        case "mention":
          return (
            <a key={index} className="text-muted" href={"#/profile/"+item.raw.substr(1)}>{item.raw}</a>
            )
        case "hashtag":
          return (
            <a key={index} className="text-muted" href={"#/hashtag/"+item.raw.substr(1)}>{item.raw}</a>
            )
        case "url":
          return (
            <a key={index} className="text-primary" href={item.raw} target="_blank">{item.raw}</a>
            )
        case "email":
          return (
            <span key={index} className="text-primary">{item.raw}</span>
            )
        default:
          return (
            <span key={index}>{item.raw}</span>
            )
      }
    });
    
    //console.log(ret);
    
    return (
      <div>
      {ret}
      </div>
      );
  }
});

/*
<div className="post-avatar">
                    <img src={this.state.avatar}/>
                </div>
                <div className="post-bulk">
                    <div className="post-username">
                        <span className="post-fullname">{this.state.fullname} </span>
                        @{post.username} - {post.id}
                        
                    </div>
                    <div className="post-timestamp">{post.timestamp}</div>
                    <div className="post-content">{post.content}</div>
                </div>
                <hr/>
                
                */