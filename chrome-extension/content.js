// Este script extrai o profile_id da página
(() => {
  const regex = /"profile_id":"(\d+)"/;
  const match = document.documentElement.innerHTML.match(regex);
  if (match) {
    console.log(`Profile ID encontrado: ${match[1]}`);
  } else {
    console.log("Profile ID não encontrado.");
  }
})();

(() => {
  const regex = /"NAME":"([^"]+)"/;
  const match = document.documentElement.innerHTML.match(regex);
  if (match) {
    console.log(`Profile Name encontrado: ${match[1]}`);
  } else {
    console.log("Profile Name não encontrado.");
  }
})();
