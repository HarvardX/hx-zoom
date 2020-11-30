// Get an array of the images to zoom.
let image_array = [];
let zoom_images = document.getElementsByClassName('zoom_img');

// Get the slider.
let slider = document.getElementById('zoomrange');
setVisibility(slider.value);

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
  setVisibility(Number(this.value));
  // console.log(this.value);
};

function setVisibility(zoom) {
  let shown = [];
  Object.keys(zoom_images).forEach(function (i) {
    let img = zoom_images[i];
    let d = zoom_images[i].dataset;
    // console.log(d.firstVis <= zoom && zoom <= d.lastVis);
    if (Number(d.firstVis) <= zoom && zoom <= Number(d.lastVis)) {
      zoom_images[i].style.display = 'block';
      shown.push(i);
    } else {
      zoom_images[i].style.display = '';
    }
  });
  console.log(shown);
}
