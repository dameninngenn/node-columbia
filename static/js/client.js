(function(){

 var Painter = function(id) {
   this.id = id;
   this.body = document.querySelector("body");
   this.canvas = document.getElementById(id);
   this.context = this.canvas.getContext('2d');

   // hide the toolbar in iOS
   setTimeout(function() { window.scrollTo(0, 1); }, 100);

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

   //iPhone
   // prevents dragging the page in iOS
   this.body.ontouchmove = function(e) {
       e.preventDefault();
   };

   this.canvas.addEventListener('touchstart', function(event) {
     self.touchdown(event)
   }, false);

   this.canvas.addEventListener('touchend', function(event) {
     self.up(event);
   }, false);

   this.canvas.addEventListener('touchmove', function(event) {
     self.touchmoving(event);
   }, false);

   this.canvas.addEventListener('touchcancel', function(event) {
     self.up(event)
   }, false);

 };

 Painter.prototype.down = function(event) {
   this.isDrawing = true;
   this.beforeX = event.clientX - 10;
   this.beforeY = event.clientY - 10;
 };

 Painter.prototype.touchdown = function(event) {
   var touch = event.touches[0];
   this.isDrawing = true;
   this.beforeX = touch.screenX - 10;
   this.beforeY = touch.screenY - 10;
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
     c: this.strokeStyle,
     layer: '@' + this.id
   };

   if (this.conn) {
     this.conn.send(JSON.stringify(points));
   } else {
     this.drawLine(points);
   }

   this.beforeX = points.ax;
   this.beforeY = points.ay;
 };

 Painter.prototype.touchmoving = function(event) {
   if (!this.isDrawing) {
     return;
   }

   var touch = event.touches[0];

   var points = {
     bx: this.beforeX,
     by: this.beforeY,
     ax: touch.screenX - 10,
     ay: touch.screenY - 10,
     c: this.strokeStyle,
     layer: '@' + this.id
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
     this.conn.send('@CLEAR @' + this.id);
   } else {
     this.clearCanvas();
   }
 };

 Painter.prototype.setConnection = function(conn) {
   this.conn = conn;

   var self = this;
   var layer = '@' + this.id;

   this.conn.onmessage = function(event) {
     if (event.data.indexOf(layer) > -1) {
       if (event.data.indexOf('@CLEAR') > -1) {
         self.clearCanvas();
       } else {
         var d = JSON.parse(event.data);
         self.drawLine(d);
       }
     }
   };

 };

 window.Painter = Painter;

})();
