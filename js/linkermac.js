最終的にリダイレクトするパスが、https://webauth.wifiservice.jp/cnctor/wp-content/plugins/aaa-data-broker/sites/macaddress/login.php となるように。処理を追加して。

このパス /wp-content/plugins/aaa-data-broker/sites/macaddress/login.php を追加する処理が必要です。もちろんこれまでのパラメタはそのまま付与します。

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("linkermac").addEventListener("click", function () {
    var currentUrl = window.location.href;
    var newFqdn = "webauth.wifiservice.jp";
    var newUrl = new URL(currentUrl);
    var urlParams = new URLSearchParams(newUrl.search);

    // resパラメータが存在しないか、notyetではない場合アラート表示後リダイレクト（避難所ポータル専用）
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

    // Apply the modified query parameters back to the URL
    newUrl.search = urlParams.toString();

    // Redirect to the modified URL
    window.location.href = newUrl.href;
  });
});
