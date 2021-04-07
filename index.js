const DiscordApp = require("discord.js")

const client = new DiscordApp.Client()

// Whitelist channel to prevent channel being deleted
// The first array is Creator Channel ( Click to Join )
var WhitelistedChannels = ["###CLICK TO JOIN###", "### WHITELISTED CHANNEL ###"]

function ChannelLeave(member, channel) {
    let userCount = GetChannelUserCount(channel)
    if (userCount == 0 && channel) {
        if (CreatorChannels.indexOf(channel.id) < 0) {
            channel.delete()
        }
    }
}

function ChannelJoin(member, channel) {
    if (CreatorChannels.indexOf(channel.id) == 0) {
        CreateAutoChannel(member, channel)
    }
}

function GetChannelUserCount(channel) {
    if (channel) {
        return channel.members.reduce((acc, member) => acc + 1, 0)
    }
    return 0
}

function CreateAutoChannel(member, channel) {
    console.log("Creating Channel")
    channel.clone({
        name: `${member.displayName}'s Channel`
    })
    .then(newChannel => {
        member.voice.setChannel(newChannel)
        newChannel.overwritePermissions(
            [
                {
                    id: member.id,
                    allow: ['MANAGE_CHANNELS']
                }
            ]
        )
    })
}

client.on("voiceStateUpdate", (oldState, newState) => {
    if (oldState && newState) {
        if (oldState.channelID === newState.channelID) {
            return
        }
    }

    if (oldState && oldState.channelID) {
        ChannelLeave(oldState.member, oldState.guild.channels.resolve(oldState.channelID))
    }
    if (newState && newState.channelID) {
        ChannelJoin(newState.member, newState.guild.channels.resolve(newState.channelID))
    }
})

client.login(process.env.BOT_TOKEN)
