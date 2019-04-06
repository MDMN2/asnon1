const Discord = require("discord.js");
const apex = require('apexlegends')
const client = new Discord.Client();
const prefix = "$";

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
});

client.on('message', async msg => {
  const args = msg.content.slice(prefix.length).split(/ +/g);
  const cmd = args.shift();
  if (cmd === `apex`) {
    let [name, platform, ...rest] = args;
    let page = 0;
    const apexy = async (playerName, playerPlatform) =>{
      if(!["pc", "psn", "xbox"].includes(playerPlatform)) return msg.reply("المنصة التي قدمتها غير صحيحة\nالمنصات المتاحة:\n`pc`\n`psn`\n`xbox`");
      const data = await apex('الكود حقك تجيبه من https://apex.tracker.gg/site-api', playerPlatform, playerName);
      if(data === undefined) return msg.reply("لم استطع ايجاد اللاعب!");
      const embed = new Discord.RichEmbed()
        .setAuthor(`Player: ${data.metadata.platformUserHandle}`)
        .addField(`Level:`, `\`${data.stats.filter(stat=> stat.metadata.key === "Level")[0].displayValue}\``, true)
      if(data.stats.map(stat=> stat.metadata.key === "Kills").includes(true)) embed.addField(`Overall Kills:`, `\`${data.stats.filter(stat=> stat.metadata.key === "Kills")[0].displayValue}\``, true)
      if(data.stats.map(stat=> stat.metadata.key === "Damage").includes(true)) embed.addField(`Damage:`, `\`${data.stats.filter(stat=> stat.metadata.key === "Damage")[0].displayValue}\``, true)
      if(data.stats.map(stat=> stat.metadata.key === "MatchesPlayed").includes(true)) embed.addField(`Matches Played:`, `\`${data.stats.filter(stat=> stat.metadata.key === "MatchesPlayed")[0].displayValue}\``, true)
      if(data.stats.map(stat=> stat.metadata.key === "KillsPerMatch").includes(true)) embed.addField(`Kills Per Match:`, `\`${data.stats.filter(stat=> stat.metadata.key === "KillsPerMatch")[0].displayValue}\``, true)
      if(data.stats.map(stat=> stat.metadata.key === "DamagePerMatch").includes(true)) embed.addField(`Damage Per Match:`, `\`${data.stats.filter(stat=> stat.metadata.key === "DamagePerMatch")[0].displayValue}\``, true)
      if(data.stats.map(stat=> stat.metadata.key === "Kills" && stat.displayRank !== "").includes(true)) embed.addField(`Overall Kills Rank:`, `\`${data.stats.filter(stat=> stat.metadata.key === "Kills")[0].displayRank}\``, true)
      if(data.stats.map(stat=> stat.metadata.key === "Damage" && stat.displayRank !== "").includes(true)) embed.addField(`Damage Rank:`, `\`${data.stats.filter(stat=> stat.metadata.key === "Damage")[0].displayRank}\``, true)
      if(data.stats.map(stat=> stat.metadata.key === "MatchesPlayed" && stat.displayRank !== "").includes(true)) embed.addField(`Matches Played Rank:`, `\`${data.stats.filter(stat=> stat.metadata.key === "MatchesPlayed")[0].displayRank}\``, true)
      if(data.stats.map(stat=> stat.metadata.key === "KillsPerMatch" && stat.displayRank !== "").includes(true)) embed.addField(`Kills Per Match Rank:`, `\`${data.stats.filter(stat=> stat.metadata.key === "KillsPerMatch")[0].displayRank}\``, true)
      if(data.stats.map(stat=> stat.metadata.key === "DamagePerMatch" && stat.displayRank !== "").includes(true)) embed.addField(`Damage Per Match Rank:`, `\`${data.stats.filter(stat=> stat.metadata.key === "DamagePerMatch")[0].displayRank}\``, true)
      if(embed.fields.length / 3 % 2) embed.addBlankField(true);
      let pages = [embed];
      for(key in data.children){
        let legend = data.children[key];
        const legend_embed = new Discord.RichEmbed()
          .setAuthor(`${legend.metadata.legend_name}'s Stats`)
        if(legend.stats.map(stat=> stat.metadata.key === "Kills").includes(true) || (legend.stats.metadata && legend.stats.metadata.key === "Kills")) legend_embed.addField(`Overall Kills:`, `\`${legend.stats.filter(stat=> stat.metadata.key === "Kills")[0].displayValue}\``, true)
        if(legend.stats.map(stat=> stat.metadata.key === "Damage").includes(true) || (legend.stats.metadata && legend.stats.metadata.key === "Damage")) legend_embed.addField(`Damage:`, `\`${legend.stats.filter(stat=> stat.metadata.key === "Damage")[0].displayValue}\``, true)
        if(legend.stats.map(stat=> stat.metadata.key === "MatchesPlayed").includes(true) || (legend.stats.metadata && legend.stats.metadata.key === "MatchesPlayed")) legend_embed.addField(`Matches Played:`, `\`${legend.stats.filter(stat=> stat.metadata.key === "MatchesPlayed")[0].displayValue}\``, true)
        if(legend.stats.map(stat=> stat.metadata.key === "KillsPerMatch").includes(true) || (legend.stats.metadata && legend.stats.metadata.key === "KillsPerMatch")) legend_embed.addField(`Kills Per Match:`, `\`${legend.stats.filter(stat=> stat.metadata.key === "KillsPerMatch")[0].displayValue}\``, true)
        if(legend.stats.map(stat=> stat.metadata.key === "DamagePerMatch").includes(true) || (legend.stats.metadata && legend.stats.metadata.key === "DamagePerMatch")) legend_embed.addField(`Damage Per Match:`, `\`${legend.stats.filter(stat=> stat.metadata.key === "DamagePerMatch")[0].displayValue}\``, true)  
        if(legend.stats.map(stat=> stat.metadata.key === "Headshots").includes(true) || (legend.stats.metadata && legend.stats.metadata.key === "Headshots")) legend_embed.addField(`Headshots:`, `\`${legend.stats.filter(stat=> stat.metadata.key === "Headshots")[0].displayValue}\``, true)  
        pages.push(legend_embed);
      };
      pages[page].setFooter(`Page ${page+1} of ${pages.length}`);
			msg.channel.send(pages[page]).then(async page0=>{
				await page0.react(`?`);
        await page0.react(`?`);
        const backwardsFilter = (reaction, user) => reaction.emoji.name === '?' && user.id === msg.author.id;
        const forwardsFilter = (reaction, user) => reaction.emoji.name === '?' && user.id === msg.author.id;
        const backwards = page0.createReactionCollector(backwardsFilter, {time: 120000});
        const forwards = page0.createReactionCollector(forwardsFilter, {time: 120000});
        backwards.on("collect", r=>{
          r.remove(msg.author);
          if(page <= 0) return;
          page--;
          let newPage = pages[page];
          newPage.setFooter(`Page ${page+1} of ${pages.length}`);
          newPage.author ? newPage.setImage(data.children[data.children.map(legend => legend.metadata.legend_name === newPage.author.name.split("'")[0]).indexOf(true)].metadata.icon) : null;
          page0.edit(newPage);
        })
        forwards.on("collect", r=>{
          r.remove(msg.author);
          if(page+1 === pages.length) return;
          page++;
          let newPage = pages[page];
          newPage.setFooter(`Page ${page+1} of ${pages.length}`);
          newPage.author ? newPage.setImage(data.children[data.children.map(legend => legend.metadata.legend_name === newPage.author.name.split("'")[0]).indexOf(true)].metadata.icon) : null;
          page0.edit(newPage);
        });
      });

    };
    if(name && platform) apexy(name, platform);
    else return msg.reply(`يرجى تحديد من تريد رؤية بياناته في الامر بالصيغة التالية:\n${prefix}apex {منصة لعب اللاعب} {اسم اللاعب}`)
  };
});

client.login('NTYwOTQ0ODk1MjI2MDE5ODYx.XKixmQ.xh6ow19m1RmTliqc1m2cPV3JvkE');