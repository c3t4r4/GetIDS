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

  // Função principal para buscar os dados após recarregar a página
  function fetchDataAfterReload() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];

      chrome.scripting.executeScript(
        { target: { tabId: tab.id }, function: extractData },
        (results) => {
          if (results && results[0] && results[0].result) {
            const { url, profileId, profileName } = results[0].result;
            urlInput.value = url;
            profileIdInput.value = profileId;
            profileNameInput.value = profileName;
          }
        }
      );
    });
  }

  // Recarregar a página e buscar os dados após a recarga
  fetchDataButton.addEventListener("click", () => {
    showSpinner(fetchDataButton, "Consultando...");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];

      chrome.tabs.reload(tab.id, {}, () => {
        // Aguardar alguns segundos para garantir que o DOM esteja pronto
        setTimeout(fetchDataAfterReload, 2000);
      });
    });
  });

  // Função para extrair dados do DOM
  function extractData() {
    const page = window.location.href;

    const regexFace = /facebook.com/i;
    const regexInsta = /instagram.com/i;

    let profileId = "Não encontrado";

    if (regexFace.test(page)) {
      try {
        const trackingRegex = /"tracking":\s*"({.*?})"/;
        const trackingMatch =
          document.documentElement.innerHTML.match(trackingRegex);
        if (trackingMatch) {
          const decodedJson = trackingMatch[1].replace(/\\"/g, '"');
          const trackingData = JSON.parse(decodedJson);
          console.table(trackingMatch);
          console.log(trackingData);

          profileId = trackingData.profile_id || "Não encontrado";
        }
      } catch (error) {
        console.log(error);
        const profileIdRegex = /"profile_id":"(\d+)"/;

        const profileIdMatch =
          document.documentElement.innerHTML.match(profileIdRegex);

        profileId = profileIdMatch ? profileIdMatch[1] : "Não encontrado";
      }
    } else if (regexInsta.test(page)) {
      try {
        const propsMatch =
          document.documentElement.innerHTML.match(/"props":\s*({.*?})/);
        if (propsMatch) {
          const decodedJson = trackingMatch[1] + "}}".replace(/\\"/g, '"');
          const propsData = JSON.parse(decodedJson);
          profileId =
            propsData.page_logging.params.profile_id || "Não encontrado";
        }
      } catch (error) {
        const profileIdRegex = /"profile_id":"(\d+)"/;

        const profileIdMatch =
          document.documentElement.innerHTML.match(profileIdRegex);

        profileId = profileIdMatch ? profileIdMatch[1] : "Não encontrado";
      }
    } else {
      const profileIdRegex = /"profile_id":"(\d+)"/;

      const profileIdMatch =
        document.documentElement.innerHTML.match(profileIdRegex);

      profileId = profileIdMatch ? profileIdMatch[1] : "Não encontrado";
    }

    const profileNameRegex = /"user":\s*{[^}]*"name":"([^"]+)"/;

    const profileNameMatch =
      document.documentElement.innerHTML.match(profileNameRegex);

    const profileName = profileNameMatch
      ? JSON.parse(`"${profileNameMatch[1]}"`)
      : "";

    return { url: window.location.href, profileId, profileName };
  }

  // Funções de copiar para a área de transferência
  copyNameBtn.addEventListener("click", () => {
    showSpinner(copyNameBtn, "Copiar Nome");
    navigator.clipboard.writeText(profileNameInput.value);
  });

  copyUrlBtn.addEventListener("click", () => {
    showSpinner(copyUrlBtn, "Copiar URL");
    navigator.clipboard.writeText(urlInput.value);
  });

  copyIdBtn.addEventListener("click", () => {
    showSpinner(copyIdBtn, "Copiar Profile ID");
    navigator.clipboard.writeText(profileIdInput.value);
  });

  // Função para exibir o spinner no botão
  function showSpinner(button, originalText, duration = 500) {
    button.innerHTML = `
      <div class="flex justify-center items-center w-full">
        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      </div>
    `;

    setTimeout(() => {
      button.innerHTML = originalText;
    }, duration);
  }
});
