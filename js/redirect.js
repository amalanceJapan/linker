document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("redirectToNewFqdn").addEventListener("click", function () {
    var currentUrl = window.location.href;
    var newFqdn = "webauth.wifiservice.jp";
    var newUrl = new URL(currentUrl);
    var urlParams = new URLSearchParams(newUrl.search);

    // resパラメータが存在しないか、notyetではない場合アラート表示後リダイレクト
    if (!urlParams.has('res') || urlParams.get('res') !== 'notyet') {
      alert("再処理が必要です｜Please retry");

      // リダイレクト先URLにタイムスタンプを付与
      var timestamp = Date.now(); // 現在のタイムスタンプ（ミリ秒）
      var redirectUrl = "http://webauth-external-ping-site.s3.ap-northeast-1.amazonaws.com/error.html";
      var redirectUrlWithTimestamp = redirectUrl + "?ts=" + timestamp;

      window.location.href = redirectUrlWithTimestamp;
      return; // ここで処理を終了
    }

    // Force HTTPS if the protocol is HTTP
    if (newUrl.protocol === "http:") {
      newUrl.protocol = "https:";
    }

    // Remove any port number
    newUrl.port = "";

    // Set the new hostname (FQDN)
    newUrl.hostname = newFqdn;

    // Add the "/cnctor" subdirectory to the pathname if it doesn't already exist
    if (!newUrl.pathname.includes("/cnctor")) {
      newUrl.pathname = "/cnctor" + newUrl.pathname;
    }

    // If 'lang' parameter is not present, add lang=ja
    if (!urlParams.has('lang')) {
      urlParams.set('lang', 'ja');
    }

    // Add 'click=ln' parameter
    urlParams.set('click', 'ln');

    // Apply the modified query parameters back to the URL
    newUrl.search = urlParams.toString();

    // Redirect to the modified URL
    window.location.href = newUrl.href;
  });
});
