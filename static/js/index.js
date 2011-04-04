(function(){

 var Socket = function(id) {
   this.id = id;
 };

 Socket.prototype.setConnection = function(conn) {
   this.conn = conn;

   var self = this;
   var layer = '@' + this.id;

   this.conn.onopen = function() {
   };

   this.conn.onclose = function(){
   };

   this.conn.onmessage = function(event) {
     if (event.data.indexOf('@JOIN') > -1) {
         alert('join');
     }
   };

 };

 window.Socket = Socket;

})();
