var sorting = (function() {

    var DEFAULT_COLOR = '#777';
    var COMPARE_COLOR = '#00f';
    var SWAP_COLOR = '#f00';
  
    /*
         * Function to draw the array on the canvas
         * This function takes 3 inpts:
         * - canvas: a DOM canvas object
         * - ary: the array of n elements to draw
         * - colors: an array with the same length as ary, but 
         *   to give the color for the ith element of ary
    function draw_array(canvas, ary, colors) {
        
        var width_ratio = 2;
        var ctx = canvas.getContext('2d');
    
        // Clear canvas
        ctx.fillStyle = '#fff';
        //draws a filled rectangle at position 0,0 as canvas
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        // Find min and max elements
        var min = ary[0];
        var max = ary[0];
        for (var i = 1; i < ary.length; i++) {
          min = ary[i] < min ? ary[i] : min;
          max = ary[i] > max ? ary[i] : max;
        }
    
        // calculating the width and bar spacing
        var n = ary.length;
        var spacing = canvas.width / (width_ratio * n + n + 1);
        var bar_width = spacing * width_ratio;
    
        // Draw canvas border
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        
        // calculating the min/ max of y value
        function convert_y(y) {          
          var a = canvas.height / (min - max);
          var b = max * canvas.height / (max - min);
          return a * y + b;
        }
    
        // Draw the y axis for 0 base line
        var y_zero = convert_y(0);
        ctx.beginPath();
        ctx.moveTo(0, y_zero);
        ctx.lineTo(canvas.width, y_zero);
        ctx.stroke();
    
        // For loop to draw the bars
        var x = spacing;
        for (var i = 0; i < ary.length; i++) {
          ctx.fillStyle = colors[i];
          var y = convert_y(ary[i]);
          if (ary[i] >= 0) {
            ctx.fillRect(x, y, bar_width, y_zero - y);
          } else {
            ctx.fillRect(x, y_zero, bar_width, y - y_zero);
          }
          x += spacing + bar_width;
        }
      }
  
  })();
  