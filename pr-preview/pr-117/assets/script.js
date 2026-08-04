
(function(){
  const year = document.querySelector("[data-year]");
  if(year) year.textContent = new Date().getFullYear();

  const counter = document.querySelector("[data-counter]");
  if(counter){
    let n = Number(localStorage.getItem("pinnacleRetroHits") || "0002012");
    n += 1;
    localStorage.setItem("pinnacleRetroHits", String(n));
    counter.textContent = String(n).padStart(7,"0");
  }

  const clock = document.querySelector("[data-clock]");
  function tick(){
    if(clock){
      const d = new Date();
      clock.textContent = d.toLocaleString([], {
        weekday:"short", month:"short", day:"numeric",
        hour:"2-digit", minute:"2-digit", second:"2-digit"
      });
    }
  }
  tick();
  setInterval(tick,1000);

  document.querySelectorAll("[data-copy-ip]").forEach(button => {
    button.addEventListener("click", async () => {
      const ip = button.getAttribute("data-copy-ip") || "pinnaclesmp.mcserv.fun";
      let copied = false;
      try{
        await navigator.clipboard.writeText(ip);
        copied = true;
      }catch(e){
        const field = document.createElement("textarea");
        field.value = ip;
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        copied = document.execCommand("copy");
        field.remove();
      }
      const output = button.parentElement.querySelector(".copy-result");
      if(output){
        output.textContent = copied ? "IP COPIED!" : "COPY FAILED — SELECT THE IP ABOVE";
        setTimeout(() => output.textContent = "", 2500);
      }
    });
  });

  const statusText = document.querySelectorAll("[data-server-status]");
  const playerCount = document.querySelectorAll("[data-player-count]");
  const serverVersion = document.querySelectorAll("[data-server-version]");
  const statusDots = document.querySelectorAll("[data-live-dot]");

  function setStatus(state, online, max, version){
    statusText.forEach(el => el.textContent = state);
    playerCount.forEach(el => el.textContent =
      Number.isFinite(online) && Number.isFinite(max) ? `${online} / ${max}` : "— / 20");
    serverVersion.forEach(el => el.textContent = version || "Paper 26.2");
    statusDots.forEach(dot => {
      dot.classList.remove("offline","unknown");
      if(state === "OFFLINE") dot.classList.add("offline");
      if(state === "STATUS UNAVAILABLE") dot.classList.add("unknown");
    });
  }

  async function refreshStatus(){
    try{
      const response = await fetch("https://api.mcsrvstat.us/3/pinnaclesmp.mcserv.fun", {
        cache:"no-store"
      });
      if(!response.ok) throw new Error("Status request failed");
      const data = await response.json();
      if(!data.online){
        setStatus("OFFLINE", 0, data.players?.max || 20, data.version || "Paper 26.2");
        return;
      }
      setStatus(
        "ONLINE",
        Number(data.players?.online || 0),
        Number(data.players?.max || 20),
        data.version || "Paper 26.2"
      );
    }catch(error){
      setStatus("STATUS UNAVAILABLE", NaN, NaN, "Paper 26.2");
    }
  }
  if(statusText.length || playerCount.length || serverVersion.length){
    refreshStatus();
    setInterval(refreshStatus, 60000);
  }

  const guestbookForm = document.querySelector("#guestbook-form");
  const entriesBox = document.querySelector("#guestbook-entries");
  if(guestbookForm && entriesBox){
    const seed = [
      {name:"Pinnacle Webmaster", realm:"Season 12", message:"Welcome to the retro Pinnacle SMP guestbook!"},
      {name:"A Passing Adventurer", realm:"The Overworld", message:"Build higher!"}
    ];
    let entries;
    try{
      entries = JSON.parse(localStorage.getItem("pinnacleRetroGuestbook") || "null") || seed;
    }catch(e){ entries = seed; }

    function safe(text){
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML;
    }
    function render(){
      entriesBox.innerHTML = entries.map(e => `
        <div class="guestbook-entry">
          <div class="guestbook-meta">${safe(e.name)} from ${safe(e.realm || "Parts Unknown")}</div>
          <div>${safe(e.message)}</div>
        </div>
      `).join("");
    }
    render();

    guestbookForm.addEventListener("submit", function(ev){
      ev.preventDefault();
      const data = new FormData(guestbookForm);
      const name = String(data.get("name") || "").trim();
      const realm = String(data.get("realm") || "").trim();
      const message = String(data.get("message") || "").trim();
      if(!name || !message){
        alert("Please enter your name and a message.");
        return;
      }
      entries.unshift({name,realm,message});
      entries = entries.slice(0,20);
      localStorage.setItem("pinnacleRetroGuestbook", JSON.stringify(entries));
      guestbookForm.reset();
      render();
      alert("Thanks for signing the guestbook!");
    });

    const clearButton = document.querySelector("#clear-guestbook");
    if(clearButton){
      clearButton.addEventListener("click", function(){
        if(confirm("Clear local guestbook entries and restore the demo entries?")){
          entries = seed;
          localStorage.removeItem("pinnacleRetroGuestbook");
          render();
        }
      });
    }
  }
})();
