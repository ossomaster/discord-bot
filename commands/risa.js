const path = require("node:path");
const { joinVoiceChannel, createAudioPlayer, AudioPlayerStatus, createAudioResource, StreamType } = require("@discordjs/voice");
const { SlashCommandBuilder } = require("discord.js");
const MODOS = ["normal", "lento"];

const getUserVoiceConnection = (interaction) => {
  const voiceChannelId = interaction.member.voice.channelId;
  const voiceChannel = interaction.client.channels.cache.get(voiceChannelId);

  return joinVoiceChannel({
    channelId: voiceChannelId,
    guildId: interaction.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  });
};

const playSong = (voiceConnection, modo) => {
  const player = createAudioPlayer();
  const fileName = `../assets/sounds/${modo}.ogg`;
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
  data: new SlashCommandBuilder()
    .setName("risa")
    .setDescription("Responde con una risa xd ;v!")
    .addStringOption((option) => option.setName("modo").setDescription("normal o lento").setRequired(false)),
  async execute(interaction) {
    let modo = interaction.options.get("modo")?.value || "normal";

    if (!MODOS.includes(modo)) return;

    try {
      const voiceConnection = getUserVoiceConnection(interaction);
      playSong(voiceConnection, modo);
      interaction.reply("** **");
    } catch (error) {
      console.error(error);
    }
  },
};
