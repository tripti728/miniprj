

$(document).ready(() => {

    var arr = new Array();


    $.ajax({
        type: "GET",
        url: "http://localhost:3000/users",

        success: function (data, status, xhr) {

            arr = JSON.parse(data);
            console.log(arr);

        },

        error: function (jqXhr, textStatus, errorMessage) {
            console.log('error' + errorMessage);
        },
        dataType: "text",
        contentType: "application/json",

    });



    $('footer').load('footer.html ', function () {

    })

    //password checking
    $('#pass,#cpass').on('keyup', function () {
        if ($('#pass').val() === $('#cpass').val()) {
            $('#out').html("Matching");
            $('#out').css('color', 'green');
            $('#but').removeAttr("disabled");
        }
        else {
            $('#out').html("Not Matching");
            $('#out').css('color', 'red');
            $('#but').attr("disabled", "true");
        }
    });



    //gender validation
    $('#but,.gen').on('click', function () {
        var radio = $('.gen');
        var flag = 0;
        for (var i = 0; i < radio.length; i++) {
            if (radio[i].checked == true) {
                flag = 1;
                $('#but').removeAttr("disabled");
                break;

            }
        }
        if (flag == 0) {
            $('#but').attr("disabled", "true");
            alert("Choose Your Gender");
        }
    })






    //registration form submission
    $('#myForm').submit((a) => {
        a.preventDefault();
        let name = $('#name').val();
        let email = $('#email').val();
        let password = $('#pass').val();

        let phone = $('#phone').val();
        let gender = $('input[name="gender"]:checked').val();


        var user = {
            "name": name, "email": email, "password": password, "phone": phone,
            "gender": gender
        };

        $.ajax({
            type: "POST",
            url: "http://localhost:3000/users",
            data: JSON.stringify(user),
            success: function (data, status, xhr) {



            },

            error: function (jqXhr, textStatus, errorMessage) {
                console.log('error' + errorMessage);
            },
            dataType: "text",
            contentType: "application/json",

        });



    })


    $('.buttonx').on('click', function () {
        let type = $(this).attr('data-filter');
        if (type == 'home') {
            console.log('reach');
            $('#myForm1').css('display', 'none');
            $('#myForm').css('display', 'none');
            $('#contain1').css('display', 'none');
            $('#home').css('display', 'block');
            $('#myModal').attr('display', 'block');
            $('footer').removeClass('foot2');

        }
        else if (type == 'login') {
            console.log('reach');
            $('#home').css('display', 'none');
            $('#contain1').css('display', 'block');
            $('#myForm').css('display', 'none');
            $('#myForm1').css('display', 'block');
            $('footer').addClass('foot2');
        }
        else if (type == 'register') {
            console.log('reach');
            $('#home').css('display', 'none');
            $('#contain1').css('display', 'block');
            $('#myForm1').css('display', 'none');
            $('#myForm').css('display', 'block');
            $('footer').removeClass('foot2');
        }


    })


    //login form submission
    $('#myForm1').submit((a) => {
        a.preventDefault();
        let email = $('#email1').val();

        let password = $('#pass1').val();



        if (email == "" && password == "" || email == "" || password == "") {
            alert("name and password is incorrect")
        }
        else {
            $.ajax({
                type: "GET",
                url: "http://localhost:3000/users",
                data: { "email": email, "password": password },
                success: function (data, status, xhr) {
                    console.log(data);
                    alert(data);
                    if (data !== '[]') {
                        sessionStorage.setItem('user', data);
                        window.location.replace('editor.html');
                    }
                    else {
                        $('.text-muted').html('Wrong Email Id or Password');
                        $('.text-muted').css('color', 'red');
                        alert('error');
                    }
                },

                error: function (jqXhr, textStatus, errorMessage) {
                    console.log('error' + errorMessage);
                },
                dataType: "text",
                contentType: "application/json",

            });
        }



    })


    //email validation

    $('#email').on('keyup', function () {

        var email = $('#email').val();
        console.log(email);
        var flag = 0;
        for (var i = 0; i < arr.length; i++) {
            if (email == arr[i].email) {
                $('#inval').html("Already registered user");
                $('#inval').css('color', 'red');
                $('#but').attr("disabled", "true");
                flag = 1;
                break;

            }

        }
        if (flag == 0) {
            $('#but').removeAttr("disabled");
            $('#inval').html("Ready to go");
            $('#inval').css('color', 'green');

        }
        if (email == "") {
            $('#but').attr("disabled", "true");
            $('#inval').html("enter your email");
            $('#inval').css('color', 'red');
        }


    })


    //blogs fetching
    var blog = new Array();
    let filteredBlogs = [];
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "http://localhost:3000/blogs",

        success: (data) => {
            console.log(data);
            blog = data;
            filteredBlogs = data;

            load1();


        },
        error: (e) => {
            alert("error");
        }
    })


    //paginate function 

    let currentPageNumber = 1
    const itemsPerPage = 4
    function paginate(direction) {
        const items = filteredBlogs;
        const totalItems = items.length

        const totalPages = Math.ceil(totalItems / itemsPerPage)
        currentPageNumber =
            direction === 'prev'
                ? Math.max(currentPageNumber - 1, 1)
                : Math.min(currentPageNumber + 1, totalPages)

        const startIndex = (currentPageNumber - 1) * itemsPerPage
        const endIndex = currentPageNumber * itemsPerPage

        return items.slice(startIndex, endIndex)
    }


    //next previous links in pagination functions

    $('#prev').on('click', function () {
        const data = paginate("prev");
        const html = data.map(item => getBlogCard(item)).join("");
        $('.wrapperblog').html(html);

    })

    $('#next').on('click', function () {
        const data = paginate("next");
        const html = data.map(item => getBlogCard(item)).join("");
        $('.wrapperblog').html(html);

    })

    //html for dynamically blog fetching
    function getBlogCard(data) {
        return `
      <div class="sub">
        <img class="Bimage" src='${data.image}'>
        <h3>${data.title}</h3>
        <div class="innersub">${data.content}</div>
        <span class="text-muted datespan">Posted on ${data.date}</span>
        <button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#myModal">Continue Reading</button>
      </div>
    `;
    }

    var cate;
    //category wise blog fetching
    $('.buttonz').on('click', function () {
        $('.buttonz').removeClass("active");
        $(this).addClass("active");
        var cat = $(this).attr('data-filter');

        filteredBlogs = blog.filter(item => cat === "all" || item.category === cat)
        const html = filteredBlogs.slice(0, itemsPerPage).map(item => getBlogCard(item)).join("");

        cate = cat;
        $('.wrapperblog').html(html);

    })

    //search blogs
    $('#sea').on('keyup', () => {
        let search = $('#sea').val();
        $('.wrapperblog').html("");
        for (var i = 0; i < blog.length; i++) {

            if (cate == blog[i].category || cate == "all") {
                if (blog[i].title.includes(search)) {
                    $('.wrapperblog').append(getBlogCard(blog[i]));

                }
            }


        }


    })

    $('.butz').on('click',function(){
        $('#home').css('display','none');
        $('#contain1').css('display','block');
        $('#myForm').css('display','none');
        $('#myForm1').css('display','block');

    })

    function load1() {

        $('.wrapperblog').html("");
        for (var i = 0; i < blog.length; i++) {
            $('.wrapperblog').append(getBlogCard(blog[i]));

        }
    }
})