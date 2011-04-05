(function(){

 var Socket = function(id) {
   this.id = id;
 };

 Socket.prototype.setConnection = function(conn) {
   this.conn = conn;

   var self = this;
   var layer = '@' + this.id;
   var users = [];

   this.conn.onopen = function() {
   };

   this.conn.onclose = function(){
   };

   this.conn.onmessage = function(event) {
     // ks code
     if (event.data.indexOf('@JOIN') > -1) {
         var d = JSON.parse(event.data);
         users.push(d.user.substr(7));
         users = uniq(users);
         $('#user').empty();
         for (var i=0;i<10;i++) {
             $('#user').prepend(
                $('<p>').append(
                    $('<a>').attr(
                        'href',
                        'http://' + document.location.host + '/user/' + users[i]
                    ).append(
                        users[i]
                    )
                )
             );
         }
     }
   };

 };

 window.Socket = Socket;

})();


function uniq(arr) {
  var o = {},
  r = [];
  for (var i = 0;i < arr.length;i++)
    if (arr[i] in o? false: o[arr[i]] = true)
      r.push(arr[i]);
  return r;
}
