document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll("button[data-click]");

  buttons.forEach(button => {
    button.addEventListener("click", async function () {
      const clickParam = button.getAttribute("data-click");
      const currentUrl = window.location.href;
      const newFqdn = "webauth.wifiservice.jp";
      const newUrl = new URL(currentUrl);
      const urlParams = new URLSearchParams(newUrl.search);

      urlParams.set("click", clickParam);

      const vendorParam = urlParams.get("vendor");
      let calledParam = "";

      if (vendorParam === "relay2") {
        calledParam = urlParams.get("apmac");
      } else {
        calledParam = urlParams.get("called");
      }

      // calledParam が存在しない場合の処理
      if (!calledParam) {        
        if (urlParams.get('lang') === 'en') {
          alert("Required parameter missing, please retry.");
        } else {
          alert("ログインに必要な情報が足りません。リトライしてください。");
        }

        // 強制リダイレクト処理
        var timestamp = Date.now();
        var redirectUrl = "http://x.wiffy.me/";
        var redirectUrlWithParams = redirectUrl + "?ts=" + timestamp;
        window.location.replace(redirectUrlWithParams);
        return;
      }

      const kvFetchUrl = `https://sd.wiffy.me/getSubdir?called=${calledParam}`;
      let subdir = "";

      try {
        const response = await fetch(kvFetchUrl);

        if (response.status === 404) {
          const errorData = await response.json();
          alert(`Error: ${errorData.error}`);
          return;
        }

        if (!response.ok) {
          alert(`Unexpected error: ${response.statusText}`);
          return;
        }

        const data = await response.json();
        subdir = data.subdir;

        if (!subdir) {          
          if (urlParams.get('lang') === 'en') {
            alert("The target directory was not returned.");
          } else {
            alert("ターゲットディレクトリが返却されませんでした。");
          }        
          return;
        }

        if (newUrl.protocol === "http:") {
          newUrl.protocol = "https:";
        }

        newUrl.port = "";
        newUrl.hostname = newFqdn;

        if (!newUrl.pathname.includes(subdir)) {
          newUrl.pathname = `/${subdir}` + newUrl.pathname;
        }

        newUrl.search = urlParams.toString();
        window.location.href = newUrl.href;
      } catch (error) {
        console.error("Fetch error:", error);
        if (urlParams.get('lang') === 'en') {
          alert("Failed to connect to the authentication server.");
        } else {
          alert("認証サーバーとの接続に失敗しました。");
        }        
      }
    });
  });
});
