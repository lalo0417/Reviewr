"use strict" //but no fetch, no let and no const!


var app = {

    image: null,
    imgOptions: null,
    imgData: null,
    uuid: null,
    urlGetAllReviews: "https://griffis.edumedia.ca/mad9022/reviewr/reviews/get/",
    urlGetReview: "https://griffis.edumedia.ca/mad9022/reviewr/review/get/",
    urlSetNewReview: "https://griffis.edumedia.ca/mad9022/reviewr/review/set/",
    newStarRating: null,

    // Application Constructor
    initialize: function () {
        //document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('DOMContentLoaded', this.onDeviceReady);
    },
    onDeviceReady: function () {
        //app.receivedEvent('deviceready');
        //document.querySelector("#save")
        var newReviewButton = document.getElementById("makeNewReview");
        var newRevHam = new Hammer(newReviewButton);
        newRevHam.on("tap", app.newReviewPage);

        app.uuid = "caleb";
        console.log(app.uuid);

        var params = new FormData();
        params.append("uuid", app.uuid);

        app.ajaxCall(app.urlGetAllReviews, params, app.gotList, app.ajaxErr);

        var starClicker = document.getElementById("newRating");
        newRating.addEventListener('click', function () {

            var ratingValue = 3;
            switch (event.target.value) {
            case "star-1":
                console.log('1');
                app.newStarRating = 1;
                break;
            case "star-2":
                app.newStarRating = 2;
                break;
            case "star-3":
                app.newStarRating = 3;
                break;
            case "star-4":
                app.newStarRating = 4;
                break;
            case "star-5":
                app.newStarRating = 5;
                break;
            default:
                app.newStarRating = 5;
                break;
            }
        });

        var frame



        var pl = document.querySelectorAll(".page-link");
        	[].forEach.call(pl, function (obj, index) {
            //console.log(index, obj);
            //use touchend if this is for mobile only
            var objHam = new Hammer(obj);
            objHam.on("tap", app.navigate);
            obj.addEventListener("click", app.navigate);

        });
        //add listeners to pages
        var pages = document.querySelectorAll("[data-role=page]");
        	[].forEach.call(pages, function (obj, index) {
            obj.className = "inactive-page";
            //setting the class in JS will trigger the animation
            if (index == 0) {
                obj.className = "active-page";
            }
            //transitionend or animationend listeners
            obj.addEventListener("animationend", app.pageAnimated);
        });
    },
    ajaxCall: function (url, formData, success, fail) {
        //url - the url to call for xhr
        //formData - the data to be sent to the AJAX call
        //success - the function to call when successful
        //fail - the function to call
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.addEventListener("load", success);
        xhr.addEventListener("error", fail);
        xhr.send(formData);
    },
    gotList: function (ev) {

        //console.dir(ev);
        var xhr = ev.target;

        if (parseInt(xhr.status) < 300) {

            var data = JSON.parse(xhr.responseText);

            if (data.code == 0) { // Zero from PHP = OK

                //console.dir(data.reviews);

                var reviews = data.reviews;

                var blackStar = "&9733;";
                var whiteStar = "&9734;"

                var list = document.querySelector(".list-view"); // get the list element

                list.innerHTML = ""; // empty the existing list

                if (reviews.length > 0) { // we have previous review(s)

                    ////console.log("We have existing reviews: " + data.message);



                    // loop through existing reviews and add a list item for each one
                    // reviews is an array so we can use array.forEach()
                    reviews.forEach(function (obj) { // forEach accaepts an iterator function and optionally, a value to use as this 
                        // actually has 3 optional arguments: value, index, and an array reference 
                        // create and initialize a new list item
                        var li = document.createElement("li");
                        var a = document.createElement("a");
                        li.className = "list-item";
                        var liTap = new Hammer(li);
                        a.setAttribute("data-review", obj.id);
                        a.setAttribute("href", "#details");
                        a.className = "list-item";

                        switch (obj.rating) {
                        case 1:
                            a.textContent = obj.title + " \u2605\u2606\u2606\u2606\u2606";
                            break;
                        case 2:
                            a.textContent = obj.title + " \u2605\u2605\u2606\u2606\u2606";
                            break;
                        case 3:
                            a.textContent = obj.title + " \u2605\u2605\u2605\u2606\u2606";
                            break;
                        case 4:
                            a.textContent = obj.title + " \u2605\u2605\u2605\u2605\u2606";
                            break;
                        case 5:
                            a.textContent = obj.title + " \u2605\u2605\u2605\u2605\u2605";
                            break;
                        default:
                            a.textContent = obj.title + " \u2606\u2606\u2606\u2606\u2606";
                            break;

                        }
                        li.appendChild(a);
                        list.appendChild(li);
                        ////console.dir(li); // add click event to the list item so you can get all the details later
                        liTap.on("tap", app.getDetails);
                        liTap.on("tap", app.navigate);

                        //console.log("Existing data: ID: " + obj.id + " Title: " + obj.title + " Rating: " + obj.rating);
                    });


                } else { // no existing reviews 

                    //console.log("no existing reviews: " + data.message);


                    // create a single list item and display the default message
                    var li = document.createElement("li");
                    li.className = "loading";
                    li.setAttribute("data-review", 0);
                    li.textContent = data.message;
                    list.appendChild(li);

                }

            } else { // Did not get zero from PHP = NOT OK!
                app.ajaxErr(data);
            }

        } else { // xhr Status Error
            app.ajaxErr({
                "message": "Invalid HTTP Response"
            });
        }
    },
    ajaxErr: function (err) {
        alert(err.message);
    },
    callCamera: function () {
        app.imgOptions = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            targetWidth: 200,
            cameraDirection: Camera.Direction.FRONT,
            saveToPhotoAlbum: false
        };

        navigator.camera.getPicture(app.imgSuccess, app.imgFail, app.imgOptions);
    },

    imgSuccess: function (imageData) {
        //got an image back from the camera
        app.image = "data:image/jpeg;base64," + imageData;
        //console.log("Image loaded into interface");
        //clear memory in app
        var frame = document.getElementById("imgFrame");
        frame.src = app.image;
        var icon = document.getElementById("camIcon");
        icon.style.color = "rgba(191, 191, 191, 0.26)";

        navigator.camera.cleanup();
    },

    imgFail: function (msg) {
        //console.log("Failed to get image: " + msg);
    },

    getDetails: function (ev) {
        ev.preventDefault();

        var reviewID = ev.target.getAttribute("data-review");

        var params = new FormData();
        params.append("uuid", app.uuid);
        params.append("review_id", reviewID)

        app.ajaxCall(app.urlGetReview, params, app.showReview, app.ajaxErr);
    },

    showReview: function (ev) {
        var response = JSON.parse(ev.currentTarget.responseText);
        //        var revTitle = getElementById("reviewTitle");
        var xhr = ev.target;
        if (parseInt(xhr.status) < 300) {
            var data = JSON.parse(xhr.responseText);

            if (data.code == 0) {
                var details = data.review_details;
                var img = document.getElementById("reviewImage");
                var title = document.getElementById("reviewTitle");
                var review = document.getElementById("reviewDescription");
                var stars = document.getElementById("reviewStars");

                //console.dir(details);
                app.imgData = decodeURIComponent(details.img);
                img.src = app.imgData;
                title.textContent = details.title;
                review.textContent = details.review_txt;
                switch (details.rating) {
                case 1:
                    stars.textContent = "\u2605\u2606\u2606\u2606\u2606";
                    break;
                case 2:
                    stars.textContent = "\u2605\u2605\u2606\u2606\u2606";
                    break;
                case 3:
                    stars.textContent = "\u2605\u2605\u2605\u2606\u2606";
                    break;
                case 4:
                    stars.textContent = "\u2605\u2605\u2605\u2605\u2606";
                    break;
                case 5:
                    stars.textContent = "\u2605\u2605\u2605\u2605\u2605";
                    break;
                }
            }
        }

        var backButton = document.getElementById("backButton");
        var backHam = new Hammer(backButton);
        backHam.on("tap", app.navigate);
    },
    newReview: function () {
        var params = new FormData();
        var newTitle = document.getElementById("newTitle");
        var newDescription = document.getElementById("newDescription");


        if (newTitle.value.length > 0 && newDescription.value.length > 0) {
            params.append("uuid", app.uuid);

            params.append("action", "insert");
            params.append("title", newTitle.value);
            params.append("rating", app.newStarRating);

            //console.log(app.newStarRating);
            params.append("review_txt", newDescription.value);
            params.append("img", app.image);

            app.ajaxCall(app.urlSetNewReview, params, app.addReview, app.ajaxErr);
            newTitle.value = "";
            newDescription.value = "";
            app.ajaxCall(app.urlGetAllReviews, params, app.gotList, app.ajaxErr);
            alert("Review Added!");
        } else {
            alert("Add a title and a review!");
            newTitle.value = "";
            newDescription.value = "";
        }


    },
    addReview: function (ev) {

        var xhr = ev.target;
        if (parseInt(xhr.status) < 300) {
            var data = JSON.parse(xhr.responseText);

        } else {
            app.ajaxErr();
        }

    },
    newReviewPage: function () {
        var camButton = document.getElementById("cameraButton");
        camButton.addEventListener('click', app.callCamera);


        //hammer causes an issue where it initializes first before the device is actually ready
        //var camHam = new Hammer(camButton);
        //camHam.on("tap", app.callCamera());


        var addButton = document.getElementById("addButton");
        var addHam = new Hammer(addButton);
        addHam.on("tap", app.newReview);
        addHam.on("tap", app.navigate);

        var cancelButton = document.getElementById("cancelButton");
        var canHam = new Hammer(cancelButton);
        canHam.on("tap", app.navigate);



    },
    clearPicture: function () {
        var frame = document.getElementById("imgFrame");
        frame.src = "";
        var icon = document.getElementById("camIcon");
        icon.style.color = "#4b90c3";
    },
    navigate: function (ev) {
        app.clearPicture();
        ev.preventDefault();
        //console.dir(ev.target);

        if (ev.target.nodeName === "I") var btn = ev.target.parentNode;
        else var btn = ev.target;

        var href = btn.href;
        var id = href.split("#")[1];

        //history.pushState();
        var pages = document.querySelectorAll('[data-role="page"]');
        for (var p = 0; p < pages.length; p++) {
            //console.log(pages[p].id, page);
            if (pages[p].id === id) {
                pages[p].classList.remove("hidden");
                if (pages[p].className !== "active-page") {
                    pages[p].className = "active-page";
                }
                //console.log("active ", page)
            } else {
                if (pages[p].className !== "inactive-page") {
                    pages[p].className = "inactive-page";
                }
            }
        }
    },

    pageAnimated: function (ev) {
        //console.log("Transition finished for " + ev.target.id);
        //console.dir(ev);
        var page = ev.target;
        if (page.className == "active-page") {
            console.log(ev.target.id, " has just appeared");
        } else {
            console.log(ev.target.id, " has just disappeared");
            //ev.target.classList.add("hidden");
            //Not required
        }
    }


};


app.initialize();