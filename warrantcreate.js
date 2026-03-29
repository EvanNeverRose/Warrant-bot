const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const fs = require('fs');

const CONFIG = './config.json';
const STORAGE = './storage.json';

module.exports = {
 data: new SlashCommandBuilder()
  .setName('warrantcreate')
  .setDescription('Create warrant')
  .addIntegerOption(o=>o.setName('robloxid').setRequired(true))
  .addStringOption(o=>o.setName('reason').setRequired(true))
  .addIntegerOption(o=>o.setName('level')),

 async execute(interaction){
  const id = interaction.options.getInteger('robloxid');
  const reason = interaction.options.getString('reason');
  const level = interaction.options.getInteger('level') || 'LOW';

  if (!fs.existsSync(CONFIG)) return interaction.reply({content:'Set channel first',ephemeral:true});
  const config = JSON.parse(fs.readFileSync(CONFIG));
  const channel = interaction.guild.channels.cache.get(config.warrantChannel);
  if (!channel) return interaction.reply({content:'Invalid channel',ephemeral:true});

  try {
    const user = await axios.get(`https://users.roblox.com/v1/users/${id}`);
    const avatar = await axios.get(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&size=420x420&format=Png`);
    const img = avatar.data.data[0].imageUrl;

    const embed = new EmbedBuilder()
      .setColor(0x1f8bff)
      .setTitle('🚔 MDT WARRANT')
      .setThumbnail(img)
      .addFields(
        {name:'User', value:user.data.name, inline:true},
        {name:'ID', value:id.toString(), inline:true},
        {name:'Level', value:level.toString(), inline:true},
        {name:'Reason', value:`\`\`\`${reason}\`\`\``}
      )
      .setFooter({text:`Issued by ${interaction.user.tag}`})
      .setTimestamp();

    const msg = await channel.send({embeds:[embed]});

    let data = fs.existsSync(STORAGE)?JSON.parse(fs.readFileSync(STORAGE)):{};
    data[id]=msg.id;
    fs.writeFileSync(STORAGE, JSON.stringify(data,null,2));

    await interaction.reply({content:'Warrant created',ephemeral:true});

  } catch(e){
    console.error(e);
    await interaction.reply({content:'Roblox fetch failed',ephemeral:true});
  }
 }
};