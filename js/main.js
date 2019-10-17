var sorting = (function() {

    var DEFAULT_COLOR = '#777';
    var COMPARE_COLOR = '#00f';
    var SWAP_COLOR = '#f00';

    function randint(low, high) {
        // Return a random integer in the range [low, high] inclusive.
        return low + Math.floor((high - low + 1) * Math.random());
      }

    /*
         * Function to draw the array on the canvas
         * This function takes 3 inpts:
         * - canvas: a DOM canvas object
         * - ary: the array of n elements to draw
         * - colors: an array with the same length as ary, but 
         *   to give the color for the ith element of ary
    */
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
      function AnimatedArray(ary, canvas, interval) {
        
        this._ary = ary;
        this._canvas = canvas;
        this._ary_display = [];
        this._colors = [];
        this._actions = [];
        for (var i = 0; i < ary.length; i++) {
          this._ary_display.push(ary[i]);
          this._colors.push(DEFAULT_COLOR);
        }
        draw_array(this._canvas, this._ary, this._colors);
        var _this = this;
        this._id = window.setInterval(function() {_this._step();}, interval);
      }
      
      //clear the interval for any pending action
      AnimatedArray.prototype.cancel = function() {        
        window.clearInterval(this._id);
      }
       
      //function to compare 2 elements
      AnimatedArray.prototype.compare = function(i, j) {       
        this._actions.push(['compare', i, j]);
        return this._ary[i] - this._ary[j];
      }
      
      //function to compare if an element is less than another
      AnimatedArray.prototype.lessThan = function(i, j) {        
        return this.compare(i, j) < 0;
      }
      
      // function to swap 2 elements
      AnimatedArray.prototype.swap = function(i, j) {        
        this._actions.push(['swap', i, j]);
        var t = this._ary[i];
        this._ary[i] = this._ary[j];
        this._ary[j] = t;
      }
    
      AnimatedArray.prototype._step = function() {        
        if (this._actions.length === 0) {
          draw_array(this._canvas, this._ary_display, this._colors);
          return;
        }
        var action = this._actions.shift();
        var i = action[1];
        var j = action[2];
        if (action[0] === 'compare') {
          this._colors[i] = COMPARE_COLOR;
          this._colors[j] = COMPARE_COLOR;
        } else if (action[0] === 'swap') {
          this._colors[i] = SWAP_COLOR;
          this._colors[j] = SWAP_COLOR;
          var t = this._ary_display[i];
          this._ary_display[i] = this._ary_display[j];
          this._ary_display[j] = t;
        }
        draw_array(this._canvas, this._ary_display, this._colors);
        this._colors[i] = DEFAULT_COLOR;
        this._colors[j] = DEFAULT_COLOR;
      }
    
      AnimatedArray.prototype.length = function() {
        return this._ary.length;
      }

      function bubblesort(aa) {
        var n = aa.length();
        for (var i = 0; i < n; i++) {
          for (var j = 0; j < n - i - 1; j++) {
            if (aa.lessThan(j + 1, j)) {
              aa.swap(j, j + 1);
            }
          }
        }
      }
    
    
      function selectionsort(aa) {
        var n = aa.length();
        for (var i = 0; i < n - 1; i++) {
          var min_j = i;
          for (var j = i; j < n; j++) {
            if (aa.lessThan(j, min_j)) min_j = j;
          }
          aa.swap(i, min_j);
        }
      }
    
    
      function insertionsort(aa) {
        var n = aa.length();
        for (var i = 1; i < n; i++) {
          for (var j = i; j > 0 && aa.lessThan(j, j - 1); j--) {
            aa.swap(j, j - 1);
          }
        }
      }
    
      var algorithms = {
        'bubblesort': bubblesort,
        'selectionsort': selectionsort,       
        'insertionsort': insertionsort,       
      }
    
      function is_pivot_algo(algo) {
        var pivot_algos = {
          'quicksort': true,
          'introsort': true,
        };
        return pivot_algos.hasOwnProperty(algo);
      }
    
      function get_sort_fn(algo, pivot_type) {
        if (!algorithms.hasOwnProperty(algo)) {
          throw 'Invalid algorithm ' + algo;
        }
        var sort_fn = algorithms[algo];
        if (is_pivot_algo(algo)) {
          return function(aa) { sort_fn(aa, pivot_type); };
        } else {
          return sort_fn;
        }
      }
      
      return {
        'AnimatedArray': AnimatedArray,
        'get_sort_fn': get_sort_fn,
        'is_pivot_algo': is_pivot_algo,
        'algorithms': algorithms,
      }
    
      return _sorting;

  })();
  