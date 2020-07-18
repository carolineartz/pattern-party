// (function (global, factory) {
//   typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
//   typeof define === 'function' && define.amd ? define(factory) :
//   (global.Pizazz = factory());
// }(this, function () {

// const cache = [];

// var getCanvas = function() {
//   if(cache.length > 0) {
//     const shifted = cache[0];
//     cache.shift();
//     return shifted;
//   }
//   else {
//     return document.createElement('canvas');
//   }
// };

// var Pizazz = function(args) {
//   this.size = args.size;
//   this.buffer = args.buffer;
//   this.spacing = args.spacing;
//   this.length = args.length;
//   this.speed = args.speed;
//   this.stroke = args.stroke;
//   this.strokeWidth = args.strokeWidth;
//   this.appendToElement = args.appendToElement;
// };

// const colors = ['tomato', 'DodgerBlue', 'BlueViolet', 'Gold', 'SpringGreen', 'HotPink', 'Cyan', 'OrangeRed'];

// Pizazz.prototype.play = function(target, d) {

//   const dimensions = target.getBoundingClientRect();
//   const dpr = window.devicePixelRatio || 1;
//   const size = this.size;
//   const spacing = this.spacing;
//   const speed = this.speed;
//   const stroke = this.stroke;
//   const strokeWidth = this.strokeWidth;
//   const appendToElement = this.appendToElement || false;
//   const delay = d || 0;
//   const offsetX = appendToElement ? 0 : dimensions.left + window.pageXOffset;
//   const offsetY = appendToElement ? 0 : dimensions.top + window.pageYOffset;
//   const appendee = appendToElement ? target : document.body;
//   const vHeight = dimensions.height+(size*2);
//   const vWidth = dimensions.width+(size*2);
//   const heightInt = Math.floor(vHeight/spacing);
//   const widthInt = Math.floor(vWidth/spacing);
//   const heightRem = dimensions.height % spacing;
//   const widthRem = dimensions.width % spacing;
//   const totalInt = heightInt*2 + widthInt*2;
//   const styles = `
//     position: absolute;
//     left: ${offsetX - size}px;
//     top: ${offsetY - size}px;
//     height: ${dimensions.height+(size*2)}px;
//     width: ${dimensions.width+(size*2)}px;
//     overflow: hidden;
//     pointer-events: none;
//     border-radius: ${dimensions.height+size/2}px;
//   `;

//   let buffer = size - this.buffer;
//   let length = this.length || 0;
//   let canvas = getCanvas();
//   let frame = 0;

//   canvas.setAttribute('style', styles);
//   canvas.height = (dimensions.height+(size*2))*dpr;
//   canvas.width = (dimensions.width+(size*2))*dpr;

//   appendee.appendChild(canvas);

//   const ctx = canvas.getContext('2d');

//   ctx.lineWidth = strokeWidth;
//   ctx.scale(dpr,dpr);

//   var draw = function() {
//     ctx.clearRect(0,0,canvas.width, canvas.height);
//     for (let i = 0; i < totalInt; i++){
//       ctx.strokeStyle = stroke || colors[i % colors.length];
//       ctx.beginPath();
//       if (i < heightInt){
//         const y1 = spacing*(i)+size+(heightRem/2);
//         if(y1 <= dimensions.height+size){
//           ctx.moveTo(buffer, y1);
//           ctx.lineTo(-length+buffer, y1);
//           ctx.stroke();
//         }
//       }
//       else if (i < heightInt + widthInt){
//         const x1 = spacing*(i-heightInt)+size+(widthRem/2);
//         if(x1 <= dimensions.width+size) {
//           ctx.moveTo(x1, vHeight-buffer);
//           ctx.lineTo(x1, vHeight-buffer+length);
//           ctx.stroke();
//         }
//       }
//       else if (i < heightInt*2 + widthInt){
//         const y2 = spacing*(i - (heightInt + widthInt)) + size+(heightRem/2);
//         if(y2 <= dimensions.height + size) {
//           ctx.moveTo(vWidth - buffer, y2);
//           ctx.lineTo(vWidth - buffer + length, y2);
//           ctx.stroke();
//         }
//       }
//       else {
//         const x2 = spacing*(i - (totalInt-widthInt)) + (size+(widthRem/2));
//         if(x2 <= dimensions.width+size) {
//           ctx.moveTo(x2, buffer);
//           ctx.lineTo(x2, -length+buffer);
//           ctx.stroke();
//         }
//       }
//     }
//     if(frame <= speed*16) {
//       requestAnimationFrame(draw);
//       length += (1 * (buffer - length) * (0.25/speed));
//     }
//     else {
//       buffer -= (1 * buffer * (0.25/speed));
//       if(frame < speed*32) {
//         requestAnimationFrame(draw);
//       }
//       else {
//         cache.unshift(canvas);
//         canvas.remove();
//         canvas = null;
//         return;
//       }
//     }
//     frame += 1;
//   };

//   setTimeout(function() {
//     draw();
//   }, delay);
// };


// return Pizazz;
// }));


const cache = [];

var getCanvas = function() {
  if(cache.length > 0) {
    const shifted = cache[0];
    cache.shift();
    return shifted;
  }
  else {
    return document.createElement('canvas');
  }
};

var Pizazz = function(args) {
  this.size = args.size;
  this.buffer = args.buffer;
  this.spacing = args.spacing;
  this.length = args.length;
  this.speed = args.speed;
  this.stroke = args.stroke;
  this.strokeWidth = args.strokeWidth;
  this.appendToElement = args.appendToElement;
};

const colors = ['tomato', 'DodgerBlue', 'BlueViolet', 'Gold', 'SpringGreen', 'HotPink', 'Cyan', 'OrangeRed'];

Pizazz.prototype.play = function(target, d) {

  const dimensions = target.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const size = this.size;
  const spacing = this.spacing;
  const speed = this.speed;
  const stroke = this.stroke;
  const strokeWidth = this.strokeWidth;
  const appendToElement = this.appendToElement || false;
  const delay = d || 0;
  const offsetX = appendToElement ? 0 : dimensions.left + window.pageXOffset;
  const offsetY = appendToElement ? 0 : dimensions.top + window.pageYOffset;
  const appendee = appendToElement ? target : document.body;
  const vHeight = dimensions.height+(size*2);
  const vWidth = dimensions.width+(size*2);
  const heightInt = Math.floor(vHeight/spacing);
  const widthInt = Math.floor(vWidth/spacing);
  const heightRem = dimensions.height % spacing;
  const widthRem = dimensions.width % spacing;
  const totalInt = heightInt*2 + widthInt*2;
  const styles = `
    position: absolute;
    left: ${offsetX - size}px;
    top: ${offsetY - size}px;
    height: ${dimensions.height+(size*2)}px;
    width: ${dimensions.width+(size*2)}px;
    overflow: hidden;
    pointer-events: none;
    border-radius: ${dimensions.height+size/2}px;
  `;

  let buffer = size - this.buffer;
  let length = this.length || 0;
  let canvas = getCanvas();
  let frame = 0;

  canvas.setAttribute('style', styles);
  canvas.height = (dimensions.height+(size*2))*dpr;
  canvas.width = (dimensions.width+(size*2))*dpr;

  appendee.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  ctx.lineWidth = strokeWidth;
  ctx.lineCap = 'round';
  ctx.scale(dpr,dpr);

  var draw = function() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    for (let i = 0; i < totalInt; i++){
      ctx.strokeStyle = stroke || colors[i % colors.length];
      ctx.beginPath();
      if (i < heightInt){
        const y1 = spacing*(i)+size+(heightRem/2);
        if(y1 <= dimensions.height+size){
          ctx.moveTo(buffer, y1);
          ctx.lineTo(-length+buffer, y1);
          ctx.stroke();
        }
      }
      else if (i < heightInt + widthInt){
        const x1 = spacing*(i-heightInt)+size+(widthRem/2);
        if(x1 <= dimensions.width+size) {
          ctx.moveTo(x1, vHeight-buffer);
          ctx.lineTo(x1, vHeight-buffer+length);
          ctx.stroke();
        }
      }
      else if (i < heightInt*2 + widthInt){
        const y2 = spacing*(i - (heightInt + widthInt)) + size+(heightRem/2);
        if(y2 <= dimensions.height + size) {
          ctx.moveTo(vWidth - buffer, y2);
          ctx.lineTo(vWidth - buffer + length, y2);
          ctx.stroke();
        }
      }
      else {
        const x2 = spacing*(i - (totalInt-widthInt)) + (size+(widthRem/2));
        if(x2 <= dimensions.width+size) {
          ctx.moveTo(x2, buffer);
          ctx.lineTo(x2, -length+buffer);
          ctx.stroke();
        }
      }
    }
    if(frame <= speed*16) {
      requestAnimationFrame(draw);
      length += (1 * (buffer - length) * (0.25/speed));
    }
    else {
      buffer -= (1 * buffer * (0.25/speed));
      if(frame < speed*32) {
        requestAnimationFrame(draw);
      }
      else {
        cache.unshift(canvas);
        canvas.remove();
        canvas = null;
        return;
      }
    }
    frame += 1;
  };

  setTimeout(function() {
    draw();
  }, delay);
};


module.exports = Pizazz;
