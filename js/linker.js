document.addEventListener("DOMContentLoaded", function () {
  // ボタンリストを取得
  const buttons = document.querySelectorAll("button[data-click]");

  // 各ボタンにイベントリスナーを追加
  buttons.forEach(button => {
    button.addEventListener("click", function () {
      // ボタンの `data-click` 属性からパラメータ値を取得
      const clickParam = button.getAttribute("data-click");

      var currentUrl = window.location.href;
      var newFqdn = "webauth.wifiservice.jp";
      var newUrl = new URL(currentUrl);
      var urlParams = new URLSearchParams(newUrl.search);

      // `click` パラメータにボタン固有の値を設定
      urlParams.set('click', clickParam);

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

      // URLにアクセスできるか確認し、エラー時にはアラートを表示
      fetch(newUrl.href, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            // URLがアクセス可能ならリダイレクト
            window.location.href = newUrl.href;
          } else {
            // アクセスできない場合
            alert("The service is undergoing maintenance. Please try again later.");
          }
        })
        .catch(() => {
          // エラーハンドリング
          alert("The service is undergoing maintenance. Please try again later.");
        });
    });
  });
});
