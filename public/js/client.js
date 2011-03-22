(function(){

 var Painter = function(id) {
   this.id = id;
   this.canvas = document.getElementById(id);
   this.context = this.canvas.getContext('2d');

   this.init();
   this.setEvents();
 };

 Painter.prototype.init = function() {
   this.beforeX = null;
   this.beforeY = null;
   this.isDrawing = false;

   this.strokeStyle = this.getRandomColor(); // 'rgb(100, 100, 100)'
   this.lineWidth = 3;
 };

 Painter.prototype.getRandomColor = function() {
   var r = Math.floor(Math.random() * 255);
   var g = Math.floor(Math.random() * 255);
   var b = Math.floor(Math.random() * 255);
   return 'rgb(' + r + ',' + g + ',' + b + ')';
 };

 Painter.prototype.setEvents = function() {
   var self = this;

   this.canvas.addEventListener('mousedown', function(event) {
     self.down(event)
   }, false);

   this.canvas.addEventListener('mouseup', function(event) {
     self.up(event);
   }, false);

   this.canvas.addEventListener('mousemove', function(event) {
     self.move(event);
   }, false);

   this.canvas.addEventListener('mouseout', function(event) {
     self.up(event)
   }, false);

 };

 Painter.prototype.down = function(event) {
   this.isDrawing = true;
   this.beforeX = event.clientX - 10;
   this.beforeY = event.clientY - 10;
 };

 Painter.prototype.up = function(event) {
   this.isDrawing = false;
 };

 Painter.prototype.drawLine = function(points) {
   this.context.beginPath();
   this.context.strokeStyle = points.c;
   this.context.lineWidth = this.lineWidth;
   this.context.lineCap = 'round';
   this.context.lineJoin = 'round';
   this.context.moveTo(points.bx, points.by);
   this.context.lineTo(points.ax, points.ay);
   this.context.stroke();
   this.context.closePath();
 };

 Painter.prototype.clearCanvas = function(conn) {
   this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
 };

 Painter.prototype.move = function(event) {
   if (!this.isDrawing) {
     return;
   }

   var points = {
     bx: this.beforeX,
     by: this.beforeY,
     ax: event.clientX - 10,
     ay: event.clientY - 10,
     c: this.strokeStyle
   };

   if (this.conn) {
     this.conn.send(JSON.stringify(points));
   } else {
     this.drawLine(points);
   }

   this.beforeX = points.ax;
   this.beforeY = points.ay;
 };

 Painter.prototype.clear = function(conn) {
   if (this.conn) {
     this.conn.send('@CLEAR');
   } else {
     this.clearCanvas();
   }
 };

 Painter.prototype.setConnection = function(conn) {
   this.conn = conn;

   this.conn.onclose = function() {console.log('Close');};
   this.conn.onopen = function(){console.log('Connected');};

   var self = this;
   this.conn.onmessage = function(event) {
     if (event.data.indexOf('@') > -1) {
       if (event.data.indexOf('@CLEAR') > -1) {
         self.clearCanvas();
       }
     } else {
       var d = JSON.parse(event.data);
       self.drawLine(d);
     }
   };

 };

 window.Painter = Painter;

})();
