var dbase = new IDB("gallery");
setTimeout(function () {
  dbase.create("bigbuckbunny");
}, 2000);

function loadImage() {
  var images = ["bbb-splash.png","bunny-bow.png","evil-frank.png","its-a-trap.png","rodents.png","rinkysplash.jpg",
    "thumb-bbb-splash.png","thumb-bunny-bow.png","thumb-evil-frank.png","thumb-its-a-trap.png","thumb-rodents.png","thumb-rinkysplash.jpg"
  ];
  images.forEach(function(e) {
    var xhr = new XMLHttpRequest(),
    blob;
    xhr.open("GET", "images/" + e, true);
    xhr.responseType = "blob";
    xhr.addEventListener("load", function () {
      if (xhr.status === 200) {
        console.log("Image retrieved : " + e);
        blob = xhr.response;
        console.log(blob);
        dbase.save("bigbuckbunny",{image:blob, _id:e});
      }
    }, false);
    xhr.send();
  });
}

function setImage(data, _id) {
  var URL = window.URL || window.webkitURL;
  var imgURL = URL.createObjectURL(data.image);
  var link = document.createElement("a");
  link.setAttribute("href", imgURL);
  dbase.get("bigbuckbunny", "thumb-"+_id, setThumbnail, link);
}

function setThumbnail(data) {
  console.log(arguments);
  var URL = window.URL || window.webkitURL;
  var imgURL = URL.createObjectURL(data.image);
  var img = document.createElement("img");
  img.setAttribute("src", imgURL);
  arguments[2].appendChild(img);
  var gallery = document.getElementById('gallery');
  gallery.appendChild(arguments[2]);
}

function showImage() {
  var images = ["bbb-splash.png","bunny-bow.png","evil-frank.png","its-a-trap.png","rodents.png","rinkysplash.jpg"];
  images.forEach(function(e) {
    dbase.get("bigbuckbunny", e, setImage);
  });
}
