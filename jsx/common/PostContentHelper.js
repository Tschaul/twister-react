module.exports = {
  extractUsername: function(s) {
      var username = "";
      for( var i = 0; i < s.length; i++ ) {
          var c = s.charCodeAt(i);
          if( (c >= 'a'.charCodeAt(0) && c <= 'z'.charCodeAt(0)) ||
              (c >= 'A'.charCodeAt(0) && c <= 'Z'.charCodeAt(0)) ||
              (c >= '0'.charCodeAt(0) && c <= '9'.charCodeAt(0)) ||
              c == '_'.charCodeAt(0) ) {
              username += s[i];
          } else {
              break;
          }
      }
      return username;
  },
  extractHashtag: function(s) {
      var hashtag = "";
      s = this.reverseHtmlEntities(s);
      for( var i = 0; i < s.length; i++ ) {
          if( " \n\t.,:/?!;'\"()[]{}*#".indexOf(s[i]) < 0 ) {
              hashtag += s[i];
          } else {
              break;
          }
      }
      return hashtag;
  },
  escapeHtmlEntities: function(str) {
      return str
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&apos;');
  },
  reverseHtmlEntities: function(str) {
      return str
                  .replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>')
                  .replace(/&quot;/g, '"')
                  .replace(/&apos;/g, "'")
                  .replace(/&amp;/g, '&');
  },
  parseContent: function( msg ) {
  
    //return [{type:"text",raw:msg}];
    
    var output = [];
  
    var tmp;
    var match = null;
    var index;
    var strUrlRegexp = "http[s]?://";
    var strEmailRegexp = "\\S+@\\S+\\.\\S+";
    var strSplitCounterR = "\\(\\d{1,2}\\/\\d{1,2}\\)$";
    var reAll = new RegExp("(?:^|[ \\n\\t.,:\\/?!])(#|@|" + strUrlRegexp + "|" + strEmailRegexp + "|" + strSplitCounterR + ")");
    var reHttp = new RegExp(strUrlRegexp);
    var reEmail = new RegExp(strEmailRegexp);
    var reSplitCounter = new RegExp(strSplitCounterR);
    
    //msg = this.escapeHtmlEntities(msg);

    while( msg != undefined && msg.length ) {
        
      match = reAll.exec(msg);
      if( match ) {
        index = (match[0] === match[1]) ? match.index : match.index + 1;
        if( match[1] == "@" ) {
          output.push({type:"text",raw:(msg.substr(0, index))});
          tmp = msg.substr(index+1);
          var username = this.extractUsername(tmp);
          if( username.length ) {
            output.push({type:"mention",raw:"@"+username});
          }else{
            output.push({type:"text",raw:"@"});
          }
          msg = tmp.substr(String(username).length);
          continue;
        }

        if( reHttp.exec(match[1]) ) {
          output.push({type:"text",raw:(msg.substr(0, index))});
          tmp = msg.substring(index);
          //console.log(tmp)
          var space = tmp.search(/\s/);
          //console.log(space)
          var url;
          if( space != -1 ) url = tmp.substring(0,space); else url = tmp;
          if( url.length ) {
              output.push({type:"url",raw:url});
          }
          msg = tmp.substr(String(url).length);                
          continue;
        }

        if( reEmail.exec(match[1]) ) {
          output.push({type:"text",raw:(msg.substr(0, index))});
          tmp = msg.substring(index);
          var space = tmp.search(/\s/);
          var email;
          if( space != -1 ) email = tmp.substring(0,space); else email = tmp;
          if( email.length ) {
            output.push({type:"email",raw:email});
          }
          msg = tmp.substr(String(email).length);
          continue;
        }

        if( match[1] == "#" ) {
          output.push({type:"text",raw:(msg.substr(0, index))});
          tmp = msg.substr(index+1);
          var hashtag = this.extractHashtag(tmp);
          if( hashtag.length ) {
//                    var hashtag_lc='';
//                    for( var i = 0; i < hashtag.length; i++ ) {
//                        var c = hashtag[i];
//                        hashtag_lc += (c >= 'A' && c <= 'Z') ? c.toLowerCase() : c;
//                    }
            output.push({type:"hashtag",raw:"#"+hashtag});

          }else{
            output.push({type:"text",raw:"@"});
          }
          msg = tmp.substr(String(hashtag).length);
          continue;
        }

          /*if (reSplitCounter.exec(match[1])) {
              output.append({type:"text",raw:(msg.substr(0, index))});
              tmp = msg.substring(index);
              if( tmp.length ) {
                  var splitCounter = $('<span class="splited-post-counter"></span>');
                  splitCounter.text(tmp);
                  output.append(splitCounter);
                  msg = "";
                  continue;
              }
              msg = tmp.substr(String(hashtag).length);
              continue;
          }*/
      }

      output.push({type:"text",raw:msg});
      msg = "";
      
    }
    
    //console.log(output)
    
    return output;
    
  }
}