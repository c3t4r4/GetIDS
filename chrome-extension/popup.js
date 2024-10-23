document.addEventListener("DOMContentLoaded", () => {
  const urlInput = document.getElementById("url");
  const profileIdInput = document.getElementById("profileId");
  const profileNameInput = document.getElementById("profileName");
  const copyUrlBtn = document.getElementById("copyUrl");
  const copyIdBtn = document.getElementById("copyId");

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];

    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        function: extractProfileId,
      },
      (results) => {
        if (results && results[0] && results[0].result) {
          const { url, profileId } = results[0].result;
          urlInput.value = url;
          profileIdInput.value = profileId;
        }
      }
    );

    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        function: extractProfileName,
      },
      (results) => {
        if (results && results[0] && results[0].result) {
          const { profileName } = results[0].result;
          if (profileName == "") {
            const extractedTitle = tab.title
              .substring(0, tab.title.indexOf("(@"))
              .trim();
            profileNameInput.value = extractedTitle;
          } else {
            // Se o nome for encontrado, exibe normalmente
            profileNameInput.value = profileName;
          }
        }
      }
    );
  });

  copyNameBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(profileNameInput.value);
    // alert("URL copiada!");
  });

  copyUrlBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(urlInput.value);
    // alert("URL copiada!");
  });

  copyIdBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(profileIdInput.value);
    // alert("Profile ID copiado!");
  });

  function extractProfileName() {
    const regex = /"user":\s*{[^}]*"name":"([^"]+)"/;
    const match = document.documentElement.innerHTML.match(regex);
    let profileName = match ? match[1] : "";
    profileName = JSON.parse(`"${profileName}"`);
    return { profileName };
  }

  function extractProfileId() {
    const regex = /"profile_id":"(\d+)"/;
    const match = document.documentElement.innerHTML.match(regex);
    const profileId = match ? match[1] : "Não encontrado";
    return { url: window.location.href, profileId };
  }
});
