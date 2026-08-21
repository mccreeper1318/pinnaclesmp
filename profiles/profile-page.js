(() => {
  const profiles = [
    { key: 'McCreeper1318', player: 'McCreeper1318', head: 'McCreeper1318.png' },
    { key: 'JohnnyKilroy', player: 'JohnnyKilroy', head: 'JohnnyKilroy.png' },
    { key: 'Piff', player: 'Piff' },
    { key: 'Jeff', player: 'Jeff' },
    { key: 'Atlaskytan', player: 'Atlaskytan', head: 'Atlaskytan.png' },
    { key: 'BeansUniverse', player: 'BeansUniverse', head: 'BeansUniverse.png' },
    { key: 'MoeBe10', player: 'MoeBe10', head: 'MoeBe10.png' },
    { key: 'rad1709', player: 'rad1709', head: 'IronArmored.png', nickname: 'IronArmored', aliases: ['IronArmored'] },
    { key: 'GodlyCris', player: 'GodlyCris', head: 'GodlyCris.png' },
    { key: 'mermaidxellie', player: 'mermaidxellie', head: 'mermaidxellie.png' },
    { key: 'BadFiction', player: 'BadFiction', head: 'BadFiction.png' },
    { key: 'pinapple_pete', player: 'pinapple_pete', head: 'pinapple_pete.png' },
    { key: 'misfiired', player: 'misfiired', head: 'misfiired.png' },
    { key: 'notnownotnever', player: 'notnownotnever', head: 'notnownotnever.png' },
    { key: 'Poplare', player: 'Poplare', head: 'Poplare.png', nickname: 'Shiny', aliases: ['Shiny'] },
    { key: 'Beslife', player: 'Beslife', head: 'Beslife.png' },
    { key: 'nicholattee', player: 'nicholattee', head: 'nicholattee.png', nickname: 'Nic / Duck', aliases: ['Nic', 'Duck'] },
    { key: 'StirfrySurprise', player: 'StirfrySurprise', head: 'StirfrySurprise.png' },
    { key: 'kylethecaver', player: 'kylethecaver', head: 'kylethecaver.png' },
    { key: 'Kananers', player: 'Kananers', head: 'Kananers.png' },
    { key: 'BACONcuzBACON', player: 'BACONcuzBACON', head: 'BACONcuzBACON.png' },
    { key: 'Aryamii', player: 'Aryamii', head: 'Aryamii.png' },
    { key: 't0w0fu', player: 't0w0fu', head: 't0w0fu.png' },
    { key: 'BraneFX', player: 'BraneFX', head: 'BraneFX.png' },
    { key: 'Diissonance', player: 'Diissonance', head: 'Diissonance.png' },
    { key: 'Someperso', player: 'Someperso', head: 'Someperso.png' },
    { key: 'Ratatuii20', player: 'Ratatuii20', head: 'Ratatuii20.png' },
    { key: 'SweetBunny16', player: 'SweetBunny16', head: 'SweetBunny16.png' },
    { key: 'laurentziu', player: 'laurentziu143', head: 'laurentziu143.png', aliases: ['laurentziu143'] },
    { key: 'Sleepy_Carson', player: 'Sleepy_Carson', head: 'Sleepy_Carson.png' },
    { key: 'dream1999', player: 'dream1999', head: 'dream1999.png' },
    { key: '2b02', player: '2b02', head: '2b02.png' },
    { key: 'DiamondKiller111', player: 'DiamondKiller111', head: 'DiamondKiller111.png' },
    { key: 'GOTH_LOV3R', player: 'GOTH_LOV3R', head: 'GOTH_LOV3R.png' },
    { key: 'Ciupi8983', player: 'Ciupi8983', head: 'Ciupi8983.png' },
    { key: 'Kelly_E', player: 'Kelly_E', head: 'Kelly_E.png' }
  ];

  const normalize = value => String(value || '').toLowerCase().replace(/[^a-z0-9_]/g, '');
  const lookup = new Map();
  profiles.forEach(profile => {
    [profile.key, profile.player, ...(profile.aliases || [])].forEach(alias => lookup.set(normalize(alias), profile));
  });

  const params = new URLSearchParams(location.search);
  const requested = params.get('player') || '';
  const profile = lookup.get(normalize(requested));
  const message = document.getElementById('profile-message');
  const hero = document.getElementById('profile-hero');
  const headSlot = document.getElementById('profile-head-slot');
  const name = document.getElementById('profile-name');
  const status = document.getElementById('profile-status');
  const nickname = document.getElementById('profile-nickname');
  const stats = document.getElementById('profile-stats');

  if (!profile) {
    document.title = 'Profile Not Found | Pinnacle SMP';
    message.hidden = false;
    message.innerHTML = '<h1>Profile Not Found</h1><p>This member profile does not exist or is no longer listed.</p><p><a class="button-90s" href="../members.html">RETURN TO MEMBERS</a></p>';
    return;
  }

  const statusNames = [profile.player, profile.key, ...(profile.aliases || [])].join(',');
  document.title = `${profile.player} | Pinnacle SMP Profile`;
  name.textContent = profile.player;
  status.dataset.usernames = statusNames;
  stats.dataset.player = profile.player;
  stats.dataset.nickname = profile.nickname || '';
  stats.querySelector('.stats-loading').textContent = `Loading latest server statistics for ${profile.player}…`;

  if (profile.head) {
    const image = document.createElement('img');
    image.className = 'profile-player-head';
    image.src = `../assets/player_heads/${encodeURIComponent(profile.head)}`;
    image.alt = `${profile.player} Minecraft player head`;
    image.decoding = 'async';
    headSlot.appendChild(image);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'profile-head-placeholder';
    placeholder.textContent = '?';
    placeholder.setAttribute('aria-label', 'Player head image pending');
    headSlot.appendChild(placeholder);
  }

  if (profile.nickname) {
    nickname.textContent = `Also known as ${profile.nickname}`;
    nickname.hidden = false;
  }

  hero.hidden = false;
  stats.hidden = false;
})();
