// Get an array of the divs that will hold images.
let image_array = [];
let zoom_boxes = document.querySelectorAll('.zoom_box');

// Put blank images inside the divs.
Object.keys(zoom_boxes).forEach(function (i) {
  let img_tag = document.createElement('img');
  img_tag.attributes.src = '';
  img_tag.attributes.alt = '';
  img_tag.className = 'zoom_img';
  zoom_boxes[i].appendChild(img_tag);
});

let zoom_images = document.querySelectorAll('.zoom_img');

// Get the slider.
let slider = document.getElementById('zoom_slider');
setVisibility(slider.value);

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
  setVisibility(Number(this.value));
  // console.log(this.value);
};

// Handle visibility when slider moves.
function setVisibility(zoom) {
  Object.keys(zoom_boxes).forEach(function (i) {
    let box = zoom_boxes[i];
    let d = zoom_boxes[i].dataset;
    if (Number(d.firstVis) <= zoom && zoom <= Number(d.lastVis)) {
      zoom_boxes[i].style.display = 'block';
      zoom_images[i].src = d.src;
    } else {
      zoom_boxes[i].style.display = '';
    }
  });
}
