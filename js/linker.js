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

      if (!calledParam) {
        alert("Missing required parameter: called or apmac");
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
          alert("No subdirectory returned from API.");
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
        alert("An error occurred while contacting the server.");
      }
    });
  });
});
