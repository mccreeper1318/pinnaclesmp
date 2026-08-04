(function(){
  const newsArticles = [
    ['plugins','Announcement','July 2, 2026','Recent Plugin Updates and Additions','<p>Pinnacle SMP added several custom plugins and restored key community tools to make the server safer, easier to manage, and more connected across Minecraft, Discord, and the website.</p><ul class="icon-list"><li><strong>FragGuard:</strong> logs world changes and supports investigations and rollbacks.</li><li><strong>FragStealers:</strong> protects storage and supports player mailboxes.</li><li><strong>PinnacleAFK:</strong> displays and announces AFK status with configurable protection.</li><li><strong>PinnacleShop:</strong> provides protected player shops.</li><li><strong>PinnacleStats:</strong> exports current player statistics to the website.</li><li><strong>squaremap, DeathsToDiscord, and LastSeenToDiscord:</strong> restored mapping and Discord information.</li></ul>'],
    ['rollback','News','June 24, 2026','Griefing Incident and Rollback','<p>A serious griefing incident affected spawn and several player bases. The server was restored using the June 20 save so damaged areas could be recovered cleanly.</p><p>FragGuard was then created to log block changes, explosions, fire spread, liquids, pistons, and other world activity, allowing staff to investigate and roll back smaller areas without restoring the entire server.</p>'],
    ['paper','Update','June 22, 2026','We Have Updated to Paper 26.2!','<p>Pinnacle SMP moved back to Paper and updated to Paper 26.2: Chaos Cubed. The move restored plugin support while keeping ordinary survival gameplay mostly vanilla.</p><p>DeathsToDiscord and LastSeenToDiscord returned first, followed by the map and other custom community tools as compatibility became available.</p>'],
    ['june-awards','Announcement','June 1, 2026','June 2026 Award Winners Announced','<p>nicholattee won the Member Base Highlight, mermaidxellie won the Gameplay Award, and Atlaskytan and mermaidxellie tied for the Community Award.</p><p>These awards recognized builds, gameplay contributions, and positive community involvement during May 2026.</p>'],
    ['gallery-update','Announcement','May 28, 2026','Gallery Update','<p>The Season 12 gallery received a folder-style layout to make its growing screenshot archive easier to browse.</p><p>MBH galleries were organized by month and winner, while the Et al section remained available for other Season 12 community moments.</p>'],
    ['wait-26-2','Community Vote','May 6, 2026','Community Votes to Wait for 26.2','<p>The community voted 0–5 to wait for Paper 26.2 instead of moving temporarily to Paper 26.1.2.</p><p>The decision avoided a major server change immediately before another update and gave the server a cleaner upgrade path.</p>'],
    ['may-awards','Announcement','May 4, 2026','Monthly Member Awards','<p>Atlaskytan and McCreeper1318 tied for Member Base Highlight. Kananers won the Gameplay Award, and McCreeper1318 won the Community Award.</p>'],
    ['legacy','Announcement','April 24, 2026','New Legacy Members','<p>mermaidxellie and Atlaskytan were promoted to Legacy Members for consistent participation, contributions across Seasons 11 and 12, and their growth within the community.</p>'],
    ['season-start','Announcement','April 14, 2026','Season 12 Has Begun','<p>Season 12 officially launched with a new world and a fresh opportunity to explore, build, and grow together.</p><p>A temporary world border was introduced to keep early progression connected, resources accessible, and community activity concentrated.</p>'],
    ['update-progress','Announcement','April 6, 2026','Update Still In Progress','<p>Paper developers released alpha builds for 26.1.1 but had not announced a stable-build date.</p><p>The Minecraft source-code deobfuscation and world-save changes made this a particularly large server update, so Pinnacle continued waiting for a safe and stable release.</p>'],
    ['ranks','Announcement','March 24, 2026','Ranks System Update','<p>Rank advancement was changed to better reflect activity, contribution, conduct, collaboration, and community involvement instead of relying only on time played.</p><p>Promotions are reviewed by staff and are no longer automatic.</p>']
  ];

  function rebuildNews(){
    if (!/\/news\.html$/.test(location.pathname) && location.pathname !== '/news.html') return;
    const box = document.querySelector('main.content .box-body');
    if (!box) return;
    box.innerHTML = `<h1>Server News Archive</h1><p>Open an article to read it. Older stories remain available without making the page excessively long.</p><div class="news-archive">${newsArticles.map((a,i)=>`<details class="news-archive-item" id="${a[0]}"${i===0?' open':''}><summary><span><span class="news-date">${a[2].toUpperCase()}</span><strong>${a[3]}</strong></span><span class="archive-tag">${a[1]}</span></summary><div class="news-archive-body">${a[4]}</div></details>`).join('')}</div>`;
  }

  const ranks = [
    ['Founding Members','founder',[['McCreeper1318','McCreeper1318','McCreeper1318.png'],['JohnnyKilroy','JohnnyKilroy','JohnnyKilroy.png'],['Piff','Piff',null],['Jeff','Jeff',null]]],
    ['Admin','admin',[['Atlaskytan','Atlaskytan','Atlaskytan.png']]],
    ['Legacy Members','legacy',[['BeansUniverse','BeansUniverse','BeansUniverse.png'],['MoeBe10','MoeBe10','MoeBe10.png'],['rad1709 (IronArmored)','rad1709','IronArmored.png','rad1709,IronArmored'],['GodlyCris','GodlyCris','GodlyCris.png'],['mermaidxellie','mermaidxellie','mermaidxellie.png'],['BadFiction','BadFiction','BadFiction.png']]],
    ['Full Members','full',[['pinapple_pete','pinapple_pete','pinapple_pete.png'],['misfiired','misfiired','misfiired.png'],['notnownotnever','notnownotnever','notnownotnever.png'],['Poplare (Shiny)','Poplare','Poplare.png','Poplare,Shiny'],['Beslife','Beslife','Beslife.png'],['nicholattee (Nic/Duck)','nicholattee','nicholattee.png','nicholattee,Nic,Duck'],['StirfrySurprise','StirfrySurprise','StirfrySurprise.png'],['kylethecaver','kylethecaver','kylethecaver.png'],['Kananers','Kananers','Kananers.png'],['BACONcuzBACON','BACONcuzBACON','BACONcuzBACON.png'],['Aryamii','Aryamii','Aryamii.png'],['t0w0fu','t0w0fu','t0w0fu.png'],['BraneFX','BraneFX','BraneFX.png'],['Diissonance','Diissonance','Diissonance.png'],['Someperso','Someperso','Someperso.png'],['Ratatuii20','Ratatuii20','Ratatuii20.png'],['SweetBunny16','SweetBunny16','SweetBunny16.png']]],
    ['New Members','new',[['NoctuLocktoo','NoctuLocktoo','NoctuLocktoo.png'],['ImThaBLADE','ImThaBLADE','ImThaBLADE.png'],['Von420','Von420','Von420.png'],['Poker118','Poker118','poker118.png'],['laurentziu143','laurentziu','laurentziu143.png'],['NateOnGuitar','NateOnGuitar',null],['blade326','blade326',null],['Dino353','Dino353',null],['Towmanger','Towmanger',null],['hor1z3n','hor1z3n',null]]],
    ['Banned','banned',[['Ciupi8983','Ciupi8983','Ciupi8983.png'],['Kelly_E','Kelly_E','Kelly_E.png']]]
  ];

  function rebuildMembers(){
    if (!/\/members\.html$/.test(location.pathname) && location.pathname !== '/members.html') return;
    const box = document.querySelector('main.content .box-body');
    if (!box) return;
    box.innerHTML = `<h1>Pinnacle SMP Members</h1><p>Every member card opens that player’s profile and current PinnacleStats dashboard.</p>${ranks.map(([title,cls,people])=>`<section class="roster-section"><h2>${title}<span class="roster-count">${people.length}</span></h2><div class="roster-grid">${people.map(([display,file,img,aliases])=>`<a class="roster-name rank-${cls}" href="profiles/${file}.html" data-member-card data-username="${file==='laurentziu'?'laurentziu143':file}"${aliases?` data-usernames="${aliases}"`:''}>${img?`<img src="assets/player_heads/${img}" alt="${display} player head">`:'<span class="roster-placeholder">?</span>'}<span class="roster-text"><strong>${display}</strong><small><span class="mini-status-dot"></span><span data-member-status>Offline</span></small></span></a>`).join('')}</div></section>`).join('')}<p class="source-note">Roster information was last updated on August 4, 2026. Member profiles are updated regularly.</p>`;
  }

  function rebuildGalleryLanding(){
    if (!/\/gallery\.html$/.test(location.pathname) && location.pathname !== '/gallery.html') return;
    const box = document.querySelector('main.content .box-body');
    if (!box) return;
    box.innerHTML = `<h1>Pinnacle SMP Galleries</h1><p>Browse the complete screenshot archives from the current and previous seasons.</p><div class="gallery-season-cards"><a class="gallery-season-card" href="gallery-season-12.html"><img src="https://res.cloudinary.com/ds4p9jsuf/image/upload/v1779704250/spawnportal_uu837o.png" alt="Season 12 gallery cover"><span><strong>Season 12 Gallery</strong><small>Browse folders, featured builds, and community screenshots</small></span></a><a class="gallery-season-card" href="gallery-season-11.html"><img src="https://res.cloudinary.com/ds4p9jsuf/image/upload/v1777776796/2026-01-26_20.25.19_2_vzvcr1.png" alt="Season 11 gallery cover"><span><strong>Season 11 Gallery</strong><small>Open the complete Season 11 screenshot archive</small></span></a></div>`;
  }


window.PinnacleMajorContent={rebuildNews,rebuildMembers,rebuildGalleryLanding};
})();
