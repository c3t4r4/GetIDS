document.addEventListener("DOMContentLoaded", () => {
  const urlInput = document.getElementById("url");
  const profileIdInput = document.getElementById("profileId");
  const profileNameInput = document.getElementById("profileName");
  const copyUrlBtn = document.getElementById("copyUrl");
  const copyIdBtn = document.getElementById("copyId");
  const copyNameBtn = document.getElementById("copyNameBtn");
  const fetchDataButton = document.getElementById("fetchData");
  const systemVersion = document.getElementById("systemVersion");

  const manifest = chrome.runtime.getManifest();
  systemVersion.textContent = `Versão: ${manifest.version}`;

  fetchDataButton.addEventListener("click", () => {
    showSpinner(fetchDataButton, "Consultar");

    urlInput.value = "";
    profileIdInput.value = "";
    profileNameInput.value = "";

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
  });

  copyNameBtn.addEventListener("click", () => {
    showSpinner(copyNameBtn, "Copiar Nome");
    navigator.clipboard.writeText(profileNameInput.value);
    // alert("URL copiada!");
  });

  copyUrlBtn.addEventListener("click", () => {
    showSpinner(copyUrlBtn, "Copiar URL");
    navigator.clipboard.writeText(urlInput.value);
    // alert("URL copiada!");
  });

  copyIdBtn.addEventListener("click", () => {
    showSpinner(copyIdBtn, "Copiar Profile ID");

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

  function showSpinner(button, originalText, duration = 500) {
    // Substituir o texto do botão por um spinner
    button.innerHTML = `
      <div class="flex justify-center items-center w-full">
        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      </div>
    `;

    // Restaurar o texto original após o tempo especificado
    setTimeout(() => {
      button.innerHTML = originalText;
    }, duration);
  }
});
