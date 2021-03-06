function generatePostTree(lowest, posts) {
    let root = document.createElement("div");
    root.className = "post-container";

    let postsInOrder = [];

    let current = lowest;

    while (current.parent !== "Unassigned") {
        let parent = getPostFromArray(posts, current.parent);

        if (parent != null) {
            postsInOrder.push(parent);

            current = parent;
        } else {
            break;
        }
    }

    //It should start with the highest parent and end with the second to last...

    let first = null;
    for (let i = 0; i < postsInOrder.length; i++) {
        let p = postsInOrder[i];
        let v = null;

        if (p.postType === "TEXT") {
            v = generateTextPost(p, null, false, false, false);
        } else if (p.postType === "IMAGE") {
            v = generateImagePost(p, null, false, false, false);
        } else if (p.postType === "AUDIO") {
            v = generateAudioPost(p, null, false, false, false);
        } else if (p.postType === "VIDEO") {
            v = generateVideoPost(p, null, false, false, false);
        }

        if (first == null) {
            first = v;
        }

        root.appendChild(v); //Don't think I need to add linebreaks here...
    }

    let child = null;
    if (lowest.postType === "TEXT") {
        child = generateTextPost(lowest, null, false, true, true);
    } else if (lowest.postType === "IMAGE") {
        child = generateImagePost(lowest, null, false, true, true);
    } else if (lowest.postType === "AUDIO") {
        child = generateAudioPost(lowest, null, false, true, true);
    } else if (lowest.postType === "VIDEO") {
        child = generateVideoPost(lowest, null, false, true, true);
    }
    root.appendChild(child);

    if (first != null) {
        let topBar = first.getElementsByClassName("post-top-bar");
        let blogUrlLatest = first.getElementsByClassName("blog-url-latest")[0];
        let blogUrlSecond = first.getElementsByClassName("blog-url-second")[0];
        let reblogIcon = first.getElementsByClassName("reblog-icon")[0];

        blogUrlLatest.innerHTML = lowest.originBlog.baseUrl;
        blogUrlSecond.innerHTML = postsInOrder[0].originBlog.baseUrl;

        topBar.style.display = '';
        blogUrlLatest.style.display = '';
        blogUrlSecond.style.display = '';
        reblogIcon.style.display = '';

        blogUrlLatest.href = lowest.originBlog.completeUrl;
        blogUrlLatest.target = "_blank";
        blogUrlSecond.href = postsInOrder[0].originBlog.completeUrl;
        blogUrlSecond.target = "_blank";
    }

    return root;
}

// noinspection Duplicates
function generateTextPost(post, parent, showTopBar, showBottomBar, showTags) {
    //Load views
    let root = document.createElement("div");
    let topBar = document.createElement("div");
    let contents = document.createElement("div");
    let bottomBar = document.createElement("div");
    let blogUrlLatest = document.createElement("a");
    let blogUrlSecond = document.createElement("a");
    let reblogIcon = document.createElement("img");
    let postTitle = document.createElement("h3");
    let postBody = document.createElement("p");
    let tagsContainer = document.createElement("div");
    let source = document.createElement("a");
    let bookmark = document.createElement("img");
    let reblog = document.createElement("img");

    //Set view classes
    root.className = "post-container bg-light rounded";
    topBar.className = "post-top-bar bg-light border-dark rounded-top";
    contents.className = "post-contents bg-light";
    bottomBar.className = "post-bottom-bar bg-light border-dark rounded-bottom";
    blogUrlLatest.className = "blog-url-latest text-link-color underline-solid";
    blogUrlSecond.className = "blog-url-second text-link-color underline-solid";
    reblogIcon.className = "reblog-icon";
    postTitle.className = "post-title text-primary text-center";
    postBody.className = "post-body text-dark";
    tagsContainer.className = "post-tag-container";
    source.className = "post-source text-dark underline-solid";
    bookmark.className = "post-bookmark btn-light rounded";
    reblog.className = "post-reblog btn-light rounded";

    //Append all the views...
    root.appendChild(topBar);
    root.appendChild(contents);
    root.appendChild(bottomBar);
    topBar.appendChild(blogUrlLatest);
    topBar.appendChild(reblogIcon);
    topBar.appendChild(blogUrlSecond);
    contents.appendChild(postTitle);
    contents.appendChild(postBody);
    contents.appendChild(tagsContainer);
    bottomBar.appendChild(source);
    bottomBar.appendChild(bookmark);
    bottomBar.appendChild(reblog);

    //Set default data stuff for the things that need it.
    reblogIcon.src = "https://www.startapped.com/img/icon/reblog_256px.png";
    blogUrlLatest.href = "#";
    blogUrlSecond.href = "#";
    source.href = "#";
    if (post.bookmarked) {
        bookmark.src = "https://www.startapped.com/img/icon/bookmark_primary_256px.png";
    } else {
        bookmark.src = "https://www.startapped.com/img/icon/bookmark_256px.png";
    }
    reblog.src = "https://www.startapped.com/img/icon/reblog_256px.png";


    //Set data
    blogUrlLatest.innerText = post.originBlog.baseUrl;
    blogUrlLatest.href = "#";
    if (parent != null) {
        blogUrlSecond.innerText = parent.originBlog.baseUrl;
    } else {
        reblogIcon.style.display = 'none';
        blogUrlSecond.style.display = 'none';
    }

    postTitle.innerHTML = textWithLinks(post.title).replace(/(?:\r\n|\r|\n)/g, '<br>');
    postBody.innerHTML = textWithLinks(post.body).replace(/(?:\r\n|\r|\n)/g, '<br>');

    source.innerText = "Source: " + post.originBlog.baseUrl;

    //Hide TopBar views if needed...
    if (!showTopBar) {
        blogUrlLatest.style.display = 'none';
        blogUrlSecond.style.display = 'none';
        reblogIcon.style.display = 'none';
        topBar.style.display = 'none';
    }

    //Hide BottomBar views if needed...
    if (!showBottomBar) {
        source.style.display = 'none';
        bookmark.style.display = 'none';
        reblog.style.display = 'none';
        bottomBar.style.display = 'none';
    }

    //Hide post tags
    if (!showTags || post.tags.length <= 0 || post.tags.toString().length <= 0) {
        tagsContainer.style.display = 'none';
    }

    //Set handlers for buttons and links...
    if (showTopBar) {
        blogUrlLatest.href = post.originBlog.completeUrl;
        blogUrlLatest.target = "_blank";

        if (parent != null) {
            blogUrlSecond.href = parent.originBlog.completeUrl;
            blogUrlSecond.target = "_blank";
        }
    }
    if (showBottomBar) {
        source.href = post.originBlog.completeUrl;
        source.target = "_blank";

        bookmark.onclick = function (ignore) {
            let bodyRaw = {
                "post_id": post.id
            };
            if (post.bookmarked) {
                bookmark.src = "https://www.startapped.com/img/icon/bookmark_256px.png";
                $.ajax({
                    url: "https://api.startapped.com/v1/post/bookmark/remove",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization_Access": getCredentials().access,
                        "Authorization_Refresh": getCredentials().refresh
                    },
                    method: "POST",
                    dataType: "json",
                    data: JSON.stringify(bodyRaw),
                    success: function (json) {
                        post.bookmarked = false;
                        showSnackbar(json.message);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        showSnackbar(JSON.parse(jqXHR.responseText).message);
                    }
                });
            } else {
                bookmark.src = "https://www.startapped.com/img/icon/bookmark_primary_256px.png";
                $.ajax({
                    url: "https://api.startapped.com/v1/post/bookmark/add",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization_Access": getCredentials().access,
                        "Authorization_Refresh": getCredentials().refresh
                    },
                    method: "POST",
                    dataType: "json",
                    data: JSON.stringify(bodyRaw),
                    success: function (json) {
                        post.bookmarked = true;
                        showSnackbar(json.message);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        showSnackbar(JSON.parse(jqXHR.responseText).message);
                    }
                });
            }
        };

        reblog.onclick = function (ignore) {
            //TODO: Handle reblog!!!!!
        };
    }

    if (showTags && post.tags.length > 0 && post.tags.toString().length > 0) {
        for (let i = 0; i < post.tags.length; i++) {
            let tag = post.tags[i].trim();

            if (tag.length > 0) {

                let button = document.createElement("a");
                button.className = "post-tag btn btn-info text-tag-color text-center";
                button.innerText = "#" + tag;
                tagsContainer.appendChild(button);

                button.target = "_blank";
                button.href = encodeURI("https://www.startapped.com/search?tags=" + tag);
            }
        }
    }

    return root;
}

// noinspection Duplicates
function generateImagePost(post, parent, showTopBar, showBottomBar, showTags) {
    //Load views
    let root = document.createElement("div");
    let topBar = document.createElement("div");
    let contents = document.createElement("div");
    let bottomBar = document.createElement("div");
    let blogUrlLatest = document.createElement("a");
    let blogUrlSecond = document.createElement("a");
    let reblogIcon = document.createElement("img");
    let postTitle = document.createElement("h3");
    let postBody = document.createElement("p");
    let tagsContainer = document.createElement("div");
    let source = document.createElement("a");
    let bookmark = document.createElement("img");
    let reblog = document.createElement("img");
    let imageContainer = document.createElement("div");
    let image = document.createElement("img");

    //Set view classes
    root.className = "post-container bg-light rounded";
    topBar.className = "post-top-bar bg-light border-dark rounded-top";
    contents.className = "post-contents bg-light";
    bottomBar.className = "post-bottom-bar bg-light border-dark rounded-bottom";
    blogUrlLatest.className = "blog-url-latest text-link-color underline-solid";
    blogUrlSecond.className = "blog-url-second text-link-color underline-solid";
    reblogIcon.className = "reblog-icon";
    postTitle.className = "post-title text-primary text-center";
    postBody.className = "post-body text-dark";
    tagsContainer.className = "post-tag-container";
    source.className = "post-source text-dark underline-solid";
    bookmark.className = "post-bookmark btn-light rounded";
    reblog.className = "post-reblog btn-light rounded";
    imageContainer.className = "post-image-container";
    image.className = "post-image";

    //Append all the views...
    root.appendChild(topBar);
    root.appendChild(contents);
    root.appendChild(bottomBar);
    topBar.appendChild(blogUrlLatest);
    topBar.appendChild(reblogIcon);
    topBar.appendChild(blogUrlSecond);
    imageContainer.appendChild(image);
    contents.appendChild(imageContainer);
    contents.appendChild(postTitle);
    contents.appendChild(postBody);
    contents.appendChild(tagsContainer);
    bottomBar.appendChild(source);
    bottomBar.appendChild(bookmark);
    bottomBar.appendChild(reblog);

    //Set default data stuff for the things that need it.
    reblogIcon.src = "https://www.startapped.com/img/icon/reblog_256px.png";
    blogUrlLatest.href = "#";
    blogUrlSecond.href = "#";
    source.href = "#";
    if (post.bookmarked) {
        bookmark.src = "https://www.startapped.com/img/icon/bookmark_primary_256px.png";
    } else {
        bookmark.src = "https://www.startapped.com/img/icon/bookmark_256px.png";
    }
    reblog.src = "https://www.startapped.com/img/icon/reblog_256px.png";


    //Set data
    blogUrlLatest.innerText = post.originBlog.baseUrl;
    blogUrlLatest.href = "#";
    if (parent != null) {
        blogUrlSecond.innerText = parent.originBlog.baseUrl;
    } else {
        reblogIcon.style.display = 'none';
        blogUrlSecond.style.display = 'none';
    }

    postTitle.innerHTML = textWithLinks(post.title).replace(/(?:\r\n|\r|\n)/g, '<br>');
    postBody.innerHTML = textWithLinks(post.body).replace(/(?:\r\n|\r|\n)/g, '<br>');

    source.innerText = "Source: " + post.originBlog.baseUrl;

    image.src = post.image.url;
    image.alt = post.image.name;

    //Hide TopBar views if needed...
    if (!showTopBar) {
        blogUrlLatest.style.display = 'none';
        blogUrlSecond.style.display = 'none';
        reblogIcon.style.display = 'none';
        topBar.style.display = 'none';
    }

    //Hide BottomBar views if needed...
    if (!showBottomBar) {
        source.style.display = 'none';
        bookmark.style.display = 'none';
        reblog.style.display = 'none';
        bottomBar.style.display = 'none';
    }

    //Hide post tags
    if (!showTags || post.tags.length <= 0 || post.tags.toString().length <= 0) {
        tagsContainer.style.display = 'none';
    }

    //Set handlers for buttons and links...
    if (showTopBar) {
        blogUrlLatest.href = post.originBlog.completeUrl;
        blogUrlLatest.target = "_blank";

        if (parent != null) {
            blogUrlSecond.href = parent.originBlog.completeUrl;
            blogUrlSecond.target = "_blank";
        }
    }
    if (showBottomBar) {
        source.href = post.originBlog.completeUrl;
        source.target = "_blank";

        bookmark.onclick = function (ignore) {
            let bodyRaw = {
                "post_id": post.id
            };
            if (post.bookmarked) {
                bookmark.src = "https://www.startapped.com/img/icon/bookmark_256px.png";
                $.ajax({
                    url: "https://api.startapped.com/v1/post/bookmark/remove",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization_Access": getCredentials().access,
                        "Authorization_Refresh": getCredentials().refresh
                    },
                    method: "POST",
                    dataType: "json",
                    data: JSON.stringify(bodyRaw),
                    success: function (json) {
                        post.bookmarked = false;
                        showSnackbar(json.message);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        showSnackbar(JSON.parse(jqXHR.responseText).message);
                    }
                });
            } else {
                bookmark.src = "https://www.startapped.com/img/icon/bookmark_primary_256px.png";
                $.ajax({
                    url: "https://api.startapped.com/v1/post/bookmark/add",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization_Access": getCredentials().access,
                        "Authorization_Refresh": getCredentials().refresh
                    },
                    method: "POST",
                    dataType: "json",
                    data: JSON.stringify(bodyRaw),
                    success: function (json) {
                        post.bookmarked = true;
                        showSnackbar(json.message);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        showSnackbar(JSON.parse(jqXHR.responseText).message);
                    }
                });
            }
        };

        reblog.onclick = function (ignore) {
            //TODO: Handle reblog!!!!!
        };
    }

    if (showTags && post.tags.length > 0 && post.tags.toString().length > 0) {
        for (let i = 0; i < post.tags.length; i++) {
            let tag = post.tags[i].trim();

            if (tag.length > 0) {

                let button = document.createElement("a");
                button.className = "post-tag btn btn-info text-tag-color text-center";
                button.innerText = "#" + tag;
                tagsContainer.appendChild(button);

                button.target = "_blank";
                button.href = encodeURI("https://www.startapped.com/search?tags=" + tag);
            }
        }
    }

    let modalId = uuid();

    //Create modal container
    let modalContainer = document.createElement("div");
    modalContainer.className = "modal fade";
    modalContainer.id = "modal-" + modalId;
    modalContainer.role = "dialog";
    root.appendChild(modalContainer);

    //Create modal-dialog
    let modalDia = document.createElement("div");
    modalDia.className = "modal-dialog";
    modalContainer.appendChild(modalDia);

    //Create Modal Content
    let modalCon = document.createElement("div");
    modalCon.className = "modal-content bg-dark";
    modalDia.appendChild(modalCon);

    //Create modal header and title
    let modalHeader = document.createElement("div");
    modalHeader.className = "modal-header";
    modalCon.appendChild(modalHeader);
    let modalTitle = document.createElement("h4");
    modalTitle.className = "modal-title text-light";
    modalTitle.innerText = "Image";
    modalHeader.appendChild(modalTitle);

    //Create Modal Body
    let modalBody = document.createElement("div");
    modalBody.className = "modal-body";
    modalCon.appendChild(modalBody);

    let modalImage = document.createElement("img");
    modalImage.className = "post-image";
    modalImage.src = post.image.url;
    modalImage.alt = post.image.name;
    modalBody.appendChild(modalImage);

    //Create modal footer
    let modalFooter = document.createElement("div");
    modalFooter.className = "modal-footer";
    modalCon.appendChild(modalFooter);

    let closeButton = document.createElement("button");
    closeButton.className = "btn btn-primary btn-sm";
    closeButton.type = "button";
    closeButton.setAttribute("data-dismiss", "modal");
    modalFooter.appendChild(closeButton);
    let closeIcon = document.createElement("img");
    closeIcon.className = "icon-custom-small";
    closeIcon.src = "https://www.startapped.com/img/icon/close_256px.png";
    closeIcon.alt = "Close";
    closeButton.appendChild(closeIcon);

    //Make sure image opens modal:
    imageContainer.setAttribute("data-toggle", "modal");
    imageContainer.setAttribute("data-target", "#modal-" + modalId);

    return root;
}

// noinspection Duplicates
function generateAudioPost(post, parent, showTopBar, showBottomBar, showTags) {
    //Load views
    let root = document.createElement("div");
    let topBar = document.createElement("div");
    let contents = document.createElement("div");
    let bottomBar = document.createElement("div");
    let blogUrlLatest = document.createElement("a");
    let blogUrlSecond = document.createElement("a");
    let reblogIcon = document.createElement("img");
    let postTitle = document.createElement("h3");
    let postBody = document.createElement("p");
    let tagsContainer = document.createElement("div");
    let source = document.createElement("a");
    let bookmark = document.createElement("img");
    let reblog = document.createElement("img");
    let audioContainer = document.createElement("div");
    let audioName = document.createElement("p");
    let audio = document.createElement("audio");
    let audioSrc = document.createElement("source");

    //Set view classes
    root.className = "post-container bg-light rounded";
    topBar.className = "post-top-bar bg-light border-dark rounded-top";
    contents.className = "post-contents bg-light";
    bottomBar.className = "post-bottom-bar bg-light border-dark rounded-bottom";
    blogUrlLatest.className = "blog-url-latest text-link-color underline-solid";
    blogUrlSecond.className = "blog-url-second text-link-color underline-solid";
    reblogIcon.className = "reblog-icon";
    postTitle.className = "post-title text-primary text-center";
    postBody.className = "post-body text-dark";
    tagsContainer.className = "post-tag-container";
    source.className = "post-source text-dark underline-solid";
    bookmark.className = "post-bookmark btn-light rounded";
    reblog.className = "post-reblog btn-light rounded";
    audioContainer.className = "post-audio-container bg-secondary";
    audioName.className = "post-audio-name text-dark";
    audio.className = "post-audio";

    //Append all the views...
    root.appendChild(topBar);
    root.appendChild(contents);
    root.appendChild(bottomBar);
    topBar.appendChild(blogUrlLatest);
    topBar.appendChild(reblogIcon);
    topBar.appendChild(blogUrlSecond);
    contents.appendChild(audioContainer);
    contents.appendChild(postTitle);
    contents.appendChild(postBody);
    contents.appendChild(tagsContainer);
    bottomBar.appendChild(source);
    bottomBar.appendChild(bookmark);
    bottomBar.appendChild(reblog);
    audioContainer.appendChild(audioName);
    audioContainer.appendChild(audio);
    audio.appendChild(audioSrc);

    //Set default data stuff for the things that need it.
    reblogIcon.src = "https://www.startapped.com/img/icon/reblog_256px.png";
    blogUrlLatest.href = "#";
    blogUrlSecond.href = "#";
    source.href = "#";
    if (post.bookmarked) {
        bookmark.src = "https://www.startapped.com/img/icon/bookmark_primary_256px.png";
    } else {
        bookmark.src = "https://www.startapped.com/img/icon/bookmark_256px.png";
    }
    reblog.src = "https://www.startapped.com/img/icon/reblog_256px.png";
    audioSrc.innerText = "Your browser does not support the Audio Tag";


    //Set data
    blogUrlLatest.innerText = post.originBlog.baseUrl;
    blogUrlLatest.href = "#";
    if (parent != null) {
        blogUrlSecond.innerText = parent.originBlog.baseUrl;
    } else {
        reblogIcon.style.display = 'none';
        blogUrlSecond.style.display = 'none';
    }

    postTitle.innerHTML = textWithLinks(post.title).replace(/(?:\r\n|\r|\n)/g, '<br>');
    postBody.innerHTML = textWithLinks(post.body).replace(/(?:\r\n|\r|\n)/g, '<br>');

    source.innerText = "Source: " + post.originBlog.baseUrl;

    //Hide TopBar views if needed...
    if (!showTopBar) {
        blogUrlLatest.style.display = 'none';
        blogUrlSecond.style.display = 'none';
        reblogIcon.style.display = 'none';
        topBar.style.display = 'none';
    }

    //Hide BottomBar views if needed...
    if (!showBottomBar) {
        source.style.display = 'none';
        bookmark.style.display = 'none';
        reblog.style.display = 'none';
        bottomBar.style.display = 'none';
    }

    //Hide post tags
    if (!showTags || post.tags.length <= 0 || post.tags.toString().length <= 0) {
        tagsContainer.style.display = 'none';
    }

    //Set handlers for buttons and links...
    if (showTopBar) {
        blogUrlLatest.href = post.originBlog.completeUrl;
        blogUrlLatest.target = "_blank";

        if (parent != null) {
            blogUrlSecond.href = parent.originBlog.completeUrl;
            blogUrlSecond.target = "_blank";
        }
    }
    if (showBottomBar) {
        source.href = post.originBlog.completeUrl;
        source.target = "_blank";

        bookmark.onclick = function (ignore) {
            let bodyRaw = {
                "post_id": post.id
            };
            if (post.bookmarked) {
                bookmark.src = "https://www.startapped.com/img/icon/bookmark_256px.png";
                $.ajax({
                    url: "https://api.startapped.com/v1/post/bookmark/remove",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization_Access": getCredentials().access,
                        "Authorization_Refresh": getCredentials().refresh
                    },
                    method: "POST",
                    dataType: "json",
                    data: JSON.stringify(bodyRaw),
                    success: function (json) {
                        post.bookmarked = false;
                        showSnackbar(json.message);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        showSnackbar(JSON.parse(jqXHR.responseText).message);
                    }
                });
            } else {
                bookmark.src = "https://www.startapped.com/img/icon/bookmark_primary_256px.png";
                $.ajax({
                    url: "https://api.startapped.com/v1/post/bookmark/add",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization_Access": getCredentials().access,
                        "Authorization_Refresh": getCredentials().refresh
                    },
                    method: "POST",
                    dataType: "json",
                    data: JSON.stringify(bodyRaw),
                    success: function (json) {
                        post.bookmarked = true;
                        showSnackbar(json.message);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        showSnackbar(JSON.parse(jqXHR.responseText).message);
                    }
                });
            }
        };

        reblog.onclick = function (ignore) {
            //TODO: Handle reblog!!!!!
        };
    }

    if (showTags && post.tags.length > 0 && post.tags.toString().length > 0) {
        for (let i = 0; i < post.tags.length; i++) {
            let tag = post.tags[i].trim();

            if (tag.length > 0) {

                let button = document.createElement("a");
                button.className = "post-tag btn btn-info text-tag-color text-center";
                button.innerText = "#" + tag;
                tagsContainer.appendChild(button);

                button.target = "_blank";
                button.href = encodeURI("https://www.startapped.com/search?tags=" + tag);
            }
        }
    }

    //Setup all of the audio player controls and src!!!
    audioName.innerText = "File Name: " + post.audio.name;
    audio.setAttribute("controls", "");
    audio.setAttribute("loop", "");
    audioSrc.src = post.audio.url;

    //If post isn't visible, make sure music isn't still playing...
    document.addEventListener('scroll', function () {
        if (!audio.paused && !isPostVisible(root, false)) {
            audio.pause();
        }
    }, true);

    return root;
}

// noinspection Duplicates
function generateVideoPost(post, parent, showTopBar, showBottomBar, showTags) {
    //Load views
    let root = document.createElement("div");
    let topBar = document.createElement("div");
    let contents = document.createElement("div");
    let bottomBar = document.createElement("div");
    let blogUrlLatest = document.createElement("a");
    let blogUrlSecond = document.createElement("a");
    let reblogIcon = document.createElement("img");
    let postTitle = document.createElement("h3");
    let postBody = document.createElement("p");
    let tagsContainer = document.createElement("div");
    let source = document.createElement("a");
    let bookmark = document.createElement("img");
    let reblog = document.createElement("img");
    let videoContainer = document.createElement("div");
    let video = document.createElement("video");
    let videoSrc = document.createElement("source");

    //Set view classes
    root.className = "post-container bg-light rounded";
    topBar.className = "post-top-bar bg-light border-dark rounded-top";
    contents.className = "post-contents bg-light";
    bottomBar.className = "post-bottom-bar bg-light border-dark rounded-bottom";
    blogUrlLatest.className = "blog-url-latest text-link-color underline-solid";
    blogUrlSecond.className = "blog-url-second text-link-color underline-solid";
    reblogIcon.className = "reblog-icon";
    postTitle.className = "post-title text-primary text-center";
    postBody.className = "post-body text-dark";
    tagsContainer.className = "post-tag-container";
    source.className = "post-source text-dark underline-solid";
    bookmark.className = "post-bookmark btn-light rounded";
    reblog.className = "post-reblog btn-light rounded";
    videoContainer.className = "post-video-container bg-secondary";
    video.className = "post-video";

    //Append all the views...
    root.appendChild(topBar);
    root.appendChild(contents);
    root.appendChild(bottomBar);
    topBar.appendChild(blogUrlLatest);
    topBar.appendChild(reblogIcon);
    topBar.appendChild(blogUrlSecond);
    contents.appendChild(videoContainer);
    contents.appendChild(postTitle);
    contents.appendChild(postBody);
    contents.appendChild(tagsContainer);
    bottomBar.appendChild(source);
    bottomBar.appendChild(bookmark);
    bottomBar.appendChild(reblog);
    videoContainer.appendChild(video);
    video.appendChild(videoSrc);

    //Set default data stuff for the things that need it.
    reblogIcon.src = "https://www.startapped.com/img/icon/reblog_256px.png";
    blogUrlLatest.href = "#";
    blogUrlSecond.href = "#";
    source.href = "#";
    if (post.bookmarked) {
        bookmark.src = "https://www.startapped.com/img/icon/bookmark_primary_256px.png";
    } else {
        bookmark.src = "https://www.startapped.com/img/icon/bookmark_256px.png";
    }
    reblog.src = "https://www.startapped.com/img/icon/reblog_256px.png";
    videoSrc.innerText = "Your browser does not support the Video Tag";


    //Set data
    blogUrlLatest.innerText = post.originBlog.baseUrl;
    blogUrlLatest.href = "#";
    if (parent != null) {
        blogUrlSecond.innerText = parent.originBlog.baseUrl;
    } else {
        reblogIcon.style.display = 'none';
        blogUrlSecond.style.display = 'none';
    }

    postTitle.innerHTML = textWithLinks(post.title).replace(/(?:\r\n|\r|\n)/g, '<br>');
    postBody.innerHTML = textWithLinks(post.body).replace(/(?:\r\n|\r|\n)/g, '<br>');

    source.innerText = "Source: " + post.originBlog.baseUrl;

    //Hide TopBar views if needed...
    if (!showTopBar) {
        blogUrlLatest.style.display = 'none';
        blogUrlSecond.style.display = 'none';
        reblogIcon.style.display = 'none';
        topBar.style.display = 'none';
    }

    //Hide BottomBar views if needed...
    if (!showBottomBar) {
        source.style.display = 'none';
        bookmark.style.display = 'none';
        reblog.style.display = 'none';
        bottomBar.style.display = 'none';
    }

    //Hide post tags
    if (!showTags || post.tags.length <= 0 || post.tags.toString().length <= 0) {
        tagsContainer.style.display = 'none';
    }

    //Set handlers for buttons and links...
    if (showTopBar) {
        blogUrlLatest.href = post.originBlog.completeUrl;
        blogUrlLatest.target = "_blank";

        if (parent != null) {
            blogUrlSecond.href = parent.originBlog.completeUrl;
            blogUrlSecond.target = "_blank";
        }
    }
    if (showBottomBar) {
        source.href = post.originBlog.completeUrl;
        source.target = "_blank";

        bookmark.onclick = function (ignore) {
            let bodyRaw = {
                "post_id": post.id
            };
            if (post.bookmarked) {
                bookmark.src = "https://www.startapped.com/img/icon/bookmark_256px.png";
                $.ajax({
                    url: "https://api.startapped.com/v1/post/bookmark/remove",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization_Access": getCredentials().access,
                        "Authorization_Refresh": getCredentials().refresh
                    },
                    method: "POST",
                    dataType: "json",
                    data: JSON.stringify(bodyRaw),
                    success: function (json) {
                        post.bookmarked = false;
                        showSnackbar(json.message);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        showSnackbar(JSON.parse(jqXHR.responseText).message);
                    }
                });
            } else {
                bookmark.src = "https://www.startapped.com/img/icon/bookmark_primary_256px.png";
                $.ajax({
                    url: "https://api.startapped.com/v1/post/bookmark/add",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization_Access": getCredentials().access,
                        "Authorization_Refresh": getCredentials().refresh
                    },
                    method: "POST",
                    dataType: "json",
                    data: JSON.stringify(bodyRaw),
                    success: function (json) {
                        post.bookmarked = true;
                        showSnackbar(json.message);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        showSnackbar(JSON.parse(jqXHR.responseText).message);
                    }
                });
            }
        };

        reblog.onclick = function (ignore) {
            //TODO: Handle reblog!!!!!
        };
    }

    if (showTags && post.tags.length > 0 && post.tags.toString().length > 0) {
        for (let i = 0; i < post.tags.length; i++) {
            let tag = post.tags[i].trim();

            if (tag.length > 0) {

                let button = document.createElement("a");
                button.className = "post-tag btn btn-info text-tag-color text-center";
                button.innerText = "#" + tag;
                tagsContainer.appendChild(button);

                button.target = "_blank";
                button.href = encodeURI("https://www.startapped.com/search?tags=" + tag);
            }
        }
    }

    //Setup all of the video player controls and src!!!!!
    video.setAttribute("controls", "");
    video.setAttribute("loop", "");
    videoSrc.src = post.video.url;

    //If post isn't visible, make sure video isn't still playing...
    document.addEventListener('scroll', function () {
        if (!video.paused && !isPostVisible(root, false)) {
            video.pause();
        }
    }, true);

    return root;
}

function getPostFromArray(posts, id) {
    for (let i = 0; i < posts.length; i++) {
        let post = posts[i];
        if (post.id === id) {
            return post;
        }
    }
    return null;
}

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        // noinspection PointlessBitwiseExpressionJS
        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function textWithLinks(text) {
    let urlRegex = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;

    return text.replace(urlRegex, function (url) {
        return '<a href="' + url + '" target="_blank" class="text-link-color">' + url + "</a>";
    });
}

function isPostVisible(el, fullyInView) {
    let pageTop = $(window).scrollTop();
    let pageBottom = pageTop + $(window).height();
    let elementTop = $(el).offset().top;
    let elementBottom = elementTop + $(el).height();

    if (fullyInView === true) {
        return ((pageTop < elementTop) && (pageBottom > elementBottom));
    } else {
        return ((elementTop <= pageBottom) && (elementBottom >= pageTop));
    }
}