const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const CONFIG = './config.json';

module.exports = {
 data: new SlashCommandBuilder()
  .setName('channelset')
  .setDescription('Set warrant channel')
  .addChannelOption(opt => opt.setName('channel').setRequired(true))
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

 async execute(interaction) {
  const channel = interaction.options.getChannel('channel');
  fs.writeFileSync(CONFIG, JSON.stringify({ warrantChannel: channel.id }, null, 2));
  await interaction.reply({ content: `Set to ${channel}`, ephemeral: true });
 }
};