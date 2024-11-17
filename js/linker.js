document.addEventListener("DOMContentLoaded", function () {
  // 認証ボタンリストを取得
  const buttons = document.querySelectorAll("button[data-click]");

  // 各ボタンにイベントリスナーを追加
  buttons.forEach(button => {
    button.addEventListener("click", async function () {
      const clickParam = button.getAttribute("data-click");

      // 現在のURLと初期設定
      var currentUrl = window.location.href;
      var newFqdn = "webauth.wifiservice.jp";
      var newUrl = new URL(currentUrl);
      var urlParams = new URLSearchParams(newUrl.search);

      // `click` パラメータにボタン固有の値を設定
      urlParams.set('click', clickParam);

      // 呼び出し元の`vendor`パラメータを取得
      const vendorParam = urlParams.get('vendor');
      let calledParam = "";

      // `vendor`の値に応じて`called`または`apmac`の値を設定
      if (vendorParam === "relay2") {
        calledParam = urlParams.get('apmac');
      } else {
        calledParam = urlParams.get('called');
      }

      if (!calledParam) {
        console.error("Required parameter `called` or `apmac` is missing.");
        return;
      }

      // Cloudflare Workerで指定されたKVの値を取得するAPIエンドポイント
      const kvFetchUrl = `https://sd.wiffy.me/getSubdir?called=${calledParam}`;
      let subdir = "";

      try {
        const response = await fetch(kvFetchUrl);
        if (response.ok) {
          const data = await response.json();
          subdir = data.subdir;
        } else {
          console.error("Failed to fetch KV value:", response.statusText);
          return;
        }
      } catch (error) {
        console.error("Error fetching KV value:", error);
        return;
      }

      // HTTPSに強制する
      if (newUrl.protocol === "http:") {
        newUrl.protocol = "https:";
      }

      // ポート番号を削除
      newUrl.port = "";

      // 新しいホスト名（FQDN）を設定
      newUrl.hostname = newFqdn;

      // KVで取得したサブディレクトリを設定
      if (subdir && !newUrl.pathname.includes(subdir)) {
        newUrl.pathname = `/${subdir}` + newUrl.pathname;
      }

      // 修正したクエリパラメータをURLに適用
      newUrl.search = urlParams.toString();

      // リダイレクトを実行
      window.location.href = newUrl.href;
    });
  });
});
