$(function () {
    $('#uploadForm').submit(function (e) {
        e.preventDefault();
        $("#status").empty().text("File is uploading...").show();
        $(".error").empty().hide();
        var form = $(this);
        //var storage = firebase.storage();
        var timestamp = Number(new Date());
        var storageRef = firebase.storage().ref();

        // File or Blob named mountains.jpg
        var file = $('#userPhoto').prop('files')[0];
        console.log(file);
        if (!file) {
            $("#status").empty().hide();
            $(".error_form").empty().text('Please choose a file').show();
            return false;
        } else {
            if (file.type == 'image/jpeg' || file.type == 'image/gif' || file.type == 'image/png') {
                var filename = file.name;
                var file_split = filename.split('.');
                var filename_original = file_split[0];
                var filename_extension = file_split[1];
                var new_file_name = filename_original + "_" + timestamp + '.' + filename_extension;

                // Create the file metadata
                var metadata = {
                    contentType: 'image/jpeg'
                };

                // Upload file
                var uploadTask = storageRef.child('uploads/' + new_file_name).put(file, metadata);

                // Listen for state changes, errors, and completion of the upload.
                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                        function (snapshot) {
                            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log('Upload is ' + progress + '% done');
                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED: // or 'paused'
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING: // or 'running'
                                    console.log('Upload is running');
                                    break;
                            }
                        }, function (error) {
                    $("#status").empty().hide();
                    $(".error_form").empty().text('Error uploading file with error code : ' + error.code).show();
                    return false;
                }, function () {
                    // Upload completed successfully, now we can get the download URL
                    var downloadURL = uploadTask.snapshot.downloadURL;
                    $('#image_path').val(downloadURL);
                    form.ajaxSubmit({
                        error: function (xhr) {
                            $("#status").empty().hide();
                            $(".error_form").empty().text('Error: ' + xhr.status).show();
                        },
                        success: function (response) {
                            $("#status").empty().hide();
                            if (response.status == 200) {
                                window.location.href = "/profile";
                            } else {
                                $(".error_form").empty().text(response.message).show();
                            }
                        }
                    });
                });
            } else {
                $("#status").empty().hide();
                $(".error_form").empty().text('Please upload jpeg/png/gif format file').show();
                return false;
            }
        }
        //Very important line, it disable the page refresh.
        return false;
    });
})

$('#register').on('click', function () {
    resetForms();
    $('.login-panel').hide();
    $('.register-panel').fadeIn();
});

$('#login').on('click', function () {
    resetForms();
    $('.register-panel').hide();
    $('.login-panel').fadeIn();
});


function follow(user_id) {
    $.ajax(
            {
                url: 'follow/' + user_id,
                type: "GET",
                success: function (response) {
                    if (response.status == 200) {
                        window.location.reload();
                    }
                },
                error: function (response) {
                }
            });
}

function unfollow(user_id) {
    $.ajax(
            {
                url: 'unfollow/' + user_id,
                type: "GET",
                success: function (response) {
                    if (response.status == 200) {
                        window.location.reload();
                    }
                },
                error: function (response) {
                }
            });
}

function resetForms() {
    $('input').val('');
    $('.error_form').hide();
}

function submitRegister() {
    var postData = $('#registerForm').serializeArray();
    $('.error_form').hide();
    $.ajax(
            {
                url: 'signup',
                type: "POST",
                data: postData,
                success: function (response) {
                    if (response.status == 200) {
                        window.location.href = "/dashboard";
                    } else {
                        $('.error_form').html(response.message).show();
                        return false;
                    }
                },
                error: function (response) {
                    //if fails  
                    $('.error_form').html('Some error occured.').show();
                    return false;
                }
            });
    return false;
}

function submitLogin() {
    var postData = $('#loginForm').serializeArray();
    $.ajax(
            {
                url: 'login',
                type: "POST",
                data: postData,
                success: function (response) {
                    if (response.status == 200) {
                        window.location.href = "/dashboard";
                    } else {
                        $('.error_form').html(response.message).show();
                        return false;
                    }
                },
                error: function (response) {
                    //if fails      
                    $('.error_form').html('Some error occured.').show();
                    return false;
                }
            });
    return false;
}
