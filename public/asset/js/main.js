;(function ($) {
    "use strict"

    /*--
		Header Sticky
    -----------------------------------*/
    $(window).on("scroll", function (event) {
        var scroll = $(window).scrollTop()
        if (scroll <= 1) {
            $(".header-sticky").removeClass("sticky")
        } else {
            $(".header-sticky").addClass("sticky")
        }
    })

    /*--
		Menu Active
    -----------------------------------*/
    $(function () {
        var url = window.location.pathname
        var activePage = url.substring(url.lastIndexOf("/") + 1)
        $(".nav-menu li a").each(function () {
            var linkPage = this.href.substring(this.href.lastIndexOf("/") + 1)

            if (activePage == linkPage) {
                $(this).closest("li").addClass("active")
            }
        })
    })

    /*--
        Bootstrap dropdown
    -----------------------------------*/
    // Add slideDown animation to Bootstrap dropdown when expanding.
    $(".dropdown").on("show.bs.dropdown", function () {
        $(this).find(".dropdown-menu").first().stop(true, true).slideDown()
    })

    // Add slideUp animation to Bootstrap dropdown when collapsing.
    $(".dropdown").on("hide.bs.dropdown", function () {
        $(this).find(".dropdown-menu").first().stop(true, true).slideUp()
    })

    /*--
        Off Canvas Menu
    -----------------------------------*/
    /*Variables*/
    var $offCanvasNav = $(".canvas-menu"),
        $offCanvasNavSubMenu = $offCanvasNav.find(
            ".sub-menu, .mega-sub-menu, .menu-item "
        )

    /*Add Toggle Button With Off Canvas Sub Menu*/
    $offCanvasNavSubMenu
        .parent()
        .prepend('<span class="mobile-menu-expand"></span>')

    /*Close Off Canvas Sub Menu*/
    $offCanvasNavSubMenu.slideUp()

    /*Category Sub Menu Toggle*/
    $offCanvasNav.on(
        "click",
        "li a, li .mobile-menu-expand, li .menu-title",
        function (e) {
            var $this = $(this)
            if (
                $this
                    .parent()
                    .attr("class")
                    .match(
                        /\b(menu-item-has-children|has-children|has-sub-menu)\b/
                    ) &&
                ($this.attr("href") === "#" ||
                    $this.hasClass("mobile-menu-expand"))
            ) {
                e.preventDefault()
                if ($this.siblings("ul:visible").length) {
                    $this.parent("li").removeClass("active-expand")
                    $this.siblings("ul").slideUp()
                } else {
                    $this.parent("li").addClass("active-expand")
                    $this
                        .closest("li")
                        .siblings("li")
                        .find("ul:visible")
                        .slideUp()
                    $this
                        .closest("li")
                        .siblings("li")
                        .removeClass("active-expand")
                    $this.siblings("ul").slideDown()
                }
            }
        }
    )

    $(".sub-menu, .mega-sub-menu, .menu-item")
        .parent("li")
        .addClass("menu-item-has-children")
    $(".mega-sub-menu").parent("li").css("position", "static")

    /*--
        Slider
    -----------------------------------*/
    var slider = new Swiper(".slider-active .swiper-container", {
        speed: 600,
        effect: "fade",
        loop: true,
        pagination: {
            el: ".slider-active .swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".slider-active .swiper-button-next",
            prevEl: ".slider-active .swiper-button-prev",
        },
        // autoplay: {
        //     delay: 8000,
        // },
    })

    /*--
        Product
    -----------------------------------*/
    var product = new Swiper(".product-active .swiper-container", {
        slidesPerView: 3,
        spaceBetween: 30,
        loop: true,
        navigation: {
            nextEl: ".product-active .swiper-button-next",
            prevEl: ".product-active .swiper-button-prev",
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            576: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 3,
            },
        },
    })

    /*--
        Product 02
    -----------------------------------*/
    var product = new Swiper(".product-active-02 .swiper-container", {
        slidesPerView: 4,
        spaceBetween: 30,
        loop: true,
        navigation: {
            nextEl: ".product-active-02 .swiper-button-next",
            prevEl: ".product-active-02 .swiper-button-prev",
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            576: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 4,
            },
        },
    })

    /*--
        products Banner
    -----------------------------------*/
    var product = new Swiper(".products-banner-active .swiper-container", {
        slidesPerView: 4,
        spaceBetween: 0,
        loop: true,
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            576: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 4,
            },
        },
    })

    /*--
        Blog
    -----------------------------------*/
    var product = new Swiper(".blog-active .swiper-container", {
        slidesPerView: 3,
        spaceBetween: 30,
        loop: true,
        navigation: {
            nextEl: ".blog-active .swiper-button-next",
            prevEl: ".blog-active .swiper-button-prev",
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 3,
            },
        },
    })

    /*--
        Brand Logo
    -----------------------------------*/
    var product = new Swiper(".brand-active .swiper-container", {
        slidesPerView: 3,
        spaceBetween: 30,
        loop: true,
        navigation: {
            nextEl: ".brand-active .swiper-button-next",
            prevEl: ".brand-active .swiper-button-prev",
        },
        breakpoints: {
            0: {
                slidesPerView: 3,
                spaceBetween: 50,
            },
            576: {
                slidesPerView: 4,
                spaceBetween: 50,
            },
            768: {
                slidesPerView: 4,
                spaceBetween: 50,
            },
            992: {
                slidesPerView: 5,
                spaceBetween: 80,
            },
            1200: {
                slidesPerView: 5,
                spaceBetween: 150,
            },
        },
    })

    /*--
        Testimonial
    -----------------------------------*/
    var slider = new Swiper(".testimonial-active .swiper-container", {
        speed: 600,
        loop: true,
        pagination: {
            el: ".testimonial-active .swiper-pagination",
            clickable: true,
        },
        // autoplay: {
        //     delay: 8000,
        // },
    })

    /*--
        Blog Gallery Active
    -----------------------------------*/
    var blog = new Swiper(".gallery-active .swiper-container", {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        navigation: {
            nextEl: ".gallery-active .swiper-button-next",
            prevEl: ".gallery-active .swiper-button-prev",
        },
    })

    /*--
        Countdown
    -----------------------------------*/
    function makeTimer($endDate, $this, $format) {
        var today = new Date()
        var BigDay = new Date($endDate),
            msPerDay = 24 * 60 * 60 * 1000,
            timeLeft = BigDay.getTime() - today.getTime(),
            e_daysLeft = timeLeft / msPerDay,
            daysLeft = Math.floor(e_daysLeft),
            e_hrsLeft = (e_daysLeft - daysLeft) * 24,
            hrsLeft = Math.floor(e_hrsLeft),
            e_minsLeft = (e_hrsLeft - hrsLeft) * 60,
            minsLeft = Math.floor((e_hrsLeft - hrsLeft) * 60),
            e_secsLeft = (e_minsLeft - minsLeft) * 60,
            secsLeft = Math.floor((e_minsLeft - minsLeft) * 60)

        var yearsLeft = 0
        var monthsLeft = 0
        var weeksLeft = 0

        if ($format != "short") {
            if (daysLeft > 365) {
                yearsLeft = Math.floor(daysLeft / 365)
                daysLeft = daysLeft % 365
            }

            if (daysLeft > 30) {
                monthsLeft = Math.floor(daysLeft / 30)
                daysLeft = daysLeft % 30
            }
            if (daysLeft > 7) {
                weeksLeft = Math.floor(daysLeft / 7)
                daysLeft = daysLeft % 7
            }
        }

        var yearsLeft = yearsLeft < 10 ? "0" + yearsLeft : yearsLeft,
            monthsLeft = monthsLeft < 10 ? "0" + monthsLeft : monthsLeft,
            weeksLeft = weeksLeft < 10 ? "0" + weeksLeft : weeksLeft,
            daysLeft = daysLeft < 10 ? "0" + daysLeft : daysLeft,
            hrsLeft = hrsLeft < 10 ? "0" + hrsLeft : hrsLeft,
            minsLeft = minsLeft < 10 ? "0" + minsLeft : minsLeft,
            secsLeft = secsLeft < 10 ? "0" + secsLeft : secsLeft,
            yearsText = yearsLeft > 1 ? "Years" : "year",
            monthsText = monthsLeft > 1 ? "Months" : "month",
            weeksText = weeksLeft > 1 ? "Weeks" : "week",
            daysText = daysLeft > 1 ? "Days" : "day",
            hourText = hrsLeft > 1 ? "Hours" : "hr",
            minsText = minsLeft > 1 ? "Mints" : "min",
            secText = secsLeft > 1 ? "Secs" : "sec"

        var $markup = {
            wrapper: $this.find(".countdown__item"),
            year: $this.find(".yearsLeft"),
            month: $this.find(".monthsLeft"),
            week: $this.find(".weeksLeft"),
            day: $this.find(".daysLeft"),
            hour: $this.find(".hoursLeft"),
            minute: $this.find(".minsLeft"),
            second: $this.find(".secsLeft"),
            yearTxt: $this.find(".yearsText"),
            monthTxt: $this.find(".monthsText"),
            weekTxt: $this.find(".weeksText"),
            dayTxt: $this.find(".daysText"),
            hourTxt: $this.find(".hoursText"),
            minTxt: $this.find(".minsText"),
            secTxt: $this.find(".secsText"),
        }

        var elNumber = $markup.wrapper.length
        $this.addClass("item-" + elNumber)
        $($markup.year).html(yearsLeft)
        $($markup.yearTxt).html(yearsText)
        $($markup.month).html(monthsLeft)
        $($markup.monthTxt).html(monthsText)
        $($markup.week).html(weeksLeft)
        $($markup.weekTxt).html(weeksText)
        $($markup.day).html(daysLeft)
        $($markup.dayTxt).html(daysText)
        $($markup.hour).html(hrsLeft)
        $($markup.hourTxt).html(hourText)
        $($markup.minute).html(minsLeft)
        $($markup.minTxt).html(minsText)
        $($markup.second).html(secsLeft)
        $($markup.secTxt).html(secText)
    }

    $(".countdown").each(function () {
        var $this = $(this)
        var $endDate = $(this).data("countdown")
        var $format = $(this).data("format")
        setInterval(function () {
            makeTimer($endDate, $this, $format)
        }, 0)
    })

    /*--
    Back To Top
    -----------------------------------*/
    var toTopBtn = document.getElementById("backBtn")

    toTopBtn.addEventListener("click", function (e) {
        e.preventDefault()
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    })

    //hide/show button on scroll up/down
    var scrollPos = 0

    window.addEventListener("scroll", function () {
        // detects new state and compares it with the new one
        if (document.body.getBoundingClientRect().top > scrollPos) {
            toTopBtn.style.display = "none"
        } else {
            toTopBtn.style.display = "block"
        }
        // saves the new position for iteration.
        scrollPos = document.body.getBoundingClientRect().top
    })

    /*--
        select2
    -----------------------------------*/
    $(".select2").select2({
        tags: true,
    })

    $(".select2-2").select2({
        minimumResultsForSearch: Infinity,
    })

    /*--
        ionRangeSlider Activation 
    -----------------------------------*/
    $("#price-range").ionRangeSlider({
        type: "double",
        grid: false,
        min: 16,
        max: 500,
        from: 16,
        to: 300,
        prefix: "$",
    })

    /*--
        Product Details Zoom Activation
    -----------------------------------*/
    $(".zoom").zoom()

    /*--
        Product Details
    -----------------------------------*/
    var galleryThumbs = new Swiper(
        ".details-gallery-thumbs .swiper-container",
        {
            spaceBetween: 20,
            slidesPerView: 4,
            freeMode: true,
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
            navigation: {
                nextEl: ".details-gallery-thumbs .swiper-button-next",
                prevEl: ".details-gallery-thumbs .swiper-button-prev",
            },
            breakpoints: {
                0: {
                    spaceBetween: 10,
                    slidesPerView: 3,
                },
                576: {
                    slidesPerView: 4,
                },
            },
        }
    )
    var galleryTop = new Swiper(".details-gallery-images .swiper-container", {
        spaceBetween: 10,
        thumbs: {
            swiper: galleryThumbs,
        },
    })

    /*--
        Quick View
    -----------------------------------*/
    var galleryThumbs = new Swiper(".quick-gallery-thumbs .swiper-container", {
        spaceBetween: 20,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        navigation: {
            nextEl: ".quick-gallery-thumbs .swiper-button-next",
            prevEl: ".quick-gallery-thumbs .swiper-button-prev",
        },
        breakpoints: {
            0: {
                spaceBetween: 10,
                slidesPerView: 3,
            },
            576: {
                slidesPerView: 4,
            },
        },
    })
    var galleryTop = new Swiper(".quick-gallery-images .swiper-container", {
        spaceBetween: 10,
        thumbs: {
            swiper: galleryThumbs,
        },
    })

    /*--
        Product Quantity Activation
    -----------------------------------*/
    $(".add").on("click", function () {
        if ($(this).prev().val()) {
            $(this)
                .prev()
                .val(+$(this).prev().val() + 1)
        }
    })
    $(".sub").on("click", function () {
        if ($(this).next().val() > 1) {
            if ($(this).next().val() > 1)
                $(this)
                    .next()
                    .val(+$(this).next().val() - 1)
        }
    })

    /*--
		Rating Script
	-----------------------------------*/

    $("#rating li").on("mouseover", function () {
        var onStar = parseInt($(this).data("value"), 10)
        var siblings = $(this).parent().children("li.star")
        Array.from(siblings, function (item) {
            var value = item.dataset.value
            var child = item.firstChild
            if (value <= onStar) {
                child.classList.add("hover")
            } else {
                child.classList.remove("hover")
            }
        })
    })

    $("#rating").on("mouseleave", function () {
        var child = $(this).find("li.star i")
        Array.from(child, function (item) {
            item.classList.remove("hover")
        })
    })

    $("#rating li").on("click", function (e) {
        var onStar = parseInt($(this).data("value"), 10)
        var siblings = $(this).parent().children("li.star")
        Array.from(siblings, function (item) {
            var value = item.dataset.value
            var child = item.firstChild
            if (value <= onStar) {
                child.classList.remove("hover", "fa-star-o")
                child.classList.add("fa-star")
            } else {
                child.classList.remove("fa-star")
                child.classList.add("fa-star-o")
            }
        })
    })

    /*--
        Odometer Activation 
    -----------------------------------*/
    if ($(".odometer").length) {
        var elemOffset = $(".odometer").offset().top
        var winHeight = $(window).height()
        if (elemOffset < winHeight) {
            $(".odometer").each(function () {
                $(this).html($(this).data("count-to"))
            })
        }
        $(window).on("scroll", function () {
            var elemOffset = $(".odometer").offset().top
            function winScrollPosition() {
                var scrollPos = $(window).scrollTop(),
                    winHeight = $(window).height()
                var scrollPosition = Math.round(scrollPos + winHeight / 1.2)
                return scrollPosition
            }
            if (elemOffset < winScrollPosition()) {
                $(".odometer").each(function () {
                    $(this).html($(this).data("count-to"))
                })
            }
        })
    }

    /*--
        Checkout Account Active
    -----------------------------------*/
    $("#account").on("click", function () {
        if ($("#account:checked").length > 0) {
            $(".checkout-account").slideDown()
        } else {
            $(".checkout-account").slideUp()
        }
    })

    /*--
        Checkout Shipping Active
    -----------------------------------*/
    $("#shipping").on("click", function () {
        if ($("#shipping:checked").length > 0) {
            $(".checkout-shipping").slideDown()
        } else {
            $(".checkout-shipping").slideUp()
        }
    })

    /*--
        Checkout Payment Active
    -----------------------------------*/
    var checked = $(".payment-radio input:checked")
    if (checked) {
        $(checked).siblings(".payment-details").slideDown(500)
    }
    $(".payment-radio input").on("change", function () {
        $(".payment-details").slideUp(500)
        $(this).siblings(".payment-details").slideToggle(500)
    })
})(jQuery)



function deleteAddress(addressId) {
    Swal.fire({
        title: 'Are you sure?',
        text: 'This product will be removed',
        icon: 'question',
        reverseButtons: true,
        confirmButtonText: 'Yes',
        showCancelButton: true,
        confirmButtonColor: '#1e6e2c',
        cancelButtonColor: '#97a399',
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('/deleteaddress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ addressId: addressId }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        $('#addrassArea').load('/profile #addrassArea');
                    } else {
                        alert('Error deleting address. Please try again.');
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    })
}




const editForm = document.getElementById('editForm');
editForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (editValidate()) {
        editAddress();
    }
});
const editAddressModal = document.getElementById('editAddressModal');
const closeEditModalButton = document.getElementById('closeEditModal');


function openEditModal(addressId, name, address, landmark, state, city, pincode, phone, email) {
    document.querySelector('[name="editName"]').value = name;
    document.querySelector('[name="editAddress"]').value = address;
    document.querySelector('[name="editLandmark"]').value = landmark;
    document.querySelector('[name="editState"]').value = state;
    document.querySelector('[name="editCity"]').value = city;
    document.querySelector('[name="editPincode"]').value = pincode;
    document.querySelector('[name="editPhone"]').value = phone;
    document.querySelector('[name="editEmail"]').value = email;

    document.getElementById('editAddressId').value = addressId;

    editAddressModal.style.display = 'block';
}

closeEditModalButton.addEventListener('click', function () {
    editAddressModal.style.display = 'none';
});

function editAddress() {
    const formData = $('#editForm').serialize();

    // Event listener to submit the Edit Address form via Ajax
    $('#editForm').submit(function (event) {
        event.preventDefault(); // Prevent the form from submitting normally
        console.log("hiiiii");

        const formData = $(this).serialize();
        console.log("nnnnnnnnnnnnnnnnnnnn", formData);

        // Send the Ajax request
        $.ajax({
            type: 'POST',
            url: '/editaddress', // Update with your server endpoint
            data: formData,
            success: function (data) {
                if (data.success == true) {
                    console.log(data);
                    $('#addrassArea').load('/profile #addrassArea')
                    editAddressModal.style.display = 'none';
                    $('.modal-backdrop').remove();
                    Swal.fire({
                        icon: 'success',
                        title: 'Address Added Successfully',
                        text: 'Your address has been added successfully.',
                    });

                } else {
                    console.error('Error updating address');
                }
            },
            error: function (error) {
                console.error('Ajax error:', error);
            }
        });
    });
}




function updateAddress() {
    const formData = $('#myForm').serialize();

    $.ajax({
        url: '/addressform',
        type: 'POST',
        data: formData,
        success: function (data) {
            if (data.add === true) {
                $('#addrassArea').load('/profile #addrassArea', function () {
                    $('#addAddressModal').modal('hide');
                    $('.modal-backdrop').remove();
                    Swal.fire({
                        icon: 'success',
                        title: 'Address Added Successfully',
                        text: 'Your address has been added successfully.',
                    });
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'There was a problem adding your address!',
                });
            }

            const modal = document.getElementById('addAddressModal');
            modal.style.display = 'none';
        },
        error: function (error) {
            // Handle errors
            console.error('Error:', error);
        }
    });
}


document.addEventListener('DOMContentLoaded', function () {
    const showModalButton = document.getElementById('showModalButton');
    const modal = document.getElementById('addAddressModal');
    const closeModalButton = document.getElementById('closeModal');

    showModalButton.addEventListener('click', function () {
        modal.style.display = 'block';
    });

    closeModalButton.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

});

const myForm = document.getElementById('myForm');
myForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (validateForm()) {
        updateAddress();
    }
});


function validateForm() {
    const name = validateField('name', 'Name must contain only letters');
    const address = validateField('address', 'Address is required');
    const landmark = validateField('landmark', 'Landmark must contain only letters and numbers');
    const state = validateField('state', 'State is required');
    const city = validateField('city', 'City is required');
    const pincode = validatePincode();
    const phone = validatePhone();
    const email = validateEmail();

    return name && address && landmark && state && city && pincode && phone && email;
}

function validateField(fieldName, errorMessage) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    const value = field.value.trim();
    const errorTag = document.getElementById(`${fieldName}Error`);

    if (!value) {
        showError(errorTag, errorMessage);
        return false;
    }

    if (fieldName === 'name' && !/^[a-zA-Z\s]*$/.test(value)) {
        showError(errorTag, 'Name must contain only letters');
        return false;
    }

    if (fieldName === 'landmark' && !/^[a-zA-Z0-9\s]*$/.test(value)) {
        showError(errorTag, 'Landmark must contain only letters and numbers');
        return false;
    }

    hideError(errorTag);
    return true;
}

function validatePincode() {
    const pincodeField = document.querySelector('[name="pincode"]');
    const pincode = pincodeField.value.trim();
    const errorTag = document.getElementById('pincodeError');

    if (!pincode) {
        showError(errorTag, 'Pincode is required');
        return false;
    }

    if (!/^\d{6}$/.test(pincode)) {
        showError(errorTag, 'Pincode must be a 6-digit number');
        return false;
    }

    hideError(errorTag);
    return true;
}

function validatePhone() {
    const phoneField = document.querySelector('[name="phone"]');
    const phone = phoneField.value.trim();
    const errorTag = document.getElementById('mobileError');

    if (!phone) {
        showError(errorTag, 'Phone is required');
        return false;
    }

    if (!/^\d{10}$/.test(phone)) {
        showError(errorTag, 'Phone must be a 10-digit number');
        return false;
    }

    hideError(errorTag);
    return true;
}

function validateEmail() {
    const emailField = document.querySelector('[name="email"]');
    const email = emailField.value.trim();
    const errorTag = document.getElementById('emailError');

    if (!email) {
        showError(errorTag, 'Email is required');
        return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        showError(errorTag, 'Invalid email address');
        return false;
    }

    hideError(errorTag);
    return true;
}

function showError(errorTag, errorMessage) {
    if (!errorTag) {
        const fieldName = errorTag.id.replace('Error', '');
        const field = document.querySelector(`[name="${fieldName}"]`);
        const errorTag = document.createElement('p');
        errorTag.id = `${fieldName}Error`;
        errorTag.classList.add('error-message');
        field.parentNode.appendChild(errorTag);
    }

    errorTag.innerText = errorMessage;
}

function hideError(errorTag) {
    if (errorTag) {
        errorTag.innerText = '';
    }
}











function editValidate() {
    const name = validateField('editName', 'Name must contain only letters');
    const address = validateField('editAddress', 'Address is required');
    const landmark = validateField('editLandmark', 'cannot be empty');
    const state = validateField('editState', 'State is required');
    const city = validateField('editCity', 'City is required');
    const pincode = editValidatePincode();
    const phone = editValidatePhone();
    const email = editValidateEmail();

    return name && address && landmark && state && city && pincode && phone && email;
}

function validateField(fieldName, errorMessage) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    const value = field.value.trim();
    const errorTag = document.getElementById(`${fieldName}Error`);

    if (!value) {
        showError(errorTag, errorMessage);
        return false;
    }

    if (fieldName === 'name' && !/^[a-zA-Z\s]*$/.test(value)) {
        showError(errorTag, 'Name must contain only letters');
        return false;
    }

    if (fieldName === 'landmark' && !/^[a-zA-Z0-9\s]*$/.test(value)) {
        showError(errorTag, 'Landmark must contain only letters and numbers');
        return false;
    }

    hideError(errorTag);
    return true;
}

function editValidatePincode() {
    const pincodeField = document.querySelector('[name="editPincode"]');
    const pincode = pincodeField.value.trim();
    const errorTag = document.getElementById('editPincodeError');

    if (!pincode) {
        showError(errorTag, 'Pincode is required');
        return false;
    }

    if (!/^\d{6}$/.test(pincode)) {
        showError(errorTag, 'Pincode must be a 6-digit number');
        return false;
    }

    hideError(errorTag);
    return true;
}

function editValidatePhone() {
    const phoneField = document.querySelector('[name="editPhone"]');
    const phone = phoneField.value.trim();
    const errorTag = document.getElementById('editPhoneError');

    if (!phone) {
        showError(errorTag, 'Phone is required');
        return false;
    }

    if (!/^\d{10}$/.test(phone)) {
        showError(errorTag, 'Phone must be a 10-digit number');
        return false;
    }

    hideError(errorTag);
    return true;
}

function editValidateEmail() {
    const emailField = document.querySelector('[name="editEmail"]');
    const email = emailField.value.trim();
    const errorTag = document.getElementById('editEmailError');

    if (!email) {
        showError(errorTag, 'Email is required');
        return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        showError(errorTag, 'Invalid email address');
        return false;
    }

    hideError(errorTag);
    return true;
}

function showError(errorTag, errorMessage) {
    if (!errorTag) {
        const fieldName = errorTag.id.replace('Error', '');
        const field = document.querySelector(`[name="${fieldName}"]`);
        const errorTag = document.createElement('p');
        errorTag.id = `${fieldName}Error`;
        errorTag.classList.add('error-message');
        field.parentNode.appendChild(errorTag);
    }

    errorTag.innerText = errorMessage;
}

function hideError(errorTag) {
    if (errorTag) {
        errorTag.innerText = '';
    }
}




function showusereditmodal() {
    $('#editProfileModal').modal('show');
}




function validateEditProfileForm() {
    var name = document.getElementById('editName').value;
    var phone = document.getElementById('editPhone').value;

    // Reset previous error messages
    document.getElementById('usernameError').innerText = '';
    document.getElementById('phoneError').innerText = '';

    // Validate name
    if (name.trim() === '') {
        document.getElementById('usernameError').innerText = 'Name cannot be empty';
        return false;
    }

    // Validate phone number
    if (!/^\d{10}$/.test(phone)) {
        document.getElementById('phoneError').innerText = 'Invalid mobile number';
        return false;
    }

    return true; // Form submission allowed
}


    
function copyToClipboard() {
  // Select the referral code text
  var referralCodeElement = document.getElementById('referralCode');
  var range = document.createRange();
  range.selectNode(referralCodeElement);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);

  // Copy the text to clipboard
  document.execCommand('copy');

  window.getSelection().removeAllRanges();
  document.getElementById("copyLink").querySelector("i").classList.replace("bi-clipboard", "bi-check-circle");

}
