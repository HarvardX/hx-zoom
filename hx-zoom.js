let max_scale = 100; // percent
let opacity_edge = 1 / 10; // Set smaller for thinner edge.

// Get an array of the divs that will hold images.
let image_array = [];
let zoom_container = document.querySelector('.zoom_container');

// Put blank images inside the divs.
Object.keys(zoom_objects).forEach(function (i) {
  let img_tag = document.createElement('img');
  img_tag.attributes.src = '';
  img_tag.attributes.alt = '';
  img_tag.className = 'zoom_img';
  zoom_container.appendChild(img_tag);
});

// For use in positioning functions
let zoom_images = document.querySelectorAll('.zoom_img');

// Get the slider.
let slider = document.getElementById('zoom_slider');

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
  zoom = Number(this.value);
  Object.keys(zoom_images).forEach(function (i) {
    setVisibility(i, zoom);
    setScales(i, zoom);
    setPosition(i, zoom);
  });
};

function isVisible(i, zoom) {
  return zoom_objects[i].first_vis <= zoom && zoom <= zoom_objects[i].last_vis;
}

// Handle visibility when slider moves.
function setVisibility(i, zoom) {
  if (isVisible(i, zoom)) {
    zoom_images[i].style.display = 'block';
    zoom_images[i].src = zoom_objects[i].src;
  } else {
    zoom_images[i].style.display = '';
  }
}

// Make the image the right size.
function setScales(i, zoom) {
  let img = zoom_images[i];

  if (isVisible(i, zoom)) {
    zoom_images[i].style.opacity = getOpacity(i, zoom);
    let current_scale = getScale(i, zoom);
    zoom_images[i].style.transform = 'scale(' + current_scale + ')';
  } else {
    zoom_images[i].style.opacity = 0;
  }
}

// Put the image in the right place.
function setPosition(i, zoom) {
  let current_scale = getScale(i, zoom);
  let { left, top } = getVector(i, current_scale);
  zoom_images[i].style.left = left + 'px';
  zoom_images[i].style.top = top + 'px';
}

function getScale(i, zoom) {
  return (
    ((max_scale / 100) * (zoom - zoom_objects[i].first_vis)) /
    (zoom_objects[i].last_vis - zoom_objects[i].first_vis)
  );
}

function getOpacity(i, zoom) {
  let first = zoom_objects[i].first_vis;
  let last = zoom_objects[i].last_vis;
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

function getVector(i, current_scale) {
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

  let theta = ((zoom_objects[i].clock % 12) * Math.PI) / 6;

  // set left-hand location and top location based on image and container size.
  // At scale 0 we're in the center of the box.
  // At smax scale, we're leaving the box.

  let top = container_height / 2 - z * Math.cos(theta) - img_height / 2;
  let left = container_width / 2 + z * Math.sin(theta) - img_width / 2;
  return { top: top, left: left };
}

// Initial setup
slider.dispatchEvent(new Event('input'));
