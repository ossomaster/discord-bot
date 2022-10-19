const path = require("node:path");
const { joinVoiceChannel, createAudioPlayer, AudioPlayerStatus, createAudioResource, StreamType } = require("@discordjs/voice");
const { SlashCommandBuilder } = require("discord.js");

const getUserVoiceConnection = (interaction) => {
  const voiceChannelId = interaction.member.voice.channelId;
  const voiceChannel = interaction.client.channels.cache.get(voiceChannelId);

  return joinVoiceChannel({
    channelId: voiceChannelId,
    guildId: interaction.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  });
};

const playSong = (voiceConnection) => {
  const player = createAudioPlayer();
  const fileName = `../assets/sounds/poronga.mp3`;
  const resource = createAudioResource(path.join(__dirname, fileName), {
    inputType: StreamType.OggOpus,
  });

  player.play(resource);

  const subscription = voiceConnection.subscribe(player);

  player.on(AudioPlayerStatus.Idle, () => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });

  player.on("error", (error) => {
    console.error(`Error: ${error.message} with resource`);
  });
};

module.exports = {
  data: new SlashCommandBuilder().setName("poronga").setDescription("WTF! Quién poronga eres"),
  async execute(interaction) {
    try {
      const voiceConnection = getUserVoiceConnection(interaction);
      playSong(voiceConnection);
      interaction.reply("** **", { ephemeral: true });
    } catch (error) {
      console.error(error);
    }
  },
};
