$(document).ready(() => {
  $.urlParam = function (name) {
    var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(
      window.location.href
    );
    if (results == null) {
      return null;
    }
    return decodeURI(results[1]) || 0;
  };

  var id = $.urlParam("id");
  console.log(id);

  var likes = new Array();
  //like array
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/likes",

    success: function (data, status, xhr) {
      console.log("success" + status);
      alert("success" + status);
      likes = JSON.parse(data);
      console.log(likes);
      load3();
    },

    error: function (jqXhr, textStatus, errorMessage) {
      console.log("error" + errorMessage);
    },
    dataType: "text",
    contentType: "application/json",
  });

  //comment array
  var commentarray = new Array();
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/comments",

    success: function (data, status, xhr) {
      console.log("success" + status);
      alert("success" + status);
      commentarray = JSON.parse(data);
      console.log(commentarray);
      load2();
    },

    error: function (jqXhr, textStatus, errorMessage) {
      console.log("error" + errorMessage);
    },
    dataType: "text",
    contentType: "application/json",
  });

  //current user

  var user = JSON.parse(sessionStorage.getItem("user"));

  //blog array
  var blog = new Array();
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "http://localhost:3000/blogs",

    success: (data) => {
      console.log(data);
      blog = data;
      load1();
      load2();
      load3();
    },
    error: (e) => {
      alert("error");
    },
  });

  //blog
  function load1() {
    $("#display").html("");

    for (var i = 0; i < blog.length; i++) {
      if (blog[i].id == id) {
        console.log("hi there");
        $("#display").append(
          '<div class="fullblog container"><br><h2>' +
          blog[i].title +
          '</h2><br><img class="Bimage" src=' +
          blog[i].image +
          "><br><br><div class='container blogcontent'>" +
          blog[i].content +
          '</div> <button type="button" id=' +
          blog[i].id +
          ' class="btn btn-default btn-sm like"><span class="glyphicon glyphicon-thumbs-up" ></span> Like</button><span class="text-muted nlike">' +
          "" +
          '</span><span class="text-muted lwarn"></span><hr><br>' +
          '<div class="container comm">' +
          '<div class="row bootstrap snippets bootdeys commentbody">' +
          '<div class="col-md-12 col-sm-12">' +
          '<div class="comment-wrapper">' +
          '<div class="panel panel-info">' +
          '<div class="panel-heading">' +
          "Comment panel" +
          "</div>" +
          '<div class="panel-body">' +
          '<textarea class="form-control" id="comarea" placeholder="write a comment..." rows="3"></textarea>' +
          "<br>" +
          '<button type="button" class="btn btn-info pull-right com" id=' +
          blog[i].id +
          ">Post</button>" +
          '<div class="clearfix"></div>' +
          "<hr>" +
          '<ul class="media-list app">' +
          "</ul>" +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div><br><br>"
        );
        break;
      }
    }
  }

  function load3() {
    let cnt = 0;

    $.each(likes, function (i, v) {
      if (v.blogid == id) {
        cnt += 1;
      }
    });
    $(".nlike").html(" " + cnt);
    $(".lwarn").css("color", "green");
  }

  function load2() {
    $(".app").html("");
    console.log("hi");
    for (var i = 0; i < commentarray.length; i++) {
      if (commentarray[i].blogid == id) {
        console.log("yoyo");
        $(".app").append(
          '<li class="media">' +
          '<a href="#" class="pull-left">' +
          '<img src="https://bootdey.com/img/Content/user_1.jpg" alt="" class="img-circle">' +
          "</a>" +
          '<div class="media-body">' +
          '<span class="text-muted pull-right">' +
          '<strong class="text-success">@' +
          commentarray[i].name +
          "</strong>" +
          "<p>" +
          commentarray[i].content +
          "</p>" +
          "</div>" +
          "</li>"
        );
      }
    }
  }
  //check if user liked or not

  function check1(name, id) {
    var flag = 0;

    console.log(likes);
    for (var i = 0; i < likes.length; i++) {
      console.log(likes.length);
      if (likes[i].name == name && likes[i].blogid == id) {
        console.log(likes[i].name, name);
        console.log(likes[i].blogid, id);
        flag = 1;
        break;
      }
    }
    if (flag == 1) {
      return "false";
    } else {
      return "true";
    }
  }

  //like button

  $("body").on("click", ".like", function (a) {
    a.preventDefault();
    var uname = user[0].name;
    let Obj = new Object();
    Obj.blogid = id;
    Obj.name = uname;

    var cnt = 0;

    $.each(likes, function (i, v) {
      if (v.blogid == id) {
        cnt += 1;
      }
    });

    if (check1(uname, id) == "true") {
      $.ajax({
        type: "POST",
        url: "http://localhost:3000/likes",

        data: JSON.stringify(Obj),
        success: function (data, status, xhr) {
          console.log("success" + status);
          alert("success" + status);
          $(".nlike").html(" " + cnt);
          $(".lwarn").css("color", "green");
          $(".lwarn").html("  liked successfully");
          $(this).removeAttr("disabled");

          a.preventDefault();
        },

        error: function (jqXhr, textStatus, errorMessage) {
          console.log("error" + errorMessage);
        },
        dataType: "text",

        contentType: "application/json",
      });
    } else {
      $(".nlike").html(" " + cnt);
      $(".lwarn").html("  already done");
      $(".lwarn").css("color", "red");
      $(this).attr("disabled", "true");
    }
  });

  //comment button

  $("body").on("click", ".com", function (a) {
    let content = $("#comarea").val();

    var name = user[0].name;
    let obj = new Object();
    obj.content = content;
    obj.blogid = id;
    obj.name = name;

    $.ajax({
      type: "POST",
      url: "http://localhost:3000/comments",

      data: JSON.stringify(obj),
      success: function (data, status, xhr) {
        console.log("comment added" + status);

        a.preventDefault();
      },

      error: function (jqXhr, textStatus, errorMessage) {
        console.log("error" + errorMessage);
      },
      dataType: "text",

      contentType: "application/json",
    });
  });
});
