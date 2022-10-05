const path = require("node:path");
const { joinVoiceChannel, createAudioPlayer, AudioPlayerStatus, createAudioResource, StreamType } = require("@discordjs/voice");
const { SlashCommandBuilder } = require("discord.js");
const { voiceChannelId } = require("../config.json");

const getUserVoiceConnection = (interaction) => {
  const voiceChannel = interaction.client.channels.cache.get(voiceChannelId);

  return joinVoiceChannel({
    channelId: voiceChannelId,
    guildId: interaction.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  });
};

const playSong = (voiceConnection) => {
  const player = createAudioPlayer();

  const resource = createAudioResource(path.join(__dirname, "../assets/sounds/normal.ogg"), {
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
  data: new SlashCommandBuilder().setName("risa").setDescription("Responde con una risa xd ;v!"),
  async execute(interaction) {
    interaction.reply(";v");

    const voiceConnection = getUserVoiceConnection(interaction);

    if (voiceConnection) {
      playSong(voiceConnection);
    }
  },
};
