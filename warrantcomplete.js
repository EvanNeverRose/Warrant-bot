const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

const STORAGE = './storage.json';
const CONFIG = './config.json';

module.exports = {
 data: new SlashCommandBuilder()
  .setName('warrantcomplete')
  .setDescription('Complete warrant')
  .addIntegerOption(o=>o.setName('robloxid').setRequired(true)),

 async execute(interaction){
  const id = interaction.options.getInteger('robloxid');

  if (!fs.existsSync(STORAGE)) return interaction.reply({content:'No data',ephemeral:true});
  const data = JSON.parse(fs.readFileSync(STORAGE));
  if (!data[id]) return interaction.reply({content:'Not found',ephemeral:true});

  const config = JSON.parse(fs.readFileSync(CONFIG));
  const channel = interaction.guild.channels.cache.get(config.warrantChannel);

  const msg = await channel.messages.fetch(data[id]);
  await msg.delete();

  delete data[id];
  fs.writeFileSync(STORAGE, JSON.stringify(data,null,2));

  await interaction.reply({content:'Warrant removed',ephemeral:true});
 }
};