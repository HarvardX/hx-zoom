let max_scale = 100; // percent
let opacity_edge = 1 / 10; // Set smaller for thinner edge.

// Get an array of the divs that will hold images.
let image_array = [];
let zoom_container = document.querySelector('.zoom_container');
let zoom_boxes = document.querySelectorAll('.zoom_box');

// Put blank images inside the divs.
Object.keys(zoom_boxes).forEach(function (i) {
  let img_tag = document.createElement('img');
  img_tag.attributes.src = '';
  img_tag.attributes.alt = '';
  img_tag.className = 'zoom_img';
  zoom_boxes[i].appendChild(img_tag);
});

// For use in positioning functions
let zoom_images = document.querySelectorAll('.zoom_img');

// Get the slider.
let slider = document.getElementById('zoom_slider');

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
  let d;
  zoom = Number(this.value);
  Object.keys(zoom_images).forEach(function (i) {
    d = zoom_boxes[i].dataset;
    setVisibility(i, d, zoom);
    setScales(i, d, zoom);
    setPosition(i, d, zoom);
  });
};

// Handle visibility when slider moves.
function setVisibility(i, d, zoom) {
  let box = zoom_boxes[i];
  let is_visible = Number(d.firstVis) <= zoom && zoom <= Number(d.lastVis);
  if (is_visible) {
    zoom_boxes[i].style.display = 'block';
    zoom_images[i].src = d.src;
  } else {
    zoom_boxes[i].style.display = '';
  }
}

// Make the image the right size.
function setScales(i, d, zoom) {
  let img = zoom_images[i];
  let is_visible = Number(d.firstVis) <= zoom && zoom <= Number(d.lastVis);

  if (is_visible) {
    zoom_images[i].style.opacity = getOpacity(d, zoom);
    let current_scale = getScale(zoom, d.firstVis, d.lastVis);
    zoom_images[i].style.transform = 'scale(' + current_scale + ')';
  } else {
    zoom_images[i].style.opacity = 0;
  }
}

// Put the image in the right place.
function setPosition(i, d, zoom) {
  let current_scale = getScale(zoom, d.firstVis, d.lastVis);
  let { left, top } = getVector(i, d.clock, current_scale);
  zoom_boxes[i].style.left = left + 'px';
  zoom_boxes[i].style.top = top + 'px';
}

function getScale(zoom, first, last) {
  return (
    ((max_scale / 100) * (zoom - Number(first))) /
    (Number(last) - Number(first))
  );
}

function getOpacity(d, zoom) {
  let first = Number(d.firstVis);
  let last = Number(d.lastVis);
  let edge = (last - first) * opacity_edge;
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

function getVector(i, clock, current_scale) {
  let container_width = document.querySelector('.zoom_container').clientWidth;
  let container_height = document.querySelector('.zoom_container').clientHeight;

  let img_width =
    document.querySelector('.zoom_img').clientWidth * current_scale;
  let img_height =
    document.querySelector('.zoom_img').clientHeight * current_scale;

  let z = 0.5 * current_scale * container_width;
  // Math.sqrt(
  //   container_width * container_width + container_height * container_height
  // );

  let theta = ((Number(clock) % 12) * Math.PI) / 6;

  // set left-hand location and top location based on image and container size.
  // At scale 0 we're in the center of the box.
  // At smax scale, we're leaving the box.

  let top = container_height / 2 - z * Math.cos(theta) - img_height / 2;
  let left = container_width / 2 + z * Math.sin(theta) - img_width / 2;
  return { top: top, left: left };
}

// Initial setup
slider.dispatchEvent(new Event('input'));
