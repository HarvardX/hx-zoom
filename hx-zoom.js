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
  setScales(Number(this.value));
  // console.log(this.value);
};

// Handle visibility when slider moves.
function setVisibility(zoom) {
  Object.keys(zoom_boxes).forEach(function (i) {
    let box = zoom_boxes[i];
    let d = zoom_boxes[i].dataset;
    let is_visible = Number(d.firstVis) <= zoom && zoom <= Number(d.lastVis);
    if (is_visible) {
      zoom_boxes[i].style.display = 'block';
      zoom_images[i].src = d.src;
    } else {
      zoom_boxes[i].style.display = '';
    }
  });
}

function setScales(zoom) {
  Object.keys(zoom_images).forEach(function (i) {
    let img = zoom_images[i];
    let d = zoom_boxes[i].dataset;
    let is_visible = Number(d.firstVis) <= zoom && zoom <= Number(d.lastVis);
    if (is_visible) {
      zoom_images[i].style.opacity = getOpacity(d, zoom);
      let current_scale =
        (2 * (zoom - Number(d.firstVis))) /
        (Number(d.lastVis) - Number(d.firstVis));
      zoom_images[i].style.transform = 'scale(' + current_scale + ')';
    } else {
      zoom_images[i].style.opacity = 0;
    }
  });
}

function getOpacity(d, zoom) {
  let first = Number(d.firstVis);
  let last = Number(d.lastVis);
  let edge = (last - first) / 5;
  if (zoom < first) {
    return 0;
  } else if (zoom < first + edge) {
    return (zoom - first) / edge;
  } else if (first + edge <= zoom && zoom <= last - edge) {
    return 1;
  } else if (zoom > last - edge) {
    return (last - zoom) / edge;
  } else {
    return 0;
  }
}
